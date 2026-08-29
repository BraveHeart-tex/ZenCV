import { runInAction } from 'mobx';
import type { GetFullDocumentStructureResponse } from '@/lib/client-db/documentService';
import { safeParse } from '@/lib/utils/objectUtils';
import { BuilderDocumentStore } from './builderDocumentStore';
import { BuilderFieldStore } from './builderFieldStore';
import { BuilderItemStore } from './builderItemStore';
import { BuilderSectionStore } from './builderSectionStore';
import { BuilderTemplateStore } from './builderTemplateStore';
import { BuilderUIStore } from './builderUIStore';

export class BuilderRootStore {
  documentStore: BuilderDocumentStore;
  sectionStore: BuilderSectionStore;
  itemStore: BuilderItemStore;
  fieldStore: BuilderFieldStore;

  UIStore: BuilderUIStore;
  templateStore: BuilderTemplateStore;

  constructor() {
    this.documentStore = new BuilderDocumentStore(this);
    this.sectionStore = new BuilderSectionStore(this);
    this.itemStore = new BuilderItemStore(this);
    this.fieldStore = new BuilderFieldStore(this);
    this.UIStore = new BuilderUIStore(this);
    this.templateStore = new BuilderTemplateStore(this);
  }

  resetState() {
    this.dispose();
    runInAction(() => {
      this.documentStore.document = null;
      this.sectionStore.sections = [];
      this.itemStore.items = [];
      this.fieldStore.clear();
      this.UIStore.resetState();
      this.templateStore.resetState();
    });
  }

  startSession() {
    this.templateStore.start();
  }

  dispose() {
    this.templateStore.stop();
  }

  hydrateFromBackend(
    result: Extract<GetFullDocumentStructureResponse, { success: true }>
  ) {
    const { document, sections, items, fields } = result;

    this.documentStore.setDocument(document);

    this.sectionStore.setSections(
      sections
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((section) => ({
          ...section,
          metadata: safeParse(section.metadata, []),
        }))
    );

    this.itemStore.setItems(
      items.slice().sort((a, b) => a.displayOrder - b.displayOrder)
    );

    this.fieldStore.setFields(fields);
  }
}

export const builderRootStore = new BuilderRootStore();
