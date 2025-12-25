import type { UpdateSpec } from 'dexie';
import { deleteAiSuggestions } from '@/lib/client-db/aiSuggestionsService';
import { clientDb } from './clientDb';
import type { DEX_Document, DEX_JobPosting } from './clientDbSchema';
import { updateDocument } from './documentService';

export async function addJobPosting(
  data: Omit<DEX_JobPosting, 'id'>,
  documentId: DEX_Document['id']
): Promise<number> {
  return clientDb.transaction(
    'rw',
    [clientDb.jobPostings, clientDb.documents],
    async () => {
      const jobPostingId = await clientDb.jobPostings.add(data);
      await updateDocument(documentId, {
        jobPostingId,
      });
      return jobPostingId;
    }
  );
}

export async function removeJobPostingByDocumentId(
  documentId: DEX_Document['id']
): Promise<void> {
  return clientDb.transaction(
    'rw',
    [clientDb.jobPostings, clientDb.documents, clientDb.aiSuggestions],
    async () => {
      await clientDb.jobPostings.delete(documentId);
      await deleteAiSuggestions(documentId);
    }
  );
}

export async function updateJobPosting(
  key: DEX_JobPosting['id'],
  data: UpdateSpec<DEX_JobPosting>
): Promise<number> {
  return clientDb.jobPostings.update(key, data);
}

export async function getJobPosting(
  id: DEX_JobPosting['id']
): Promise<DEX_JobPosting | null> {
  return (await clientDb.jobPostings.get(id)) || null;
}
