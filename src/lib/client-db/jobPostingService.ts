import { clientDb } from './clientDb';
import { DEX_Document, DEX_JobPosting } from './clientDbSchema';
import DocumentService from './documentService';

class JobPostingService {
  static async addJobPosting(
    data: Omit<DEX_JobPosting, 'id'>,
    documentId: DEX_Document['id'],
  ) {
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
  static async removeJobPosting(jobPostingId: DEX_JobPosting['id']) {
    return clientDb.transaction(
      'rw',
      [clientDb.jobPostings, clientDb.documents],
      async () => {
        return await clientDb.jobPostings.delete(jobPostingId);
      },
    );
  }
}

export default JobPostingService;
