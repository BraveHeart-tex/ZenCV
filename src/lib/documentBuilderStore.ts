import { action, runInAction, makeAutoObservable, observable } from 'mobx';
import type { Document, Field, Item, Section } from '@/lib/schema';
import { db } from '@/lib/db';
import {
  addItemFromTemplate,
  deleteItem,
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
    makeAutoObservable(this, {
      document: observable,
      sections: observable,
      items: observable,
      fields: observable,
      collapsedItemId: observable,
      initializeStore: action,
      renameDocument: action,
      renameSection: action,
      setFieldValue: action,
      toggleItem: action,
      addNewItemEntry: action,
    });
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
          this.sections = sections.sort(
            (a, b) => a.displayOrder - b.displayOrder,
          );
          this.fields = fields;
          this.items = items;
        });
      },
    );
  };
  renameDocument = async (newValue: string) => {
    if (!this.document) return;

    this.document.title = newValue;
    await renameDocument(this.document!.id, newValue);
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
    const field = this.fields.find((field) => field.id === fieldId);
    if (!field) return;
    field.value = value;
    // TODO: Debouncing this might be a good idea
    if (!shouldSaveToStore) return;
    await updateField(field.id, value);
  };

  renameSection = async (sectionId: number, value: string) => {
    const section = this.sections.find((section) => section.id === sectionId);
    if (!section) return;
    section.title = value;
    await updateSection(section.id, {
      title: value,
    });
  };

  toggleItem = (itemId: number) => {
    this.collapsedItemId = itemId === this.collapsedItemId ? null : itemId;
  };

  removeItem = async (itemId: number) => {
    await deleteItem(itemId);
    this.items = this.items.filter((item) => item.id !== itemId);
    this.fields = this.fields.filter((field) => field.itemId !== itemId);
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
        0,
      ),
    });

    const { fields, item } = result;

    this.items.push(item);
    this.fields.push(...fields);

    setTimeout(() => {
      this.toggleItem(item.id);
    }, 100);
  };
}

export const documentBuilderStore = new DocumentBuilderStore();
