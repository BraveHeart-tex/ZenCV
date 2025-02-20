import {
  DEX_AiSuggestions,
  DEX_Document,
} from '@/lib/client-db/clientDbSchema';
import { clientDb } from '@/lib/client-db/clientDb';

class AiSuggestionsService {
  static addAiSuggestions = (
    data: Omit<DEX_AiSuggestions, 'id'>,
  ): Promise<number> => {
    return clientDb.aiSuggestions.add(data);
  };

  static deleteAiSuggestions = (
    documentId: DEX_AiSuggestions['documentId'],
  ): Promise<number> => {
    return clientDb.aiSuggestions
      .where('documentId')
      .equals(documentId)
      .delete();
  };

  static async getAiSuggestionsByDocumentId(
    documentId: DEX_Document['id'],
  ): Promise<DEX_AiSuggestions | null> {
    return (
      (await clientDb.aiSuggestions
        .where('documentId')
        .equals(documentId)
        .first()) || null
    );
  }
}

export default AiSuggestionsService;
