import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import {
  serializeTemplateSettings,
  type TemplateSettings,
} from '@/lib/constants/accentColors';
import type { ResumeTemplate } from '@/lib/types/documentBuilder.types';
import type {
  DocumentPersistence,
  PersistedDocumentRecords,
  PersistenceResult,
} from '../documentPersistence';

export class InMemoryDocumentPersistence implements DocumentPersistence {
  readonly records: PersistedDocumentRecords;
  saveFailure: Error | null = null;

  constructor(records: PersistedDocumentRecords) {
    this.records = structuredClone(records);
  }

  async renameDocument(
    documentId: number,
    title: string
  ): Promise<PersistenceResult<void>> {
    if (this.saveFailure) {
      throw this.saveFailure;
    }
    if (documentId !== this.records.document.id) {
      return { success: false, reason: 'notFound' };
    }
    this.records.document.title = title;
    return { success: true, value: undefined };
  }

  async saveAppearance(
    documentId: number,
    templateType: ResumeTemplate,
    settings: TemplateSettings
  ): Promise<PersistenceResult<void>> {
    if (this.saveFailure) {
      throw this.saveFailure;
    }
    if (documentId !== this.records.document.id) {
      return { success: false, reason: 'notFound' };
    }
    this.records.document.templateType = templateType;
    this.records.document.templateSettings =
      serializeTemplateSettings(settings);
    return { success: true, value: undefined };
  }

  async load(
    documentId: number
  ): Promise<PersistenceResult<PersistedDocumentRecords>> {
    if (this.records.document.id !== documentId) {
      return { success: false, reason: 'notFound' };
    }
    return { success: true, value: structuredClone(this.records) };
  }

  async saveFieldValue(
    documentId: number,
    fieldId: number,
    value: string
  ): Promise<PersistenceResult<void>> {
    if (this.saveFailure) {
      throw this.saveFailure;
    }
    if (documentId !== this.records.document.id) {
      return { success: false, reason: 'notFound' };
    }
    const field = this.records.fields.find((entry) => entry.id === fieldId);
    const item =
      field && this.records.items.find((entry) => entry.id === field.itemId);
    const section =
      item &&
      this.records.sections.find((entry) => entry.id === item.sectionId);
    if (!field || !section || section.documentId !== documentId) {
      return { success: false, reason: 'notFound' };
    }
    const index = this.records.fields.indexOf(field);
    (this.records.fields as DEX_Field[])[index] = {
      ...field,
      value,
    } as DEX_Field;
    return { success: true, value: undefined };
  }
}
