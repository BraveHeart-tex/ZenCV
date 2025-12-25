import { clientDb } from '@/lib/client-db/clientDb';
import type {
  DEX_AiSuggestions,
  DEX_Document,
} from '@/lib/client-db/clientDbSchema';

export async function addAiSuggestions(
  data: Omit<DEX_AiSuggestions, 'id'>
): Promise<number> {
  return clientDb.aiSuggestions.add(data);
}

export async function deleteAiSuggestions(
  documentId: DEX_AiSuggestions['documentId']
): Promise<number> {
  return clientDb.aiSuggestions.where('documentId').equals(documentId).delete();
}

export async function getAiSuggestionsByDocumentId(
  documentId: DEX_Document['id']
): Promise<DEX_AiSuggestions | null> {
  return (
    (await clientDb.aiSuggestions
      .where('documentId')
      .equals(documentId)
      .first()) || null
  );
}
