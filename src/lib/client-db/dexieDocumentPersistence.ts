import type {
  DocumentPersistence,
  PersistedDocumentRecords,
  PersistenceResult,
  SectionMetadata,
} from '@/lib/builderDocument/documentPersistence';
import {
  serializeTemplateSettings,
  type TemplateSettings,
} from '@/lib/constants/accentColors';
import type { ResumeTemplate } from '@/lib/types/documentBuilder.types';
import { clientDb } from './clientDb';

export class DexieDocumentPersistence implements DocumentPersistence {
  async renameSection(
    documentId: number,
    sectionId: number,
    title: string
  ): Promise<PersistenceResult<void>> {
    return this.saveSectionChange(documentId, sectionId, { title });
  }

  async saveSectionMetadata(
    documentId: number,
    sectionId: number,
    metadata: SectionMetadata
  ): Promise<PersistenceResult<void>> {
    return this.saveSectionChange(documentId, sectionId, {
      metadata: JSON.stringify(metadata),
    });
  }

  private async saveSectionChange(
    documentId: number,
    sectionId: number,
    change: { title: string } | { metadata: string }
  ): Promise<PersistenceResult<void>> {
    return clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections],
      async () => {
        const document = await clientDb.documents.get(documentId);
        const section = await clientDb.sections.get(sectionId);
        if (!document || !section || section.documentId !== documentId) {
          return { success: false as const, reason: 'notFound' as const };
        }
        const updated = await clientDb.sections.update(sectionId, change);
        if (updated !== 1) {
          return { success: false as const, reason: 'notFound' as const };
        }
        return { success: true as const, value: undefined };
      }
    );
  }

  async renameDocument(
    documentId: number,
    title: string
  ): Promise<PersistenceResult<void>> {
    const updated = await clientDb.documents.update(documentId, { title });
    return updated === 1
      ? { success: true, value: undefined }
      : { success: false, reason: 'notFound' };
  }

  async saveAppearance(
    documentId: number,
    templateType: ResumeTemplate,
    settings: TemplateSettings
  ): Promise<PersistenceResult<void>> {
    const updated = await clientDb.documents.update(documentId, {
      templateType,
      templateSettings: serializeTemplateSettings(settings),
    });
    return updated === 1
      ? { success: true, value: undefined }
      : { success: false, reason: 'notFound' };
  }

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
