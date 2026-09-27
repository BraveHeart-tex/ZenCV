import type {
  DocumentPersistence,
  PersistedDocumentRecords,
  PersistenceResult,
} from '@/lib/builderDocument/documentPersistence';
import { clientDb } from './clientDb';

export class DexieDocumentPersistence implements DocumentPersistence {
  async load(
    documentId: number
  ): Promise<PersistenceResult<PersistedDocumentRecords>> {
    return clientDb.transaction(
      'r',
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        const document = await clientDb.documents.get(documentId);
        if (!document) {
          return { success: false as const, reason: 'notFound' as const };
        }
        const sections = await clientDb.sections
          .where('documentId')
          .equals(documentId)
          .toArray();
        const items = sections.length
          ? await clientDb.items
              .where('sectionId')
              .anyOf(sections.map((section) => section.id))
              .toArray()
          : [];
        const fields = items.length
          ? await clientDb.fields
              .where('itemId')
              .anyOf(items.map((item) => item.id))
              .toArray()
          : [];
        return {
          success: true as const,
          value: { document, sections, items, fields },
        };
      }
    );
  }

  async saveFieldValue(
    documentId: number,
    fieldId: number,
    value: string
  ): Promise<PersistenceResult<void>> {
    return clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        const field = await clientDb.fields.get(fieldId);
        const item = field && (await clientDb.items.get(field.itemId));
        const section = item && (await clientDb.sections.get(item.sectionId));
        if (!section || section.documentId !== documentId) {
          return { success: false as const, reason: 'notFound' as const };
        }
        const document = await clientDb.documents.get(documentId);
        if (!document) {
          return { success: false as const, reason: 'notFound' as const };
        }
        const updated = await clientDb.fields.update(fieldId, { value });
        if (updated !== 1) {
          return { success: false as const, reason: 'notFound' as const };
        }
        return { success: true as const, value: undefined };
      }
    );
  }
}
