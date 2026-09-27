import {
  sectionCreationTemplate,
  validateCreatedSection,
} from '@/lib/builderDocument/builderDocument';
import type {
  AddItemIntent,
  AddSectionIntent,
  CreatedItemRecords,
  CreatedSectionRecords,
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
import type { DEX_Field } from './clientDbSchema';

export class DexieDocumentPersistence implements DocumentPersistence {
  async addItem(
    documentId: number,
    intent: AddItemIntent
  ): Promise<PersistenceResult<CreatedItemRecords>> {
    return clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        const document = await clientDb.documents.get(documentId);
        const section = await clientDb.sections.get(intent.sectionId);
        if (!document || !section || section.documentId !== documentId) {
          return { success: false as const, reason: 'notFound' as const };
        }
        if (section.type !== intent.sectionType) {
          return { success: false as const, reason: 'notFound' as const };
        }
        if (intent.maxItems !== undefined) {
          const sectionIds = (
            await clientDb.sections
              .where('documentId')
              .equals(documentId)
              .filter((candidate) => candidate.type === intent.sectionType)
              .toArray()
          ).map((candidate) => candidate.id);
          const itemCount = sectionIds.length
            ? await clientDb.items.where('sectionId').anyOf(sectionIds).count()
            : 0;
          if (itemCount >= intent.maxItems) {
            return { success: false as const, reason: 'limitReached' as const };
          }
        }
        const siblings = await clientDb.items
          .where('sectionId')
          .equals(intent.sectionId)
          .toArray();
        const itemInput = {
          sectionId: intent.sectionId,
          containerType: intent.containerType,
          displayOrder:
            Math.max(0, ...siblings.map((item) => item.displayOrder)) + 1,
        };
        const itemId = await clientDb.items.add(itemInput);
        const fieldInputs = intent.fields.map((field) => ({
          ...field,
          itemId,
        }));
        const fieldIds = await clientDb.fields.bulkAdd(fieldInputs, {
          allKeys: true,
        });
        return {
          success: true as const,
          value: {
            item: { ...itemInput, id: itemId },
            fields: fieldInputs.map((field, index) => ({
              ...field,
              id: fieldIds[index],
            })) as DEX_Field[],
          },
        };
      }
    );
  }

  async addSection(
    documentId: number,
    intent: AddSectionIntent
  ): Promise<PersistenceResult<CreatedSectionRecords>> {
    const creation = sectionCreationTemplate(intent);
    if (!creation.success) {
      throw new Error('Invalid section creation template');
    }
    const { definition, template } = creation;
    return clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        if (!(await clientDb.documents.get(documentId))) {
          return { success: false as const, reason: 'notFound' as const };
        }
        const siblings = await clientDb.sections
          .where('documentId')
          .equals(documentId)
          .toArray();
        if (
          definition.sectionCardinality === 'optional-one' &&
          siblings.some((section) => section.type === intent.type)
        ) {
          return { success: false as const, reason: 'alreadyExists' as const };
        }
        const displayOrder =
          Math.max(0, ...siblings.map((section) => section.displayOrder)) + 1;
        const sectionInput = {
          documentId,
          type: intent.type,
          title: intent.title,
          defaultTitle: intent.defaultTitle,
          metadata: intent.metadata.length
            ? JSON.stringify(intent.metadata)
            : '',
          displayOrder,
        };
        const sectionId = await clientDb.sections.add(sectionInput);
        const itemInput = {
          sectionId,
          containerType: template.containerType,
          displayOrder: template.displayOrder,
        };
        const itemId = await clientDb.items.add(itemInput);
        const fieldInputs = template.fields.map((field) => ({
          ...field,
          itemId,
        }));
        const fieldIds = await clientDb.fields.bulkAdd(fieldInputs, {
          allKeys: true,
        });
        const value: CreatedSectionRecords = {
          section: { ...sectionInput, id: sectionId },
          item: { ...itemInput, id: itemId },
          fields: fieldInputs.map((field, index) => ({
            ...field,
            id: fieldIds[index],
          })) as DEX_Field[],
        };
        validateCreatedSection(value, intent, documentId, displayOrder);
        return { success: true as const, value };
      }
    );
  }

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
