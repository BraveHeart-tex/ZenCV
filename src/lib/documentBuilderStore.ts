import { action, runInAction, makeAutoObservable, observable } from 'mobx';
import type { Document, Field, Item, Section } from '@/lib/schema';
import { db } from '@/lib/db';
import { renameDocument } from '@/lib/service';

class DocumentBuilderStore {
  document: Document | null = null;
  sections: Section[] = [];
  items: Item[] = [];
  fields: Field[] = [];
  private renameDebounceTimer: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this, {
      document: observable,
      sections: observable,
      items: observable,
      fields: observable,
      initializeStore: action,
      renameDocument: action,
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
          this.sections = sections;
          this.fields = fields;
          this.items = items;
        });
      },
    );
  };
  renameDocument = async (newValue: string) => {
    if (!this.document) return;
    if (this.renameDebounceTimer) {
      clearTimeout(this.renameDebounceTimer);
    }

    this.renameDebounceTimer = setTimeout(async () => {
      await renameDocument(this.document!.id, newValue);
    }, 300);

    runInAction(() => {
      if (!this.document) return;
      this.document.title = newValue;
    });
  };
}

export const documentBuilderStore = new DocumentBuilderStore();
