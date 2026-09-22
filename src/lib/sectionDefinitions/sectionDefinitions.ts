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
  placeholder?: string;
  options?: readonly string[];
  dateRange?: DateRangeDefinitionInput;
  richText?: RichTextDefinitionInput;
}

export interface SectionDefinitionInput {
  key: string;
  persistedType: string;
  label: string;
  sectionCardinality: 'required-one' | 'optional-one' | 'many';
  itemCardinality: { min: number; max?: number };
  expectedContainerType: 'static' | 'collapsible';
  metadata?: readonly MetadataDefinitionInput[];
  initialFocusFieldKey: string;
  fields: readonly FieldDefinitionInput[];
}

export interface MetadataDefinitionInput {
  key: string;
  allowedValues: readonly string[];
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
    if (
      !['required-one', 'optional-one', 'many'].includes(
        section.sectionCardinality
      )
    ) {
      problems.push(
        `section ${sectionContext} has invalid section cardinality`
      );
    }
    if (
      !section.itemCardinality ||
      !Number.isInteger(section.itemCardinality.min) ||
      section.itemCardinality.min < 0 ||
      (section.itemCardinality.max !== undefined &&
        (!Number.isInteger(section.itemCardinality.max) ||
          section.itemCardinality.max < section.itemCardinality.min))
    ) {
      problems.push(`section ${sectionContext} has invalid item cardinality`);
    }
    if (!['static', 'collapsible'].includes(section.expectedContainerType)) {
      problems.push(`section ${sectionContext} has invalid container type`);
    }
    if (section.metadata !== undefined) {
      if (!Array.isArray(section.metadata) || section.metadata.length === 0) {
        problems.push(
          `section ${sectionContext} has an empty metadata contract`
        );
      } else {
        const metadataKeys = new Set<string>();
        for (const entry of section.metadata) {
          if (!entry || typeof entry !== 'object') {
            problems.push(
              `section ${sectionContext} has invalid metadata entry`
            );
            continue;
          }
          if (typeof entry.key !== 'string' || !entry.key) {
            problems.push(
              `section ${sectionContext} has an empty metadata key`
            );
          } else if (metadataKeys.has(entry.key)) {
            problems.push(
              `section ${sectionContext} has duplicate metadata key: ${entry.key}`
            );
          }
          metadataKeys.add(entry.key);
          if (
            !Array.isArray(entry.allowedValues) ||
            entry.allowedValues.length === 0 ||
            entry.allowedValues.some(
              (value: string) => typeof value !== 'string' || !value
            ) ||
            new Set(entry.allowedValues).size !== entry.allowedValues.length
          ) {
            problems.push(
              `section ${sectionContext} metadata ${entry.key || '<empty metadata key>'} has invalid allowed values`
            );
          }
        }
      }
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
        itemCardinality: { ...section.itemCardinality },
        metadata: section.metadata?.map((entry) => ({
          key: entry.key,
          allowedValues: [...entry.allowedValues],
        })),
        fields: Object.fromEntries(
          section.fields.map((field) => [
            field.key,
            {
              ...field,
              options: field.options ? [...field.options] : undefined,
              placeholder: field.placeholder,
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
    key: 'personalDetails',
    persistedType: 'personal-details',
    sectionCardinality: 'required-one',
    itemCardinality: { min: 1, max: 1 },
    expectedContainerType: 'static',
    label: 'Personal Details',
    initialFocusFieldKey: 'wantedJobTitle',
    fields: [
      {
        key: 'wantedJobTitle',
        persistedName: 'Wanted Job Title',
        label: 'Wanted Job Title',
        expectedPersistedType: 'string',
        control: 'text',
        order: 0,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'firstName',
        persistedName: 'First Name',
        label: 'First Name',
        expectedPersistedType: 'string',
        control: 'text',
        order: 1,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'lastName',
        persistedName: 'Last Name',
        label: 'Last Name',
        expectedPersistedType: 'string',
        control: 'text',
        order: 2,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'email',
        persistedName: 'Email',
        label: 'Email',
        expectedPersistedType: 'string',
        control: 'text',
        order: 3,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'phone',
        persistedName: 'Phone',
        label: 'Phone',
        expectedPersistedType: 'string',
        control: 'text',
        order: 4,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'country',
        persistedName: 'Country',
        label: 'Country',
        expectedPersistedType: 'string',
        control: 'text',
        order: 5,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'city',
        persistedName: 'City',
        label: 'City',
        expectedPersistedType: 'string',
        control: 'text',
        order: 6,
        visibility: 'additional',
        width: 'half',
      },
      {
        key: 'address',
        persistedName: 'Address',
        label: 'Address',
        expectedPersistedType: 'string',
        control: 'text',
        order: 7,
        visibility: 'additional',
        width: 'half',
      },
    ],
  },
  {
    key: 'summary',
    persistedType: 'summary',
    sectionCardinality: 'required-one',
    itemCardinality: { min: 1, max: 1 },
    expectedContainerType: 'static',
    label: 'Summary',
    initialFocusFieldKey: 'summary',
    fields: [
      {
        key: 'summary',
        persistedName: 'Summary',
        label: 'Summary',
        expectedPersistedType: 'rich-text',
        control: 'richText',
        order: 0,
        visibility: 'primary',
        width: 'full',
        richText: {
          guidance:
            'E.g., "Full-stack developer with 5+ years of experience in building scalable web applications"',
          characterCounter: true,
        },
      },
    ],
  },
  {
    key: 'workExperience',
    persistedType: 'work-experience',
    sectionCardinality: 'required-one',
    itemCardinality: { min: 1 },
    expectedContainerType: 'collapsible',
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
  {
    key: 'education',
    persistedType: 'education',
    sectionCardinality: 'optional-one',
    itemCardinality: { min: 1 },
    expectedContainerType: 'collapsible',
    label: 'Education',
    initialFocusFieldKey: 'school',
    fields: [
      {
        key: 'school',
        persistedName: 'School',
        label: 'School',
        expectedPersistedType: 'string',
        control: 'text',
        order: 0,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'degree',
        persistedName: 'Degree',
        label: 'Degree',
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
        dateRange: { key: 'education', role: 'start', allowPresent: false },
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
        dateRange: { key: 'education', role: 'end', allowPresent: true },
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
            'E.g., "Computer Science major with Dean\'s List recognition"',
          characterCounter: false,
        },
      },
    ],
  },
  {
    key: 'websitesSocialLinks',
    persistedType: 'websites-social-links',
    sectionCardinality: 'optional-one',
    itemCardinality: { min: 0, max: 4 },
    expectedContainerType: 'collapsible',
    label: 'Links',
    initialFocusFieldKey: 'label',
    fields: [
      {
        key: 'label',
        persistedName: 'Label',
        label: 'Label',
        expectedPersistedType: 'string',
        control: 'text',
        order: 0,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'link',
        persistedName: 'Link',
        label: 'Link',
        expectedPersistedType: 'string',
        control: 'url',
        order: 1,
        visibility: 'primary',
        width: 'half',
      },
    ],
  },
  {
    key: 'skills',
    persistedType: 'skills',
    sectionCardinality: 'optional-one',
    itemCardinality: { min: 1 },
    expectedContainerType: 'collapsible',
    metadata: [
      { key: 'showExperienceLevel', allowedValues: ['0', '1'] },
      { key: 'isCommaSeparated', allowedValues: ['0', '1'] },
    ],
    label: 'Skills',
    initialFocusFieldKey: 'skill',
    fields: [
      {
        key: 'skill',
        persistedName: 'Skill',
        label: 'Skill',
        expectedPersistedType: 'string',
        control: 'text',
        order: 0,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'experienceLevel',
        persistedName: 'Experience Level',
        label: 'Experience Level',
        expectedPersistedType: 'select',
        control: 'select',
        order: 1,
        visibility: 'primary',
        width: 'half',
        options: ['Beginner', 'Competent', 'Proficient', 'Expert'],
      },
    ],
  },
  {
    key: 'custom',
    persistedType: 'custom',
    sectionCardinality: 'many',
    itemCardinality: { min: 1 },
    expectedContainerType: 'collapsible',
    label: 'Custom Section',
    initialFocusFieldKey: 'activityName',
    fields: [
      {
        key: 'activityName',
        persistedName: 'Activity name, job, book title etc.',
        label: 'Activity name, job, book title etc.',
        expectedPersistedType: 'string',
        control: 'text',
        order: 0,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'city',
        persistedName: 'City',
        label: 'City',
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
        dateRange: { key: 'custom', role: 'start', allowPresent: false },
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
        dateRange: { key: 'custom', role: 'end', allowPresent: true },
      },
      {
        key: 'description',
        persistedName: 'Description',
        label: 'Description',
        expectedPersistedType: 'rich-text',
        control: 'richText',
        order: 4,
        visibility: 'primary',
        width: 'full',
        richText: { characterCounter: false },
      },
    ],
  },
  {
    key: 'internships',
    persistedType: 'internships',
    sectionCardinality: 'optional-one',
    itemCardinality: { min: 1 },
    expectedContainerType: 'collapsible',
    label: 'Internships',
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
        dateRange: { key: 'employment', role: 'start', allowPresent: false },
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
        dateRange: { key: 'employment', role: 'end', allowPresent: true },
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
  {
    key: 'hobbies',
    persistedType: 'hobbies',
    sectionCardinality: 'optional-one',
    itemCardinality: { min: 1, max: 1 },
    expectedContainerType: 'static',
    label: 'Hobbies',
    initialFocusFieldKey: 'whatYouLike',
    fields: [
      {
        key: 'whatYouLike',
        persistedName: 'What do you like?',
        label: 'What do you like?',
        expectedPersistedType: 'textarea',
        control: 'textarea',
        order: 0,
        visibility: 'primary',
        width: 'full',
        placeholder: 'E.g., "Photography, Rock Climbing, Learning Languages"',
      },
    ],
  },
  {
    key: 'references',
    persistedType: 'references',
    sectionCardinality: 'optional-one',
    itemCardinality: { min: 1 },
    expectedContainerType: 'collapsible',
    metadata: [{ key: 'hideReferences', allowedValues: ['0', '1'] }],
    label: 'References',
    initialFocusFieldKey: 'referentFullName',
    fields: [
      {
        key: 'referentFullName',
        persistedName: "Referent's Full Name",
        label: "Referent's Full Name",
        expectedPersistedType: 'string',
        control: 'text',
        order: 0,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'company',
        persistedName: 'Company',
        label: 'Company',
        expectedPersistedType: 'string',
        control: 'text',
        order: 1,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'phone',
        persistedName: 'Phone',
        label: 'Phone',
        expectedPersistedType: 'string',
        control: 'text',
        order: 2,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'referentEmail',
        persistedName: "Referent's Email",
        label: "Referent's Email",
        expectedPersistedType: 'string',
        control: 'text',
        order: 3,
        visibility: 'primary',
        width: 'half',
      },
    ],
  },
  {
    key: 'courses',
    persistedType: 'courses',
    sectionCardinality: 'optional-one',
    itemCardinality: { min: 1 },
    expectedContainerType: 'collapsible',
    label: 'Courses',
    initialFocusFieldKey: 'course',
    fields: [
      {
        key: 'course',
        persistedName: 'Course',
        label: 'Course',
        expectedPersistedType: 'string',
        control: 'text',
        order: 0,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'institution',
        persistedName: 'Institution',
        label: 'Institution',
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
        dateRange: { key: 'course', role: 'start', allowPresent: false },
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
        dateRange: { key: 'course', role: 'end', allowPresent: true },
      },
    ],
  },
  {
    key: 'languages',
    persistedType: 'languages',
    sectionCardinality: 'optional-one',
    itemCardinality: { min: 1 },
    expectedContainerType: 'collapsible',
    label: 'Languages',
    initialFocusFieldKey: 'language',
    fields: [
      {
        key: 'language',
        persistedName: 'Language',
        label: 'Language',
        expectedPersistedType: 'string',
        control: 'text',
        order: 0,
        visibility: 'primary',
        width: 'half',
      },
      {
        key: 'level',
        persistedName: 'Level',
        label: 'Level',
        expectedPersistedType: 'select',
        control: 'select',
        order: 1,
        visibility: 'primary',
        width: 'half',
        options: [
          'Native Speaker',
          'Highly Proficient',
          'Very good command',
          'Good working knowledge',
          'Working knowledge',
          'C2',
          'C1',
          'B2',
          'B1',
          'A2',
          'A1',
        ],
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
  Section extends SectionKey
    ? (typeof sectionDefinitions)[Section]['fields'][keyof (typeof sectionDefinitions)[Section]['fields']]
    : never;

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

export const validateSectionMetadata = (
  definition: SectionDefinition,
  metadata: unknown
): readonly string[] => {
  if (!Array.isArray(metadata)) {
    return ['metadata must be an array'];
  }
  const contracts = 'metadata' in definition ? definition.metadata : undefined;
  if (!contracts) {
    return metadata.length === 0
      ? []
      : [`section ${definition.key} does not allow metadata`];
  }

  const problems: string[] = [];
  const seen = new Set<string>();
  for (const [index, entry] of metadata.entries()) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      problems.push(`metadata entry ${index} must be an object`);
      continue;
    }
    const record = entry as Record<string, unknown>;
    const key = record.key;
    if (typeof key !== 'string') {
      problems.push(`metadata entry ${index} must have a string key`);
      continue;
    }
    const contract = contracts.find((item) => item.key === key);
    if (!contract) {
      problems.push(
        `section ${definition.key} has unknown metadata key: ${key}`
      );
      continue;
    }
    if (seen.has(key)) {
      problems.push(
        `section ${definition.key} has duplicate metadata key: ${key}`
      );
    }
    seen.add(key);
    if (typeof record.label !== 'string' || !record.label) {
      problems.push(
        `section ${definition.key} metadata ${key} has invalid label`
      );
    }
    if (!contract.allowedValues.some((value) => value === record.value)) {
      problems.push(
        `section ${definition.key} metadata ${key} has invalid value`
      );
    }
  }
  for (const contract of contracts) {
    if (!seen.has(contract.key)) {
      problems.push(
        `section ${definition.key} is missing metadata key: ${contract.key}`
      );
    }
  }
  return problems;
};

export type DefinitionDiagnostic =
  | Readonly<{
      type: 'unknownSection';
      persistedSectionType: string;
      recordIds: readonly (string | number)[];
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
          recordIds: fields.map((field) => field.id),
        },
      ],
    });
  }

  const sectionKey = definition.key as SectionKey;
  const fieldsByPersistedName = new Map<string, PersistedFieldInput[]>();
  for (const field of fields) {
    const matchingFields = fieldsByPersistedName.get(field.name) ?? [];
    matchingFields.push(field);
    fieldsByPersistedName.set(field.name, matchingFields);
  }
  const resolved = fields.flatMap((field, inputOrder) => {
    const fieldDefinition = resolveFieldDefinition(sectionKey, field.name);
    const matches = fieldsByPersistedName.get(field.name) ?? [];
    return fieldDefinition && matches.length === 1
      ? [{ field, definition: fieldDefinition, inputOrder }]
      : [];
  });

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
        field,
        definition: fieldDefinition,
      })),
    diagnostics: [
      ...missingDiagnostics,
      ...inputDiagnostics
        .sort((left, right) => left.inputOrder - right.inputOrder)
        .map(({ diagnostic }) => diagnostic),
    ],
  });
};
