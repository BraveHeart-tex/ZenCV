import { makeAutoObservable, runInAction } from 'mobx';
import {
  type BuilderDocumentModel,
  hydrateBuilderDocument,
} from '@/lib/builderDocument/builderDocument';
import {
  type GetFullDocumentStructureResponse,
  getFullDocumentStructure,
} from '@/lib/client-db/documentService';

type BuilderRecords = Extract<
  GetFullDocumentStructureResponse,
  { success: true }
>;

export type BuilderSessionState =
  | Readonly<{ status: 'idle' }>
  | Readonly<{ status: 'loading'; documentId: number }>
  | Readonly<{
      status: 'ready';
      documentId: number;
      document: BuilderDocumentModel;
    }>
  | Readonly<{
      status: 'failed';
      documentId: number;
      message: string;
    }>;

type BuilderSessionOptions = Readonly<{
  clearPublishedDocument: () => void;
  publishDocument: (
    records: BuilderRecords,
    document: BuilderDocumentModel
  ) => void;
  loadRecords?: (
    documentId: number
  ) => Promise<GetFullDocumentStructureResponse>;
}>;

const genericFailure = 'The document could not be loaded.';
const invalidDocumentFailure =
  'The document contains records the builder cannot load.';
const initializationFailure =
  'An error occurred while initializing the document store.';

export class BuilderSession {
  state: BuilderSessionState = { status: 'idle' };
  #generation = 0;
  readonly #clearPublishedDocument: () => void;
  readonly #publishDocument: BuilderSessionOptions['publishDocument'];
  readonly #loadRecords: NonNullable<BuilderSessionOptions['loadRecords']>;

  constructor(options: BuilderSessionOptions) {
    this.#clearPublishedDocument = options.clearPublishedDocument;
    this.#publishDocument = options.publishDocument;
    this.#loadRecords = options.loadRecords ?? getFullDocumentStructure;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get document(): BuilderDocumentModel | null {
    return this.state.status === 'ready' ? this.state.document : null;
  }

  async load(documentId: number): Promise<BuilderSessionState> {
    const generation = ++this.#generation;
    this.discardReadyDocument();
    this.#clearPublishedDocument();
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
      this.#publishDocument(records, hydrated.document);
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
    if (this.state.status !== 'failed') {
      return Promise.resolve(this.state);
    }
    return this.load(this.state.documentId);
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
    this.discardReadyDocument();
    this.#clearPublishedDocument();
    runInAction(() => {
      this.state = { status: 'idle' };
    });
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

  private discardReadyDocument(): void {
    if (this.state.status === 'ready') {
      this.state.document.discard();
    }
  }
}
