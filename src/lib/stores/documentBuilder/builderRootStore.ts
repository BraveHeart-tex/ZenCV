import { runInAction } from 'mobx';
import {
  type BuilderDocumentModel,
  hydrateBuilderDocument,
  type ItemId,
  type SectionId,
} from '@/lib/builderDocument/builderDocument';
import {
  type GetFullDocumentStructureResponse,
  getFullDocumentStructure,
} from '@/lib/client-db/documentService';
import { safeParse } from '@/lib/utils/objectUtils';
import { BuilderDocumentStore } from './builderDocumentStore';
import { BuilderFieldStore } from './builderFieldStore';
import { BuilderItemStore } from './builderItemStore';
import { BuilderSectionStore } from './builderSectionStore';
import { BuilderSession } from './builderSession';
import { BuilderTemplateStore } from './builderTemplateStore';
import { BuilderUIStore } from './builderUIStore';
import { CurrentStoreProjection } from './currentStoreProjection';

export class BuilderRootStore {
  documentStore: BuilderDocumentStore;
  sectionStore: BuilderSectionStore;
  itemStore: BuilderItemStore;
  fieldStore: BuilderFieldStore;

  UIStore: BuilderUIStore;
  templateStore: BuilderTemplateStore;
  session: BuilderSession;
  documentModel: BuilderDocumentModel | null = null;
  private currentStoreProjection: CurrentStoreProjection;

  constructor() {
    this.documentStore = new BuilderDocumentStore(this);
    this.sectionStore = new BuilderSectionStore(this);
    this.itemStore = new BuilderItemStore(this);
    this.fieldStore = new BuilderFieldStore(this);
    this.UIStore = new BuilderUIStore(this);
    this.templateStore = new BuilderTemplateStore(this);
    this.currentStoreProjection = new CurrentStoreProjection(this);
    this.session = new BuilderSession({
      clearPublishedDocument: () => this.clearPublishedDocument(),
      publishDocument: (records, document) => {
        this.publishDocumentModel(records, document, true);
        this.startSession();
      },
    });
  }

  resetState() {
    this.session.discard();
  }

  private clearPublishedDocument() {
    this.dispose();
    runInAction(() => {
      this.documentModel = null;
      this.currentStoreProjection.clear();
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
    this.currentStoreProjection.clear();
  }

  installDocumentModel(
    records: Extract<GetFullDocumentStructureResponse, { success: true }>,
    hydrateLegacyStores = false
  ): boolean {
    const result = hydrateBuilderDocument(records);
    if (!result.success) {
      return false;
    }
    this.publishDocumentModel(records, result.document, hydrateLegacyStores);
    return true;
  }

  publishDocumentModel(
    records: Extract<GetFullDocumentStructureResponse, { success: true }>,
    document: BuilderDocumentModel,
    hydrateLegacyStores = false
  ): void {
    if (hydrateLegacyStores) {
      this.currentStoreProjection.clear();
      this.hydrateFromBackend(records);
    }
    this.documentModel = document;
    this.currentStoreProjection.publish(document);
  }

  disposeProjectedSection(sectionId: number): void {
    this.currentStoreProjection.disposeProjectedSection(sectionId);
  }

  async addItem(sectionId: number): Promise<number | undefined> {
    const itemId = await this.documentModel?.addItem(sectionId as SectionId);
    if (itemId) {
      runInAction(() => this.UIStore.toggleItem(itemId));
    }
    return itemId;
  }

  async removeItem(itemId: number): Promise<boolean> {
    const removed = await this.documentModel?.removeItem(itemId as ItemId);
    if (removed) {
      this.currentStoreProjection.disposeProjectedItem(itemId);
    }
    return removed ?? false;
  }

  async reorderItems(itemIds: readonly number[]): Promise<boolean> {
    if (itemIds.length === 0) {
      return false;
    }
    const sectionId = this.documentModel?.itemsById.get(
      itemIds[0] as ItemId
    )?.sectionId;
    if (!sectionId) {
      return false;
    }
    return (
      (await this.documentModel?.reorderItems(
        sectionId,
        itemIds as ItemId[]
      )) ?? false
    );
  }

  async refreshDocumentModel(): Promise<void> {
    const documentId = this.documentStore.document?.id;
    if (!this.documentModel || !documentId) {
      return;
    }
    const records = await getFullDocumentStructure(documentId);
    if (!records.success || !this.installDocumentModel(records)) {
      throw new Error('Failed to refresh Builder Document');
    }
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
