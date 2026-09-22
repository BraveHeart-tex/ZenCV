import { autorun } from 'mobx';
import { describe, expect, it } from 'vitest';
import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import {
  hydrateBuilderDocument,
  type PersistedDocumentRecords,
} from '../builderDocument';

const fixture = (): PersistedDocumentRecords => {
  const document = {
    id: 1,
    title: 'Resume',
    templateType: 'tokyo',
    templateSettings: '{}',
    createdAt: '',
    updatedAt: '',
    jobPostingId: null,
  } as DEX_Document;
  const keys = ['personalDetails', 'summary', 'workExperience'] as const;
  const sections: DEX_Section[] = [];
  const items: DEX_Item[] = [];
  const fields: DEX_Field[] = [];
  keys.forEach((key, index) => {
    const definition = sectionDefinitions[key];
    const sectionId = index + 10;
    const itemId = index + 20;
    sections.push({
      id: sectionId,
      documentId: 1,
      title: definition.label,
      defaultTitle: definition.label,
      type: definition.persistedType,
      displayOrder: index + 1,
      metadata: '',
    } as DEX_Section);
    items.push({
      id: itemId,
      sectionId,
      containerType: definition.expectedContainerType,
      displayOrder: 1,
    });
    Object.values(definition.fields).forEach((field, fieldIndex) => {
      fields.push({
        id: index * 100 + fieldIndex + 1,
        itemId,
        name: field.persistedName,
        type: field.expectedPersistedType,
        value: `value-${field.key}`,
        ...(field.control === 'select'
          ? { selectType: 'basic', options: [...field.options] }
          : {}),
      } as DEX_Field);
    });
  });
  return { document, sections, items, fields };
};

const failure = (records: PersistedDocumentRecords) => {
  const result = hydrateBuilderDocument(records);
  expect(result.success).toBe(false);
  if (result.success) {
    throw new Error('Expected hydration failure');
  }
  return result.diagnostics;
};

describe('Builder Document hydration', () => {
  it('publishes one normalized graph with typed and generic identity and definition order', () => {
    const records = fixture();
    const result = hydrateBuilderDocument({
      ...records,
      sections: [...records.sections].reverse(),
      items: [...records.items].reverse(),
      fields: [...records.fields].reverse(),
    });
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    const document = result.document;
    expect(document.title).toBe('Resume');
    expect(document.sections.map((section) => section.sectionKey)).toEqual([
      'personalDetails',
      'summary',
      'workExperience',
    ]);
    expect(document.education).toBeUndefined();
    const work = document.workExperience;
    expect(work).toBe(document.section('workExperience'));
    expect(work).toBe(document.sectionsById.get(work.id));
    const item = work.items[0];
    expect(item).toBe(document.itemsById.get(item.id));
    expect(item.editableFields.map((field) => field.fieldKey)).toEqual([
      'role',
      'employer',
      'startDate',
      'endDate',
      'city',
      'description',
    ]);
    expect(item.fields.role).toBe(item.editableFields[0]);
    expect(item.fields.description).toBe(item.field('description'));
    expect(item.fields.description).toBe(
      document.fieldsById.get(item.fields.description.id)
    );
    expect(item.fields.description.sectionKey).toBe('workExperience');
    expect(item.fields.description.definition).toMatchObject({
      key: 'description',
      control: 'richText',
      order: 5,
    });
    expect(item.fields.description.definition).not.toHaveProperty(
      'persistedName'
    );
    expect(item.fields.description.definition).not.toHaveProperty(
      'expectedPersistedType'
    );
    expect(Object.isFrozen(item.fields)).toBe(true);
    expect(Object.isFrozen(item.fields.description.definition)).toBe(true);
    const values: string[] = [];
    const stop = autorun(() => values.push(item.fields.role.value));
    item.fields.role.setDraft('Engineer');
    stop();
    expect(values).toEqual(['value-role', 'Engineer']);
    expect(item.fields.role.isDirty).toBe(true);
    expect(Object.isFrozen(records.fields[0])).toBe(false);
  });

  it('keeps Custom repeatable and generic', () => {
    const records = fixture();
    const custom = sectionDefinitions.custom;
    const sections = [30, 31].map(
      (id, index) =>
        ({
          id,
          documentId: 1,
          title: 'Other',
          defaultTitle: 'Other',
          type: custom.persistedType,
          displayOrder: index + 4,
          metadata: '',
        }) as DEX_Section
    );
    const items = sections.map((section, index) => ({
      id: 40 + index,
      sectionId: section.id,
      containerType: 'collapsible' as const,
      displayOrder: 1,
    }));
    const fields = items.flatMap((item, index) =>
      Object.values(custom.fields).map(
        (definition, fieldIndex) =>
          ({
            id: 5000 + index * 100 + fieldIndex,
            itemId: item.id,
            name: definition.persistedName,
            type: definition.expectedPersistedType,
            value: '',
          }) as DEX_Field
      )
    );
    const result = hydrateBuilderDocument({
      ...records,
      sections: [...records.sections, ...sections],
      items: [...records.items, ...items],
      fields: [...records.fields, ...fields],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.document.customSections).toHaveLength(2);
      expect(
        result.document.customSections[0]?.items[0]?.fields
      ).toBeUndefined();
      expect(result.document.customSections[0]?.items[0]?.field('city')).toBe(
        result.document.customSections[0]?.items[0]?.editableFields[1]
      );
    }
  });

  it('rejects definition drift, duplicate IDs, ownership, orphans and structural violations', () => {
    const records = fixture();
    const sections = records.sections.map((section) => ({ ...section }));
    const items = records.items.map((item) => ({ ...item }));
    const fields = records.fields.map((field) => ({ ...field }));
    sections[0].documentId = 99;
    sections[1].displayOrder = 1;
    items[2].containerType = 'static';
    fields[0].type = 'textarea';
    fields[1].name = 'Retired' as DEX_Field['name'];
    const diagnostics = failure({
      ...records,
      sections: [
        ...sections,
        {
          ...sections[2],
          id: 13,
          type: 'retired' as DEX_Section['type'],
          displayOrder: 4,
        },
      ],
      items: [
        ...items,
        { id: 99, sectionId: 999, containerType: 'static', displayOrder: 1 },
      ],
      fields: [
        ...fields,
        { ...fields[0] },
        { ...fields[0], id: 999, itemId: 999 } as DEX_Field,
      ],
    });
    expect(diagnostics.map((diagnostic) => diagnostic.type)).toEqual(
      expect.arrayContaining([
        'duplicateId',
        'brokenOwnership',
        'orphan',
        'invalidDisplayOrder',
        'invalidContainerType',
        'unknownSection',
        'missingField',
        'unknownField',
        'incompatibleFieldType',
      ])
    );
  });

  it('rejects cardinality, malformed metadata and definition-owned field structure', () => {
    const records = fixture();
    const sections = [
      ...records.sections,
      { ...records.sections[2], id: 40, displayOrder: 4 },
    ];
    const fields = records.fields.map((field) => ({ ...field }));
    const result = failure({
      ...records,
      sections,
      items: records.items.filter((item) => item.sectionId !== 12),
      fields: fields.filter((field) => field.itemId !== 22),
    });
    expect(result.map((diagnostic) => diagnostic.type)).toContain(
      'invalidSectionCardinality'
    );
    expect(result.map((diagnostic) => diagnostic.type)).toContain(
      'invalidItemCardinality'
    );

    const skills = sectionDefinitions.skills;
    const section = {
      id: 50,
      documentId: 1,
      title: 'Skills',
      defaultTitle: 'Skills',
      type: skills.persistedType,
      displayOrder: 4,
      metadata: '{bad',
    } as DEX_Section;
    const item = {
      id: 60,
      sectionId: 50,
      containerType: 'collapsible',
      displayOrder: 1,
    } as DEX_Item;
    const skillFields = Object.values(skills.fields).map(
      (definition, index) =>
        ({
          id: 500 + index,
          itemId: 60,
          name: definition.persistedName,
          type: definition.expectedPersistedType,
          value: '',
          ...(definition.control === 'select'
            ? { selectType: 'basic', options: ['wrong'] }
            : {}),
        }) as DEX_Field
    );
    const other = failure({
      ...records,
      sections: [...records.sections, section],
      items: [...records.items, item],
      fields: [...records.fields, ...skillFields],
    });
    expect(other.map((diagnostic) => diagnostic.type)).toContain(
      'invalidMetadata'
    );
    expect(other.map((diagnostic) => diagnostic.type)).toContain(
      'invalidFieldStructure'
    );
  });

  it('returns the same graph and diagnostics for input permutations', () => {
    const records = fixture();
    const left = hydrateBuilderDocument(records);
    const right = hydrateBuilderDocument({
      ...records,
      sections: [...records.sections].reverse(),
      items: [...records.items].reverse(),
      fields: [...records.fields].reverse(),
    });
    expect(left.success && right.success).toBe(true);
    if (left.success && right.success) {
      expect(
        left.document.sections.map((section) => [
          section.id,
          section.items.map((item) => [
            item.id,
            item.editableFields.map((field) => field.id),
          ]),
        ])
      ).toEqual(
        right.document.sections.map((section) => [
          section.id,
          section.items.map((item) => [
            item.id,
            item.editableFields.map((field) => field.id),
          ]),
        ])
      );
    }
    const invalid = {
      ...records,
      fields: records.fields.filter((field) => field.name !== 'Employer'),
    };
    expect(failure(invalid)).toEqual(
      failure({
        ...invalid,
        sections: [...invalid.sections].reverse(),
        items: [...invalid.items].reverse(),
        fields: [...invalid.fields].reverse(),
      })
    );
  });
});
