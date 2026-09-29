import type { InsertType } from 'dexie';
import { clientDb } from './clientDb';
import type { DEX_Document, DEX_Section } from './clientDbSchema';

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
