import { isObservable, runInAction } from 'mobx';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { serializeTemplateSettings } from '@/lib/constants/accentColors';
import { builderRootStore } from '../builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '../builderUIStore';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
  INTERNAL_TEMPLATE_TYPES,
  MAX_PERSONAL_DETAILS_LINKS,
  SECTION_METADATA_KEYS,
  TEMPLATE_DATA_DEBOUNCE_MS,
} from '../documentBuilder.constants';
import {
  buildDocument,
  buildField,
  buildItem,
  buildParsedSection,
  buildSection,
  createSectionOption,
  createTestRootStore,
  hydrateBasicResume,
} from './testHelpers';

const serviceMocks = vi.hoisted(() => ({
  document: {
    getFullDocumentStructure: vi.fn(),
    renameDocument: vi.fn(),
    updateDocument: vi.fn(),
  },
  section: {
    bulkUpdateSections: vi.fn(),
    deleteSection: vi.fn(),
    updateSection: vi.fn(),
  },
  item: {
    addItemFromTemplate: vi.fn(),
    addItemFromTemplateWithSectionTypeLimit: vi.fn(),
    bulkUpdateItems: vi.fn(),
    deleteItem: vi.fn(),
  },
  field: {
    updateField: vi.fn(),
  },
  toast: {
    showErrorToast: vi.fn(),
  },
}));

const clientDbMock = vi.hoisted(() => {
  let nextSectionId = 200;
  let nextItemId = 300;
  let nextFieldId = 400;
  const state: {
    sections: DEX_Section[];
    items: DEX_Item[];
    fields: DEX_Field[];
  } = {
    sections: [],
    items: [],
    fields: [],
  };

  const query = <T extends object>(
    getRows: () => T[],
    key: keyof T,
    values: unknown[]
  ) => ({
    async toArray() {
      return getRows().filter((row) => values.includes(row[key]));
    },
    filter(predicate: (row: T) => boolean) {
      return {
        async toArray() {
          return getRows()
            .filter((row) => values.includes(row[key]))
            .filter(predicate);
        },
      };
    },
    async count() {
      return getRows().filter((row) => values.includes(row[key])).length;
    },
  });

  const makeWhere =
    <T extends object>(getRows: () => T[]) =>
    (key: keyof T) => ({
      equals(value: unknown) {
        return query(getRows, key, [value]);
      },
      anyOf(values: unknown[]) {
        return query(getRows, key, values);
      },
    });

  return {
    state,
    reset() {
      state.sections = [];
      state.items = [];
      state.fields = [];
      nextSectionId = 200;
      nextItemId = 300;
      nextFieldId = 400;
    },
    clientDb: {
      transaction: vi.fn(
        async (_mode: string, _tables: unknown[], callback: () => unknown) =>
          callback()
      ),
      sections: {
        add: vi.fn(async (data: Omit<DEX_Section, 'id'>) => {
          const id = nextSectionId++;
          state.sections.push({ ...data, id });
          return id;
        }),
        delete: vi.fn(async (id: DEX_Section['id']) => {
          state.sections = state.sections.filter(
            (section) => section.id !== id
          );
        }),
        where: makeWhere(() => state.sections),
      },
      items: {
        add: vi.fn(async (data: Omit<DEX_Item, 'id'>) => {
          const id = nextItemId++;
          state.items.push({ ...data, id });
          return id;
        }),
        where: makeWhere(() => state.items),
      },
      fields: {
        bulkAdd: vi.fn(async (fields: Omit<DEX_Field, 'id'>[]) => {
          const ids = fields.map(() => nextFieldId++);
          state.fields.push(
            ...fields.map(
              (field, index) => ({ ...field, id: ids[index] }) as DEX_Field
            )
          );
          return ids;
        }),
        where: makeWhere(() => state.fields),
      },
    },
  };
});

vi.mock('@/lib/client-db/documentService', () => serviceMocks.document);
vi.mock('@/lib/client-db/sectionService', () => serviceMocks.section);
vi.mock('@/lib/client-db/itemService', () => serviceMocks.item);
vi.mock('@/lib/client-db/fieldService', () => serviceMocks.field);
vi.mock('@/components/ui/sonner', () => serviceMocks.toast);
vi.mock('@/lib/client-db/clientDb', () => ({
  clientDb: clientDbMock.clientDb,
}));

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  globalThis.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  clientDbMock.reset();
  Object.values(serviceMocks).forEach((moduleMocks) => {
    Object.values(moduleMocks).forEach((mock) => {
      mock.mockReset();
    });
  });
  serviceMocks.document.renameDocument.mockResolvedValue(1);
  serviceMocks.document.updateDocument.mockResolvedValue(1);
  serviceMocks.section.bulkUpdateSections.mockResolvedValue(1);
  serviceMocks.section.deleteSection.mockResolvedValue(undefined);
  serviceMocks.section.updateSection.mockResolvedValue(1);
  serviceMocks.item.addItemFromTemplate.mockResolvedValue({
    item: buildItem({ id: 777 }),
    fields: [buildField({ id: 778, itemId: 777 })],
  });
  serviceMocks.item.addItemFromTemplateWithSectionTypeLimit.mockResolvedValue({
    item: buildItem({ id: 779, sectionId: 5 }),
    fields: [buildField({ id: 780, itemId: 779 })],
  });
  serviceMocks.item.bulkUpdateItems.mockResolvedValue(1);
  serviceMocks.item.deleteItem.mockResolvedValue(undefined);
  serviceMocks.field.updateField.mockResolvedValue(1);
});

afterEach(() => {
  builderRootStore.resetState();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('BuilderRootStore', () => {
  it('constructs child stores', () => {
    const root = createTestRootStore();

    expect(root.documentStore.constructor.name).toBe('BuilderDocumentStore');
    expect(root.sectionStore.constructor.name).toBe('BuilderSectionStore');
    expect(root.itemStore.constructor.name).toBe('BuilderItemStore');
    expect(root.fieldStore.constructor.name).toBe('BuilderFieldStore');
    expect(root.UIStore.constructor.name).toBe('BuilderUIStore');
    expect(root.templateStore.constructor.name).toBe('BuilderTemplateStore');
  });

  it('hydrates backend data sorted by displayOrder and observable metadata', () => {
    const root = createTestRootStore();
    root.hydrateFromBackend({
      success: true,
      document: buildDocument(),
      sections: [
        buildSection({ id: 2, displayOrder: 2 }),
        buildSection({
          id: 1,
          type: INTERNAL_SECTION_TYPES.SKILLS,
          metadata: JSON.stringify([
            {
              key: SECTION_METADATA_KEYS.SKILLS.IS_COMMA_SEPARATED,
              label: 'Comma separated',
              value: '1',
            },
          ]),
          displayOrder: 1,
        }),
      ],
      items: [
        buildItem({ id: 2, displayOrder: 2 }),
        buildItem({ id: 1, displayOrder: 1 }),
      ],
      fields: [buildField()],
    });

    expect(root.sectionStore.orderedSectionIds).toEqual([1, 2]);
    expect(root.itemStore.items.map((item) => item.id)).toEqual([1, 2]);
    expect(isObservable(root.sectionStore.sections[0].metadata[0])).toBe(true);
  });

  it('starts and stops reaction-backed stores and resetState clears all stores', async () => {
    const { root } = hydrateBasicResume();

    root.startSession();
    vi.advanceTimersByTime(TEMPLATE_DATA_DEBOUNCE_MS);
    expect(
      root.templateStore.debouncedTemplateData?.personalDetails.firstName
    ).toBe('Ada');

    root.dispose();
    await root.fieldStore.setFieldValue(1, 'Grace', false);
    vi.advanceTimersByTime(TEMPLATE_DATA_DEBOUNCE_MS);
    expect(
      root.templateStore.debouncedTemplateData?.personalDetails.firstName
    ).toBe('Ada');

    root.resetState();
    expect(root.documentStore.document).toBeNull();
    expect(root.sectionStore.sections).toEqual([]);
    expect(root.itemStore.items).toEqual([]);
    expect(root.fieldStore.fields).toEqual([]);
    expect(root.UIStore.currentView).toBe(BUILDER_CURRENT_VIEWS.BUILDER);
    expect(root.templateStore.debouncedTemplateData).toBeNull();
  });
});

describe('BuilderDocumentStore', () => {
  it('initializes successfully and starts reactions', async () => {
    const root = createTestRootStore();
    serviceMocks.document.getFullDocumentStructure.mockResolvedValue({
      success: true,
      document: buildDocument(),
      sections: [buildSection()],
      items: [buildItem()],
      fields: [buildField()],
    });

    await expect(root.documentStore.initializeStore(1)).resolves.toEqual({
      success: true,
    });
    vi.advanceTimersByTime(TEMPLATE_DATA_DEBOUNCE_MS);
    expect(root.documentStore.document?.id).toBe(1);
    expect(root.templateStore.debouncedTemplateData).not.toBeNull();
  });

  it('returns failure when initialization service fails or throws', async () => {
    const root = createTestRootStore();
    serviceMocks.document.getFullDocumentStructure.mockResolvedValue({
      success: false,
      error: 'Document not found.',
    });

    await expect(root.documentStore.initializeStore(1)).resolves.toEqual({
      success: false,
      error: 'Document not found.',
    });

    serviceMocks.document.getFullDocumentStructure.mockRejectedValue(
      new Error('boom')
    );
    await expect(root.documentStore.initializeStore(1)).resolves.toEqual({
      success: false,
      error: 'An error occurred while initializing the document store.',
    });
  });

  it('renames optimistically and rolls back on failure', async () => {
    const { root } = hydrateBasicResume();

    await expect(
      root.documentStore.renameDocument('New title')
    ).resolves.toEqual({
      success: true,
    });
    expect(root.documentStore.document?.title).toBe('New title');

    serviceMocks.document.renameDocument.mockRejectedValue(new Error('nope'));
    await expect(root.documentStore.renameDocument('Broken')).resolves.toEqual({
      success: false,
      error: 'An error occurred while renaming the document.',
    });
    expect(root.documentStore.document?.title).toBe('New title');
  });

  it('computes accent color fallbacks and per-template settings', () => {
    const root = createTestRootStore();
    expect(root.documentStore.accentColor).toBe('#4f8ef7');

    root.documentStore.setDocument(
      buildDocument({
        templateType: INTERNAL_TEMPLATE_TYPES.SYDNEY,
        templateSettings: serializeTemplateSettings({
          [INTERNAL_TEMPLATE_TYPES.SYDNEY]: { accentColor: '#2563eb' },
        }),
      })
    );
    expect(root.documentStore.accentColor).toBe('#2563eb');

    root.documentStore.setDocument(
      buildDocument({ templateType: INTERNAL_TEMPLATE_TYPES.DUBAI })
    );
    expect(root.documentStore.accentColor).toBe('#c8a96e');
  });

  it('changes template/settings together and rolls back on failure', async () => {
    const { root } = hydrateBasicResume();

    await root.documentStore.changeDocumentTemplateType(
      INTERNAL_TEMPLATE_TYPES.SYDNEY
    );
    expect(root.documentStore.document?.templateType).toBe(
      INTERNAL_TEMPLATE_TYPES.SYDNEY
    );
    expect(root.documentStore.accentColor).toBe('#111111');
    expect(serviceMocks.document.updateDocument).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ templateType: INTERNAL_TEMPLATE_TYPES.SYDNEY })
    );

    serviceMocks.document.updateDocument.mockRejectedValue(
      new Error('persist failed')
    );
    await root.documentStore.changeDocumentTemplateType(
      INTERNAL_TEMPLATE_TYPES.DUBAI
    );
    expect(root.documentStore.document?.templateType).toBe(
      INTERNAL_TEMPLATE_TYPES.SYDNEY
    );
  });

  it('updates accent color and rolls back on failure', async () => {
    const { root } = hydrateBasicResume();

    await expect(
      root.documentStore.updateAccentColor('#111111')
    ).resolves.toEqual({
      success: true,
    });
    expect(root.documentStore.accentColor).toBe('#111111');

    serviceMocks.document.updateDocument.mockRejectedValue(new Error('no'));
    await expect(
      root.documentStore.updateAccentColor('#222222')
    ).resolves.toEqual({
      success: false,
      error: 'Failed to update accent color.',
    });
    expect(root.documentStore.accentColor).toBe('#111111');
  });
});

describe('BuilderSectionStore', () => {
  it('derives maps, order, getters, fixed sections, and observable metadata', () => {
    const root = createTestRootStore();
    root.sectionStore.setSections([
      buildParsedSection({ id: 2, displayOrder: 2 }),
      buildParsedSection({
        id: 1,
        type: INTERNAL_SECTION_TYPES.PERSONAL_DETAILS,
        displayOrder: 1,
      }),
    ]);
    root.itemStore.setItems([buildItem({ id: 1, sectionId: 2 })]);

    expect(root.sectionStore.sectionsById.get(1)?.type).toBe(
      INTERNAL_SECTION_TYPES.PERSONAL_DETAILS
    );
    expect(root.sectionStore.orderedSectionIds).toEqual([1, 2]);
    expect(root.sectionStore.sectionsWithItems[0].items).toHaveLength(1);
    expect(root.sectionStore.isSectionFixed(1)).toBe(true);
    expect(
      root.sectionStore.getSectionNameByType(
        INTERNAL_SECTION_TYPES.PERSONAL_DETAILS
      )
    ).toBe('Work Experience');
    expect(isObservable(root.sectionStore.sections[0].metadata[0])).toBe(true);
  });

  it('reorders sections: empty, no-op, success, and rollback', async () => {
    const root = createTestRootStore();
    root.sectionStore.setSections([
      buildParsedSection({ id: 1, displayOrder: 1 }),
      buildParsedSection({ id: 2, displayOrder: 2 }),
    ]);

    await expect(root.sectionStore.reOrderSections([])).resolves.toEqual({
      success: false,
      error: 'No sections to reorder',
    });
    await expect(root.sectionStore.reOrderSections([1, 2])).resolves.toEqual({
      success: true,
    });
    expect(serviceMocks.section.bulkUpdateSections).not.toHaveBeenCalled();

    await expect(root.sectionStore.reOrderSections([2, 1])).resolves.toEqual({
      success: true,
    });
    expect(root.sectionStore.orderedSectionIds).toEqual([2, 1]);

    serviceMocks.section.bulkUpdateSections.mockRejectedValue(new Error('no'));
    await expect(root.sectionStore.reOrderSections([1, 2])).resolves.toEqual({
      success: false,
      error: 'Failed to reorder sections',
    });
    expect(root.sectionStore.orderedSectionIds).toEqual([2, 1]);
  });

  it('adds sections and handles duplicate, non-template, no-document, and link-limit guards', async () => {
    const root = createTestRootStore();
    root.documentStore.setDocument(buildDocument());
    clientDbMock.state.sections = [
      buildSection({ id: 3, type: INTERNAL_SECTION_TYPES.COURSES }),
    ];

    await expect(
      root.sectionStore.addNewSection(
        createSectionOption(INTERNAL_SECTION_TYPES.COURSES)
      )
    ).resolves.toBeUndefined();

    await expect(
      root.sectionStore.addNewSection(
        createSectionOption(
          INTERNAL_SECTION_TYPES.PERSONAL_DETAILS as Parameters<
            typeof createSectionOption
          >[0]
        )
      )
    ).resolves.toBeUndefined();

    root.documentStore.document = null;
    await expect(
      root.sectionStore.addNewSection(createSectionOption())
    ).resolves.toBeUndefined();

    root.documentStore.setDocument(buildDocument());
    clientDbMock.state.sections = [];
    await expect(
      root.sectionStore.addNewSection(createSectionOption())
    ).resolves.toEqual({
      itemId: 300,
      sectionId: 200,
    });
    expect(root.sectionStore.sections.at(-1)?.title).toBe('Custom Section');
    expect(root.fieldStore.fields.length).toBeGreaterThan(0);

    const linksRoot = createTestRootStore();
    linksRoot.documentStore.setDocument(buildDocument());
    clientDbMock.reset();
    clientDbMock.state.sections = [
      buildSection({
        id: 5,
        type: INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS,
      }),
    ];
    clientDbMock.state.items = Array.from(
      { length: MAX_PERSONAL_DETAILS_LINKS },
      (_, index) => buildItem({ id: index + 1, sectionId: 5 })
    );
    await expect(
      linksRoot.sectionStore.addNewSection(
        createSectionOption(INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS)
      )
    ).resolves.toBeUndefined();
  });

  it('removes sections and disposes removed fields only after service success', async () => {
    const { root } = hydrateBasicResume();
    const removedField = root.fieldStore.fields.find(
      (field) => field.itemId === 3
    );
    removedField?.setValue('pending save');

    await root.sectionStore.removeSection(3);
    expect(root.sectionStore.getSectionById(3)).toBeUndefined();
    expect(root.itemStore.getItemById(3)).toBeUndefined();
    vi.advanceTimersByTime(400);
    expect(serviceMocks.field.updateField).not.toHaveBeenCalled();

    const failed = hydrateBasicResume().root;
    serviceMocks.section.deleteSection.mockRejectedValue(
      new Error('delete failed')
    );
    await failed.sectionStore.removeSection(3);
    expect(failed.sectionStore.getSectionById(3)).toBeDefined();
    expect(failed.itemStore.getItemById(3)).toBeDefined();
  });

  it('renames sections and updates metadata with rollback', async () => {
    const root = createTestRootStore();
    root.sectionStore.setSections([
      buildParsedSection({
        id: 4,
        type: INTERNAL_SECTION_TYPES.SKILLS,
      }),
    ]);

    await root.sectionStore.renameSection(4, 'Core Skills');
    expect(root.sectionStore.getSectionById(4)?.title).toBe('Core Skills');

    serviceMocks.section.updateSection.mockRejectedValueOnce(
      new Error('rename failed')
    );
    await root.sectionStore.renameSection(4, 'Broken');
    expect(root.sectionStore.getSectionById(4)?.title).toBe('Core Skills');

    await root.sectionStore.updateSectionMetadata(4, {
      key: SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL,
      value: '0',
    });
    expect(root.sectionStore.getSectionMetadataOptions(4)[0].value).toBe('0');

    serviceMocks.section.updateSection.mockRejectedValueOnce(
      new Error('metadata failed')
    );
    await root.sectionStore.updateSectionMetadata(4, {
      key: SECTION_METADATA_KEYS.SKILLS.SHOW_EXPERIENCE_LEVEL,
      value: '1',
    });
    expect(root.sectionStore.getSectionMetadataOptions(4)[0].value).toBe('0');
  });
});

describe('BuilderItemStore', () => {
  it('derives item maps, order, and collapsible state', () => {
    const root = createTestRootStore();
    root.itemStore.setItems([
      buildItem({ id: 2, displayOrder: 2 }),
      buildItem({ id: 1, displayOrder: 1 }),
    ]);

    expect(root.itemStore.itemsById.get(1)?.displayOrder).toBe(1);
    expect(root.itemStore.getOrderedItemIdsBySectionId(10)).toEqual([1, 2]);
    expect(root.itemStore.areAllItemsCollapsible(10)).toBe(true);
  });

  it('adds items and honors the link limit guard', async () => {
    const { root } = hydrateBasicResume();

    await expect(root.itemStore.addNewItemEntry(3)).resolves.toBe(777);
    expect(root.itemStore.getItemById(777)).toBeDefined();
    expect(root.fieldStore.getFieldsByItemId(777)).toHaveLength(1);
    expect(root.UIStore.isItemOpen(777)).toBe(true);

    const linksRoot = hydrateBasicResume().root;
    runInAction(() => {
      linksRoot.itemStore.items = Array.from(
        { length: MAX_PERSONAL_DETAILS_LINKS },
        (_, index) => buildItem({ id: index + 1, sectionId: 5 })
      );
    });
    await expect(
      linksRoot.itemStore.addNewItemEntry(5)
    ).resolves.toBeUndefined();
    expect(
      serviceMocks.item.addItemFromTemplateWithSectionTypeLimit
    ).not.toHaveBeenCalled();
  });

  it('removes items and rolls back on failure', async () => {
    const { root } = hydrateBasicResume();
    const removedField = root.fieldStore.fields.find(
      (field) => field.itemId === 3
    );
    removedField?.setValue('pending save');

    await root.itemStore.removeItem(3);
    expect(root.itemStore.getItemById(3)).toBeUndefined();
    expect(root.fieldStore.getFieldsByItemId(3)).toEqual([]);
    vi.advanceTimersByTime(400);
    expect(serviceMocks.field.updateField).not.toHaveBeenCalled();

    const failed = hydrateBasicResume().root;
    serviceMocks.item.deleteItem.mockRejectedValue(new Error('delete failed'));
    await failed.itemStore.removeItem(3);
    expect(failed.itemStore.getItemById(3)).toBeDefined();
    expect(failed.fieldStore.getFieldsByItemId(3)).toHaveLength(1);
  });

  it('reorders items: empty, no-op, success, and rollback', async () => {
    const root = createTestRootStore();
    root.itemStore.setItems([
      buildItem({ id: 1, displayOrder: 1 }),
      buildItem({ id: 2, displayOrder: 2 }),
    ]);

    await root.itemStore.reOrderSectionItems([]);
    await root.itemStore.reOrderSectionItems([1, 2]);
    expect(serviceMocks.item.bulkUpdateItems).not.toHaveBeenCalled();

    await root.itemStore.reOrderSectionItems([2, 1]);
    expect(root.itemStore.getOrderedItemIdsBySectionId(10)).toEqual([2, 1]);

    serviceMocks.item.bulkUpdateItems.mockRejectedValue(new Error('no'));
    await root.itemStore.reOrderSectionItems([1, 2]);
    expect(root.itemStore.getOrderedItemIdsBySectionId(10)).toEqual([2, 1]);
  });
});

describe('BuilderFieldStore and FieldModel', () => {
  it('sets, adds, snapshots, looks up, and clears fields while disposing timers', async () => {
    const root = createTestRootStore();
    root.fieldStore.setFields([buildField({ id: 1, value: 'first' })]);
    root.fieldStore.addFields([
      buildField({ id: 2, itemId: 101, value: 'second' }),
    ]);

    expect(root.fieldStore.getFieldById(1)).toEqual(
      expect.objectContaining({ id: 1, value: 'first' })
    );
    expect(root.fieldStore.getFieldsByItemId(101)).toHaveLength(1);
    expect(
      root.fieldStore.getFieldValueByName(
        FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION
      )
    ).toBe('first');

    await root.fieldStore.setFieldValue(1, 'pending');
    const firstModel = root.fieldStore.fields[0];
    expect(firstModel.constructor.name).toBe('FieldModel');
    root.fieldStore.clear();
    vi.advanceTimersByTime(400);
    expect(serviceMocks.field.updateField).not.toHaveBeenCalled();
  });

  it('updates locally immediately, persists after debounce, rolls back failures, and skips persistence', async () => {
    const root = createTestRootStore();
    root.fieldStore.setFields([buildField({ id: 1, value: 'saved' })]);

    await expect(root.fieldStore.setFieldValue(1, 'draft')).resolves.toEqual({
      success: true,
    });
    expect(root.fieldStore.getFieldById(1)?.value).toBe('draft');
    expect(serviceMocks.field.updateField).not.toHaveBeenCalled();
    vi.advanceTimersByTime(400);
    await flushPromises();
    expect(serviceMocks.field.updateField).toHaveBeenCalledWith(1, 'draft');

    serviceMocks.field.updateField.mockRejectedValue(new Error('offline'));
    await root.fieldStore.setFieldValue(1, 'lost');
    expect(root.fieldStore.getFieldById(1)?.value).toBe('lost');
    vi.advanceTimersByTime(400);
    await flushPromises();
    expect(root.fieldStore.getFieldById(1)?.value).toBe('draft');
    expect(serviceMocks.toast.showErrorToast).toHaveBeenCalledWith(
      'Could not save this edit.',
      expect.objectContaining({
        description: 'The field was restored to its last saved value.',
      })
    );

    serviceMocks.field.updateField.mockClear();
    await root.fieldStore.setFieldValue(1, 'local only', false);
    vi.advanceTimersByTime(400);
    expect(root.fieldStore.getFieldById(1)?.value).toBe('local only');
    expect(serviceMocks.field.updateField).not.toHaveBeenCalled();

    await expect(root.fieldStore.setFieldValue(999, 'x')).resolves.toEqual({
      success: false,
      error: 'Field not found',
    });
  });
});

describe('BuilderTemplateStore', () => {
  it('maps personal details, summary, sections, links, template, and accent color', () => {
    const { root } = hydrateBasicResume();

    expect(root.templateStore.personalDetails).toEqual(
      expect.objectContaining({
        firstName: 'Ada',
        lastName: 'Lovelace',
        jobTitle: 'Product Engineer',
        email: 'ada@example.com',
      })
    );
    expect(root.templateStore.summarySection.sectionName).toBe('Summary');
    expect(root.templateStore.pdfTemplateData.personalDetails.links).toEqual([
      { entryId: '5', label: 'Portfolio', link: 'https://example.com/' },
    ]);
    expect(
      root.templateStore.pdfTemplateData.sections.map((section) => section.type)
    ).not.toContain(INTERNAL_SECTION_TYPES.WEBSITES_SOCIAL_LINKS);
    expect(root.templateStore.pdfTemplateData.templateType).toBe(
      INTERNAL_TEMPLATE_TYPES.TOKYO
    );
    expect(root.templateStore.pdfTemplateData.accentColor).toBe('#10b981');
  });

  it('computes resume score, suggestions, and local resume checks', () => {
    const { root } = hydrateBasicResume();

    expect(root.templateStore.resumeStats.score).toBeGreaterThan(0);
    expect(root.templateStore.resumeStats.suggestions.length).toBeGreaterThan(
      0
    );
    expect(root.templateStore.atsCompatibility.totalCount).toBe(6);
    expect(root.templateStore.atsCompatibility.passedCount).toBeGreaterThan(0);
  });

  it('starts/stops idempotently and debounces reaction updates with fake timers', async () => {
    const { root } = hydrateBasicResume();

    root.templateStore.start();
    root.templateStore.start();
    expect(root.templateStore.debouncedTemplateData).toBeNull();
    vi.advanceTimersByTime(TEMPLATE_DATA_DEBOUNCE_MS);
    expect(
      root.templateStore.debouncedTemplateData?.personalDetails.firstName
    ).toBe('Ada');

    await root.fieldStore.setFieldValue(1, 'Grace', false);
    expect(
      root.templateStore.debouncedTemplateData?.personalDetails.firstName
    ).toBe('Ada');
    vi.advanceTimersByTime(TEMPLATE_DATA_DEBOUNCE_MS);
    expect(
      root.templateStore.debouncedTemplateData?.personalDetails.firstName
    ).toBe('Grace');

    root.templateStore.stop();
    root.templateStore.stop();
    await root.fieldStore.setFieldValue(1, 'Katherine', false);
    vi.advanceTimersByTime(TEMPLATE_DATA_DEBOUNCE_MS);
    expect(
      root.templateStore.debouncedTemplateData?.personalDetails.firstName
    ).toBe('Grace');
  });
});

describe('BuilderUIStore', () => {
  it('toggles items, refs, and mobile template selector, then resets', () => {
    const root = createTestRootStore();
    const element = { focus: vi.fn() } as unknown as HTMLElement;

    root.UIStore.toggleItem(1);
    expect(root.UIStore.isItemOpen(1)).toBe(true);
    root.UIStore.toggleItem(1);
    expect(root.UIStore.isItemOpen(1)).toBe(false);

    root.UIStore.setElementRef('item-1', element);
    root.UIStore.setFieldRef('field-1', element);
    root.UIStore.toggleTemplateSelectorBottomMenu();
    root.UIStore.currentView = BUILDER_CURRENT_VIEWS.PREVIEW;

    expect(root.UIStore.itemRefs.get('item-1')).toMatchObject({
      focus: expect.any(Function),
    });
    expect(root.UIStore.fieldRefs.get('field-1')).toMatchObject({
      focus: expect.any(Function),
    });
    expect(root.UIStore.isMobileTemplateSelectorVisible).toBe(true);

    root.UIStore.resetState();
    expect(root.UIStore.itemRefs.size).toBe(0);
    expect(root.UIStore.fieldRefs.size).toBe(0);
    expect(root.UIStore.isMobileTemplateSelectorVisible).toBe(false);
    expect(root.UIStore.currentView).toBe(BUILDER_CURRENT_VIEWS.BUILDER);
  });

  it('finds field refs by field name/section and focuses first item field with guards', () => {
    const { root } = hydrateBasicResume();
    const firstFieldElement = { focus: vi.fn() } as unknown as HTMLElement;
    root.UIStore.setFieldRef('1', firstFieldElement);

    expect(
      root.UIStore.getFieldRefByFieldNameAndSection(
        FIELD_NAMES.PERSONAL_DETAILS.FIRST_NAME,
        INTERNAL_SECTION_TYPES.PERSONAL_DETAILS
      )
    ).toMatchObject({ focus: expect.any(Function) });

    root.UIStore.focusFirstFieldInItem(1);
    expect(firstFieldElement.focus).toHaveBeenCalled();

    root.UIStore.focusFirstFieldInItem(999);
    expect(console.warn).toHaveBeenCalledWith(
      'No item found to focus first field'
    );

    runInAction(() => {
      root.fieldStore.fields = root.fieldStore.fields.filter(
        (field) => field.itemId !== 1
      );
    });
    root.UIStore.focusFirstFieldInItem(1);
    expect(console.warn).toHaveBeenCalledWith('No field found to focus');

    root.fieldStore.addFields([buildField({ id: 99, itemId: 1 })]);
    root.UIStore.focusFirstFieldInItem(1);
    expect(console.warn).toHaveBeenCalledWith('No element found to focus');
  });
});

describe('shepherdStore', () => {
  it('is constructible/importable and exposes Shepherd', async () => {
    const { shepherdStore } = await import('../shepherdStore');

    expect(shepherdStore.Shepherd).toBeDefined();
  });
});
