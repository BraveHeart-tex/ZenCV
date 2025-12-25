import type { InsertType, UpdateSpec } from 'dexie';
import { clientDb } from './clientDb';
import type { DEX_Document, DEX_Section } from './clientDbSchema';

export async function updateSection(
  sectionId: DEX_Section['id'],
  data: UpdateSpec<DEX_Section>
) {
  return clientDb.sections.update(sectionId, data);
}

export async function deleteSection(sectionId: DEX_Section['id']) {
  return clientDb.transaction(
    'rw',
    [clientDb.sections, clientDb.items, clientDb.fields],
    async () => {
      await clientDb.sections.delete(sectionId);
      const itemIds = await clientDb.items
        .where('sectionId')
        .equals(sectionId)
        .primaryKeys();

      await clientDb.items.bulkDelete(itemIds);
      await clientDb.fields.where('itemId').anyOf(itemIds).delete();
    }
  );
}

export async function bulkUpdateSections(
  keysAndChanges: {
    key: DEX_Section['id'];
    changes: UpdateSpec<DEX_Section>;
  }[]
) {
  return clientDb.sections.bulkUpdate(keysAndChanges);
}

export async function getSectionsByDocumentId(
  documentId: DEX_Document['id']
): Promise<DEX_Section[]> {
  return clientDb.sections.where('documentId').equals(documentId).toArray();
}

export async function getSectionIdsByDocumentId(
  documentId: DEX_Document['id']
): Promise<number[]> {
  return clientDb.sections.where('documentId').equals(documentId).primaryKeys();
}

export async function bulkDeleteSections(
  sectionIds: DEX_Section['id'][]
): Promise<void> {
  return clientDb.sections.bulkDelete(sectionIds);
}

export async function bulkAddSections(
  data: InsertType<DEX_Section, 'id'>[]
): Promise<DEX_Section['id'][]> {
  return clientDb.sections.bulkAdd(data, {
    allKeys: true,
  });
}
