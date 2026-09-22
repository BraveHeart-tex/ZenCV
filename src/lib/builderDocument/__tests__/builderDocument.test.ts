import { autorun } from 'mobx';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { updateField } from '@/lib/client-db/fieldService';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import {
  hydrateBuilderDocument,
  type PersistedDocumentRecords,
} from '../builderDocument';

vi.mock('@/lib/client-db/fieldService', () => ({ updateField: vi.fn() }));

afterEach(() => {
  vi.useRealTimers();
  vi.mocked(updateField).mockReset();
});

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

  it('validates each record when two fields share an ID', () => {
    const records = fixture();
    const role = records.fields.find((field) => field.name === 'Job Title');
    const employer = records.fields.find((field) => field.name === 'Employer');
    if (!role || !employer) {
      throw new Error('Missing Work Experience fields');
    }
    const duplicate = {
      ...employer,
      id: role.id,
      value: 42 as unknown as string,
    } as DEX_Field;
    const fields = records.fields.map((field) =>
      field === employer ? duplicate : field
    );
    const diagnostics = failure({ ...records, fields });
    expect(diagnostics).toEqual(
      failure({ ...records, fields: [...fields].reverse() })
    );
    expect(diagnostics).toEqual(
      expect.arrayContaining([
        { type: 'duplicateId', entity: 'field', id: role.id },
        {
          type: 'invalidFieldStructure',
          entity: 'field',
          id: role.id,
          detail: 'value must be a string',
        },
      ])
    );
    expect(
      diagnostics.filter(
        (diagnostic) => diagnostic.type === 'invalidFieldStructure'
      )
    ).toHaveLength(1);
  });
});

describe('Semantic Field editing', () => {
  const roleField = () => {
    const result = hydrateBuilderDocument(fixture());
    if (!result.success) {
      throw new Error('Fixture failed hydration');
    }
    const item = result.document.workExperience.items[0];
    return { field: item.fields.role, item, document: result.document };
  };

  it('keeps draft edits observable through typed and generic access without saving', async () => {
    vi.useFakeTimers();
    const { field, item, document } = roleField();
    const values: string[] = [];
    const stop = autorun(() => values.push(item.editableFields[0].value));
    field.setDraft('Draft');
    await vi.runAllTimersAsync();
    stop();
    expect(values).toEqual(['value-role', 'Draft']);
    expect(document.fieldsById.get(field.id)).toBe(field);
    expect(item.field('role')).toBe(field);
    expect(updateField).not.toHaveBeenCalled();
  });

  it('debounces edits and flushes the current value with durable success', async () => {
    vi.useFakeTimers();
    vi.mocked(updateField).mockResolvedValue(1);
    const { field } = roleField();
    field.setDebounced('First');
    await vi.advanceTimersByTimeAsync(200);
    field.setDebounced('Second');
    await vi.advanceTimersByTimeAsync(399);
    expect(updateField).not.toHaveBeenCalled();
    expect(field.value).toBe('Second');
    expect(await field.flush()).toBe(true);
    expect(updateField).toHaveBeenCalledTimes(1);
    expect(updateField).toHaveBeenCalledWith(field.id, 'Second');
    expect(field.isDirty).toBe(false);
    await vi.runAllTimersAsync();
    expect(updateField).toHaveBeenCalledTimes(1);
  });

  it('commits immediately and rolls back to the latest durable value on failure', async () => {
    vi.mocked(updateField)
      .mockResolvedValueOnce(1)
      .mockRejectedValueOnce(new Error('offline'));
    const { field } = roleField();
    field.setDraft('Saved');
    expect(await field.commit()).toBe(true);
    field.setDraft('Failed');
    expect(await field.commit()).toBe(false);
    expect(field.value).toBe('Saved');
    expect(field.isDirty).toBe(false);
  });

  it('notifies MobX reactions when a debounced save fails and rolls back', async () => {
    vi.useFakeTimers();
    vi.mocked(updateField).mockRejectedValue(new Error('offline'));
    const { field, item } = roleField();
    const values: string[] = [];
    const stop = autorun(() => values.push(item.editableFields[0].value));

    field.setDebounced('Unsaved');
    await vi.advanceTimersByTimeAsync(400);

    expect(values).toEqual(['value-role', 'Unsaved', 'value-role']);
    expect(field.isDirty).toBe(false);
    expect(updateField).toHaveBeenCalledWith(field.id, 'Unsaved');
    stop();
  });

  it('treats a missing persistence record as a failed commit', async () => {
    vi.mocked(updateField).mockResolvedValue(0);
    const { field } = roleField();
    field.setDraft('Lost');
    expect(await field.commit()).toBe(false);
    expect(field.value).toBe('value-role');
  });

  it('preserves newer edits when an older save fails and reports flush failure', async () => {
    let rejectSave: (error: Error) => void = () => {};
    vi.mocked(updateField)
      .mockImplementationOnce(
        () =>
          new Promise<number>((_resolve, reject) => {
            rejectSave = reject;
          })
      )
      .mockRejectedValueOnce(new Error('offline'));
    const { field } = roleField();
    field.setDraft('Older');
    const older = field.commit();
    field.setDraft('Newer');
    await Promise.resolve();
    rejectSave(new Error('offline'));
    expect(await older).toBe(false);
    expect(field.value).toBe('Newer');
    expect(await field.flush()).toBe(false);
    expect(field.value).toBe('value-role');
  });

  it('rolls a failed newer edit back to an older save that completed meanwhile', async () => {
    let resolveSave: (value: number) => void = () => {};
    vi.mocked(updateField)
      .mockImplementationOnce(
        () =>
          new Promise<number>((resolve) => {
            resolveSave = resolve;
          })
      )
      .mockRejectedValueOnce(new Error('offline'));
    const { field } = roleField();
    field.setDraft('Durable');
    const older = field.commit();
    await Promise.resolve();
    field.setDraft('Failed');
    const newer = field.commit();
    resolveSave(1);
    expect(await older).toBe(true);
    expect(await newer).toBe(false);
    expect(field.value).toBe('Durable');
    expect(field.isDirty).toBe(false);
  });

  it('cancels queued writes on disposal while allowing an active write to settle', async () => {
    let resolveSave: (value: number) => void = () => {};
    vi.mocked(updateField).mockImplementationOnce(
      () =>
        new Promise<number>((resolve) => {
          resolveSave = resolve;
        })
    );
    const { field } = roleField();
    field.setDraft('Started');
    const active = field.commit();
    await Promise.resolve();
    field.setDraft('Queued');
    const queued = field.commit();
    field.dispose();
    resolveSave(1);
    expect(await active).toBe(true);
    expect(await queued).toBe(false);
    expect(updateField).toHaveBeenCalledTimes(1);
  });

  it('rolls back an active failed write after disposal and notifies MobX reactions', async () => {
    let rejectSave: (error: Error) => void = () => {};
    vi.mocked(updateField).mockImplementationOnce(
      () =>
        new Promise<number>((_resolve, reject) => {
          rejectSave = reject;
        })
    );
    const { field, document } = roleField();
    const values: string[] = [];
    const stop = autorun(() =>
      values.push(document.fieldsById.get(field.id)?.value ?? '')
    );

    field.setDraft('Unsaved');
    const active = field.commit();
    await Promise.resolve();
    field.dispose();
    rejectSave(new Error('offline'));

    expect(await active).toBe(false);
    expect(values).toEqual(['value-role', 'Unsaved', 'value-role']);
    expect(field.isDirty).toBe(false);
    stop();
  });

  it('rolls back pending edits and disposes idempotently without sending them', async () => {
    vi.useFakeTimers();
    const { field } = roleField();
    field.setDebounced('Pending');
    expect(await field.rollback()).toBe(true);
    expect(field.value).toBe('value-role');
    field.setDebounced('Discarded');
    field.dispose();
    field.dispose();
    await vi.runAllTimersAsync();
    expect(updateField).not.toHaveBeenCalled();
    expect(() => field.setDraft('Too late')).toThrow('disposed');
    expect(() => field.setDebounced('Too late')).toThrow('disposed');
    expect(await field.commit()).toBe(false);
  });
});
