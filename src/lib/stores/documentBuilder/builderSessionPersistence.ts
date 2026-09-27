import type { DocumentPersistence } from '@/lib/builderDocument/documentPersistence';
import { DexieDocumentPersistence } from '@/lib/client-db/dexieDocumentPersistence';

/** Application composition seam for the production Builder persistence. */
export const createBuilderSessionPersistence = (): DocumentPersistence =>
  new DexieDocumentPersistence();
