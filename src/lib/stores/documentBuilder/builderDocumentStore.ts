import { makeAutoObservable, runInAction } from 'mobx';
import { BuilderRootStore } from './builderRootStore';
import {
  DEX_Document,
  DEX_DocumentWithJobPosting,
} from '@/lib/client-db/clientDbSchema';
import { ResumeTemplate } from '@/lib/types/documentBuilder.types';
import DocumentService from '@/lib/client-db/documentService';
import JobPostingService from '@/lib/client-db/jobPostingService';
import { JobPostingSchema } from '@/lib/validation/jobPosting.schema';

export class BuilderDocumentStore {
  root: BuilderRootStore;
  document: DEX_DocumentWithJobPosting | null = null;
  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  initializeStore = async (documentId: DEX_Document['id']) => {
    try {
      const result = await DocumentService.getFullDocumentStructure(documentId);
      if (!result?.success) {
        return {
          error: result?.error,
        };
      }

      const { document, sections, items, fields } = result;

      runInAction(() => {
        this.document = document;
        this.root.sectionStore.sections = sections
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((section) => ({
            ...section,
            metadata: JSON.parse(section?.metadata || '[]'),
          }));
        this.root.itemStore.items = items
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder);
        this.root.fieldStore.fields = fields;
      });
    } catch (error) {
      console.error('initializeStore error', error);
      return {
        error: 'An error occurred while initializing the document store.',
      };
    }
  };

  renameDocument = async (newValue: string) => {
    if (!this.document) return;
    try {
      await DocumentService.renameDocument(this.document.id, newValue);
      runInAction(() => {
        if (!this.document) return;
        this.document.title = newValue;
      });
    } catch (error) {
      console.error('renameDocument error', error);
      return {
        error:
          'An error occurred while renaming the document. Please try again.',
      };
    }
  };

  changeDocumentTemplateType = async (templateType: ResumeTemplate) => {
    if (!this.document || this.document.templateType === templateType) return;

    await DocumentService.changeDocumentTemplateType(
      this.document.id,
      templateType,
    );

    runInAction(() => {
      this.document!.templateType = templateType;
    });
  };

  addJobPosting = async (data: JobPostingSchema) => {
    if (!this.document) {
      return {
        success: false,
        message: 'Document not found.',
      };
    }

    try {
      const jobPostingId = await JobPostingService.addJobPosting(
        data,
        this.document.id,
      );
      runInAction(() => {
        if (this.document) {
          this.document!.jobPostingId = jobPostingId;
          this.document.jobPosting = {
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

  removeJobPosting = async () => {
    if (!this.document) {
      return {
        success: false,
        message: 'Document not found.',
      };
    }

    if (!this.document.jobPostingId) {
      return {
        success: false,
        message: 'The document has no job posting connection.',
      };
    }

    try {
      await JobPostingService.removeJobPosting(this.document.jobPostingId);
      runInAction(() => {
        if (this.document?.jobPosting) {
          this.document!.jobPostingId = null;
          this.document.jobPosting = null;
        }
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
}
