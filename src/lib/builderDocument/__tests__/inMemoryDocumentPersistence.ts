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
  canDeleteItemFromSection,
  canDeleteSection,
  sectionCreationTemplate,
  validateCreatedSection,
} from '../builderDocument';
import type {
  AddItemIntent,
  AddSectionIntent,
  CreatedItemRecords,
  CreatedSectionRecords,
  DocumentPersistence,
  PersistedDocumentRecords,
  PersistenceResult,
  ReorderPersistenceResult,
  SectionMetadata,
} from '../documentPersistence';
import { sameIds } from '../sameIds';

export class InMemoryDocumentPersistence implements DocumentPersistence {
  readonly records: Omit<
    PersistedDocumentRecords,
    'sections' | 'items' | 'fields'
  > & {
    sections: DEX_Section[];
    items: DEX_Item[];
    fields: DEX_Field[];
  };
  saveFailure: Error | null = null;

  async deleteItem(
    documentId: number,
    itemId: number
  ): Promise<PersistenceResult<void>> {
    if (this.saveFailure) {
      throw this.saveFailure;
    }
    const item = this.records.items.find((entry) => entry.id === itemId);
    const section =
      item &&
      this.records.sections.find((entry) => entry.id === item.sectionId);
    if (!item || !section) {
      return { success: false, reason: 'notFound' };
    }
    const itemCount = this.records.items.filter(
      (entry) => entry.sectionId === section.id
    ).length;
    if (
      !canDeleteItemFromSection(
        {
          documentExists: documentId === this.records.document.id,
          documentId,
          section,
        },
        itemCount
      )
    ) {
      return { success: false, reason: 'notFound' };
    }
    const index = this.records.items.indexOf(item);
    this.records.items.splice(index, 1);
    this.records.fields = this.records.fields.filter(
      (field) => field.itemId !== itemId
    );
    return { success: true, value: undefined };
  }

  async deleteSection(
    documentId: number,
    sectionId: number
  ): Promise<PersistenceResult<void>> {
    if (this.saveFailure) {
      throw this.saveFailure;
    }
    const section = this.records.sections.find(
      (entry) => entry.id === sectionId
    );
    if (
      !section ||
      !canDeleteSection({
        documentExists: documentId === this.records.document.id,
        documentId,
        section,
      })
    ) {
      return { success: false, reason: 'notFound' };
    }
    const itemIds = this.records.items
      .filter((item) => item.sectionId === sectionId)
      .map((item) => item.id);
    this.records.sections.splice(this.records.sections.indexOf(section), 1);
    this.records.items = this.records.items.filter(
      (item) => item.sectionId !== sectionId
    );
    this.records.fields = this.records.fields.filter(
      (field) => !itemIds.includes(field.itemId)
    );
    return { success: true, value: undefined };
  }

  constructor(records: PersistedDocumentRecords) {
    const cloned = structuredClone(records);
    this.records = {
      ...cloned,
      sections: [...cloned.sections],
      items: [...cloned.items],
      fields: [...cloned.fields],
    };
  }

  async addItem(
    documentId: number,
    intent: AddItemIntent
  ): Promise<PersistenceResult<CreatedItemRecords>> {
    if (this.saveFailure) {
      throw this.saveFailure;
    }
    const section = this.records.sections.find(
      (entry) => entry.id === intent.sectionId
    );
    if (
      documentId !== this.records.document.id ||
      !section ||
      section.documentId !== documentId ||
      section.type !== intent.sectionType
    ) {
      return { success: false, reason: 'notFound' };
    }
    if (intent.maxItems !== undefined) {
      const sectionIds = this.records.sections
        .filter(
          (entry) =>
            entry.documentId === documentId && entry.type === intent.sectionType
        )
        .map((entry) => entry.id);
      const count = this.records.items.filter((item) =>
        sectionIds.includes(item.sectionId)
      ).length;
      if (count >= intent.maxItems) {
        return { success: false, reason: 'limitReached' };
      }
    }
    const nextId = (records: readonly { id: number }[]) =>
      Math.max(0, ...records.map((record) => record.id)) + 1;
    const item: DEX_Item = {
      id: nextId(this.records.items),
      sectionId: intent.sectionId,
      containerType: intent.containerType,
      displayOrder:
        Math.max(
          0,
          ...this.records.items
            .filter((entry) => entry.sectionId === intent.sectionId)
            .map((entry) => entry.displayOrder)
        ) + 1,
    };
    const fields = intent.fields.map((field, index) => ({
      ...field,
      id: nextId(this.records.fields) + index,
      itemId: item.id,
    })) as DEX_Field[];
    this.records.items.push(item);
    this.records.fields.push(...fields);
    return { success: true, value: { item, fields } };
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
    const creation = sectionCreationTemplate(intent);
    if (!creation.success) {
      throw new Error('Invalid section creation template');
    }
    const { definition, template } = creation;
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

  async reorderSections(
    documentId: number,
    sectionIds: readonly number[]
  ): Promise<ReorderPersistenceResult> {
    if (this.saveFailure) {
      throw this.saveFailure;
    }
    const siblings = this.records.sections.filter(
      (section) => section.documentId === documentId
    );
    if (documentId !== this.records.document.id) {
      return { success: false, reason: 'notFound' };
    }
    if (
      !sameIds(
        siblings.map((section) => section.id),
        sectionIds
      )
    ) {
      return { success: false, reason: 'conflict' };
    }
    sectionIds.forEach((id, index) => {
      const section = this.records.sections.find((entry) => entry.id === id);
      if (section) {
        section.displayOrder = index + 1;
      }
    });
    return { success: true, value: undefined };
  }

  async reorderItems(
    documentId: number,
    sectionId: number,
    itemIds: readonly number[]
  ): Promise<ReorderPersistenceResult> {
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
    const siblings = this.records.items.filter(
      (item) => item.sectionId === sectionId
    );
    if (
      !sameIds(
        siblings.map((item) => item.id),
        itemIds
      )
    ) {
      return { success: false, reason: 'conflict' };
    }
    itemIds.forEach((id, index) => {
      const item = this.records.items.find((entry) => entry.id === id);
      if (item) {
        item.displayOrder = index + 1;
      }
    });
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
