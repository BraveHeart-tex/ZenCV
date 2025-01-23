import { runInAction, makeAutoObservable } from 'mobx';
import type {
  DEX_Document,
  DEX_Field,
  DEX_Item,
  DEX_Section,
} from '@/lib/schema';
import { dxDb } from '@/lib/dxDb';
import {
  addItemFromTemplate,
  deleteItem,
  deleteSection,
  renameDocument,
  updateField,
  updateSection,
} from '@/lib/service';
import { getItemInsertTemplate } from '@/lib/helpers';
import { OtherSectionOption } from '@/components/AddSectionWidget';
import {
  ParsedSectionMetadata,
  SectionMetadataKey,
  SectionWithParsedMetadata,
  TemplatedSectionType,
} from '@/lib/types';

class DocumentBuilderStore {
  document: DEX_Document | null = null;
  sections: SectionWithParsedMetadata[] = [];
  items: DEX_Item[] = [];
  fields: DEX_Field[] = [];
  collapsedItemId: DEX_Item['id'] | null = null;

  constructor() {
    makeAutoObservable(this);
  }
  initializeStore = async (documentId: DEX_Document['id']) => {
    return dxDb.transaction(
      'r',
      [dxDb.documents, dxDb.sections, dxDb.items, dxDb.fields],
      async () => {
        const document = await dxDb.documents.get(documentId);
        if (!document) {
          return {
            error: 'Document not found.',
          };
        }

        const sections = await dxDb.sections
          .where('documentId')
          .equals(documentId)
          .toArray();
        const sectionIds = sections.map((section) => section.id);

        const items = await dxDb.items
          .where('sectionId')
          .anyOf(sectionIds)
          .toArray();
        const itemIds = items.map((item) => item.id);

        const fields = await dxDb.fields
          .where('itemId')
          .anyOf(itemIds)
          .toArray();

        runInAction(() => {
          this.document = document;
          this.sections = sections
            .toSorted((a, b) => a.displayOrder - b.displayOrder)
            .map((section) => ({
              ...section,
              metadata: JSON.parse(section?.metadata || '[]'),
            }));
          this.items = items.toSorted(
            (a, b) => a.displayOrder - b.displayOrder,
          );
          this.fields = fields;
        });
      },
    );
  };
  renameDocument = async (newValue: string) => {
    if (!this.document) return;
    await renameDocument(this.document.id, newValue);

    runInAction(() => {
      if (!this.document) return;
      this.document.title = newValue;
    });
  };

  getSectionById = (sectionId: DEX_Section['id']) => {
    return this.sections.find((section) => section.id === sectionId);
  };

  getItemsBySectionId = (sectionId: DEX_Section['id']) => {
    return this.items
      .filter((item) => item.sectionId === sectionId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  getFieldsByItemId = (itemId: DEX_Item['id']) => {
    return this.fields.filter((field) => field.itemId === itemId);
  };

  getFieldById = (fieldId: DEX_Field['id']) => {
    return this.fields.find((field) => field.id === fieldId);
  };

  getItemById = (itemId: DEX_Item['id']) => {
    return this.items.find((item) => item.id === itemId);
  };

  setFieldValue = async (
    fieldId: DEX_Field['id'],
    value: string,
    shouldSaveToStore = true,
  ) => {
    runInAction(() => {
      const field = this.fields.find((field) => field.id === fieldId);
      if (!field) return;
      field.value = value;
    });

    if (shouldSaveToStore) {
      await updateField(fieldId, value);
    }
  };

  renameSection = async (sectionId: DEX_Section['id'], value: string) => {
    runInAction(() => {
      const section = this.sections.find((section) => section.id === sectionId);
      if (!section) return;
      section.title = value;
    });

    await updateSection(sectionId, {
      title: value,
    });
  };

  toggleItem = (itemId: DEX_Item['id']) => {
    this.collapsedItemId = itemId === this.collapsedItemId ? null : itemId;
  };

  removeItem = async (itemId: DEX_Item['id']) => {
    runInAction(() => {
      this.items = this.items.filter((item) => item.id !== itemId);
      this.fields = this.fields.filter((field) => field.itemId !== itemId);
    });

    await deleteItem(itemId);
  };

  removeSection = async (sectionId: DEX_Section['id']) => {
    runInAction(() => {
      const itemIdsToKeep = this.items
        .filter((item) => item.sectionId !== sectionId)
        .map((item) => item.id);

      this.sections = this.sections.filter(
        (section) => section.id !== sectionId,
      );
      this.items = this.items.filter((item) => item.sectionId !== sectionId);
      this.fields = this.fields.filter((field) =>
        itemIdsToKeep.includes(field.itemId),
      );
    });

    await deleteSection(sectionId);
  };

  addNewItemEntry = async (sectionId: DEX_Section['id']) => {
    const section = this.getSectionById(sectionId);
    if (!section) return;

    const template = getItemInsertTemplate(
      section.type as TemplatedSectionType,
    );
    if (!template) return;

    const result = await addItemFromTemplate({
      ...template,
      sectionId,
      displayOrder: this.items.reduce(
        (displayOrder, currentItem) =>
          currentItem.displayOrder > displayOrder
            ? currentItem.displayOrder
            : displayOrder,
        1,
      ),
    });

    runInAction(() => {
      const { fields, item } = result;

      this.items.push(item);
      this.fields.push(...fields);

      setTimeout(() => {
        this.toggleItem(item.id);
      }, 100);
    });
  };

  reOrderSectionItems = async (items: DEX_Item[]) => {
    runInAction(() => {
      const updatedDisplayOrders = new Map(
        items.map((item, index) => [item.id, index + 1]),
      );

      this.items.forEach((item) => {
        if (updatedDisplayOrders.has(item.id)) {
          item.displayOrder = updatedDisplayOrders.get(item.id)!;
        }
      });
    });

    await dxDb.items.bulkUpdate(
      items
        .map((item, index) => ({
          key: item.id,
          changes: { displayOrder: index + 1 },
        }))
        .filter(({ key, changes }) =>
          this.items.some(
            (existingItem) =>
              existingItem.id === key &&
              existingItem.displayOrder !== changes.displayOrder,
          ),
        ),
    );
  };
  reOrderSections = async (sections: SectionWithParsedMetadata[]) => {
    runInAction(() => {
      this.sections = sections.map((section, index) => ({
        ...section,
        displayOrder: index + 1,
      }));
    });

    await dxDb.sections.bulkUpdate(
      sections.map((section, index) => ({
        key: section.id,
        changes: {
          displayOrder: index + 1,
        },
      })),
    );
  };

  addNewSection = async (option: OtherSectionOption) => {
    const template = getItemInsertTemplate(option.type);
    if (!template) return;

    await dxDb.transaction(
      'rw',
      [dxDb.sections, dxDb.fields, dxDb.items],
      async () => {
        const sectionDto = {
          displayOrder: documentBuilderStore.sections.reduce(
            (acc, curr) => Math.max(acc, curr.displayOrder),
            1,
          ),
          title: option.title,
          defaultTitle: option.defaultTitle,
          type: option.type,
          metadata: option?.metadata,
          documentId: documentBuilderStore.document!.id,
        };

        const sectionId = await dxDb.sections.add(sectionDto);

        runInAction(() => {
          this.sections.push({
            ...sectionDto,
            id: sectionId,
            metadata: option?.metadata ? JSON.parse(option?.metadata) : [],
          });
        });

        await this.addNewItemEntry(sectionId);
      },
    );
  };
  resetState = () => {
    this.document = null;
    this.sections = [];
    this.items = [];
    this.fields = [];
    this.collapsedItemId = null;
  };
  getSectionMetadataOptions = (
    sectionId: DEX_Section['id'],
  ): ParsedSectionMetadata[] => {
    const section = this.getSectionById(sectionId);
    if (!section || !section?.metadata) return [];
    return section?.metadata || [];
  };
  updateSectionMetadata = async (
    sectionId: DEX_Section['id'],
    data: {
      key: SectionMetadataKey;
      value: string;
    },
  ) => {
    const section = this.getSectionById(sectionId);
    if (!section) return;

    runInAction(() => {
      const metadata = section.metadata.find(
        (metadata) => metadata.key === data.key,
      );
      if (metadata) {
        metadata.value = data.value;
      }
    });

    await dxDb.sections.update(sectionId, {
      metadata: JSON.stringify(
        section.metadata.map((metadata) => ({
          ...metadata,
          value: metadata.key === data.key ? data.value : metadata.value,
        })),
      ),
    });
  };
}

export const documentBuilderStore = new DocumentBuilderStore();
