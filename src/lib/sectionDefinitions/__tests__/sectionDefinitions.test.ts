import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  coursesSectionFields,
  customSectionFields,
  educationFields,
  employmentHistoryFields,
  hobbiesSectionFields,
  languagesSectionFields,
  personalDetailsSectionFields,
  referencesSectionFields,
  skillsSectionFields,
  summarySectionFields,
  websitesAndLinkFields,
} from '@/lib/misc/fieldTemplates';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  analyzeItemFields,
  createSectionDefinitionRegistry,
  getSectionDefinition,
  InvalidSectionDefinitionsError,
  resolveFieldDefinition,
  resolveSectionDefinition,
  type SectionDefinitionInput,
  sectionDefinitions,
  validateSectionMetadata,
} from '../sectionDefinitions';

const sourceDirectory = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../..'
);

const getProductionSourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : getProductionSourceFiles(path);
    }

    return /\.(?:ts|tsx)$/.test(entry.name) &&
      entry.name !== 'sectionDefinitions.ts'
      ? [path]
      : [];
  });

describe('section definitions', () => {
  it('declares the Section and Item Cardinality and persisted container type', () => {
    const expected = {
      personalDetails: ['required-one', 1, 1, 'static'],
      summary: ['required-one', 1, 1, 'static'],
      workExperience: ['required-one', 1, undefined, 'collapsible'],
      education: ['optional-one', 1, undefined, 'collapsible'],
      websitesSocialLinks: ['optional-one', 0, 4, 'collapsible'],
      skills: ['optional-one', 1, undefined, 'collapsible'],
      custom: ['many', 1, undefined, 'collapsible'],
      internships: ['optional-one', 1, undefined, 'collapsible'],
      hobbies: ['optional-one', 1, 1, 'static'],
      references: ['optional-one', 1, undefined, 'collapsible'],
      courses: ['optional-one', 1, undefined, 'collapsible'],
      languages: ['optional-one', 1, undefined, 'collapsible'],
    } as const;

    for (const [
      key,
      [sectionCardinality, min, max, containerType],
    ] of Object.entries(expected)) {
      const definition = sectionDefinitions[key as keyof typeof expected];
      expect(definition.sectionCardinality).toBe(sectionCardinality);
      expect(definition.itemCardinality).toEqual({ min, ...(max && { max }) });
      expect(definition.expectedContainerType).toBe(containerType);
    }
  });

  it('validates declared metadata and rejects metadata elsewhere', () => {
    expect(sectionDefinitions.skills.metadata).toEqual([
      { key: 'showExperienceLevel', allowedValues: ['0', '1'] },
      { key: 'isCommaSeparated', allowedValues: ['0', '1'] },
    ]);
    expect(sectionDefinitions.references.metadata).toEqual([
      { key: 'hideReferences', allowedValues: ['0', '1'] },
    ]);
    expect(
      validateSectionMetadata(sectionDefinitions.skills, [
        { key: 'showExperienceLevel', label: 'Show level', value: '1' },
      ])
    ).toEqual([]);
    expect(validateSectionMetadata(sectionDefinitions.summary, [])).toEqual([]);
    expect(
      validateSectionMetadata(sectionDefinitions.summary, [
        { key: 'unexpected', label: 'Unexpected', value: '1' },
      ])
    ).toEqual(['section summary does not allow metadata']);
    expect(
      validateSectionMetadata(sectionDefinitions.references, [
        { key: 'hideReferences', label: 'Hide', value: 'bad' },
        { key: 'hideReferences', label: '', value: '1' },
        { key: 'unknown', label: 'Unknown', value: '1' },
      ])
    ).toEqual([
      'section references metadata hideReferences has invalid value',
      'section references has duplicate metadata key: hideReferences',
      'section references metadata hideReferences has invalid label',
      'section references has unknown metadata key: unknown',
    ]);
  });

  it('reports every invalid runtime declaration in stable order', () => {
    const bad = {
      key: 'broken',
      persistedType: 'broken',
      label: 'Broken',
      sectionCardinality: 'invalid',
      itemCardinality: { min: 2, max: 1 },
      expectedContainerType: 'invalid',
      metadata: [
        { key: '', allowedValues: [] },
        { key: 'repeated', allowedValues: ['0', '0'] },
        { key: 'repeated', allowedValues: ['0', '1'] },
      ],
      initialFocusFieldKey: 'name',
      fields: [
        {
          key: 'name',
          persistedName: 'Name',
          label: 'Name',
          expectedPersistedType: 'string',
          control: 'text',
          order: 0,
          visibility: 'primary',
          width: 'full',
        },
      ],
    } as unknown as SectionDefinitionInput;

    try {
      createSectionDefinitionRegistry([bad]);
      throw new Error('expected invalid definitions');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidSectionDefinitionsError);
      expect((error as InvalidSectionDefinitionsError).problems).toEqual([
        'section broken has invalid section cardinality',
        'section broken has invalid item cardinality',
        'section broken has invalid container type',
        'section broken has an empty metadata key',
        'section broken metadata <empty metadata key> has invalid allowed values',
        'section broken metadata repeated has invalid allowed values',
        'section broken has duplicate metadata key: repeated',
      ]);
    }
  });

  it('characterizes every current section and field template exactly', () => {
    const expectedTemplates = [
      [
        'personalDetails',
        INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
        personalDetailsSectionFields,
      ],
      ['summary', INTERNAL_SECTION_TYPES.SUMMARY, summarySectionFields],
      [
        'workExperience',
        INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
        employmentHistoryFields,
      ],
      ['education', INTERNAL_SECTION_TYPES.EDUCATION, educationFields],
      [
        'websitesSocialLinks',
        INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
        websitesAndLinkFields,
      ],
      ['skills', INTERNAL_SECTION_TYPES.SKILLS, skillsSectionFields],
      ['custom', INTERNAL_SECTION_TYPES.CUSTOM, customSectionFields],
      [
        'internships',
        INTERNAL_SECTION_TYPES.INTERNSHIPS,
        employmentHistoryFields,
      ],
      ['hobbies', INTERNAL_SECTION_TYPES.HOBBIES, hobbiesSectionFields],
      [
        'references',
        INTERNAL_SECTION_TYPES.REFERENCES,
        referencesSectionFields,
      ],
      ['courses', INTERNAL_SECTION_TYPES.COURSES, coursesSectionFields],
      ['languages', INTERNAL_SECTION_TYPES.LANGUAGES, languagesSectionFields],
    ] as const;

    expect(Object.keys(sectionDefinitions)).toEqual(
      expectedTemplates.map(([key]) => key)
    );

    for (const [key, persistedType, template] of expectedTemplates) {
      const definition = sectionDefinitions[key];

      expect(definition.persistedType).toBe(persistedType);
      expect(Object.values(definition.fields)).toHaveLength(template.length);
      expect(Object.values(definition.fields)).toEqual(
        expect.arrayContaining(
          template.map((field, order) =>
            expect.objectContaining({
              persistedName: field.name,
              expectedPersistedType: field.type,
              order,
              options:
                field.type === 'select' && 'options' in field
                  ? field.options
                  : undefined,
              placeholder:
                field.type === 'textarea' ? field.placeholder : undefined,
              richText:
                field.type === 'rich-text'
                  ? field.placeholder
                    ? expect.objectContaining({ guidance: field.placeholder })
                    : expect.objectContaining({
                        characterCounter: expect.any(Boolean),
                      })
                  : undefined,
            })
          )
        )
      );
    }

    expect(sectionDefinitions.custom.fields.description.richText).toEqual({
      characterCounter: false,
    });
  });

  it('keeps shared persisted field names distinct within their sections', () => {
    expect(resolveFieldDefinition('workExperience', 'Job Title')?.key).toBe(
      'role'
    );
    expect(resolveFieldDefinition('internships', 'Job Title')?.key).toBe(
      'role'
    );
    expect(resolveFieldDefinition('education', 'City')?.key).toBe('city');
    expect(resolveFieldDefinition('custom', 'City')?.key).toBe('city');
  });

  it('resolves the Work Experience definition and its current persisted tokens', () => {
    const definition = getSectionDefinition('workExperience');

    expect(definition.label).toBe('Work Experience');
    expect(resolveSectionDefinition('work-experience')).toBe(definition);
    expect(resolveFieldDefinition('workExperience', 'Job Title')?.key).toBe(
      'role'
    );
    expect(definition.initialFocusFieldKey).toBe('role');
    expect(definition.fields.startDate.dateRange).toEqual({
      key: 'employment',
      role: 'start',
      allowPresent: false,
    });
    expect(definition.fields.endDate.dateRange).toEqual({
      key: 'employment',
      role: 'end',
      allowPresent: true,
    });
    expect(
      resolveFieldDefinition('workExperience', 'Description')
    ).toMatchObject({
      key: 'description',
      control: 'richText',
      order: 5,
      visibility: 'primary',
      width: 'full',
      richText: {
        characterCounter: true,
        guidance:
          'E.g., "Led a team of 5 to deliver a new feature that increased user engagement by 40%"',
      },
    });
  });

  it('returns deeply immutable definition metadata', () => {
    const definition = getSectionDefinition('workExperience');

    expect(Object.isFrozen(definition)).toBe(true);
    expect(Object.isFrozen(definition.fields)).toBe(true);
    expect(Object.isFrozen(definition.fields.description.richText)).toBe(true);
    expect(Object.isFrozen(definition.itemCardinality)).toBe(true);
    expect(Object.isFrozen(sectionDefinitions.skills.metadata)).toBe(true);
    expect(
      Object.isFrozen(sectionDefinitions.skills.metadata[0].allowedValues)
    ).toBe(true);
  });

  it('analyzes fields by explicit definition order instead of input position', () => {
    const fields = [
      { id: 4, name: 'Description', type: 'rich-text' },
      { id: 1, name: 'Job Title', type: 'string' },
      { id: 3, name: 'End Date', type: 'date-month' },
      { id: 2, name: 'Start Date', type: 'date-month' },
      { id: 5, name: 'Employer', type: 'string' },
      { id: 6, name: 'City', type: 'string' },
    ] as const;
    const result = analyzeItemFields({ type: 'work-experience' }, fields);

    expect(result.entries.map((entry) => entry.definition.key)).toEqual([
      'role',
      'employer',
      'startDate',
      'endDate',
      'city',
      'description',
    ]);
    expect(result.entries.map((entry) => entry.field.id)).toEqual([
      1, 5, 2, 3, 6, 4,
    ]);
    expect(result.entries.map((entry) => entry.field)).toEqual([
      fields[1],
      fields[4],
      fields[3],
      fields[2],
      fields[5],
      fields[0],
    ]);
    expect(result.entries[0]?.field).toBe(fields[1]);
    expect(result.diagnostics).toEqual([]);
  });

  it('reports unknown, duplicate, incompatible, and missing fields deterministically', () => {
    const result = analyzeItemFields({ type: 'work-experience' }, [
      { id: 1, name: 'Job Title', type: 'textarea' },
      { id: 2, name: 'Employer', type: 'string' },
      { id: 3, name: 'Employer', type: 'string' },
      { id: 4, name: 'Retired field', type: 'string' },
    ]);

    expect(result.diagnostics).toEqual([
      {
        type: 'missingField',
        sectionKey: 'workExperience',
        fieldKey: 'startDate',
        persistedFieldName: 'Start Date',
      },
      {
        type: 'missingField',
        sectionKey: 'workExperience',
        fieldKey: 'endDate',
        persistedFieldName: 'End Date',
      },
      {
        type: 'missingField',
        sectionKey: 'workExperience',
        fieldKey: 'city',
        persistedFieldName: 'City',
      },
      {
        type: 'missingField',
        sectionKey: 'workExperience',
        fieldKey: 'description',
        persistedFieldName: 'Description',
      },
      {
        type: 'incompatibleFieldType',
        sectionKey: 'workExperience',
        fieldKey: 'role',
        persistedFieldName: 'Job Title',
        recordIds: [1],
        expectedPersistedType: 'string',
        actualPersistedType: 'textarea',
      },
      {
        type: 'duplicateField',
        sectionKey: 'workExperience',
        fieldKey: 'employer',
        persistedFieldName: 'Employer',
        recordIds: [2, 3],
      },
      {
        type: 'unknownField',
        sectionKey: 'workExperience',
        persistedFieldName: 'Retired field',
        recordIds: [4],
      },
    ]);
    expect(result.entries).toEqual([
      {
        field: { id: 1, name: 'Job Title', type: 'textarea' },
        definition: getSectionDefinition('workExperience').fields.role,
      },
    ]);
  });

  it('does not resolve duplicate records', () => {
    const result = analyzeItemFields({ type: 'work-experience' }, [
      { id: 1, name: 'Job Title', type: 'string' },
      { id: 2, name: 'Job Title', type: 'string' },
    ]);

    expect(result.entries).toEqual([]);
    expect(result.diagnostics).toContainEqual({
      type: 'duplicateField',
      sectionKey: 'workExperience',
      fieldKey: 'role',
      persistedFieldName: 'Job Title',
      recordIds: [1, 2],
    });
  });

  it('keeps the registry out of production module imports', () => {
    const registryImport =
      /from\s+['"][^'"]*sectionDefinitions(?:\/sectionDefinitions)?['"]/;

    for (const sourceFile of getProductionSourceFiles(sourceDirectory)) {
      expect(readFileSync(sourceFile, 'utf8')).not.toMatch(registryImport);
    }
  });

  it('reports an unknown section once without inventing field identities', () => {
    const result = analyzeItemFields({ type: 'retired-section' }, [
      { id: 1, name: 'Job Title', type: 'string' },
    ]);

    expect(result).toEqual({
      entries: [],
      diagnostics: [
        {
          type: 'unknownSection',
          persistedSectionType: 'retired-section',
          recordIds: [1],
        },
      ],
    });
  });

  it('rejects every invalid registry construction invariant together', () => {
    expect(() =>
      createSectionDefinitionRegistry([
        {
          key: '',
          persistedType: '',
          label: 'Broken',
          sectionCardinality: 'required-one',
          itemCardinality: { min: 1, max: 1 },
          expectedContainerType: 'static',
          initialFocusFieldKey: 'missing',
          fields: [
            {
              key: '',
              persistedName: '',
              label: '',
              expectedPersistedType: 'string',
              control: 'month',
              order: -1,
              visibility: 'primary',
              width: 'half',
            },
            {
              key: '',
              persistedName: '',
              label: 'Duplicate',
              expectedPersistedType: 'string',
              control: 'text',
              order: -1,
              visibility: 'primary',
              width: 'half',
            },
          ],
        },
        {
          key: '',
          persistedType: '',
          label: 'Also broken',
          sectionCardinality: 'required-one',
          itemCardinality: { min: 1, max: 1 },
          expectedContainerType: 'static',
          initialFocusFieldKey: 'missing',
          fields: [],
        },
      ])
    ).toThrow(InvalidSectionDefinitionsError);

    try {
      createSectionDefinitionRegistry([
        {
          key: 'duplicate',
          persistedType: 'duplicate',
          label: 'Duplicate',
          sectionCardinality: 'required-one',
          itemCardinality: { min: 1, max: 1 },
          expectedContainerType: 'static',
          initialFocusFieldKey: 'date',
          fields: [
            {
              key: 'date',
              persistedName: 'Date',
              label: 'Date',
              expectedPersistedType: 'date-month',
              control: 'month',
              order: 0,
              visibility: 'primary',
              width: 'half',
              dateRange: {
                key: 'range',
                role: 'start',
                allowPresent: true,
              },
            },
          ],
        },
        {
          key: 'duplicate',
          persistedType: 'duplicate',
          label: 'Duplicate',
          sectionCardinality: 'required-one',
          itemCardinality: { min: 1, max: 1 },
          expectedContainerType: 'static',
          initialFocusFieldKey: 'date',
          fields: [
            {
              key: 'date',
              persistedName: 'Date',
              label: 'Date',
              expectedPersistedType: 'date-month',
              control: 'month',
              order: 0,
              visibility: 'primary',
              width: 'half',
              dateRange: {
                key: 'range',
                role: 'start',
                allowPresent: true,
              },
            },
          ],
        },
      ]);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidSectionDefinitionsError);
      expect((error as InvalidSectionDefinitionsError).problems).toEqual(
        expect.arrayContaining([
          expect.stringContaining('duplicate section key'),
          expect.stringContaining('duplicate persisted section type'),
          expect.stringContaining('allows Present but is not an end date'),
          expect.stringContaining('must contain exactly one start and one end'),
        ])
      );
    }
  });
});
