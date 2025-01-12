import { db } from './db';
import { Document } from './schema';

export const createDocument = async (
  data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  return await db.documents.add(data as Document);
};

export const renameDocument = async (
  documentId: Document['id'],
  title: string,
) => {
  return await db.documents.update(documentId, { title });
};

export const deleteDocument = async (documentId: Document['id']) => {
  return await db.documents.delete(documentId);
};
