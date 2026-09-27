import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import type { TemplateSettings } from '@/lib/constants/accentColors';
import type {
  ResumeTemplate,
  SectionType,
} from '@/lib/types/documentBuilder.types';

/** Private record handoff to the strict Builder Document hydrator. */
export type PersistedDocumentRecords = Readonly<{
  document: DEX_Document;
  sections: readonly DEX_Section[];
  items: readonly DEX_Item[];
  fields: readonly DEX_Field[];
}>;

export type PersistenceFailureReason =
  | 'notFound'
  | 'alreadyExists'
  | 'limitReached'
  | 'minimumRequired'
  | 'membershipChanged';

export type PersistenceResult<T> =
  | Readonly<{ success: true; value: T }>
  | Readonly<{
      success: false;
      reason: PersistenceFailureReason;
    }>;

export type ReorderPersistenceResult =
  | Readonly<{ success: true; value: undefined }>
  | Readonly<{
      success: false;
      reason: 'notFound' | 'membershipChanged';
    }>;

export type CreatedSectionRecords = Readonly<{
  section: DEX_Section;
  item: DEX_Item;
  fields: readonly DEX_Field[];
}>;

export type AddSectionIntent = Readonly<{
  type: SectionType;
  title: string;
  defaultTitle: string;
  metadata: SectionMetadata;
}>;

export type AddItemIntent = Readonly<{
  sectionId: number;
  sectionType: SectionType;
}>;

export type CreatedItemRecords = Readonly<{
  item: DEX_Item;
  fields: readonly DEX_Field[];
}>;

export type SectionMetadata = readonly Readonly<{
  key: string;
  label: string;
  value: string;
}>[];

export interface DocumentPersistence {
  addItem(
    documentId: number,
    intent: AddItemIntent
  ): Promise<PersistenceResult<CreatedItemRecords>>;
  addSection(
    documentId: number,
    intent: AddSectionIntent
  ): Promise<PersistenceResult<CreatedSectionRecords>>;
  deleteItem(
    documentId: number,
    itemId: number
  ): Promise<PersistenceResult<void>>;
  deleteSection(
    documentId: number,
    sectionId: number
  ): Promise<PersistenceResult<void>>;
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
  reorderSections(
    documentId: number,
    sectionIds: readonly number[]
  ): Promise<ReorderPersistenceResult>;
  reorderItems(
    documentId: number,
    sectionId: number,
    itemIds: readonly number[]
  ): Promise<ReorderPersistenceResult>;
}
