import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { builderDocumentFixture } from '@/lib/builderDocument/__tests__/builderDocumentFixture';
import { hydrateBuilderDocument } from '@/lib/builderDocument/builderDocument';
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
