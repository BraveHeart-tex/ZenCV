import type {
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import {
  serializeTemplateSettings,
  type TemplateSettings,
} from '@/lib/constants/accentColors';
import type { ResumeTemplate } from '@/lib/types/documentBuilder.types';
import {
  sectionCreationTemplate,
  validateCreatedSection,
} from '../builderDocument';
import type {
  AddSectionIntent,
  CreatedSectionRecords,
  DocumentPersistence,
  PersistedDocumentRecords,
  PersistenceResult,
  SectionMetadata,
} from '../documentPersistence';

export class InMemoryDocumentPersistence implements DocumentPersistence {
  readonly records: PersistedDocumentRecords;
  saveFailure: Error | null = null;

  constructor(records: PersistedDocumentRecords) {
    this.records = structuredClone(records);
  }

  async addSection(
    documentId: number,
    intent: AddSectionIntent
  ): Promise<PersistenceResult<CreatedSectionRecords>> {
    if (this.saveFailure) {
      throw this.saveFailure;
    }
    if (documentId !== this.records.document.id) {
      return { success: false, reason: 'notFound' };
    }
    const { definition, template } = sectionCreationTemplate(intent);
    if (
      definition.sectionCardinality === 'optional-one' &&
      this.records.sections.some((section) => section.type === intent.type)
    ) {
      return { success: false, reason: 'alreadyExists' };
    }
    const nextId = (records: readonly { id: number }[]) =>
      Math.max(0, ...records.map((record) => record.id)) + 1;
    const sectionId = nextId(this.records.sections);
    const itemId = nextId(this.records.items);
    const fieldId = nextId(this.records.fields);
    const displayOrder =
      Math.max(
        0,
        ...this.records.sections.map((section) => section.displayOrder)
      ) + 1;
    const value: CreatedSectionRecords = {
      section: {
        id: sectionId,
        documentId,
        type: intent.type,
        title: intent.title,
        defaultTitle: intent.defaultTitle,
        metadata: intent.metadata.length ? JSON.stringify(intent.metadata) : '',
        displayOrder,
      },
      item: {
        id: itemId,
        sectionId,
        containerType: template.containerType,
        displayOrder: template.displayOrder,
      },
      fields: template.fields.map((field, index) => ({
        ...field,
        id: fieldId + index,
        itemId,
      })) as DEX_Field[],
    };
    validateCreatedSection(value, intent, documentId, displayOrder);
    (this.records.sections as DEX_Section[]).push(value.section);
    (this.records.items as DEX_Item[]).push(value.item);
    (this.records.fields as DEX_Field[]).push(...value.fields);
    return { success: true, value };
  }

  async renameSection(
    documentId: number,
    sectionId: number,
    title: string
  ): Promise<PersistenceResult<void>> {
    if (this.saveFailure) {
      throw this.saveFailure;
    }
    const section = this.records.sections.find(
      (entry) => entry.id === sectionId
    );
    if (
      documentId !== this.records.document.id ||
      section?.documentId !== documentId
    ) {
      return { success: false, reason: 'notFound' };
    }
    section.title = title;
    return { success: true, value: undefined };
  }

  async saveSectionMetadata(
    documentId: number,
    sectionId: number,
    metadata: SectionMetadata
  ): Promise<PersistenceResult<void>> {
    if (this.saveFailure) {
      throw this.saveFailure;
    }
    const section = this.records.sections.find(
      (entry) => entry.id === sectionId
    );
    if (
      documentId !== this.records.document.id ||
      section?.documentId !== documentId
    ) {
      return { success: false, reason: 'notFound' };
    }
    section.metadata = JSON.stringify(metadata);
    return { success: true, value: undefined };
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
