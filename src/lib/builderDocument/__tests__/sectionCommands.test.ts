import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import type { FieldId, ItemId, SectionId } from '../builderDocument';
import {
  builderDocumentFixture,
  hydrateTestBuilderDocument as hydrateBuilderDocument,
} from './builderDocumentFixture';
import { InMemoryDocumentPersistence } from './inMemoryDocumentPersistence';

const sectionCommands = {
  renameSection: vi.fn(async () => ({
    success: true as const,
    value: undefined,
  })),
  saveSectionMetadata: vi.fn(async () => ({
    success: true as const,
    value: undefined,
  })),
};

const persistence = vi.hoisted(() => {
  const sections: DEX_Section[] = [];
  let nextSectionId = 100;
  let nextItemId = 200;
  let nextFieldId = 300;
  return {
    sections,
    transaction: vi.fn(
      async (_mode: string, _tables: unknown[], work: () => Promise<unknown>) =>
        work()
    ),
    addSection: vi.fn(async (input: Omit<DEX_Section, 'id'>) => {
      const id = nextSectionId++;
      sections.push({ ...input, id });
      return id;
    }),
    addItem: vi.fn(async (_input: Omit<DEX_Item, 'id'>) => nextItemId++),
    addFields: vi.fn(async (fields: Omit<DEX_Field, 'id'>[]) =>
      fields.map(() => nextFieldId++)
    ),
    deleteSection: vi.fn(async (id: number) => {
      const index = sections.findIndex((section) => section.id === id);
      if (index >= 0) {
        sections.splice(index, 1);
      }
    }),
    bulkUpdateSections: vi.fn(async (changes: unknown[]) => changes.length),
    reset() {
      sections.length = 0;
      nextSectionId = 100;
      nextItemId = 200;
      nextFieldId = 300;
    },
  };
});

vi.mock('@/lib/client-db/clientDb', () => ({
  clientDb: {
    transaction: persistence.transaction,
    sections: {
      add: persistence.addSection,
      where: () => ({
        equals: () => ({ toArray: async () => [...persistence.sections] }),
      }),
    },
    items: { add: persistence.addItem },
    fields: { bulkAdd: persistence.addFields },
  },
}));
vi.mock('@/lib/client-db/sectionService', () => ({
  deleteSection: persistence.deleteSection,
  bulkUpdateSections: persistence.bulkUpdateSections,
}));

const document = () => {
  const records = builderDocumentFixture();
  const adapter = new InMemoryDocumentPersistence(records);
  persistence.deleteSection.mockImplementation(async (id: number) => {
    const index = adapter.records.sections.findIndex(
      (section) => section.id === id
    );
    if (index >= 0) {
      (adapter.records.sections as DEX_Section[]).splice(index, 1);
    }
  });
  adapter.renameSection = sectionCommands.renameSection;
  adapter.saveSectionMetadata = sectionCommands.saveSectionMetadata;
  const result = hydrateBuilderDocument(records, adapter);
  if (!result.success) {
    throw new Error('Invalid fixture');
  }
  persistence.sections.push(...builderDocumentFixture().sections);
  return result.document;
};

beforeEach(() => {
  persistence.reset();
  vi.clearAllMocks();
});
afterEach(() => {
  vi.restoreAllMocks();
});

const option = (
  key: 'courses' | 'custom' | 'skills' | 'education' | 'websitesSocialLinks'
) => {
  const definition = sectionDefinitions[key];
  return {
    type: definition.persistedType,
    title: definition.label,
    defaultTitle: definition.label,
    containerType: definition.expectedContainerType,
    ...(key === 'skills'
      ? {
          metadata: JSON.stringify([
            {
              key: 'showExperienceLevel',
              label: 'Show experience level',
              value: '0',
            },
            { key: 'isCommaSeparated', label: 'Separate skills', value: '0' },
          ]),
        }
      : {}),
  };
};

describe('Builder Document section commands', () => {
  it('rejects a section added in another session and leaves the model unchanged', async () => {
    const model = document();
    const adapter = model.persistence as InMemoryDocumentPersistence;
    const input = option('courses');
    const persisted = await adapter.addSection(model.id, {
      type: input.type,
      title: input.title,
      defaultTitle: input.defaultTitle,
      metadata: [],
    });
    expect(persisted.success).toBe(true);
    expect(await model.addSection(input)).toEqual({
      success: false,
      error: 'Section already exists',
    });
    expect(model.courses).toBeUndefined();
    expect(model.sectionIds).toHaveLength(3);
  });

  it('keeps model and records unchanged on a storage failure', async () => {
    const model = document();
    const adapter = model.persistence as InMemoryDocumentPersistence;
    const before = structuredClone(adapter.records);
    adapter.saveFailure = new Error('disk failed');
    expect(await model.addSection(option('courses'))).toEqual({
      success: false,
      error: 'Failed to add section',
    });
    expect(adapter.records).toEqual(before);
    expect(model.sectionIds).toHaveLength(3);
  });

  it('enforces required, optional-one, and many Section Cardinality', async () => {
    const model = document();
    expect(await model.removeSection(model.workExperience.id)).toBe(false);
    expect(persistence.deleteSection).not.toHaveBeenCalled();
    const first = await model.addSection(option('courses'));
    expect(first.success).toBe(true);
    expect((await model.addSection(option('courses'))).success).toBe(false);
    expect((await model.addSection(option('custom'))).success).toBe(true);
    expect((await model.addSection(option('custom'))).success).toBe(true);
    expect(model.customSections).toHaveLength(2);
    expect(
      (model.persistence as InMemoryDocumentPersistence).records.sections
    ).toHaveLength(6);
  });

  it('publishes one complete graph after persistence allocates IDs', async () => {
    const model = document();
    let release: (() => void) | undefined;
    const adapter = model.persistence as InMemoryDocumentPersistence;
    const addSection = adapter.addSection.bind(adapter);
    adapter.addSection = async (...args) => {
      await new Promise<void>((resolve) => {
        release = resolve;
      });
      return addSection(...args);
    };
    const pending = model.addSection(option('courses'));
    await vi.waitFor(() => expect(release).toBeDefined());
    expect(model.courses).toBeUndefined();
    release?.();
    const result = await pending;
    expect(result.success).toBe(true);
    const section = model.courses;
    expect(section?.items[0]).toBe(
      model.itemsById.get(section?.itemIds[0] as ItemId)
    );
    for (const field of section?.items[0].editableFields ?? []) {
      expect(model.fieldsById.get(field.id)).toBe(field);
    }
  });

  it('removes optional sections and restores exact graph identities and order on failure', async () => {
    const model = document();
    const added = await model.addSection(option('custom'));
    if (!added.success || !added.data) {
      throw new Error('Failed to add test section');
    }
    const section = model.sectionsById.get(added.data.sectionId);
    const item = section?.items[0];
    const field = item?.editableFields[0];
    const previousOrder = [...model.sectionIds];
    let reject: ((error: Error) => void) | undefined;
    persistence.deleteSection.mockImplementationOnce(
      () =>
        new Promise((_, failure) => {
          reject = failure;
        })
    );
    const pending = model.removeSection(added.data.sectionId);
    await vi.waitFor(() => expect(reject).toBeDefined());
    expect(model.sectionsById.has(added.data.sectionId)).toBe(false);
    reject?.(new Error('offline'));
    expect(await pending).toBe(false);
    expect(model.sectionIds.slice()).toEqual(previousOrder);
    expect(model.sectionsById.get(added.data.sectionId)).toBe(section);
    expect(model.itemsById.get(item?.id as ItemId)).toBe(item);
    expect(model.fieldsById.get(field?.id as FieldId)).toBe(field);
    expect(await model.removeSection(added.data.sectionId)).toBe(true);
    expect(model.customSections).toHaveLength(0);
  });

  it('can remove and recreate Education, Links, and Skills', async () => {
    const model = document();
    for (const key of ['education', 'websitesSocialLinks', 'skills'] as const) {
      const created = await model.addSection(option(key));
      expect(created.success).toBe(true);
      if (!created.success || !created.data) {
        throw new Error('Failed to create optional section');
      }
      expect(await model.removeSection(created.data.sectionId)).toBe(true);
      expect((await model.addSection(option(key))).success).toBe(true);
    }
  });

  it('serializes section commands with the structural queue', async () => {
    const model = document();
    const created = await model.addSection(option('courses'));
    if (!created.success || !created.data) {
      throw new Error('Failed to create courses');
    }
    let finish: (() => void) | undefined;
    persistence.deleteSection.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = () => resolve(undefined);
        })
    );
    const removal = model.removeSection(created.data.sectionId);
    const rename = model.renameSection(model.workExperience.id, 'Experience');
    await vi.waitFor(() => expect(finish).toBeDefined());
    expect(sectionCommands.renameSection).not.toHaveBeenCalled();
    finish?.();
    expect(await removal).toBe(true);
    expect((await rename).success).toBe(true);
    expect(model.workExperience.title).toBe('Experience');
  });

  it('validates metadata and rolls back title, metadata, and ordering failures', async () => {
    const model = document();
    const created = await model.addSection(option('skills'));
    if (!created.success || !created.data) {
      throw new Error('Failed to create skills');
    }
    const section = model.sectionsById.get(created.data.sectionId);
    const originalMetadata = section?.metadata[0];
    expect(await model.renameSection(created.data.sectionId, '   ')).toEqual({
      success: false,
      error: 'Invalid section title',
    });
    expect(sectionCommands.renameSection).not.toHaveBeenCalled();
    expect(
      await model.updateSectionMetadata(
        created.data.sectionId,
        'showExperienceLevel',
        'bad'
      )
    ).toMatchObject({ success: false });
    expect(sectionCommands.saveSectionMetadata).not.toHaveBeenCalled();
    sectionCommands.renameSection.mockRejectedValueOnce(new Error('offline'));
    expect(
      (await model.renameSection(created.data.sectionId, 'New')).success
    ).toBe(false);
    expect(section?.title).toBe('Skills');
    sectionCommands.saveSectionMetadata.mockRejectedValueOnce(
      new Error('offline')
    );
    expect(
      (
        await model.updateSectionMetadata(
          created.data.sectionId,
          'showExperienceLevel',
          '1'
        )
      ).success
    ).toBe(false);
    expect(section?.metadata[0].value).toBe('0');
    expect(section?.metadata[0]).toBe(originalMetadata);
    expect(sectionCommands.saveSectionMetadata).toHaveBeenCalledWith(
      model.id,
      created.data.sectionId,
      [
        {
          key: 'showExperienceLevel',
          label: 'Show experience level',
          value: '1',
        },
        { key: 'isCommaSeparated', label: 'Separate skills', value: '0' },
      ]
    );
    expect(model.sectionsById.get(created.data.sectionId)).toBe(section);
    const before = [...model.sectionIds];
    const reordered = [...before].reverse() as SectionId[];
    persistence.bulkUpdateSections.mockRejectedValueOnce(new Error('offline'));
    expect((await model.reorderSections(reordered)).success).toBe(false);
    expect(model.sectionIds.slice()).toEqual(before);
    expect((await model.reorderSections(reordered)).success).toBe(true);
    expect(model.sectionIds.slice()).toEqual(reordered);
  });
});
