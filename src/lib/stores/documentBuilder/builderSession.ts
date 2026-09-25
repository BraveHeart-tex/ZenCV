import { makeAutoObservable, runInAction } from 'mobx';
import {
  type BuilderDocumentModel,
  type FieldId,
  hydrateBuilderDocument,
  type ItemId,
  type SectionId,
} from '@/lib/builderDocument/builderDocument';
import {
  type GetFullDocumentStructureResponse,
  getFullDocumentStructure,
} from '@/lib/client-db/documentService';
import type { StoreResult } from '@/lib/types/documentBuilder.types';
import { BuilderTemplateStore } from './builderTemplateStore';
import { BuilderUIStore } from './builderUIStore';
import { CurrentStoreProjection } from './currentStoreProjection';

export type BuilderSessionState =
  | Readonly<{ status: 'idle' }>
  | Readonly<{ status: 'loading'; documentId: number }>
  | Readonly<{
      status: 'ready';
      documentId: number;
      document: BuilderDocumentModel;
    }>
  | Readonly<{ status: 'failed'; documentId: number; message: string }>;

type BuilderSessionOptions = Readonly<{
  loadRecords?: (
    documentId: number
  ) => Promise<GetFullDocumentStructureResponse>;
}>;

const genericFailure = 'The document could not be loaded.';
const invalidDocumentFailure =
  'The document contains records the builder cannot load.';
const initializationFailure =
  'An error occurred while initializing the document store.';

/** The sole application root for an active Document Builder route. */
export class BuilderSession {
  state: BuilderSessionState = { status: 'idle' };
  readonly UIStore: BuilderUIStore;
  readonly templateStore: BuilderTemplateStore;
  readonly currentStoreProjection: CurrentStoreProjection;
  #generation = 0;
  readonly #loadRecords: NonNullable<BuilderSessionOptions['loadRecords']>;

  constructor(options: BuilderSessionOptions = {}) {
    this.#loadRecords = options.loadRecords ?? getFullDocumentStructure;
    this.UIStore = new BuilderUIStore(this);
    this.currentStoreProjection = new CurrentStoreProjection(this);
    this.templateStore = new BuilderTemplateStore(this);
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get document(): BuilderDocumentModel | null {
    return this.state.status === 'ready' ? this.state.document : null;
  }

  getSection(sectionId: number) {
    return this.document?.sectionsById.get(sectionId as SectionId);
  }

  getItem(itemId: number) {
    return this.document?.itemsById.get(itemId as ItemId);
  }

  getField(fieldId: number) {
    return this.document?.fieldsById.get(fieldId as FieldId);
  }

  async load(documentId: number): Promise<BuilderSessionState> {
    const generation = ++this.#generation;
    this.clearDocument();
    runInAction(() => {
      this.state = { status: 'loading', documentId };
    });
    try {
      const records = await this.#loadRecords(documentId);
      if (!records.success) {
        return this.publishFailure(generation, documentId, records.error);
      }
      const hydrated = hydrateBuilderDocument(records);
      if (!hydrated.success) {
        return this.publishFailure(
          generation,
          documentId,
          invalidDocumentFailure
        );
      }
      if (generation !== this.#generation) {
        hydrated.document.discard();
        return this.state;
      }
      this.currentStoreProjection.publish(hydrated.document);
      this.templateStore.start();
      runInAction(() => {
        this.state = {
          status: 'ready',
          documentId,
          document: hydrated.document,
        };
      });
    } catch {
      return this.publishFailure(generation, documentId, initializationFailure);
    }
    return this.state;
  }

  retry(): Promise<BuilderSessionState> {
    return this.state.status === 'failed'
      ? this.load(this.state.documentId)
      : Promise.resolve(this.state);
  }

  async prepareNavigation(): Promise<boolean> {
    if (this.state.status !== 'ready') {
      return this.state.status === 'idle';
    }
    if (!(await this.state.document.closeAndFlush())) {
      return false;
    }
    this.discard();
    return true;
  }

  discard(): void {
    this.#generation += 1;
    this.clearDocument();
    runInAction(() => {
      this.state = { status: 'idle' };
    });
  }

  resetState(): void {
    this.discard();
  }

  dispose(): void {
    this.clearDocument();
  }

  async addItem(sectionId: number): Promise<number | undefined> {
    const itemId = await this.document?.addItem(sectionId as SectionId);
    if (itemId) {
      runInAction(() => this.UIStore.toggleItem(itemId));
    }
    return itemId;
  }

  async removeItem(itemId: number): Promise<boolean> {
    const removed = await this.document?.removeItem(itemId as ItemId);
    if (removed) {
      this.currentStoreProjection.disposeProjectedItem(itemId);
    }
    return removed ?? false;
  }

  async removeSection(sectionId: number): Promise<boolean> {
    const removed = await this.document?.removeSection(sectionId as SectionId);
    if (removed) {
      this.currentStoreProjection.disposeProjectedSection(sectionId);
    }
    return removed ?? false;
  }

  async reorderItems(itemIds: readonly number[]): Promise<boolean> {
    if (itemIds.length === 0) {
      return false;
    }
    const sectionId = this.document?.itemsById.get(
      itemIds[0] as ItemId
    )?.sectionId;
    if (!sectionId) {
      return false;
    }
    return (
      (await this.document?.reorderItems(sectionId, itemIds as ItemId[])) ??
      false
    );
  }

  async initializeStore(documentId: number): Promise<StoreResult> {
    const state = await this.load(documentId);
    return state.status === 'ready'
      ? { success: true }
      : {
          success: false,
          error: state.status === 'failed' ? state.message : genericFailure,
        };
  }

  private publishFailure(
    generation: number,
    documentId: number,
    message: string | undefined
  ): BuilderSessionState {
    if (generation !== this.#generation) {
      return this.state;
    }
    runInAction(() => {
      this.state = {
        status: 'failed',
        documentId,
        message: message || genericFailure,
      };
    });
    return this.state;
  }

  private clearDocument(): void {
    this.templateStore.stop();
    this.currentStoreProjection.clear();
    if (this.state.status === 'ready') {
      this.state.document.discard();
    }
    this.UIStore.resetState();
  }
}

export const builderSession = new BuilderSession();
