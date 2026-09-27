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
