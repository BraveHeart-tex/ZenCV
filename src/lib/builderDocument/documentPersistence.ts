import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import type { TemplateSettings } from '@/lib/constants/accentColors';
import type { ResumeTemplate } from '@/lib/types/documentBuilder.types';

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

export type SectionMetadata = readonly Readonly<{
  key: string;
  label: string;
  value: string;
}>[];

export interface DocumentPersistence {
  load(
    documentId: number
  ): Promise<PersistenceResult<PersistedDocumentRecords>>;
  saveFieldValue(
    documentId: number,
    fieldId: number,
    value: string
  ): Promise<PersistenceResult<void>>;
  renameDocument(
    documentId: number,
    title: string
  ): Promise<PersistenceResult<void>>;
  saveAppearance(
    documentId: number,
    templateType: ResumeTemplate,
    settings: TemplateSettings
  ): Promise<PersistenceResult<void>>;
  renameSection(
    documentId: number,
    sectionId: number,
    title: string
  ): Promise<PersistenceResult<void>>;
  saveSectionMetadata(
    documentId: number,
    sectionId: number,
    metadata: SectionMetadata
  ): Promise<PersistenceResult<void>>;
}
