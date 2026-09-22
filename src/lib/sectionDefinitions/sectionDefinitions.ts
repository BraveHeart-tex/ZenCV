type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer Entry)[]
    ? readonly DeepReadonly<Entry>[]
    : T extends object
      ? { readonly [Key in keyof T]: DeepReadonly<T[Key]> }
      : T;

export type PersistedFieldType =
  | 'string'
  | 'rich-text'
  | 'date-month'
  | 'select'
  | 'textarea';

export type FieldControl =
  | 'text'
  | 'url'
  | 'month'
  | 'richText'
  | 'select'
  | 'textarea';

export interface DateRangeDefinitionInput {
  key: string;
  role: 'start' | 'end';
  allowPresent: boolean;
}

export interface RichTextDefinitionInput {
  guidance?: string;
  characterCounter: boolean;
}

export interface FieldDefinitionInput {
  key: string;
  persistedName: string;
  label: string;
  expectedPersistedType: PersistedFieldType;
  control: FieldControl;
  order: number;
  visibility: 'primary' | 'additional';
  width: 'half' | 'full';
  options?: readonly string[];
  dateRange?: DateRangeDefinitionInput;
  richText?: RichTextDefinitionInput;
}

export interface SectionDefinitionInput {
  key: string;
  persistedType: string;
  label: string;
  initialFocusFieldKey: string;
  fields: readonly FieldDefinitionInput[];
}

type SectionRegistry<Entry extends SectionDefinitionInput> = DeepReadonly<
  Omit<Entry, 'fields'> & {
    fields: {
      readonly [Field in Entry['fields'][number] as Field['key']]: Field;
    };
  }
>;

export type SectionDefinitionRegistry<
  Entries extends readonly SectionDefinitionInput[],
> = {
  readonly [Entry in Entries[number] as Entry['key']]: SectionRegistry<Entry>;
};

export class InvalidSectionDefinitionsError extends Error {
  public readonly problems: readonly string[];

  public constructor(problems: readonly string[]) {
    super(`Invalid section definitions:\n${problems.join('\n')}`);
    this.name = 'InvalidSectionDefinitionsError';
    this.problems = freeze(problems);
  }
}

const controlPersistedTypes: Readonly<
  Record<FieldControl, PersistedFieldType>
> = {
  text: 'string',
  url: 'string',
  month: 'date-month',
  richText: 'rich-text',
  select: 'select',
  textarea: 'textarea',
};

const freeze = <Value>(value: Value): DeepReadonly<Value> => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const property of Object.values(value)) {
      freeze(property);
    }
    Object.freeze(value);
  }

  return value as DeepReadonly<Value>;
};

const validateRegistry = (entries: readonly SectionDefinitionInput[]) => {
  const problems: string[] = [];
  const sectionKeys = new Set<string>();
  const persistedTypes = new Set<string>();

  for (const section of entries) {
    const sectionContext = section.key || '<empty section key>';

    if (!section.key) {
      problems.push('section key must not be empty');
    } else if (sectionKeys.has(section.key)) {
      problems.push(`duplicate section key: ${section.key}`);
    }
    sectionKeys.add(section.key);

    if (!section.persistedType) {
      problems.push(
        `section ${sectionContext} has an empty persisted section type`
      );
    } else if (persistedTypes.has(section.persistedType)) {
      problems.push(
        `duplicate persisted section type: ${section.persistedType}`
      );
    }
    persistedTypes.add(section.persistedType);

    if (!section.label) {
      problems.push(`section ${sectionContext} has an empty section label`);
    }
    if (section.fields.length === 0) {
      problems.push(`section ${sectionContext} must define at least one field`);
    }

    const fieldKeys = new Set<string>();
    const persistedNames = new Set<string>();
    const orders = new Set<number>();
    const ranges = new Map<string, DateRangeDefinitionInput[]>();

    for (const field of section.fields) {
      const fieldContext = `${sectionContext}.${field.key || '<empty field key>'}`;

      if (!field.key) {
        problems.push(`section ${sectionContext} has an empty field key`);
      } else if (fieldKeys.has(field.key)) {
        problems.push(
          `section ${sectionContext} has duplicate field key: ${field.key}`
        );
      }
      fieldKeys.add(field.key);

      if (!field.persistedName) {
        problems.push(
          `field ${fieldContext} has an empty persisted field name`
        );
      } else if (persistedNames.has(field.persistedName)) {
        problems.push(
          `section ${sectionContext} has duplicate persisted field name: ${field.persistedName}`
        );
      }
      persistedNames.add(field.persistedName);

      if (!field.label) {
        problems.push(`field ${fieldContext} has an empty field label`);
      }
      if (!Number.isInteger(field.order) || field.order < 0) {
        problems.push(
          `field ${fieldContext} must have a non-negative integer order`
        );
      } else if (orders.has(field.order)) {
        problems.push(
          `section ${sectionContext} has duplicate field order: ${field.order}`
        );
      }
      orders.add(field.order);

      if (
        controlPersistedTypes[field.control] !== field.expectedPersistedType
      ) {
        problems.push(
          `field ${fieldContext} control ${field.control} is incompatible with persisted type ${field.expectedPersistedType}`
        );
      }
      if (
        field.control === 'select' &&
        (!field.options || field.options.length === 0)
      ) {
        problems.push(`select field ${fieldContext} must define options`);
      }
      if (field.control !== 'select' && field.options) {
        problems.push(
          `non-select field ${fieldContext} must not define options`
        );
      }
      if (field.control === 'richText' && !field.richText) {
        problems.push(
          `rich-text field ${fieldContext} must define rich-text metadata`
        );
      }
      if (field.control !== 'richText' && field.richText) {
        problems.push(
          `non-rich-text field ${fieldContext} must not define rich-text metadata`
        );
      }

      if (field.dateRange) {
        if (field.control !== 'month') {
          problems.push(
            `non-month field ${fieldContext} must not define a date range`
          );
        }
        if (!field.dateRange.key) {
          problems.push(`date range for field ${fieldContext} must have a key`);
        }
        if (field.dateRange.allowPresent && field.dateRange.role !== 'end') {
          problems.push(
            `field ${fieldContext} allows Present but is not an end date`
          );
        }
        const rangeFields = ranges.get(field.dateRange.key) ?? [];
        rangeFields.push(field.dateRange);
        ranges.set(field.dateRange.key, rangeFields);
      } else if (field.control === 'month') {
        problems.push(`month field ${fieldContext} must define a date range`);
      }
    }

    if (!fieldKeys.has(section.initialFocusFieldKey)) {
      problems.push(
        `section ${sectionContext} has invalid initial focus field key: ${section.initialFocusFieldKey}`
      );
    }

    for (const [rangeKey, fields] of ranges) {
      const starts = fields.filter((field) => field.role === 'start').length;
      const ends = fields.filter((field) => field.role === 'end').length;
      if (starts !== 1 || ends !== 1) {
        problems.push(
          `date range ${sectionContext}.${rangeKey} must contain exactly one start and one end`
        );
      }
    }
  }

  if (problems.length > 0) {
    throw new InvalidSectionDefinitionsError(problems);
  }
};

export const createSectionDefinitionRegistry = <
  const Entries extends readonly SectionDefinitionInput[],
>(
  entries: Entries
): SectionDefinitionRegistry<Entries> => {
  validateRegistry(entries);

  const registry = Object.fromEntries(
    entries.map((section) => [
      section.key,
      {
        ...section,
        fields: Object.fromEntries(
          section.fields.map((field) => [
            field.key,
            {
              ...field,
              options: field.options ? [...field.options] : undefined,
              dateRange: field.dateRange ? { ...field.dateRange } : undefined,
              richText: field.richText ? { ...field.richText } : undefined,
            },
          ])
        ),
      },
    ])
  );

  return freeze(registry) as SectionDefinitionRegistry<Entries>;
};

export const sectionDefinitions = createSectionDefinitionRegistry([
  {
    key: 'workExperience',
    persistedType: 'work-experience',
    label: 'Work Experience',
    initialFocusFieldKey: 'role',
    fields: [
      {
        key: 'role',
        persistedName: 'Job Title',
        label: 'Job Title',
        expectedPersistedType: 'string',
        control: 'text',
        order: 0,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'employer',
        persistedName: 'Employer',
        label: 'Employer',
        expectedPersistedType: 'string',
        control: 'text',
        order: 1,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'startDate',
        persistedName: 'Start Date',
        label: 'Start Date',
        expectedPersistedType: 'date-month',
        control: 'month',
        order: 2,
        visibility: 'primary',
        width: 'half',
        dateRange: {
          key: 'employment',
          role: 'start',
          allowPresent: false,
        },
      },
      {
        key: 'endDate',
        persistedName: 'End Date',
        label: 'End Date',
        expectedPersistedType: 'date-month',
        control: 'month',
        order: 3,
        visibility: 'primary',
        width: 'half',
        dateRange: {
          key: 'employment',
          role: 'end',
          allowPresent: true,
        },
      },
      {
        key: 'city',
        persistedName: 'City',
        label: 'City',
        expectedPersistedType: 'string',
        control: 'text',
        order: 4,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'description',
        persistedName: 'Description',
        label: 'Description',
        expectedPersistedType: 'rich-text',
        control: 'richText',
        order: 5,
        visibility: 'primary',
        width: 'full',
        richText: {
          guidance:
            'E.g., "Led a team of 5 to deliver a new feature that increased user engagement by 40%"',
          characterCounter: true,
        },
      },
    ],
  },
] as const);

export type SectionKey = keyof typeof sectionDefinitions;
export type FieldKey<Section extends SectionKey> =
  keyof (typeof sectionDefinitions)[Section]['fields'];
export type SectionDefinition<Section extends SectionKey = SectionKey> =
  (typeof sectionDefinitions)[Section];
export type FieldDefinition<Section extends SectionKey = SectionKey> =
  SectionDefinition<Section>['fields'][FieldKey<Section>];

export interface PersistedSectionInput {
  readonly type: string;
}

export interface PersistedFieldInput {
  readonly id: string | number;
  readonly name: string;
  readonly type: string;
}

export const getSectionDefinition = <Section extends SectionKey>(
  key: Section
): SectionDefinition<Section> => sectionDefinitions[key];

export const resolveSectionDefinition = (
  persistedType: string
): SectionDefinition | undefined =>
  Object.values(sectionDefinitions).find(
    (definition) => definition.persistedType === persistedType
  );

export const resolveFieldDefinition = <Section extends SectionKey>(
  sectionKey: Section,
  persistedName: string
): FieldDefinition<Section> | undefined =>
  Object.values(sectionDefinitions[sectionKey].fields).find(
    (field) => field.persistedName === persistedName
  ) as FieldDefinition<Section> | undefined;

export type DefinitionDiagnostic =
  | Readonly<{
      type: 'unknownSection';
      persistedSectionType: string;
    }>
  | Readonly<{
      type: 'unknownField';
      sectionKey: SectionKey;
      persistedFieldName: string;
      recordIds: readonly (string | number)[];
    }>
  | Readonly<{
      type: 'missingField';
      sectionKey: SectionKey;
      fieldKey: FieldKey<SectionKey>;
      persistedFieldName: string;
    }>
  | Readonly<{
      type: 'duplicateField';
      sectionKey: SectionKey;
      fieldKey: FieldKey<SectionKey>;
      persistedFieldName: string;
      recordIds: readonly (string | number)[];
    }>
  | Readonly<{
      type: 'incompatibleFieldType';
      sectionKey: SectionKey;
      fieldKey: FieldKey<SectionKey>;
      persistedFieldName: string;
      recordIds: readonly (string | number)[];
      expectedPersistedType: PersistedFieldType;
      actualPersistedType: string;
    }>;

export interface ResolvedFieldEntry {
  readonly field: PersistedFieldInput;
  readonly definition: FieldDefinition;
}

export interface ItemFieldAnalysis {
  readonly entries: readonly ResolvedFieldEntry[];
  readonly diagnostics: readonly DefinitionDiagnostic[];
}

export const analyzeItemFields = (
  section: PersistedSectionInput,
  fields: readonly PersistedFieldInput[]
): ItemFieldAnalysis => {
  const definition = resolveSectionDefinition(section.type);
  if (!definition) {
    return freeze({
      entries: [],
      diagnostics: [
        {
          type: 'unknownSection',
          persistedSectionType: section.type,
        },
      ],
    });
  }

  const sectionKey = definition.key as SectionKey;
  const resolved = fields.flatMap((field, inputOrder) => {
    const fieldDefinition = resolveFieldDefinition(sectionKey, field.name);
    return fieldDefinition
      ? [{ field, definition: fieldDefinition, inputOrder }]
      : [];
  });
  const fieldsByPersistedName = new Map<string, PersistedFieldInput[]>();
  for (const field of fields) {
    const matchingFields = fieldsByPersistedName.get(field.name) ?? [];
    matchingFields.push(field);
    fieldsByPersistedName.set(field.name, matchingFields);
  }

  const inputDiagnostics: {
    inputOrder: number;
    diagnostic: DefinitionDiagnostic;
  }[] = [];
  for (const [inputOrder, field] of fields.entries()) {
    const fieldDefinition = resolveFieldDefinition(sectionKey, field.name);
    if (!fieldDefinition) {
      inputDiagnostics.push({
        inputOrder,
        diagnostic: {
          type: 'unknownField',
          sectionKey,
          persistedFieldName: field.name,
          recordIds: [field.id],
        },
      });
      continue;
    }

    const matches = fieldsByPersistedName.get(field.name) ?? [];
    if (matches.length > 1 && matches[0] === field) {
      inputDiagnostics.push({
        inputOrder,
        diagnostic: {
          type: 'duplicateField',
          sectionKey,
          fieldKey: fieldDefinition.key as FieldKey<SectionKey>,
          persistedFieldName: field.name,
          recordIds: matches.map((match) => match.id),
        },
      });
    }
    if (field.type !== fieldDefinition.expectedPersistedType) {
      inputDiagnostics.push({
        inputOrder,
        diagnostic: {
          type: 'incompatibleFieldType',
          sectionKey,
          fieldKey: fieldDefinition.key as FieldKey<SectionKey>,
          persistedFieldName: field.name,
          recordIds: [field.id],
          expectedPersistedType: fieldDefinition.expectedPersistedType,
          actualPersistedType: field.type,
        },
      });
    }
  }

  const missingDiagnostics = Object.values(definition.fields)
    .filter(
      (fieldDefinition) =>
        !fieldsByPersistedName.has(fieldDefinition.persistedName)
    )
    .sort((left, right) => left.order - right.order)
    .map<DefinitionDiagnostic>((fieldDefinition) => ({
      type: 'missingField',
      sectionKey,
      fieldKey: fieldDefinition.key as FieldKey<SectionKey>,
      persistedFieldName: fieldDefinition.persistedName,
    }));

  return freeze({
    entries: resolved
      .sort(
        (left, right) =>
          left.definition.order - right.definition.order ||
          left.inputOrder - right.inputOrder
      )
      .map(({ field, definition: fieldDefinition }) => ({
        field: { ...field },
        definition: fieldDefinition,
      })),
    diagnostics: [
      ...inputDiagnostics
        .sort((left, right) => left.inputOrder - right.inputOrder)
        .map(({ diagnostic }) => diagnostic),
      ...missingDiagnostics,
    ],
  });
};
