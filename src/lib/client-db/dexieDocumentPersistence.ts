import {
  canDeleteItemFromSection,
  canDeleteSection,
  getSectionDefinitionForPersistence,
  itemCreationTemplate,
  sectionCreationTemplate,
  validateCreatedItem,
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
  ReorderPersistenceResult,
  SectionMetadata,
} from '@/lib/builderDocument/documentPersistence';
import { sameIds } from '@/lib/builderDocument/sameIds';
import {
  serializeTemplateSettings,
  type TemplateSettings,
} from '@/lib/constants/accentColors';
import type { ResumeTemplate } from '@/lib/types/documentBuilder.types';
import { clientDb } from './clientDb';
import type { DEX_Field } from './clientDbSchema';

export class DexieDocumentPersistence implements DocumentPersistence {
  async deleteItem(
    documentId: number,
    itemId: number
  ): Promise<PersistenceResult<void>> {
    return clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        const document = await clientDb.documents.get(documentId);
        const item = await clientDb.items.get(itemId);
        const section = item && (await clientDb.sections.get(item.sectionId));
        if (
          !document ||
          !item ||
          !section ||
          section.documentId !== documentId
        ) {
          return { success: false as const, reason: 'notFound' as const };
        }
        if (!getSectionDefinitionForPersistence(section.type)) {
          return { success: false as const, reason: 'notFound' as const };
        }
        const itemCount = await clientDb.items
          .where('sectionId')
          .equals(section.id)
          .count();
        if (
          !canDeleteItemFromSection(
            {
              documentExists: Boolean(document),
              documentId,
              section,
            },
            itemCount
          )
        ) {
          return {
            success: false as const,
            reason: 'minimumRequired' as const,
          };
        }
        await clientDb.fields.where('itemId').equals(itemId).delete();
        await clientDb.items.delete(itemId);
        return { success: true as const, value: undefined };
      }
    );
  }

  async deleteSection(
    documentId: number,
    sectionId: number
  ): Promise<PersistenceResult<void>> {
    return clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections, clientDb.items, clientDb.fields],
      async () => {
        const document = await clientDb.documents.get(documentId);
        const section = await clientDb.sections.get(sectionId);
        if (
          !document ||
          !section ||
          section.documentId !== documentId ||
          !getSectionDefinitionForPersistence(section.type)
        ) {
          return { success: false as const, reason: 'notFound' as const };
        }
        if (
          !canDeleteSection({
            documentExists: true,
            documentId,
            section,
          })
        ) {
          return {
            success: false as const,
            reason: 'minimumRequired' as const,
          };
        }
        const itemIds = await clientDb.items
          .where('sectionId')
          .equals(sectionId)
          .primaryKeys();
        await clientDb.fields.where('itemId').anyOf(itemIds).delete();
        await clientDb.items.bulkDelete(itemIds);
        await clientDb.sections.delete(sectionId);
        return { success: true as const, value: undefined };
      }
    );
  }

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
        const creation = itemCreationTemplate(intent.sectionType);
        if (
          !document ||
          !section ||
          section.documentId !== documentId ||
          section.type !== intent.sectionType ||
          !creation.success
        ) {
          return { success: false as const, reason: 'notFound' as const };
        }
        const { definition, template } = creation;
        const maxItems =
          'max' in definition.itemCardinality
            ? definition.itemCardinality.max
            : undefined;
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
        if (maxItems !== undefined && itemCount >= maxItems) {
          return { success: false as const, reason: 'limitReached' as const };
        }
        const siblings = await clientDb.items
          .where('sectionId')
          .equals(intent.sectionId)
          .toArray();
        const itemInput = {
          sectionId: intent.sectionId,
          containerType: template.containerType,
          displayOrder:
            Math.max(0, ...siblings.map((item) => item.displayOrder)) + 1,
        };
        const itemId = await clientDb.items.add(itemInput);
        const fieldInputs = template.fields.map((field) => ({
          ...field,
          itemId,
        }));
        const fieldIds = await clientDb.fields.bulkAdd(fieldInputs, {
          allKeys: true,
        });
        const value: CreatedItemRecords = {
          item: { ...itemInput, id: itemId },
          fields: fieldInputs.map((field, index) => ({
            ...field,
            id: fieldIds[index],
          })) as DEX_Field[],
        };
        validateCreatedItem(value, intent, itemInput.displayOrder);
        return {
          success: true as const,
          value,
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

  async reorderSections(
    documentId: number,
    sectionIds: readonly number[]
  ): Promise<ReorderPersistenceResult> {
    return clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections],
      async () => {
        if (!(await clientDb.documents.get(documentId))) {
          return { success: false as const, reason: 'notFound' as const };
        }
        const siblings = await clientDb.sections
          .where('documentId')
          .equals(documentId)
          .toArray();
        if (
          !sameIds(
            siblings.map((section) => section.id),
            sectionIds
          )
        ) {
          return {
            success: false as const,
            reason: 'membershipChanged' as const,
          };
        }
        for (const [index, sectionId] of sectionIds.entries()) {
          if (
            (await clientDb.sections.update(sectionId, {
              displayOrder: index + 1,
            })) !== 1
          ) {
            throw new Error('Section no longer exists');
          }
        }
        return { success: true as const, value: undefined };
      }
    );
  }

  async reorderItems(
    documentId: number,
    sectionId: number,
    itemIds: readonly number[]
  ): Promise<ReorderPersistenceResult> {
    return clientDb.transaction(
      'rw',
      [clientDb.documents, clientDb.sections, clientDb.items],
      async () => {
        const document = await clientDb.documents.get(documentId);
        const section = await clientDb.sections.get(sectionId);
        if (!document || !section || section.documentId !== documentId) {
          return { success: false as const, reason: 'notFound' as const };
        }
        const siblings = await clientDb.items
          .where('sectionId')
          .equals(sectionId)
          .toArray();
        if (
          !sameIds(
            siblings.map((item) => item.id),
            itemIds
          )
        ) {
          return {
            success: false as const,
            reason: 'membershipChanged' as const,
          };
        }
        for (const [index, itemId] of itemIds.entries()) {
          if (
            (await clientDb.items.update(itemId, {
              displayOrder: index + 1,
            })) !== 1
          ) {
            throw new Error('Item no longer exists');
          }
        }
        return { success: true as const, value: undefined };
      }
    );
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
