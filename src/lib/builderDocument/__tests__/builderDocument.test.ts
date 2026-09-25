import { autorun } from 'mobx';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type {
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
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import {
  hydrateBuilderDocument,
  type ItemId,
  type PersistedDocumentRecords,
} from '../builderDocument';
import { builderDocumentFixture as fixture } from './builderDocumentFixture';

vi.mock('@/lib/client-db/fieldService', () => ({ updateField: vi.fn() }));
vi.mock('@/lib/client-db/itemService', () => ({
  addItemFromTemplate: vi.fn(),
  addItemFromTemplateWithSectionTypeLimit: vi.fn(),
  bulkUpdateItems: vi.fn(),
  deleteItem: vi.fn(),
}));

afterEach(() => {
  vi.useRealTimers();
  vi.mocked(updateField).mockReset();
  vi.mocked(addItemFromTemplate).mockReset();
  vi.mocked(addItemFromTemplateWithSectionTypeLimit).mockReset();
  vi.mocked(bulkUpdateItems).mockReset();
  vi.mocked(deleteItem).mockReset();
});

const commandDocument = (workItems = 1) => {
  const records = fixture();
  const work = records.items.find((item) => item.sectionId === 12) as DEX_Item;
  const workFields = records.fields.filter((field) => field.itemId === work.id);
  const extraItems = Array.from({ length: workItems - 1 }, (_, index) => ({
    ...work,
    id: 30 + index,
    displayOrder: index + 2,
  }));
  const extraFields = extraItems.flatMap((item, index) =>
    workFields.map((field) => ({
      ...field,
      id: 1000 + index * 100 + field.id,
      itemId: item.id,
    }))
  );
  const result = hydrateBuilderDocument({
    ...records,
    items: [...records.items, ...extraItems],
    fields: [...records.fields, ...extraFields],
  });
  if (!result.success) {
    throw new Error('Invalid command fixture');
  }
  return result.document;
};

describe('Builder Document item commands', () => {
  it('leaves the graph untouched when insertion fails', async () => {
    const document = commandDocument();
    const original = document.workExperience.items[0];
    vi.mocked(addItemFromTemplate).mockRejectedValueOnce(new Error('offline'));
    await expect(document.addItem(document.workExperience.id)).rejects.toThrow(
      'offline'
    );
    expect(document.workExperience.items).toEqual([original]);
    expect(document.itemsById.size).toBe(3);
  });

  it('creates a complete graph only after durable insertion', async () => {
    const document = commandDocument();
    const section = document.workExperience;
    const oldItem = section.items[0];
    let finish: (value: { item: DEX_Item; fields: DEX_Field[] }) => void =
      () => {};
    vi.mocked(addItemFromTemplate).mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    const pending = document.addItem(section.id);
    await Promise.resolve();
    expect(section.items).toEqual([oldItem]);
    const definitions = Object.values(section.definition.fields);
    finish({
      item: {
        id: 99,
        sectionId: section.id,
        containerType: 'collapsible',
        displayOrder: 2,
      },
      fields: definitions.map((definition, index) => ({
        id: 2000 + index,
        itemId: 99,
        name: definition.persistedName,
        type: definition.expectedPersistedType,
        value: '',
      })) as DEX_Field[],
    });
    expect(await pending).toBe(99);
    const item = section.items[1];
    expect(item).toBe(document.itemsById.get(99 as ItemId));
    expect(item.editableFields).toHaveLength(definitions.length);
    expect(item.fields.role).toBe(document.fieldsById.get(item.fieldIds[0]));
    expect(section.items[0]).toBe(oldItem);
  });

  it('rejects minimum and maximum Item Cardinality before persistence', async () => {
    const document = commandDocument();
    expect(await document.removeItem(document.workExperience.items[0].id)).toBe(
      false
    );
    expect(await document.addItem(document.personalDetails.id)).toBeUndefined();
    expect(deleteItem).not.toHaveBeenCalled();
    expect(addItemFromTemplate).not.toHaveBeenCalled();

    const records = fixture();
    const definition = sectionDefinitions.websitesSocialLinks;
    const section: DEX_Section = {
      id: 50,
      documentId: 1,
      title: 'Links',
      defaultTitle: 'Links',
      type: definition.persistedType,
      displayOrder: 4,
      metadata: '',
    };
    const items = Array.from({ length: 4 }, (_, index) => ({
      id: 60 + index,
      sectionId: 50,
      containerType: definition.expectedContainerType,
      displayOrder: index + 1,
    }));
    const fields = items.flatMap((item, index) =>
      Object.values(definition.fields).map((field, fieldIndex) => ({
        id: 3000 + index * 10 + fieldIndex,
        itemId: item.id,
        name: field.persistedName,
        type: field.expectedPersistedType,
        value: '',
      }))
    ) as DEX_Field[];
    const hydrated = hydrateBuilderDocument({
      ...records,
      sections: [...records.sections, section],
      items: [...records.items, ...items],
      fields: [...records.fields, ...fields],
    });
    expect(hydrated.success).toBe(true);
    if (hydrated.success) {
      expect(
        await hydrated.document.addItem(
          50 as typeof hydrated.document.workExperience.id
        )
      ).toBeUndefined();
      expect(addItemFromTemplateWithSectionTypeLimit).not.toHaveBeenCalled();
    }
  });

  it('detaches optimistically, restores exact identity and order on failure, then disposes after success', async () => {
    const document = commandDocument(3);
    const section = document.workExperience;
    const [first, middle, last] = section.items;
    const fields = middle.editableFields;
    let rejectDelete: (error: Error) => void = () => {};
    vi.mocked(deleteItem).mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          rejectDelete = reject;
        })
    );
    const pending = document.removeItem(middle.id);
    await Promise.resolve();
    expect(section.items).toEqual([first, last]);
    expect(document.itemsById.has(middle.id)).toBe(false);
    rejectDelete(new Error('offline'));
    expect(await pending).toBe(false);
    expect(section.items).toEqual([first, middle, last]);
    expect(document.itemsById.get(middle.id)).toBe(middle);
    expect(document.fieldsById.get(fields[0].id)).toBe(fields[0]);
    fields[0].setDraft('still active');

    vi.mocked(deleteItem).mockResolvedValueOnce(undefined);
    expect(await document.removeItem(middle.id)).toBe(true);
    expect(section.items).toEqual([first, last]);
    expect(() => fields[0].setDraft('disposed')).toThrow('disposed');
  });

  it('reorders by identity, persists contiguous orders, rolls back, and serializes commands', async () => {
    const document = commandDocument(3);
    const section = document.workExperience;
    const [first, middle, last] = section.items;
    const field = last.editableFields[0];
    let finish: () => void = () => {};
    vi.mocked(bulkUpdateItems).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = () => resolve(3);
        })
    );
    const reorder = document.reorderItems(section.id, [
      last.id,
      first.id,
      middle.id,
    ]);
    const remove = document.removeItem(middle.id);
    await Promise.resolve();
    expect(section.items).toEqual([last, first, middle]);
    expect(deleteItem).not.toHaveBeenCalled();
    expect(bulkUpdateItems).toHaveBeenCalledWith([
      { key: last.id, changes: { displayOrder: 1 } },
      { key: first.id, changes: { displayOrder: 2 } },
      { key: middle.id, changes: { displayOrder: 3 } },
    ]);
    finish();
    expect(await reorder).toBe(true);
    vi.mocked(deleteItem).mockResolvedValueOnce(undefined);
    expect(await remove).toBe(true);
    expect(section.items).toEqual([last, first]);
    expect(section.items[0].editableFields[0]).toBe(field);

    vi.mocked(bulkUpdateItems).mockRejectedValueOnce(new Error('offline'));
    expect(await document.reorderItems(section.id, [first.id, last.id])).toBe(
      false
    );
    expect(section.items).toEqual([last, first]);
    expect(last.displayOrder).toBe(1);
    expect(first.displayOrder).toBe(2);
    expect(await document.reorderItems(section.id, [first.id, first.id])).toBe(
      false
    );
  });

  it('keeps ordered item IDs controlled by document commands', () => {
    const document = commandDocument(2);
    const section = document.workExperience;
    const original = section.itemIds;

    expect(Object.isFrozen(original)).toBe(true);
    expect(() => (original as ItemId[]).reverse()).toThrow();
    expect(section.itemIds).toEqual(original);
    expect(section.items.map((item) => item.id)).toEqual(original);
  });

  it('rolls back when a reorder updates fewer persisted rows than requested', async () => {
    const document = commandDocument(2);
    const section = document.workExperience;
    const [first, second] = section.items;
    vi.mocked(bulkUpdateItems).mockResolvedValueOnce(1);

    expect(await document.reorderItems(section.id, [second.id, first.id])).toBe(
      false
    );
    expect(section.items).toEqual([first, second]);
    expect(section.itemIds).toEqual([first.id, second.id]);
    expect(first.displayOrder).toBe(1);
    expect(second.displayOrder).toBe(2);
  });

  it('normalizes gapped sibling orders even when the requested order is unchanged', async () => {
    const records = fixture();
    const items = records.items.map((item) =>
      item.sectionId === 12 ? { ...item, displayOrder: 9 } : item
    );
    const hydrated = hydrateBuilderDocument({ ...records, items });
    expect(hydrated.success).toBe(true);
    if (!hydrated.success) {
      return;
    }
    vi.mocked(bulkUpdateItems).mockResolvedValueOnce(1);
    const section = hydrated.document.workExperience;
    const item = section.items[0];
    expect(await hydrated.document.reorderItems(section.id, [item.id])).toBe(
      true
    );
    expect(item.displayOrder).toBe(1);
    expect(bulkUpdateItems).toHaveBeenCalledWith([
      { key: item.id, changes: { displayOrder: 1 } },
    ]);
  });
});

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
