import {
  action,
  computed,
  type IObservableArray,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import {
  getDefaultAccentColorForTemplate,
  parseTemplateSettings,
  type TemplateSettings,
} from '@/lib/constants/accentColors';
import { getItemInsertTemplate } from '@/lib/helpers/documentBuilderHelpers';
import {
  analyzeItemFields,
  type DefinitionDiagnostic,
  type EditorLayoutDefinition,
  type FieldDefinition,
  type FieldDefinitionInput,
  type FieldKey,
  resolveSectionDefinition,
  type SectionDefinition,
  type SectionDefinitionInput,
  type SectionKey,
  sectionDefinitions,
  validateSectionMetadata,
} from '@/lib/sectionDefinitions/sectionDefinitions';
import type {
  FieldInsertTemplate,
  ResumeTemplate,
  SectionType,
  StoreResult,
  TemplatedSectionType,
} from '@/lib/types/documentBuilder.types';
import type {
  AddItemIntent,
  AddSectionIntent,
  CreatedItemRecords,
  CreatedSectionRecords,
  DocumentPersistence,
  PersistedDocumentRecords,
} from './documentPersistence';

export type DocumentId = number & { readonly __documentId: unique symbol };
export type SemanticSectionKey = SectionKey;
export const persistedTypeForSectionKey = (
  key: SemanticSectionKey
): SectionType => sectionDefinitions[key].persistedType;
export type SectionId = number & { readonly __sectionId: unique symbol };
export type ItemId = number & { readonly __itemId: unique symbol };
export type FieldId = number & { readonly __fieldId: unique symbol };

export type ReorderResult =
  | Readonly<{ success: true }>
  | Readonly<{
      success: false;
      reason: 'invalid' | 'notFound' | 'conflict' | 'error';
    }>;

const FIELD_SAVE_DEBOUNCE_MS = 400;

type AnyFieldKey<S extends SectionKey> = S extends SectionKey
  ? FieldKey<S>
  : never;
type DefinitionFor<S extends SectionKey, K extends string> = Extract<
  FieldDefinition<S>,
  { readonly key: K }
>;
type PublicFieldDefinition<S extends SectionKey, K extends string> = Omit<
  DefinitionFor<S, K>,
  'persistedName' | 'expectedPersistedType'
> & {
  readonly key: K;
  readonly label: string;
  readonly control: FieldDefinition<S>['control'];
  readonly order: number;
  readonly labelRow?: 'compact';
  readonly placeholder?: string;
  readonly options?: readonly string[];
  readonly dateRange?: Readonly<{
    key: string;
    role: 'start' | 'end';
    allowPresent: boolean;
  }>;
  readonly richText?: Readonly<{
    guidance?: string;
    characterCounter: boolean;
  }>;
};
type PublicSectionDefinition<S extends SectionKey> = Readonly<
  Omit<SectionDefinitionInput, 'persistedType' | 'fields'> & {
    key: S;
    readonly fields: Readonly<
      Record<
        string,
        Readonly<
          Omit<FieldDefinitionInput, 'persistedName' | 'expectedPersistedType'>
        >
      >
    >;
  }
>;
type FieldsFor<S extends SectionKey> = {
  readonly [K in FieldKey<S>]: SemanticField<S, Extract<K, string>>;
};

export type WorkExperienceFields = FieldsFor<'workExperience'>;

export class SemanticField<
  S extends SectionKey = SectionKey,
  K extends string = AnyFieldKey<S> & string,
> {
  readonly id: FieldId;
  readonly itemId: ItemId;
  readonly sectionKey: S;
  readonly fieldKey: K;
  readonly definition: PublicFieldDefinition<S, K>;
  value: string;
  saveError: string | null = null;
  private persistedValue: string;
  #version = 0;
  #timer: ReturnType<typeof setTimeout> | null = null;
  #saveTail: Promise<void> = Promise.resolve();
  #pendingCount = 0;
  #lastQueued: { version: number; promise: Promise<boolean> } | null = null;
  #disposed = false;
  readonly #persistence: DocumentPersistence;
  readonly #documentId: DocumentId;

  constructor(
    record: DEX_Field,
    sectionKey: S,
    definition: FieldDefinition<S>,
    documentId: DocumentId,
    persistence: DocumentPersistence
  ) {
    this.id = record.id as FieldId;
    this.itemId = record.itemId as ItemId;
    this.#documentId = documentId;
    this.#persistence = persistence;
    this.sectionKey = sectionKey;
    this.fieldKey = definition.key as K;
    const {
      persistedName: _persistedName,
      expectedPersistedType: _persistedType,
      ...publicDefinition
    } = definition;
    this.definition = Object.freeze(publicDefinition) as PublicFieldDefinition<
      S,
      K
    >;
    this.value = record.value;
    this.persistedValue = record.value;
    makeObservable<this, 'persistedValue'>(this, {
      value: observable,
      saveError: observable,
      persistedValue: observable,
      isDirty: computed,
      setDraft: action,
      setDebounced: action,
      rollback: action,
    });
  }

  get label(): string {
    return this.definition.label;
  }

  get isDirty(): boolean {
    return this.value !== this.persistedValue;
  }

  setDraft(value: string): void {
    this.#assertActive();
    this.#cancelTimer();
    this.value = value;
    this.saveError = null;
    this.#version += 1;
  }

  setDebounced(value: string): void {
    this.setDraft(value);
    this.#timer = setTimeout(() => {
      this.#timer = null;
      void this.#queueSave(this.#version, this.value);
    }, FIELD_SAVE_DEBOUNCE_MS);
  }

  commit(): Promise<boolean> {
    if (this.#disposed) {
      return Promise.resolve(false);
    }
    this.#cancelTimer();
    return this.#queueSave(this.#version, this.value);
  }

  flush(): Promise<boolean> {
    if (this.#disposed) {
      return Promise.resolve(false);
    }
    this.#cancelTimer();
    if (this.#lastQueued?.version === this.#version) {
      return this.#lastQueued.promise;
    }
    if (!this.isDirty && this.#pendingCount === 0) {
      return Promise.resolve(true);
    }
    return this.#queueSave(this.#version, this.value);
  }

  rollback(): Promise<boolean> {
    this.#assertActive();
    this.#cancelTimer();
    this.value = this.persistedValue;
    this.#version += 1;
    if (this.#pendingCount === 0) {
      return Promise.resolve(true);
    }
    return this.#queueSave(this.#version, this.value);
  }

  dispose(): void {
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
    this.#cancelTimer();
  }

  #assertActive(): void {
    if (this.#disposed) {
      throw new Error('Semantic Field is disposed');
    }
  }

  #cancelTimer(): void {
    if (this.#timer !== null) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }

  #queueSave(version: number, value: string): Promise<boolean> {
    if (this.#lastQueued?.version === version) {
      return this.#lastQueued.promise;
    }
    this.#pendingCount += 1;
    const promise = this.#saveTail.then(async () => {
      if (this.#disposed) {
        return false;
      }
      try {
        const result = await this.#persistence.saveFieldValue(
          this.#documentId,
          this.id,
          value
        );
        if (!result.success) {
          throw new Error('Field no longer exists');
        }
        runInAction(() => {
          this.persistedValue = value;
        });
        return true;
      } catch {
        runInAction(() => {
          if (this.#version === version) {
            this.value = this.persistedValue;
            this.saveError = 'Could not save this change. Please try again.';
          }
        });
        return false;
      }
    });
    this.#saveTail = promise.then(() => {
      this.#pendingCount -= 1;
      if (this.#lastQueued?.promise === promise) {
        this.#lastQueued = null;
      }
    });
    this.#lastQueued = { version, promise };
    return promise;
  }
}

export class BuilderItemModel<S extends SectionKey = SectionKey> {
  readonly id: ItemId;
  readonly sectionId: SectionId;
  readonly sectionKey: S;
  readonly containerType: DEX_Item['containerType'];
  displayOrder: number;
  readonly fieldIds: readonly FieldId[];
  readonly fields: S extends 'custom' ? undefined : FieldsFor<S>;
  #document: BuilderDocumentModel;

  constructor(
    record: DEX_Item,
    sectionKey: S,
    fieldIds: readonly FieldId[],
    fields: Record<string, SemanticField>,
    document: BuilderDocumentModel
  ) {
    this.id = record.id as ItemId;
    this.sectionId = record.sectionId as SectionId;
    this.sectionKey = sectionKey;
    this.containerType = record.containerType;
    this.displayOrder = record.displayOrder;
    this.fieldIds = Object.freeze([...fieldIds]);
    this.fields = (sectionKey === 'custom'
      ? undefined
      : Object.freeze(fields)) as unknown as BuilderItemModel<S>['fields'];
    this.#document = document;
    makeObservable(this, { displayOrder: observable });
  }

  get editableFields(): readonly SemanticField<S>[] {
    return this.fieldIds.map(
      (id) => this.#document.fieldsById.get(id) as unknown as SemanticField<S>
    );
  }

  field(key: AnyFieldKey<S>): SemanticField<S> | undefined {
    return this.editableFields.find((field) => field.fieldKey === key);
  }
}

/** A read-only semantic view of one ordered Work Experience Item. */
export class WorkExperienceEntry {
  readonly id: ItemId;
  readonly role: SemanticField<'workExperience', 'role'>;
  readonly employer: SemanticField<'workExperience', 'employer'>;
  readonly startDate: SemanticField<'workExperience', 'startDate'>;
  readonly endDate: SemanticField<'workExperience', 'endDate'>;
  readonly city: SemanticField<'workExperience', 'city'>;
  readonly description: SemanticField<'workExperience', 'description'>;

  constructor(item: WorkExperienceItemModel) {
    this.id = item.id;
    this.role = item.fields.role;
    this.employer = item.fields.employer;
    this.startDate = item.fields.startDate;
    this.endDate = item.fields.endDate;
    this.city = item.fields.city;
    this.description = item.fields.description;
    makeObservable(this, {
      heading: computed,
      dateDescription: computed,
    });
  }

  get heading(): string {
    const role = this.role.value.trim();
    const employer = this.employer.value.trim();
    if (role && employer) {
      return `${role} at ${employer}`;
    }
    return role || employer || '(Untitled)';
  }

  get dateDescription(): string {
    if (this.heading === '(Untitled)') {
      return '';
    }
    const startDate = this.startDate.value.trim();
    const endDate = this.endDate.value.trim();
    return [startDate, endDate].filter(Boolean).join(' - ');
  }
}

export class WorkExperienceItemModel extends BuilderItemModel<'workExperience'> {
  declare readonly fields: WorkExperienceFields;
  readonly entry: WorkExperienceEntry;

  constructor(
    record: DEX_Item,
    fieldIds: readonly FieldId[],
    fields: WorkExperienceFields,
    document: BuilderDocumentModel
  ) {
    super(record, 'workExperience', fieldIds, fields, document);
    this.entry = new WorkExperienceEntry(this);
  }
}

const createBuilderItemModel = <S extends SectionKey>(
  record: DEX_Item,
  sectionKey: S,
  fieldIds: readonly FieldId[],
  fields: Record<string, SemanticField>,
  document: BuilderDocumentModel
): BuilderItemModel<S> => {
  if (sectionKey === 'workExperience') {
    return new WorkExperienceItemModel(
      record,
      fieldIds,
      fields as WorkExperienceFields,
      document
    ) as unknown as BuilderItemModel<S>;
  }
  return new BuilderItemModel(record, sectionKey, fieldIds, fields, document);
};

export class BuilderSectionModel<S extends SectionKey = SectionKey> {
  readonly id: SectionId;
  readonly documentId: DocumentId;
  readonly sectionKey: S;
  readonly definition: PublicSectionDefinition<S>;
  readonly editorDefinition: Readonly<{
    editorLayout?: EditorLayoutDefinition;
  }>;
  title: string;
  readonly defaultTitle: string;
  readonly metadata: {
    key: string;
    label: string;
    value: string;
  }[];
  displayOrder: number;
  #document: BuilderDocumentModel;
  #persistedType: SectionDefinition<S>['persistedType'];
  #persistedFields: SectionDefinition<S>['fields'];

  constructor(
    record: DEX_Section,
    definition: SectionDefinition<S>,
    metadata: readonly Readonly<{
      key: string;
      label: string;
      value: string;
    }>[],
    itemIds: readonly ItemId[],
    document: BuilderDocumentModel
  ) {
    this.id = record.id as SectionId;
    this.documentId = record.documentId as DocumentId;
    this.sectionKey = definition.key as S;
    const {
      persistedType,
      fields: persistedFields,
      ...presentationDefinition
    } = definition;
    this.#persistedType = persistedType;
    this.#persistedFields = persistedFields;
    const fields = Object.fromEntries(
      Object.entries(persistedFields).map(([key, field]) => {
        const {
          persistedName: _persistedName,
          expectedPersistedType: _expectedPersistedType,
          ...presentationField
        } = field;
        return [key, Object.freeze(presentationField)];
      })
    ) as PublicSectionDefinition<S>['fields'];
    this.definition = Object.freeze({
      ...presentationDefinition,
      fields: Object.freeze(fields),
    }) as unknown as PublicSectionDefinition<S>;
    this.editorDefinition = Object.freeze({
      editorLayout: this.definition.editorLayout,
    });
    this.title = record.title;
    this.defaultTitle = record.defaultTitle;
    this.metadata = metadata.map((entry) => ({ ...entry }));
    this.displayOrder = record.displayOrder;
    sectionItemIds.set(this, observable.array([...itemIds], { deep: false }));
    this.#document = document;
    makeObservable(this, {
      title: observable,
      metadata: observable,
      displayOrder: observable,
    });
  }

  get itemIds(): readonly ItemId[] {
    return Object.freeze([
      ...(sectionItemIds.get(this) as IObservableArray<ItemId>),
    ]);
  }

  get persistedType(): SectionDefinition<S>['persistedType'] {
    return this.#persistedType;
  }

  fieldKeyForPersistedName(name: string): string | undefined {
    return Object.values(this.#persistedFields).find(
      (field) => field.persistedName === name
    )?.key;
  }

  toPersistedFieldSnapshot(field: SemanticField): DEX_Field {
    const definition = Object.values(this.#persistedFields).find(
      (candidate) => candidate.key === field.fieldKey
    );
    if (!definition) {
      throw new Error('Field definition missing during projection');
    }
    return {
      id: field.id,
      itemId: field.itemId,
      name: definition.persistedName,
      type: definition.expectedPersistedType,
      value: field.value,
      ...(definition.expectedPersistedType === 'select'
        ? { selectType: 'basic' as const, options: definition.options ?? null }
        : {}),
    };
  }

  get items(): readonly BuilderItemModel<S>[] {
    return this.itemIds.map(
      (id) => this.#document.itemsById.get(id) as unknown as BuilderItemModel<S>
    );
  }
}

/** Typed lifecycle boundary for the required Work Experience section. */
export class WorkExperienceSectionModel extends BuilderSectionModel<'workExperience'> {
  readonly #document: BuilderDocumentModel;

  constructor(
    record: DEX_Section,
    definition: SectionDefinition<'workExperience'>,
    metadata: readonly Readonly<{
      key: string;
      label: string;
      value: string;
    }>[],
    itemIds: readonly ItemId[],
    document: BuilderDocumentModel
  ) {
    super(record, definition, metadata, itemIds, document);
    this.#document = document;
  }

  override get items(): readonly WorkExperienceItemModel[] {
    return super.items as readonly WorkExperienceItemModel[];
  }

  get entries(): readonly WorkExperienceEntry[] {
    return this.items.map((item) => item.entry);
  }

  async addEntry(): Promise<WorkExperienceItemModel | undefined> {
    const itemId = await this.#document.addItem(this.id);
    return itemId
      ? (this.#document.itemsById.get(itemId) as WorkExperienceItemModel)
      : undefined;
  }

  removeEntry(item: WorkExperienceItemModel): Promise<boolean> {
    if (item.sectionId !== this.id) {
      return Promise.resolve(false);
    }
    return this.#document.removeItem(item.id);
  }

  reorderEntries(
    items: readonly WorkExperienceItemModel[]
  ): Promise<ReorderResult> {
    return this.#document.reorderItems(
      this.id,
      items.map((item) => item.id)
    );
  }
}

const sectionItemIds = new WeakMap<
  BuilderSectionModel,
  IObservableArray<ItemId>
>();

const mutableItemIds = (
  section: BuilderSectionModel
): IObservableArray<ItemId> =>
  sectionItemIds.get(section) as IObservableArray<ItemId>;

export class BuilderDocumentModel {
  readonly id: DocumentId;
  title: string;
  templateType: DEX_Document['templateType'];
  templateSettings: TemplateSettings;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly jobPostingId: DEX_Document['jobPostingId'];
  readonly sectionsById = observable.map<SectionId, BuilderSectionModel>([], {
    deep: false,
  });
  readonly itemsById = observable.map<ItemId, BuilderItemModel>([], {
    deep: false,
  });
  readonly fieldsById = observable.map<FieldId, SemanticField>([], {
    deep: false,
  });
  readonly sectionIds: IObservableArray<SectionId>;
  #commandTail: Promise<void> = Promise.resolve();
  #acceptingCommands = true;
  #commandFailed = false;
  #savedTitle: string;
  #savedAppearance: {
    templateType: ResumeTemplate;
    settings: TemplateSettings;
  };
  #titleRevision = 0;
  #appearanceRevision = 0;
  readonly persistence: DocumentPersistence;
  readonly #reconcileAfterCreateFailure?: () => Promise<void>;

  constructor(
    record: DEX_Document,
    sectionIds: readonly SectionId[],
    persistence: DocumentPersistence,
    reconcileAfterCreateFailure?: () => Promise<void>
  ) {
    this.id = record.id as DocumentId;
    this.persistence = persistence;
    this.#reconcileAfterCreateFailure = reconcileAfterCreateFailure;
    this.title = record.title;
    this.templateType = record.templateType;
    this.templateSettings = parseTemplateSettings(record.templateSettings);
    this.#savedTitle = record.title;
    this.#savedAppearance = {
      templateType: record.templateType,
      settings: this.templateSettings,
    };
    this.createdAt = record.createdAt;
    this.updatedAt = record.updatedAt;
    this.jobPostingId = record.jobPostingId;
    this.sectionIds = observable.array([...sectionIds], { deep: false });
    makeObservable(this, {
      title: observable,
      templateType: observable,
      templateSettings: observable.ref,
    });
  }

  get sections(): readonly BuilderSectionModel[] {
    return this.sectionIds.map(
      (id) => this.sectionsById.get(id) as BuilderSectionModel
    );
  }

  get accentColor(): string {
    return (
      this.templateSettings[this.templateType]?.accentColor ??
      getDefaultAccentColorForTemplate(this.templateType)
    );
  }

  section<S extends SectionKey>(key: S): BuilderSectionModel<S> | undefined {
    return this.sections.find((section) => section.sectionKey === key) as
      | BuilderSectionModel<S>
      | undefined;
  }

  get personalDetails(): BuilderSectionModel<'personalDetails'> {
    return this.section(
      'personalDetails'
    ) as BuilderSectionModel<'personalDetails'>;
  }
  get summary(): BuilderSectionModel<'summary'> {
    return this.section('summary') as BuilderSectionModel<'summary'>;
  }
  get workExperience(): WorkExperienceSectionModel {
    return this.section('workExperience') as WorkExperienceSectionModel;
  }
  get education(): BuilderSectionModel<'education'> | undefined {
    return this.section('education');
  }
  get websitesSocialLinks():
    | BuilderSectionModel<'websitesSocialLinks'>
    | undefined {
    return this.section('websitesSocialLinks');
  }
  get skills(): BuilderSectionModel<'skills'> | undefined {
    return this.section('skills');
  }
  get internships(): BuilderSectionModel<'internships'> | undefined {
    return this.section('internships');
  }
  get hobbies(): BuilderSectionModel<'hobbies'> | undefined {
    return this.section('hobbies');
  }
  get references(): BuilderSectionModel<'references'> | undefined {
    return this.section('references');
  }
  get courses(): BuilderSectionModel<'courses'> | undefined {
    return this.section('courses');
  }
  get languages(): BuilderSectionModel<'languages'> | undefined {
    return this.section('languages');
  }
  get customSections(): readonly BuilderSectionModel<'custom'>[] {
    return this.sections.filter(
      (section) => section.sectionKey === 'custom'
    ) as BuilderSectionModel<'custom'>[];
  }

  #enqueue<Result>(command: () => Promise<Result>): Promise<Result> {
    if (!this.#acceptingCommands) {
      return Promise.reject(new Error('Builder Document is closing'));
    }
    const result = this.#commandTail.then(command);
    this.#commandTail = result.then(
      (value) => {
        if (
          value === false ||
          (typeof value === 'object' &&
            value !== null &&
            'success' in value &&
            value.success === false)
        ) {
          this.#commandFailed = true;
        }
      },
      () => {
        this.#commandFailed = true;
      }
    );
    return result;
  }

  async closeAndFlush(): Promise<boolean> {
    this.#acceptingCommands = false;
    await this.#commandTail;
    if (this.#commandFailed) {
      this.#commandFailed = false;
      this.#acceptingCommands = true;
      return false;
    }
    const results = await Promise.all(
      [...this.fieldsById.values()].map((field) => field.flush())
    );
    if (!results.every(Boolean)) {
      this.#acceptingCommands = true;
      return false;
    }
    return true;
  }

  discard(): void {
    this.#acceptingCommands = false;
    for (const field of this.fieldsById.values()) {
      field.dispose();
    }
  }

  rename(title: string): Promise<StoreResult> {
    if (!this.#acceptingCommands) {
      return Promise.reject(new Error('Builder Document is closing'));
    }
    const revision = ++this.#titleRevision;
    runInAction(() => {
      this.title = title;
    });
    return this.#enqueue(async () => {
      const restoreAndFail = (): StoreResult => {
        if (revision === this.#titleRevision) {
          runInAction(() => {
            this.title = this.#savedTitle;
          });
        }
        return { success: false, error: 'Failed to rename document' };
      };
      try {
        const result = await this.persistence.renameDocument(this.id, title);
        if (!result.success) {
          return restoreAndFail();
        }
        this.#savedTitle = title;
        return { success: true };
      } catch {
        return restoreAndFail();
      }
    });
  }

  private saveAppearance(
    templateType: ResumeTemplate,
    settings: TemplateSettings
  ): Promise<StoreResult> {
    if (!this.#acceptingCommands) {
      return Promise.reject(new Error('Builder Document is closing'));
    }
    const revision = ++this.#appearanceRevision;
    runInAction(() => {
      this.templateType = templateType;
      this.templateSettings = settings;
    });
    return this.#enqueue(async () => {
      const restoreAndFail = (): StoreResult => {
        if (revision === this.#appearanceRevision) {
          this.restoreSavedAppearance();
        }
        return { success: false, error: 'Failed to update document' };
      };
      try {
        const result = await this.persistence.saveAppearance(
          this.id,
          templateType,
          settings
        );
        if (!result.success) {
          return restoreAndFail();
        }
        this.#savedAppearance = { templateType, settings };
        return { success: true };
      } catch {
        return restoreAndFail();
      }
    });
  }

  private restoreSavedAppearance(): void {
    runInAction(() => {
      this.templateType = this.#savedAppearance.templateType;
      this.templateSettings = this.#savedAppearance.settings;
    });
  }

  #materializeCreatedItem(
    sectionType: DEX_Section['type'],
    sectionKey: SectionKey,
    itemRecord: DEX_Item,
    fieldRecords: readonly DEX_Field[],
    invalidGraphMessage: string
  ): { item: BuilderItemModel; fields: SemanticField[] } {
    const analysis = analyzeItemFields(
      { type: sectionType },
      fieldRecords.map((field) => ({
        id: field.id,
        name: field.name,
        type: field.type,
      }))
    );
    if (
      analysis.diagnostics.length > 0 ||
      analysis.entries.length !== fieldRecords.length
    ) {
      throw new Error(invalidGraphMessage);
    }
    const recordsById = new Map(fieldRecords.map((field) => [field.id, field]));
    const typedFields: Record<string, SemanticField> = {};
    const fields = analysis.entries.map(
      ({ field, definition: fieldDefinition }) => {
        const record = recordsById.get(Number(field.id));
        if (!record) {
          throw new Error('Created field is missing');
        }
        const model = new SemanticField(
          record,
          sectionKey,
          fieldDefinition as FieldDefinition<SectionKey>,
          this.id,
          this.persistence
        );
        typedFields[model.fieldKey] = model;
        return model;
      }
    );
    const item = createBuilderItemModel(
      itemRecord,
      sectionKey,
      fields.map((field) => field.id),
      typedFields,
      this
    );
    return { item, fields };
  }

  #publishCreatedItem(
    item: BuilderItemModel,
    fields: readonly SemanticField[]
  ): void {
    for (const field of fields) {
      this.fieldsById.set(field.id, field);
    }
    this.itemsById.set(item.id, item);
  }

  changeTemplate(templateType: ResumeTemplate): Promise<StoreResult> {
    const settings = { ...this.templateSettings };
    if (!settings[templateType]) {
      settings[templateType] = {
        accentColor: getDefaultAccentColorForTemplate(templateType),
      };
    }
    return this.saveAppearance(templateType, settings);
  }

  changeAccent(color: string): Promise<StoreResult> {
    return this.saveAppearance(this.templateType, {
      ...this.templateSettings,
      [this.templateType]: { accentColor: color },
    });
  }

  addSection(
    input: Pick<DEX_Section, 'type' | 'title' | 'defaultTitle'> & {
      metadata?: DEX_Section['metadata'];
    }
  ): Promise<StoreResult<{ sectionId: SectionId; itemId: ItemId }>> {
    return this.#enqueue(async () => {
      const currentDefinition = resolveSectionDefinition(input.type);
      if (
        currentDefinition?.sectionCardinality === 'optional-one' &&
        this.section(currentDefinition.key)
      ) {
        return { success: false, error: 'Section already exists' };
      }
      const metadata = parseMetadata(input.metadata);
      const creation = sectionCreationTemplate({
        type: input.type,
        title: input.title,
        defaultTitle: input.defaultTitle,
        metadata: metadata as BuilderSectionModel['metadata'],
      });
      if (!creation.success) {
        return { success: false, error: creation.error };
      }
      const { definition } = creation;
      let committed = false;
      try {
        const created = await this.persistence.addSection(this.id, {
          type: input.type,
          title: input.title,
          defaultTitle: input.defaultTitle,
          metadata: metadata as BuilderSectionModel['metadata'],
        });
        if (!created.success) {
          return {
            success: false,
            error:
              created.reason === 'alreadyExists'
                ? 'Section already exists'
                : 'Failed to add section',
          };
        }
        committed = true;
        const {
          section: sectionRecord,
          item: itemRecord,
          fields: fieldRecords,
        } = created.value;
        const { item, fields } = this.#materializeCreatedItem(
          sectionRecord.type,
          definition.key,
          itemRecord,
          fieldRecords,
          'Created section graph is invalid'
        );
        const section = new BuilderSectionModel(
          sectionRecord,
          definition,
          metadata as BuilderSectionModel['metadata'],
          [item.id],
          this
        );
        runInAction(() => {
          this.#publishCreatedItem(item, fields);
          this.sectionsById.set(section.id, section);
          this.sectionIds.push(section.id);
        });
        return {
          success: true,
          data: { sectionId: section.id, itemId: item.id },
        };
      } catch {
        if (committed) {
          try {
            await this.#reconcileAfterCreateFailure?.();
          } catch {
            // The session owns the failed reload state.
          }
        }
        return { success: false, error: 'Failed to add section' };
      }
    });
  }

  removeSection(sectionId: SectionId): Promise<boolean> {
    return this.#enqueue(async () => {
      const section = this.sectionsById.get(sectionId);
      if (
        !section ||
        section.definition.sectionCardinality === 'required-one'
      ) {
        return false;
      }
      const index = this.sectionIds.indexOf(sectionId);
      const items = section.itemIds.map(
        (id) => this.itemsById.get(id) as BuilderItemModel
      );
      const fields = items.flatMap((item) =>
        item.fieldIds.map((id) => this.fieldsById.get(id) as SemanticField)
      );
      runInAction(() => {
        this.sectionIds.splice(index, 1);
        this.sectionsById.delete(sectionId);
        for (const item of items) {
          this.itemsById.delete(item.id);
        }
        for (const field of fields) {
          this.fieldsById.delete(field.id);
        }
      });
      try {
        const result = await this.persistence.deleteSection(this.id, sectionId);
        if (!result.success) {
          throw new Error('Section no longer exists');
        }
        for (const field of fields) {
          field.dispose();
        }
        return true;
      } catch {
        runInAction(() => {
          for (const field of fields) {
            this.fieldsById.set(field.id, field);
          }
          for (const item of items) {
            this.itemsById.set(item.id, item);
          }
          this.sectionsById.set(sectionId, section);
          this.sectionIds.splice(index, 0, sectionId);
        });
        return false;
      }
    });
  }

  renameSection(sectionId: SectionId, title: string): Promise<StoreResult> {
    return this.#enqueue(async () => {
      const section = this.sectionsById.get(sectionId);
      if (!section) {
        return { success: false, error: 'Section not found' };
      }
      if (!title.replaceAll(' ', '').trim()) {
        return { success: false, error: 'Invalid section title' };
      }
      const previous = section.title;
      runInAction(() => {
        section.title = title;
      });
      try {
        const result = await this.persistence.renameSection(
          this.id,
          sectionId,
          title
        );
        if (!result.success) {
          throw new Error('Section no longer exists');
        }
        return { success: true };
      } catch {
        runInAction(() => {
          section.title = previous;
        });
        return { success: false, error: 'Failed to rename section' };
      }
    });
  }

  updateSectionMetadata(
    sectionId: SectionId,
    key: string,
    value: string
  ): Promise<StoreResult> {
    return this.#enqueue(async () => {
      const section = this.sectionsById.get(sectionId);
      if (!section) {
        return { success: false, error: 'Section not found' };
      }
      const entry = section.metadata.find((item) => item.key === key);
      if (!entry) {
        return { success: false, error: 'Metadata key not found' };
      }
      const proposed = section.metadata.map((item) =>
        item.key === key ? { ...item, value } : { ...item }
      );
      if (
        validateSectionMetadata(
          sectionDefinitions[section.sectionKey],
          proposed
        ).length > 0
      ) {
        return { success: false, error: 'Invalid section metadata' };
      }
      const previous = entry.value;
      runInAction(() => {
        entry.value = value;
      });
      try {
        const result = await this.persistence.saveSectionMetadata(
          this.id,
          sectionId,
          proposed
        );
        if (!result.success) {
          throw new Error('Section no longer exists');
        }
        return { success: true };
      } catch {
        runInAction(() => {
          entry.value = previous;
        });
        return { success: false, error: 'Failed to update section metadata' };
      }
    });
  }

  reorderSections(sectionIds: readonly SectionId[]): Promise<ReorderResult> {
    return this.#enqueue(async () => {
      if (
        sectionIds.length !== this.sectionIds.length ||
        new Set(sectionIds).size !== sectionIds.length ||
        sectionIds.some((id) => !this.sectionsById.has(id))
      ) {
        return { success: false, reason: 'invalid' };
      }
      const previousIds = [...this.sectionIds];
      const previousOrders = new Map(
        this.sections.map((section) => [section.id, section.displayOrder])
      );
      const restoreOrder = () => {
        runInAction(() => {
          this.sectionIds.replace(previousIds);
          for (const [id, order] of previousOrders) {
            (this.sectionsById.get(id) as BuilderSectionModel).displayOrder =
              order;
          }
        });
      };
      runInAction(() => {
        this.sectionIds.replace([...sectionIds]);
        sectionIds.forEach((id, index) => {
          (this.sectionsById.get(id) as BuilderSectionModel).displayOrder =
            index + 1;
        });
      });
      try {
        const result = await this.persistence.reorderSections(
          this.id,
          sectionIds
        );
        if (!result.success) {
          restoreOrder();
          return {
            success: false,
            reason:
              result.reason === 'membershipChanged'
                ? 'conflict'
                : result.reason,
          };
        }
        return { success: true };
      } catch {
        restoreOrder();
        return { success: false, reason: 'error' };
      }
    });
  }

  addItem(sectionId: SectionId): Promise<ItemId | undefined> {
    return this.#enqueue(async () => {
      const section = this.sectionsById.get(sectionId);
      if (!section) {
        return undefined;
      }
      const max =
        'max' in section.definition.itemCardinality
          ? section.definition.itemCardinality.max
          : undefined;
      if (max !== undefined && section.itemIds.length >= max) {
        return undefined;
      }
      const template = getItemInsertTemplate(
        section.persistedType as TemplatedSectionType
      );
      if (!template) {
        return undefined;
      }
      let committed = false;
      try {
        const result = await this.persistence.addItem(this.id, {
          sectionId,
          sectionType: section.persistedType,
        });
        if (!result.success) {
          return undefined;
        }
        committed = true;
        const { item: itemRecord, fields: fieldRecords } = result.value;
        const { item, fields } = this.#materializeCreatedItem(
          section.persistedType,
          section.sectionKey,
          itemRecord,
          fieldRecords,
          'Persisted item does not match its Section Definition'
        );
        runInAction(() => {
          this.#publishCreatedItem(item, fields);
          mutableItemIds(section).push(item.id);
        });
        return item.id;
      } catch (error) {
        if (committed) {
          try {
            await this.#reconcileAfterCreateFailure?.();
          } catch {
            // The session owns the failed reload state.
          }
        }
        throw error;
      }
    });
  }

  removeItem(itemId: ItemId): Promise<boolean> {
    return this.#enqueue(async () => {
      const item = this.itemsById.get(itemId);
      const section = item && this.sectionsById.get(item.sectionId);
      if (
        !item ||
        !section ||
        section.itemIds.length <= section.definition.itemCardinality.min
      ) {
        return false;
      }
      const index = section.itemIds.indexOf(itemId);
      const fields = item.fieldIds.map(
        (id) => this.fieldsById.get(id) as SemanticField
      );
      runInAction(() => {
        mutableItemIds(section).splice(index, 1);
        this.itemsById.delete(itemId);
        for (const field of fields) {
          this.fieldsById.delete(field.id);
        }
      });
      try {
        const result = await this.persistence.deleteItem(this.id, itemId);
        if (!result.success) {
          throw new Error('Item no longer exists');
        }
        for (const field of fields) {
          field.dispose();
        }
        return true;
      } catch {
        runInAction(() => {
          for (const field of fields) {
            this.fieldsById.set(field.id, field);
          }
          this.itemsById.set(itemId, item);
          mutableItemIds(section).splice(index, 0, itemId);
        });
        return false;
      }
    });
  }

  reorderItems(
    sectionId: SectionId,
    itemIds: readonly ItemId[]
  ): Promise<ReorderResult> {
    return this.#enqueue(async () => {
      const section = this.sectionsById.get(sectionId);
      if (
        !section ||
        itemIds.length !== section.itemIds.length ||
        new Set(itemIds).size !== itemIds.length ||
        itemIds.some((id) => !section.itemIds.includes(id))
      ) {
        return { success: false, reason: 'invalid' };
      }
      const previousIds = [...section.itemIds];
      const previousOrders = section.items.map(
        (item) => [item.id, item.displayOrder] as const
      );
      const restoreOrder = () => {
        runInAction(() => {
          mutableItemIds(section).replace(previousIds);
          for (const [id, order] of previousOrders) {
            (this.itemsById.get(id) as BuilderItemModel).displayOrder = order;
          }
        });
      };
      runInAction(() => {
        mutableItemIds(section).replace([...itemIds]);
        itemIds.forEach((id, index) => {
          (this.itemsById.get(id) as BuilderItemModel).displayOrder = index + 1;
        });
      });
      try {
        const result = await this.persistence.reorderItems(
          this.id,
          sectionId,
          itemIds
        );
        if (!result.success) {
          restoreOrder();
          return {
            success: false,
            reason:
              result.reason === 'membershipChanged'
                ? 'conflict'
                : result.reason,
          };
        }
        return { success: true };
      } catch {
        restoreOrder();
        return { success: false, reason: 'error' };
      }
    });
  }
}

export type HydrationDiagnostic =
  | (DefinitionDiagnostic & {
      readonly sectionId: number;
      readonly itemId?: number;
    })
  | Readonly<{
      type: 'duplicateId';
      entity: 'section' | 'item' | 'field';
      id: number;
    }>
  | Readonly<{
      type:
        | 'brokenOwnership'
        | 'orphan'
        | 'invalidDisplayOrder'
        | 'invalidContainerType'
        | 'invalidItemCardinality'
        | 'invalidSectionCardinality'
        | 'invalidMetadata'
        | 'invalidFieldStructure';
      entity: 'section' | 'item' | 'field';
      id?: number;
      detail: string;
    }>;

export type HydrationResult =
  | Readonly<{ success: true; document: BuilderDocumentModel }>
  | Readonly<{ success: false; diagnostics: readonly HydrationDiagnostic[] }>;

export type { PersistedDocumentRecords } from './documentPersistence';

const byId = <T extends { readonly id: number }>(left: T, right: T): number =>
  left.id - right.id;
const byOrder = <
  T extends { readonly displayOrder: number; readonly id: number },
>(
  left: T,
  right: T
): number => left.displayOrder - right.displayOrder || left.id - right.id;
const canonical = (value: HydrationDiagnostic): string => JSON.stringify(value);

const parseMetadata = (raw: unknown): unknown => {
  if (raw === undefined || raw === '') {
    return [];
  }
  if (typeof raw !== 'string') {
    return raw;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const checkIds = <T extends { readonly id: number }>(
  records: readonly T[],
  entity: 'section' | 'item' | 'field',
  diagnostics: HydrationDiagnostic[]
): void => {
  const seen = new Set<number>();
  for (const record of records) {
    if (seen.has(record.id)) {
      diagnostics.push({ type: 'duplicateId', entity, id: record.id });
    }
    seen.add(record.id);
  }
};

const checkOrders = <
  T extends { readonly id: number; readonly displayOrder: number },
>(
  records: readonly T[],
  entity: 'section' | 'item',
  diagnostics: HydrationDiagnostic[]
): void => {
  const seen = new Set<number>();
  for (const record of records) {
    if (
      !Number.isInteger(record.displayOrder) ||
      record.displayOrder <= 0 ||
      seen.has(record.displayOrder)
    ) {
      diagnostics.push({
        type: 'invalidDisplayOrder',
        entity,
        id: record.id,
        detail: String(record.displayOrder),
      });
    }
    seen.add(record.displayOrder);
  }
};

const checkFieldStructure = (
  field: DEX_Field,
  definition: FieldDefinition,
  diagnostics: HydrationDiagnostic[]
): void => {
  const raw = field as unknown as Record<string, unknown>;
  const issues: string[] = [];
  if (typeof field.value !== 'string') {
    issues.push('value must be a string');
  }
  if (definition.control === 'select') {
    if (
      raw.selectType !== 'basic' ||
      !Array.isArray(raw.options) ||
      JSON.stringify(raw.options) !== JSON.stringify(definition.options)
    ) {
      issues.push('select metadata differs from definition');
    }
  } else if (raw.selectType !== undefined || raw.options !== undefined) {
    issues.push('unexpected select metadata');
  }
  const expectedPlaceholder =
    definition.control === 'richText' &&
    'richText' in definition &&
    definition.richText &&
    'guidance' in definition.richText
      ? definition.richText.guidance
      : 'placeholder' in definition
        ? definition.placeholder
        : undefined;
  if (
    raw.placeholder !== undefined &&
    raw.placeholder !== '' &&
    raw.placeholder !== expectedPlaceholder
  ) {
    issues.push('placeholder differs from definition');
  }
  for (const detail of issues) {
    diagnostics.push({
      type: 'invalidFieldStructure',
      entity: 'field',
      id: field.id,
      detail,
    });
  }
};

export const hydrateBuilderDocument = (
  { document, sections, items, fields }: PersistedDocumentRecords,
  persistence: DocumentPersistence,
  reconcileAfterCreateFailure?: () => Promise<void>
): HydrationResult => {
  const diagnostics: HydrationDiagnostic[] = [];
  const sortedSections = [...sections].sort(byId);
  const sortedItems = [...items].sort(byId);
  const sortedFields = [...fields].sort(byId);
  checkIds(sortedSections, 'section', diagnostics);
  checkIds(sortedItems, 'item', diagnostics);
  checkIds(sortedFields, 'field', diagnostics);
  checkOrders(sortedSections, 'section', diagnostics);

  const sectionById = new Map(
    sortedSections.map((section) => [section.id, section])
  );
  const itemById = new Map(sortedItems.map((item) => [item.id, item]));
  const itemsBySection = new Map<number, DEX_Item[]>();
  const fieldsByItem = new Map<number, DEX_Field[]>();
  for (const item of sortedItems) {
    if (!sectionById.has(item.sectionId)) {
      diagnostics.push({
        type: 'orphan',
        entity: 'item',
        id: item.id,
        detail: `section ${item.sectionId}`,
      });
    }
    const group = itemsBySection.get(item.sectionId) ?? [];
    group.push(item);
    itemsBySection.set(item.sectionId, group);
  }
  for (const field of sortedFields) {
    if (!itemById.has(field.itemId)) {
      diagnostics.push({
        type: 'orphan',
        entity: 'field',
        id: field.id,
        detail: `item ${field.itemId}`,
      });
    }
    const group = fieldsByItem.get(field.itemId) ?? [];
    group.push(field);
    fieldsByItem.set(field.itemId, group);
  }

  const counts = new Map<SectionKey, number>();
  const resolved = new Map<number, SectionDefinition>();
  const parsedMetadata = new Map<
    number,
    readonly { key: string; label: string; value: string }[]
  >();
  const resolvedFieldsByItem = new Map<
    number,
    readonly { record: DEX_Field; definition: FieldDefinition }[]
  >();
  for (const section of sortedSections) {
    if (section.documentId !== document.id) {
      diagnostics.push({
        type: 'brokenOwnership',
        entity: 'section',
        id: section.id,
        detail: `document ${section.documentId}`,
      });
    }
    const definition = resolveSectionDefinition(section.type);
    const sectionItems = (itemsBySection.get(section.id) ?? []).sort(byOrder);
    checkOrders(sectionItems, 'item', diagnostics);
    if (!definition) {
      diagnostics.push({
        type: 'unknownSection',
        sectionId: section.id,
        persistedSectionType: section.type,
        recordIds: sectionItems.flatMap((item) =>
          (fieldsByItem.get(item.id) ?? []).map((field) => field.id)
        ),
      });
      continue;
    }
    resolved.set(section.id, definition);
    const key = definition.key as SectionKey;
    counts.set(key, (counts.get(key) ?? 0) + 1);
    if (
      sectionItems.length < definition.itemCardinality.min ||
      ('max' in definition.itemCardinality &&
        definition.itemCardinality.max !== undefined &&
        sectionItems.length > definition.itemCardinality.max)
    ) {
      diagnostics.push({
        type: 'invalidItemCardinality',
        entity: 'section',
        id: section.id,
        detail: `${sectionItems.length} items`,
      });
    }
    const metadata = parseMetadata(section.metadata);
    for (const detail of validateSectionMetadata(definition, metadata)) {
      diagnostics.push({
        type: 'invalidMetadata',
        entity: 'section',
        id: section.id,
        detail,
      });
    }
    if (Array.isArray(metadata)) {
      parsedMetadata.set(
        section.id,
        metadata as { key: string; label: string; value: string }[]
      );
    }
    for (const item of sectionItems) {
      if (item.containerType !== definition.expectedContainerType) {
        diagnostics.push({
          type: 'invalidContainerType',
          entity: 'item',
          id: item.id,
          detail: String(item.containerType),
        });
      }
      const itemFields = fieldsByItem.get(item.id) ?? [];
      const fieldInputs = itemFields.map((field) => ({
        id: field.id,
        name: field.name,
        type: field.type,
      }));
      const recordsByInput = new Map<object, DEX_Field>(
        fieldInputs.map((input, index) => [input, itemFields[index]] as const)
      );
      const analysis = analyzeItemFields(section, fieldInputs);
      for (const diagnostic of analysis.diagnostics) {
        diagnostics.push({
          ...diagnostic,
          sectionId: section.id,
          itemId: item.id,
        });
      }
      const resolvedFields = analysis.entries.map((entry) => ({
        record: recordsByInput.get(entry.field) as DEX_Field,
        definition: entry.definition,
      }));
      resolvedFieldsByItem.set(item.id, resolvedFields);
      for (const { record, definition: fieldDefinition } of resolvedFields) {
        checkFieldStructure(record, fieldDefinition, diagnostics);
      }
    }
  }
  for (const definition of Object.values(sectionDefinitions)) {
    const count = counts.get(definition.key as SectionKey) ?? 0;
    if (
      (definition.sectionCardinality === 'required-one' && count !== 1) ||
      (definition.sectionCardinality === 'optional-one' && count > 1)
    ) {
      diagnostics.push({
        type: 'invalidSectionCardinality',
        entity: 'section',
        detail: `${definition.key}: ${count}`,
      });
    }
  }
  if (diagnostics.length > 0) {
    return {
      success: false,
      diagnostics: Object.freeze(
        diagnostics.sort((left, right) =>
          canonical(left).localeCompare(canonical(right))
        )
      ),
    };
  }

  const orderedSections = sortedSections.sort(byOrder);
  const model = new BuilderDocumentModel(
    document,
    orderedSections.map((section) => section.id as SectionId),
    persistence,
    reconcileAfterCreateFailure
  );
  for (const section of orderedSections) {
    const definition = resolved.get(section.id) as SectionDefinition;
    const sectionItems = (itemsBySection.get(section.id) ?? []).sort(byOrder);
    const sectionModel =
      definition.key === 'workExperience'
        ? new WorkExperienceSectionModel(
            section,
            definition as SectionDefinition<'workExperience'>,
            parsedMetadata.get(section.id) ?? [],
            sectionItems.map((item) => item.id as ItemId),
            model
          )
        : new BuilderSectionModel(
            section,
            definition,
            parsedMetadata.get(section.id) ?? [],
            sectionItems.map((item) => item.id as ItemId),
            model
          );
    model.sectionsById.set(sectionModel.id, sectionModel);
    for (const item of sectionItems) {
      const typedFields: Record<string, SemanticField> = {};
      const fieldIds: FieldId[] = [];
      for (const {
        record,
        definition: fieldDefinition,
      } of resolvedFieldsByItem.get(item.id) ?? []) {
        const fieldModel = new SemanticField(
          record,
          definition.key as SectionKey,
          fieldDefinition,
          model.id,
          persistence
        );
        model.fieldsById.set(fieldModel.id, fieldModel);
        typedFields[fieldModel.fieldKey] = fieldModel;
        fieldIds.push(fieldModel.id);
      }
      const itemModel = createBuilderItemModel(
        item,
        definition.key as SectionKey,
        fieldIds,
        typedFields,
        model
      );
      model.itemsById.set(itemModel.id, itemModel);
    }
  }
  return { success: true, document: model };
};

export const sectionCreationTemplate = (intent: AddSectionIntent) => {
  const definition = resolveSectionDefinition(intent.type);
  const template = getItemInsertTemplate(intent.type as TemplatedSectionType);
  if (
    !definition ||
    !template ||
    definition.sectionCardinality === 'required-one'
  ) {
    return { success: false as const, error: 'Section cannot be added' };
  }
  if (validateSectionMetadata(definition, intent.metadata).length > 0) {
    return { success: false as const, error: 'Invalid section metadata' };
  }
  if (
    template.containerType !== definition.expectedContainerType ||
    analyzeItemFields(
      { type: intent.type },
      template.fields.map((field, id) => ({
        id,
        name: field.name,
        type: field.type,
      }))
    ).diagnostics.length > 0
  ) {
    return {
      success: false as const,
      error: 'Section template does not match its definition',
    };
  }
  return { success: true as const, definition, template };
};

export const itemCreationTemplate = (sectionType: SectionType) => {
  const definition = resolveSectionDefinition(sectionType);
  const template = getItemInsertTemplate(sectionType as TemplatedSectionType);
  if (!definition || !template) {
    return { success: false as const };
  }
  return { success: true as const, definition, template };
};

export const itemCreationLimitReached = (
  definition: SectionDefinition,
  itemCount: number
) => {
  const maxItems =
    'max' in definition.itemCardinality
      ? definition.itemCardinality.max
      : undefined;
  return maxItems !== undefined && itemCount >= maxItems;
};

export const isKnownPersistedSectionType = (type: string): boolean => {
  return resolveSectionDefinition(type) !== undefined;
};

interface DeletionContext {
  documentExists: boolean;
  documentId: number;
  section: Pick<DEX_Section, 'documentId' | 'type'> | undefined;
}

const resolveOwnedSectionDefinition = ({
  documentExists,
  documentId,
  section,
}: DeletionContext) => {
  if (!documentExists || !section || section.documentId !== documentId) {
    return undefined;
  }
  return resolveSectionDefinition(section.type);
};

export const canDeleteItemFromSection = (
  context: DeletionContext,
  itemCount: number
) => {
  const definition = resolveOwnedSectionDefinition(context);
  return Boolean(definition && itemCount > definition.itemCardinality.min);
};

export const canDeleteSection = (context: DeletionContext) => {
  const definition = resolveOwnedSectionDefinition(context);
  return Boolean(
    definition && definition.sectionCardinality !== 'required-one'
  );
};

const validPersistedId = (id: number) => Number.isSafeInteger(id) && id > 0;

const validateCreatedItemGraph = (
  records: CreatedItemRecords,
  sectionType: SectionType,
  expected: Readonly<{
    sectionId: number;
    containerType: DEX_Item['containerType'];
    displayOrder: number;
    fields: readonly FieldInsertTemplate[];
  }>,
  context: 'section' | 'item'
): void => {
  const { item, fields } = records;
  const analysis = analyzeItemFields(
    { type: sectionType },
    fields.map((field) => ({
      id: field.id,
      name: field.name,
      type: field.type,
    }))
  );
  if (
    !validPersistedId(item.id) ||
    fields.some((field) => !validPersistedId(field.id)) ||
    new Set(fields.map((field) => field.id)).size !== fields.length ||
    item.sectionId !== expected.sectionId ||
    item.containerType !== expected.containerType ||
    item.displayOrder !== expected.displayOrder ||
    fields.length !== expected.fields.length ||
    fields.some(
      (field) => field.itemId !== item.id || typeof field.value !== 'string'
    ) ||
    analysis.diagnostics.length > 0
  ) {
    throw new Error(`Incomplete created ${context} graph`);
  }
  for (const entry of analysis.entries) {
    const field = fields.find((candidate) => candidate.id === entry.field.id);
    const templateField = expected.fields.find(
      (candidate) => candidate.name === entry.field.name
    );
    if (!field || !templateField) {
      throw new Error(`Created ${context} field differs from template`);
    }
    const { id: _id, itemId: _itemId, ...content } = field;
    if (JSON.stringify(content) !== JSON.stringify(templateField)) {
      throw new Error(`Created ${context} field differs from template`);
    }
  }
};

/** Reject an incomplete graph while the transaction can still roll back. */
export const validateCreatedSection = (
  records: CreatedSectionRecords,
  intent: AddSectionIntent,
  documentId: number,
  displayOrder: number
): void => {
  const creation = sectionCreationTemplate(intent);
  if (!creation.success) {
    throw new Error('Invalid section creation template');
  }
  const { definition, template } = creation;
  const { section } = records;
  if (
    !validPersistedId(section.id) ||
    section.documentId !== documentId ||
    section.type !== intent.type ||
    section.title !== intent.title ||
    section.defaultTitle !== intent.defaultTitle ||
    section.displayOrder !== displayOrder ||
    section.metadata !==
      (intent.metadata.length ? JSON.stringify(intent.metadata) : '')
  ) {
    throw new Error('Incomplete created section graph');
  }
  validateCreatedItemGraph(
    records,
    intent.type,
    {
      sectionId: section.id,
      containerType: definition.expectedContainerType,
      displayOrder: template.displayOrder,
      fields: template.fields,
    },
    'section'
  );
};

/** Reject an incomplete item graph while the transaction can still roll back. */
export const validateCreatedItem = (
  records: CreatedItemRecords,
  intent: AddItemIntent,
  displayOrder: number
): void => {
  const creation = itemCreationTemplate(intent.sectionType);
  if (!creation.success) {
    throw new Error('Invalid item creation template');
  }
  const { definition, template } = creation;
  validateCreatedItemGraph(
    records,
    intent.sectionType,
    {
      sectionId: intent.sectionId,
      containerType: definition.expectedContainerType,
      displayOrder,
      fields: template.fields,
    },
    'item'
  );
};
