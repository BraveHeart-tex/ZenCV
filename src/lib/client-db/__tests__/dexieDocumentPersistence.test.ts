import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { hydrateBuilderDocument } from '@/lib/builderDocument/builderDocument';
import { getDefaultSkillsMetadata } from '@/lib/misc/sectionMetadataTemplates';
import { sectionDefinitions } from '@/lib/sectionDefinitions/sectionDefinitions';
import { clientDb } from '../clientDb';
import { DexieDocumentPersistence } from '../dexieDocumentPersistence';

const clearRecords = () =>
  clientDb.transaction(
    'rw',
    [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
    async () => {
      await Promise.all([
        clientDb.fields.clear(),
        clientDb.items.clear(),
        clientDb.sections.clear(),
        clientDb.documents.clear(),
      ]);
    }
  );

beforeEach(clearRecords);
afterEach(clearRecords);

describe('DexieDocumentPersistence', () => {
  const intent = (key: 'courses' | 'custom' | 'skills') => {
    const definition = sectionDefinitions[key];
    return {
      type: definition.persistedType,
      title: definition.label,
      defaultTitle: definition.label,
      metadata:
        key === 'skills'
          ? (JSON.parse(getDefaultSkillsMetadata()) as {
              key: string;
              label: string;
              value: string;
            }[])
          : [],
    };
  };

  it('creates complete sections with Dexie IDs and persisted sibling order', async () => {
    const records = builderDocumentFixture();
    await clientDb.documents.put(records.document);
    await clientDb.sections.bulkPut([...records.sections]);
    await clientDb.items.bulkPut([...records.items]);
    await clientDb.fields.bulkPut([...records.fields]);
    const persistence = new DexieDocumentPersistence();
    const created = await persistence.addSection(
      records.document.id,
      intent('skills')
    );
    expect(created.success).toBe(true);
    if (!created.success) {
      throw new Error('Expected a created section');
    }
    const { section, item, fields } = created.value;
    expect(section).toMatchObject({
      displayOrder: 4,
      metadata: getDefaultSkillsMetadata(),
    });
    expect(item.sectionId).toBe(section.id);
    expect(fields).toHaveLength(
      Object.keys(sectionDefinitions.skills.fields).length
    );
    expect(fields.every((field) => field.itemId === item.id)).toBe(true);
    expect(await clientDb.sections.get(section.id)).toEqual(section);
    expect(await clientDb.items.get(item.id)).toEqual(item);
    expect(
      await clientDb.fields.where('itemId').equals(item.id).toArray()
    ).toEqual(expect.arrayContaining([...fields]));
    const loaded = await persistence.load(records.document.id);
    expect(loaded.success).toBe(true);
    if (loaded.success) {
      const hydrated = hydrateBuilderDocument(loaded.value, persistence);
      expect(hydrated.success).toBe(true);
    }
  });

  it('checks optional-one uniqueness in storage and allows multiple Custom sections', async () => {
    const records = builderDocumentFixture();
    await clientDb.documents.put(records.document);
    const first = new DexieDocumentPersistence();
    const second = new DexieDocumentPersistence();
    expect(
      (await first.addSection(records.document.id, intent('courses'))).success
    ).toBe(true);
    expect(
      await second.addSection(records.document.id, intent('courses'))
    ).toEqual({
      success: false,
      reason: 'alreadyExists',
    });
    const custom1 = await first.addSection(
      records.document.id,
      intent('custom')
    );
    const custom2 = await second.addSection(
      records.document.id,
      intent('custom')
    );
    expect(custom1.success && custom2.success).toBe(true);
    expect(
      await clientDb.sections
        .where('documentId')
        .equals(records.document.id)
        .count()
    ).toBe(3);
  });

  it('rejects creation for a missing document without inserting records', async () => {
    const persistence = new DexieDocumentPersistence();
    expect(await persistence.addSection(999, intent('custom'))).toEqual({
      success: false,
      reason: 'notFound',
    });
    expect(await clientDb.sections.count()).toBe(0);
    expect(await clientDb.items.count()).toBe(0);
    expect(await clientDb.fields.count()).toBe(0);
  });

  it('creates Work Experience items from persisted sibling order with complete fields', async () => {
    const records = builderDocumentFixture();
    await clientDb.documents.put(records.document);
    await clientDb.sections.bulkPut(records.sections);
    await clientDb.items.bulkPut(records.items);
    await clientDb.fields.bulkPut(records.fields);
    const definition = sectionDefinitions.workExperience;
    const persistence = new DexieDocumentPersistence();
    const created = await persistence.addItem(records.document.id, {
      sectionId: 12,
      sectionType: definition.persistedType,
      containerType: definition.expectedContainerType,
      fields: Object.values(definition.fields).map((field) => ({
        name: field.persistedName,
        type: field.expectedPersistedType,
        value: '',
      })),
    });
    expect(created.success).toBe(true);
    if (!created.success) {
      throw new Error('Expected a created item');
    }
    expect(created.value.item).toMatchObject({
      sectionId: 12,
      displayOrder: 2,
    });
    expect(created.value.item.id).toBeGreaterThan(0);
    expect(created.value.fields).toHaveLength(
      Object.values(definition.fields).length
    );
    expect(
      created.value.fields.every(
        (field) => field.itemId === created.value.item.id && field.id > 0
      )
    ).toBe(true);
  });

  it('enforces bounded section-type limits atomically for concurrent additions', async () => {
    const records = builderDocumentFixture();
    const definition = sectionDefinitions.websitesSocialLinks;
    const section = {
      ...records.sections[0],
      id: 50,
      type: definition.persistedType,
      title: 'Links',
      defaultTitle: 'Links',
    };
    await clientDb.documents.put(records.document);
    await clientDb.sections.put(section);
    const persistence = new DexieDocumentPersistence();
    const intent = {
      sectionId: section.id,
      sectionType: definition.persistedType,
      containerType: definition.expectedContainerType,
      maxItems: 1,
      fields: Object.values(definition.fields).map((field) => ({
        name: field.persistedName,
        type: field.expectedPersistedType,
        value: '',
      })),
    };
    const results = await Promise.all([
      persistence.addItem(records.document.id, intent),
      persistence.addItem(records.document.id, intent),
    ]);
    expect(results.filter((result) => result.success)).toHaveLength(1);
    expect(results.filter((result) => !result.success)).toEqual([
      { success: false, reason: 'limitReached' },
    ]);
    expect(
      await clientDb.items.where('sectionId').equals(section.id).count()
    ).toBe(1);
  });

  it('rejects foreign sections and rolls back item fields on storage failure', async () => {
    const records = builderDocumentFixture();
    const foreign = { ...records.document, id: 2 };
    await clientDb.documents.bulkPut([records.document, foreign]);
    await clientDb.sections.bulkPut(records.sections);
    await clientDb.items.bulkPut(records.items);
    await clientDb.fields.bulkPut(records.fields);
    await clientDb.sections.put({ ...records.sections[2], documentId: 2 });
    const persistence = new DexieDocumentPersistence();
    const definition = sectionDefinitions.workExperience;
    const intent = {
      sectionId: 12,
      sectionType: definition.persistedType,
      containerType: definition.expectedContainerType,
      fields: Object.values(definition.fields).map((field) => ({
        name: field.persistedName,
        type: field.expectedPersistedType,
        value: '',
      })),
    };
    expect(await persistence.addItem(records.document.id, intent)).toEqual({
      success: false,
      reason: 'notFound',
    });
    await clientDb.sections.put(records.sections[2]);
    const fail = vi
      .spyOn(clientDb.fields, 'bulkAdd')
      .mockRejectedValueOnce(new Error('disk failed'));
    await expect(
      persistence.addItem(records.document.id, intent)
    ).rejects.toThrow('disk failed');
    fail.mockRestore();
    expect(await clientDb.items.where('sectionId').equals(12).count()).toBe(1);
    expect(await clientDb.fields.where('itemId').equals(22).count()).toBe(
      Object.values(definition.fields).length
    );
  });

  it('rolls back every created record when storage fails after section and item insertion', async () => {
    const records = builderDocumentFixture();
    await clientDb.documents.put(records.document);
    const persistence = new DexieDocumentPersistence();
    const fail = vi
      .spyOn(clientDb.fields, 'bulkAdd')
      .mockRejectedValueOnce(new Error('disk failed'));
    await expect(
      persistence.addSection(records.document.id, intent('courses'))
    ).rejects.toThrow('disk failed');
    fail.mockRestore();
    expect(await clientDb.sections.count()).toBe(0);
    expect(await clientDb.items.count()).toBe(0);
    expect(await clientDb.fields.count()).toBe(0);
  });

  it('rolls back an incomplete graph before the transaction commits', async () => {
    const records = builderDocumentFixture();
    await clientDb.documents.put(records.document);
    const persistence = new DexieDocumentPersistence();
    const incomplete = vi
      .spyOn(clientDb.fields, 'bulkAdd')
      .mockResolvedValueOnce([] as unknown as number);
    await expect(
      persistence.addSection(records.document.id, intent('courses'))
    ).rejects.toThrow('Incomplete created section graph');
    incomplete.mockRestore();
    expect(await clientDb.sections.count()).toBe(0);
    expect(await clientDb.items.count()).toBe(0);
    expect(await clientDb.fields.count()).toBe(0);
  });

  it('scopes section edits to the document and writes structured metadata as JSON', async () => {
    const records = builderDocumentFixture();
    const section = {
      ...records.sections[0],
      type: 'skills' as const,
      metadata: getDefaultSkillsMetadata(),
    };
    const foreignDocument = { ...records.document, id: 2 };
    await clientDb.documents.bulkPut([records.document, foreignDocument]);
    await clientDb.sections.put(section);
    const persistence = new DexieDocumentPersistence();
    const metadata = [
      {
        key: 'showExperienceLevel',
        label: 'Show experience level',
        value: '1',
      },
      { key: 'isCommaSeparated', label: 'Separate skills', value: '0' },
    ];

    expect(await persistence.renameSection(2, section.id, 'Foreign')).toEqual({
      success: false,
      reason: 'notFound',
    });
    expect(
      await persistence.saveSectionMetadata(2, section.id, metadata)
    ).toEqual({
      success: false,
      reason: 'notFound',
    });
    expect(await persistence.renameSection(1, 999999, 'Missing')).toEqual({
      success: false,
      reason: 'notFound',
    });
    expect(await clientDb.sections.get(section.id)).toEqual(section);

    expect(await persistence.renameSection(1, section.id, 'Updated')).toEqual({
      success: true,
      value: undefined,
    });
    expect(
      await persistence.saveSectionMetadata(1, section.id, metadata)
    ).toEqual({
      success: true,
      value: undefined,
    });
    expect(await clientDb.sections.get(section.id)).toMatchObject({
      title: 'Updated',
      metadata:
        '[{"key":"showExperienceLevel","label":"Show experience level","value":"1"},{"key":"isCommaSeparated","label":"Separate skills","value":"0"}]',
    });
  });

  it('saves title and structured appearance with exact settings encoding', async () => {
    const records = builderDocumentFixture();
    await clientDb.documents.put(records.document);
    const persistence = new DexieDocumentPersistence();
    const settings = {
      tokyo: { accentColor: '#123456' },
      sydney: { accentColor: '#abcdef' },
      dubai: { accentColor: '#fedcba' },
    };
    expect(
      await persistence.renameDocument(records.document.id, 'Staff CV')
    ).toEqual({
      success: true,
      value: undefined,
    });
    expect(
      await persistence.saveAppearance(records.document.id, 'dubai', settings)
    ).toEqual({ success: true, value: undefined });
    expect(await clientDb.documents.get(records.document.id)).toMatchObject({
      title: 'Staff CV',
      templateType: 'dubai',
      templateSettings: JSON.stringify(settings),
    });
  });

  it('rejects missing documents and keeps last-write-wins updates', async () => {
    const records = builderDocumentFixture();
    const persistence = new DexieDocumentPersistence();
    expect(
      await persistence.renameDocument(records.document.id, 'Missing')
    ).toEqual({
      success: false,
      reason: 'notFound',
    });
    expect(
      await persistence.saveAppearance(records.document.id, 'dubai', {})
    ).toEqual({ success: false, reason: 'notFound' });

    await clientDb.documents.put(records.document);
    await persistence.renameDocument(records.document.id, 'First');
    await persistence.renameDocument(records.document.id, 'Last');
    await persistence.saveAppearance(records.document.id, 'dubai', {
      tokyo: { accentColor: '#123456' },
      dubai: { accentColor: '#111111' },
    });
    await persistence.saveAppearance(records.document.id, 'dubai', {
      tokyo: { accentColor: '#123456' },
      dubai: { accentColor: '#222222' },
    });
    expect(await clientDb.documents.get(records.document.id)).toMatchObject({
      title: 'Last',
      templateType: 'dubai',
      templateSettings:
        '{"tokyo":{"accentColor":"#123456"},"dubai":{"accentColor":"#222222"}}',
    });
  });

  it('loads the existing record graph and saves a scoped Semantic Field', async () => {
    const records = builderDocumentFixture();
    await clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        await clientDb.documents.put(records.document);
        await clientDb.sections.bulkPut([...records.sections]);
        await clientDb.items.bulkPut([...records.items]);
        await clientDb.fields.bulkPut([...records.fields]);
      }
    );
    const persistence = new DexieDocumentPersistence();
    const loaded = await persistence.load(records.document.id);
    expect(loaded.success).toBe(true);
    if (!loaded.success) {
      throw new Error('Expected the document');
    }
    expect(loaded.value).toEqual({
      document: records.document,
      sections: expect.arrayContaining([...records.sections]),
      items: expect.arrayContaining([...records.items]),
      fields: expect.arrayContaining([...records.fields]),
    });
    const hydrated = hydrateBuilderDocument(loaded.value, persistence);
    expect(hydrated.success).toBe(true);
    const field = records.fields[0];
    expect(
      await persistence.saveFieldValue(records.document.id, field.id, 'Changed')
    ).toEqual({
      success: true,
      value: undefined,
    });
    expect((await clientDb.fields.get(field.id))?.value).toBe('Changed');
  });

  it('rejects missing and foreign field IDs without changing durable values', async () => {
    const records = builderDocumentFixture();
    const foreignDocument = {
      ...records.document,
      id: records.document.id + 1,
    };
    await clientDb.documents.bulkPut([records.document, foreignDocument]);
    await clientDb.sections.bulkPut([...records.sections]);
    await clientDb.items.bulkPut([...records.items]);
    await clientDb.fields.bulkPut([...records.fields]);
    const persistence = new DexieDocumentPersistence();
    const field = records.fields[0];
    expect(
      await persistence.saveFieldValue(foreignDocument.id, field.id, 'Wrong')
    ).toEqual({
      success: false,
      reason: 'notFound',
    });
    expect(
      await persistence.saveFieldValue(records.document.id, 999999, 'Missing')
    ).toEqual({
      success: false,
      reason: 'notFound',
    });
    expect((await clientDb.fields.get(field.id))?.value).toBe(field.value);
  });
});
