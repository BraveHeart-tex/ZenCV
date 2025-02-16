import { BuilderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { makeAutoObservable, runInAction } from 'mobx';
import { DEX_JobPosting } from '@/lib/client-db/clientDbSchema';
import { JobPostingSchema } from '@/lib/validation/jobPosting.schema';
import JobPostingService from '@/lib/client-db/jobPostingService';

export class BuilderJobPostingStore {
  root: BuilderRootStore;
  jobPosting: DEX_JobPosting | null = null;

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  updateJobPosting = async (data: Partial<JobPostingSchema>) => {
    if (!this.root.documentStore.document) {
      return {
        success: false,
        message: 'Document not found.',
      };
    }

    if (!this.jobPosting?.id) {
      return {
        success: false,
        message: 'The document has no job posting connection.',
      };
    }

    try {
      await JobPostingService.updateJobPosting(this.jobPosting.id, data);
      runInAction(() => {
        if (this.jobPosting) {
          Object.assign(this.jobPosting, data);
        }
      });
      return {
        success: true,
        message: 'Job posting updated successfully.',
      };
    } catch (error) {
      console.error('updateJobPosting error', error);
      return {
        success: false,
        message:
          'An error occurred while updating the job posting. Please try again.',
      };
    }
  };

  removeJobPosting = async () => {
    if (!this.root.documentStore.document) {
      return {
        success: false,
        message: 'Document not found.',
      };
    }

    if (!this.jobPosting?.id) {
      return {
        success: false,
        message: 'The document has no job posting connection.',
      };
    }

    try {
      await JobPostingService.removeJobPosting(
        this.root.documentStore.document.id,
      );
      runInAction(() => {
        if (this.root.documentStore.document) {
          this.root.documentStore.document.jobPostingId = null;
          this.jobPosting = null;
        }
        this.root.aiSuggestionsStore.resetState();
      });
      return {
        success: true,
        message: 'Job posting removed successfully.',
      };
    } catch (error) {
      console.error('removeJobPosting error', error);
      return {
        success: false,
        message:
          'An error occurred while removing the job posting. Please try again.',
      };
    }
  };

  addJobPosting = async (data: JobPostingSchema) => {
    if (!this.root.documentStore.document) {
      return {
        success: false,
        message: 'Document not found.',
      };
    }

    try {
      const jobPostingId = await JobPostingService.addJobPosting(
        data,
        this.root.documentStore.document.id,
      );
      runInAction(() => {
        if (this.root.documentStore.document) {
          this.root.documentStore.document.jobPostingId = jobPostingId;
          this.jobPosting = {
            ...data,
            id: jobPostingId,
          };
        }
      });
      return {
        success: true,
        message: 'Job posting added successfully.',
      };
    } catch (error) {
      console.error('addJobPosting error', error);
      return {
        success: false,
        message:
          'An error occurred while adding the job posting. Please try again.',
      };
    }
  };
}
