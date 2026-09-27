import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';

/** Private record handoff to the strict Builder Document hydrator. */
export type PersistedDocumentRecords = Readonly<{
  document: DEX_Document;
  sections: readonly DEX_Section[];
  items: readonly DEX_Item[];
  fields: readonly DEX_Field[];
}>;

export type PersistenceResult<T> =
  | Readonly<{ success: true; value: T }>
  | Readonly<{ success: false; reason: 'notFound' }>;

export interface DocumentPersistence {
  load(
    documentId: number
  ): Promise<PersistenceResult<PersistedDocumentRecords>>;
  saveFieldValue(
    documentId: number,
    fieldId: number,
    value: string
  ): Promise<PersistenceResult<void>>;
}
