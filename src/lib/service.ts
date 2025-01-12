import { db } from './db';
import { Document } from './schema';

export const createDocument = async (
  data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  return await db.documents.add(data as Document);
};

export const renameDocument = (documentId: Document['id'], title: string) => {
  return db.documents.update(documentId, { title });
};
