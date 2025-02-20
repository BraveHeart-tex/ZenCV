import { UpdateSpec } from 'dexie';
import { clientDb } from './clientDb';
import { DEX_Document, DEX_JobPosting } from './clientDbSchema';
import DocumentService from './documentService';
import AiSuggestionsService from '@/lib/client-db/aiSuggestionsService';

class JobPostingService {
  static async addJobPosting(
    data: Omit<DEX_JobPosting, 'id'>,
    documentId: DEX_Document['id'],
  ): Promise<number> {
    return clientDb.transaction(
      'rw',
      [clientDb.jobPostings, clientDb.documents],
      async () => {
        const jobPostingId = await clientDb.jobPostings.add(data);
        await DocumentService.updateDocument(documentId, {
          jobPostingId,
        });
        return jobPostingId;
      },
    );
  }

  static async removeJobPostingByDocumentId(
    documentId: DEX_Document['id'],
  ): Promise<void> {
    return clientDb.transaction(
      'rw',
      [clientDb.jobPostings, clientDb.documents, clientDb.aiSuggestions],
      async () => {
        await clientDb.jobPostings.delete(documentId);
        await AiSuggestionsService.deleteAiSuggestions(documentId);
      },
    );
  }
  static async updateJobPosting(
    key: DEX_JobPosting['id'],
    data: UpdateSpec<DEX_JobPosting>,
  ): Promise<number> {
    return clientDb.jobPostings.update(key, data);
  }

  static async getJobPosting(
    id: DEX_JobPosting['id'],
  ): Promise<DEX_JobPosting | null> {
    return (await clientDb.jobPostings.get(id)) || null;
  }
}

export default JobPostingService;
