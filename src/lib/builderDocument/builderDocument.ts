import { action, computed, makeObservable, observable } from 'mobx';
import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
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

export type DocumentId = number & { readonly __documentId: unique symbol };
export type SectionId = number & { readonly __sectionId: unique symbol };
export type ItemId = number & { readonly __itemId: unique symbol };
export type FieldId = number & { readonly __fieldId: unique symbol };

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
  #persisted: DEX_Field;

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
    this.#persisted = { ...record };
    makeObservable(this, {
      value: observable,
      isDirty: computed,
      setDraft: action,
    });
  }

  get label(): string {
    return this.definition.label;
  }

  get isDirty(): boolean {
    return this.value !== this.#persisted.value;
  }

  setDraft(value: string): void {
    this.value = value;
  }
}

export class BuilderItemModel<S extends SectionKey = SectionKey> {
  readonly id: ItemId;
  readonly sectionId: SectionId;
  readonly sectionKey: S;
  readonly containerType: DEX_Item['containerType'];
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
    this.fieldIds = Object.freeze([...fieldIds]);
    this.fields = (sectionKey === 'custom'
      ? undefined
      : Object.freeze(fields)) as unknown as BuilderItemModel<S>['fields'];
    this.#document = document;
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
  readonly title: string;
  readonly defaultTitle: string;
  readonly metadata: readonly Readonly<{
    key: string;
    label: string;
    value: string;
  }>[];
  readonly itemIds: readonly ItemId[];
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
    this.metadata = Object.freeze(
      metadata.map((entry) => Object.freeze({ ...entry }))
    );
    this.itemIds = Object.freeze([...itemIds]);
    this.#document = document;
  }

  get items(): readonly BuilderItemModel<S>[] {
    return this.itemIds.map(
      (id) => this.#document.itemsById.get(id) as unknown as BuilderItemModel<S>
    );
  }
}

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
  readonly sectionIds: readonly SectionId[];

  constructor(record: DEX_Document, sectionIds: readonly SectionId[]) {
    this.id = record.id as DocumentId;
    this.title = record.title;
    this.templateType = record.templateType;
    this.templateSettings = record.templateSettings;
    this.createdAt = record.createdAt;
    this.updatedAt = record.updatedAt;
    this.jobPostingId = record.jobPostingId;
    this.sectionIds = Object.freeze([...sectionIds]);
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
      const analysis = analyzeItemFields(
        section,
        itemFields.map((field) => ({
          id: field.id,
          name: field.name,
          type: field.type,
        }))
      );
      for (const diagnostic of analysis.diagnostics) {
        diagnostics.push({
          ...diagnostic,
          sectionId: section.id,
          itemId: item.id,
        });
      }
      for (const entry of analysis.entries) {
        const record = itemFields.find((field) => field.id === entry.field.id);
        if (record) {
          checkFieldStructure(record, entry.definition, diagnostics);
        }
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
      const analysis = analyzeItemFields(
        section,
        (fieldsByItem.get(item.id) ?? []).map((field) => ({
          id: field.id,
          name: field.name,
          type: field.type,
        }))
      );
      const typedFields: Record<string, SemanticField> = {};
      const fieldIds: FieldId[] = [];
      for (const entry of analysis.entries) {
        const record = (fieldsByItem.get(item.id) ?? []).find(
          (field) => field.id === entry.field.id
        ) as DEX_Field;
        const fieldModel = new SemanticField(
          record,
          definition.key as SectionKey,
          entry.definition
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
