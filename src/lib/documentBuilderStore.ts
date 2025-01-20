import { runInAction, makeAutoObservable } from 'mobx';
import type { Document, Field, Item, Section } from '@/lib/schema';
import { db } from '@/lib/db';
import {
  addItemFromTemplate,
  deleteItem,
  deleteSection,
  renameDocument,
  updateField,
  updateSection,
} from '@/lib/service';
import { getItemInsertTemplate } from '@/lib/helpers';

class DocumentBuilderStore {
  document: Document | null = null;
  sections: Section[] = [];
  items: Item[] = [];
  fields: Field[] = [];
  collapsedItemId: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }
  initializeStore = async (documentId: number) => {
    return db.transaction(
      'r',
      [db.documents, db.sections, db.items, db.fields],
      async () => {
        const document = await db.documents.get(documentId);
        if (!document) {
          return {
            error: 'Document not found.',
          };
        }

        const sections = await db.sections
          .where('documentId')
          .equals(documentId)
          .toArray();
        const sectionIds = sections.map((section) => section.id);

        const items = await db.items
          .where('sectionId')
          .anyOf(sectionIds)
          .toArray();
        const itemIds = items.map((item) => item.id);

        const fields = await db.fields.where('itemId').anyOf(itemIds).toArray();

        runInAction(() => {
          this.document = document;
          this.sections = sections.toSorted(
            (a, b) => a.displayOrder - b.displayOrder,
          );
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

  getSectionById = (sectionId: number) => {
    return this.sections.find((section) => section.id === sectionId);
  };

  getItemsBySectionId = (sectionId: number) => {
    return this.items
      .filter((item) => item.sectionId === sectionId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  getFieldsByItemId = (itemId: number) => {
    return this.fields.filter((field) => field.itemId === itemId);
  };

  getFieldById = (fieldId: number) => {
    return this.fields.find((field) => field.id === fieldId);
  };

  getItemById = (itemId: number) => {
    return this.items.find((item) => item.id === itemId);
  };

  setFieldValue = async (
    fieldId: number,
    value: string,
    shouldSaveToStore = true,
  ) => {
    if (shouldSaveToStore) {
      await updateField(fieldId, value);
    }
    runInAction(() => {
      const field = this.fields.find((field) => field.id === fieldId);
      if (!field) return;
      field.value = value;
    });
  };

  renameSection = async (sectionId: number, value: string) => {
    await updateSection(sectionId, {
      title: value,
    });

    runInAction(() => {
      const section = this.sections.find((section) => section.id === sectionId);
      if (!section) return;
      section.title = value;
    });
  };

  toggleItem = (itemId: number) => {
    this.collapsedItemId = itemId === this.collapsedItemId ? null : itemId;
  };

  removeItem = async (itemId: number) => {
    await deleteItem(itemId);
    runInAction(() => {
      this.items = this.items.filter((item) => item.id !== itemId);
      this.fields = this.fields.filter((field) => field.itemId !== itemId);
    });
  };

  removeSection = async (sectionId: number) => {
    await deleteSection(sectionId);

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
  };

  addNewItemEntry = async (sectionId: number) => {
    const section = this.getSectionById(sectionId);
    if (!section) return;

    const template = getItemInsertTemplate(section.type);
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

  reOrderSectionItems = async (items: Item[]) => {
    await db.items.bulkUpdate(
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
  };
}

export const documentBuilderStore = new DocumentBuilderStore();
