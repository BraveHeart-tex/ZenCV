import {
  action,
  computed,
  type IObservableArray,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import { clientDb } from '@/lib/client-db/clientDb';
import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { updateField } from '@/lib/client-db/fieldService';
import {
  addItemFromTemplate,
  addItemFromTemplateWithSectionTypeLimit,
  bulkUpdateItems,
  deleteItem,
} from '@/lib/client-db/itemService';
import {
  bulkUpdateSections,
  deleteSection,
  updateSection,
} from '@/lib/client-db/sectionService';
import { getItemInsertTemplate } from '@/lib/helpers/documentBuilderHelpers';
import {
  analyzeItemFields,
  type DefinitionDiagnostic,
  type FieldDefinition,
  type FieldKey,
  resolveSectionDefinition,
  type SectionDefinition,
  type SectionKey,
  sectionDefinitions,
  validateSectionMetadata,
} from '@/lib/sectionDefinitions/sectionDefinitions';
import type {
  StoreResult,
  TemplatedSectionType,
} from '@/lib/types/documentBuilder.types';

export type DocumentId = number & { readonly __documentId: unique symbol };
export type SectionId = number & { readonly __sectionId: unique symbol };
export type ItemId = number & { readonly __itemId: unique symbol };
export type FieldId = number & { readonly __fieldId: unique symbol };

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
};
type FieldsFor<S extends SectionKey> = {
  readonly [K in FieldKey<S>]: SemanticField<S, Extract<K, string>>;
};

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
  private persistedValue: string;
  #version = 0;
  #timer: ReturnType<typeof setTimeout> | null = null;
  #saveTail: Promise<void> = Promise.resolve();
  #pendingCount = 0;
  #lastQueued: { version: number; promise: Promise<boolean> } | null = null;
  #disposed = false;

  constructor(
    record: DEX_Field,
    sectionKey: S,
    definition: FieldDefinition<S>
  ) {
    this.id = record.id as FieldId;
    this.itemId = record.itemId as ItemId;
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
        const updated = await updateField(this.id, value);
        if (updated === 0) {
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

export class BuilderSectionModel<S extends SectionKey = SectionKey> {
  readonly id: SectionId;
  readonly documentId: DocumentId;
  readonly sectionKey: S;
  readonly definition: SectionDefinition<S>;
  title: string;
  readonly defaultTitle: string;
  readonly metadata: {
    key: string;
    label: string;
    value: string;
  }[];
  displayOrder: number;
  #document: BuilderDocumentModel;

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
    this.definition = definition;
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

  get items(): readonly BuilderItemModel<S>[] {
    return this.itemIds.map(
      (id) => this.#document.itemsById.get(id) as unknown as BuilderItemModel<S>
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
  readonly title: string;
  readonly templateType: DEX_Document['templateType'];
  readonly templateSettings: string;
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

  constructor(record: DEX_Document, sectionIds: readonly SectionId[]) {
    this.id = record.id as DocumentId;
    this.title = record.title;
    this.templateType = record.templateType;
    this.templateSettings = record.templateSettings;
    this.createdAt = record.createdAt;
    this.updatedAt = record.updatedAt;
    this.jobPostingId = record.jobPostingId;
    this.sectionIds = observable.array([...sectionIds], { deep: false });
  }

  get sections(): readonly BuilderSectionModel[] {
    return this.sectionIds.map(
      (id) => this.sectionsById.get(id) as BuilderSectionModel
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
  get workExperience(): BuilderSectionModel<'workExperience'> {
    return this.section(
      'workExperience'
    ) as BuilderSectionModel<'workExperience'>;
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

  addSection(
    input: Pick<DEX_Section, 'type' | 'title' | 'defaultTitle'> & {
      metadata?: DEX_Section['metadata'];
    }
  ): Promise<StoreResult<{ sectionId: SectionId; itemId: ItemId }>> {
    return this.#enqueue(async () => {
      const definition = resolveSectionDefinition(input.type);
      const template = getItemInsertTemplate(
        input.type as TemplatedSectionType
      );
      if (
        !definition ||
        !template ||
        definition.sectionCardinality === 'required-one'
      ) {
        return { success: false, error: 'Section cannot be added' };
      }
      if (
        definition.sectionCardinality === 'optional-one' &&
        this.section(definition.key)
      ) {
        return { success: false, error: 'Section already exists' };
      }
      const metadata = parseMetadata(input.metadata);
      if (validateSectionMetadata(definition, metadata).length > 0) {
        return { success: false, error: 'Invalid section metadata' };
      }
      const fieldsAnalysis = analyzeItemFields(
        { type: input.type },
        template.fields.map((field, index) => ({
          id: index,
          name: field.name,
          type: field.type,
        }))
      );
      if (
        fieldsAnalysis.diagnostics.length > 0 ||
        template.containerType !== definition.expectedContainerType
      ) {
        return {
          success: false,
          error: 'Section template does not match its definition',
        };
      }
      try {
        const created = await clientDb.transaction(
          'rw',
          [clientDb.sections, clientDb.items, clientDb.fields],
          async () => {
            const persisted = await clientDb.sections
              .where('documentId')
              .equals(this.id)
              .toArray();
            if (
              definition.sectionCardinality === 'optional-one' &&
              persisted.some((section) => section.type === input.type)
            ) {
              return undefined;
            }
            const displayOrder =
              Math.max(0, ...persisted.map((section) => section.displayOrder)) +
              1;
            const sectionInput = {
              documentId: this.id,
              type: input.type,
              title: input.title,
              defaultTitle: input.defaultTitle,
              metadata: input.metadata ?? '',
              displayOrder,
            };
            const sectionId = await clientDb.sections.add(sectionInput);
            const itemInput = {
              sectionId,
              containerType: template.containerType,
              displayOrder: template.displayOrder,
            };
            const itemId = await clientDb.items.add(itemInput);
            const fieldInputs = template.fields.map((field) => ({
              ...field,
              itemId,
            }));
            const fieldIds = await clientDb.fields.bulkAdd(fieldInputs, {
              allKeys: true,
            });
            return {
              section: { ...sectionInput, id: sectionId } as DEX_Section,
              item: { ...itemInput, id: itemId } as DEX_Item,
              fields: fieldInputs.map((field, index) => ({
                ...field,
                id: fieldIds[index],
              })) as DEX_Field[],
            };
          }
        );
        if (!created) {
          return { success: false, error: 'Section already exists' };
        }
        const analysis = analyzeItemFields(
          created.section,
          created.fields.map((field) => ({
            id: field.id,
            name: field.name,
            type: field.type,
          }))
        );
        const recordsById = new Map(
          created.fields.map((field) => [field.id, field])
        );
        const typedFields: Record<string, SemanticField> = {};
        const fields = analysis.entries.map(
          ({ field, definition: fieldDefinition }) => {
            const model = new SemanticField(
              recordsById.get(Number(field.id)) as DEX_Field,
              definition.key as SectionKey,
              fieldDefinition as FieldDefinition<SectionKey>
            );
            typedFields[model.fieldKey] = model;
            return model;
          }
        );
        const item = new BuilderItemModel(
          created.item,
          definition.key,
          fields.map((field) => field.id),
          typedFields,
          this
        );
        const section = new BuilderSectionModel(
          created.section,
          definition,
          metadata as BuilderSectionModel['metadata'],
          [item.id],
          this
        );
        runInAction(() => {
          for (const field of fields) {
            this.fieldsById.set(field.id, field);
          }
          this.itemsById.set(item.id, item);
          this.sectionsById.set(section.id, section);
          this.sectionIds.push(section.id);
        });
        return {
          success: true,
          data: { sectionId: section.id, itemId: item.id },
        };
      } catch {
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
        await deleteSection(sectionId);
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
      const previous = section.title;
      runInAction(() => {
        section.title = title;
      });
      try {
        if ((await updateSection(sectionId, { title })) === 0) {
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
      if (validateSectionMetadata(section.definition, proposed).length > 0) {
        return { success: false, error: 'Invalid section metadata' };
      }
      const previous = entry.value;
      runInAction(() => {
        entry.value = value;
      });
      try {
        if (
          (await updateSection(sectionId, {
            metadata: JSON.stringify(proposed),
          })) === 0
        ) {
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

  reorderSections(sectionIds: readonly SectionId[]): Promise<StoreResult> {
    return this.#enqueue(async () => {
      if (
        sectionIds.length !== this.sectionIds.length ||
        new Set(sectionIds).size !== sectionIds.length ||
        sectionIds.some((id) => !this.sectionsById.has(id))
      ) {
        return { success: false, error: 'Invalid section order' };
      }
      const previousIds = [...this.sectionIds];
      const previousOrders = new Map(
        this.sections.map((section) => [section.id, section.displayOrder])
      );
      const changes = sectionIds.flatMap((id, index) =>
        previousOrders.get(id) === index + 1
          ? []
          : [{ key: id, changes: { displayOrder: index + 1 } }]
      );
      runInAction(() => {
        this.sectionIds.replace([...sectionIds]);
        sectionIds.forEach((id, index) => {
          (this.sectionsById.get(id) as BuilderSectionModel).displayOrder =
            index + 1;
        });
      });
      try {
        if (
          changes.length > 0 &&
          (await bulkUpdateSections(changes)) !== changes.length
        ) {
          throw new Error('Some sections no longer exist');
        }
        return { success: true };
      } catch {
        runInAction(() => {
          this.sectionIds.replace(previousIds);
          for (const [id, order] of previousOrders) {
            (this.sectionsById.get(id) as BuilderSectionModel).displayOrder =
              order;
          }
        });
        return { success: false, error: 'Failed to reorder sections' };
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
        section.definition.persistedType as TemplatedSectionType
      );
      if (!template) {
        return undefined;
      }
      const displayOrder =
        Math.max(0, ...section.items.map((item) => item.displayOrder)) + 1;
      const input = { ...template, sectionId, displayOrder };
      const result =
        max !== undefined && section.sectionKey === 'websitesSocialLinks'
          ? await addItemFromTemplateWithSectionTypeLimit(input, max)
          : await addItemFromTemplate(input);
      if (!result) {
        return undefined;
      }
      const fieldInputs = result.fields.map((field) => ({
        id: field.id,
        name: field.name,
        type: field.type,
      }));
      const analysis = analyzeItemFields(
        { type: section.definition.persistedType } as DEX_Section,
        fieldInputs
      );
      if (analysis.diagnostics.length > 0) {
        throw new Error('Persisted item does not match its Section Definition');
      }
      const recordsById = new Map(
        result.fields.map((field) => [field.id, field])
      );
      const typedFields: Record<string, SemanticField> = {};
      const fields = analysis.entries.map(({ field, definition }) => {
        const model = new SemanticField(
          recordsById.get(Number(field.id)) as DEX_Field,
          section.sectionKey,
          definition
        );
        typedFields[model.fieldKey] = model;
        return model;
      });
      const item = new BuilderItemModel(
        result.item,
        section.sectionKey,
        fields.map((field) => field.id),
        typedFields,
        this
      );
      runInAction(() => {
        for (const field of fields) {
          this.fieldsById.set(field.id, field);
        }
        this.itemsById.set(item.id, item);
        mutableItemIds(section).push(item.id);
      });
      return item.id;
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
        await deleteItem(itemId);
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
  ): Promise<boolean> {
    return this.#enqueue(async () => {
      const section = this.sectionsById.get(sectionId);
      if (
        !section ||
        itemIds.length !== section.itemIds.length ||
        new Set(itemIds).size !== itemIds.length ||
        itemIds.some((id) => !section.itemIds.includes(id))
      ) {
        return false;
      }
      const previousIds = [...section.itemIds];
      const previousOrders = section.items.map(
        (item) => [item.id, item.displayOrder] as const
      );
      const changes = itemIds.flatMap((id, index) => {
        const item = this.itemsById.get(id) as BuilderItemModel;
        return item.displayOrder === index + 1
          ? []
          : [{ key: id, changes: { displayOrder: index + 1 } }];
      });
      runInAction(() => {
        mutableItemIds(section).replace([...itemIds]);
        itemIds.forEach((id, index) => {
          (this.itemsById.get(id) as BuilderItemModel).displayOrder = index + 1;
        });
      });
      try {
        if (changes.length > 0) {
          const updated = await bulkUpdateItems(changes);
          if (updated !== changes.length) {
            throw new Error('Some items no longer exist');
          }
        }
        return true;
      } catch {
        runInAction(() => {
          mutableItemIds(section).replace(previousIds);
          for (const [id, order] of previousOrders) {
            (this.itemsById.get(id) as BuilderItemModel).displayOrder = order;
          }
        });
        return false;
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

export interface PersistedDocumentRecords {
  readonly document: DEX_Document;
  readonly sections: readonly DEX_Section[];
  readonly items: readonly DEX_Item[];
  readonly fields: readonly DEX_Field[];
}

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

export const hydrateBuilderDocument = ({
  document,
  sections,
  items,
  fields,
}: PersistedDocumentRecords): HydrationResult => {
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
    orderedSections.map((section) => section.id as SectionId)
  );
  for (const section of orderedSections) {
    const definition = resolved.get(section.id) as SectionDefinition;
    const sectionItems = (itemsBySection.get(section.id) ?? []).sort(byOrder);
    const sectionModel = new BuilderSectionModel(
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
          fieldDefinition
        );
        model.fieldsById.set(fieldModel.id, fieldModel);
        typedFields[fieldModel.fieldKey] = fieldModel;
        fieldIds.push(fieldModel.id);
      }
      const itemModel = new BuilderItemModel(
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
