import { describe, expect, it } from 'vitest';
import {
  analyzeItemFields,
  createSectionDefinitionRegistry,
  getSectionDefinition,
  InvalidSectionDefinitionsError,
  resolveFieldDefinition,
  resolveSectionDefinition,
} from '../sectionDefinitions';

describe('section definitions', () => {
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
  });

  it('analyzes fields by explicit definition order instead of input position', () => {
    const result = analyzeItemFields({ type: 'work-experience' }, [
      { id: 4, name: 'Description', type: 'rich-text' },
      { id: 1, name: 'Job Title', type: 'string' },
      { id: 3, name: 'End Date', type: 'date-month' },
      { id: 2, name: 'Start Date', type: 'date-month' },
      { id: 5, name: 'Employer', type: 'string' },
      { id: 6, name: 'City', type: 'string' },
    ]);

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
    ]);
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
