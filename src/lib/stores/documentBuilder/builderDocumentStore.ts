import { makeAutoObservable, runInAction } from 'mobx';
import type { DEX_Document } from '@/lib/client-db/clientDbSchema';
import {
  changeDocumentTemplateType,
  getFullDocumentStructure,
  renameDocument,
} from '@/lib/client-db/documentService';
import type {
  ResumeTemplate,
  StoreResult,
} from '@/lib/types/documentBuilder.types';
import { safeParse } from '@/lib/utils/objectUtils';
import type { BuilderRootStore } from './builderRootStore';

export class BuilderDocumentStore {
  root: BuilderRootStore;
  document: DEX_Document | null = null;

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this, {
      root: false,
    });
  }

  initializeStore = async (
    documentId: DEX_Document['id']
  ): Promise<StoreResult> => {
    try {
      const result = await getFullDocumentStructure(documentId);
      if (!result?.success) {
        return {
          success: false,
          error: result?.error,
        };
      }

      const { document, sections, items, fields, aiSuggestions } = result;

      runInAction(() => {
        this.document = document;
        this.root.sectionStore.sections = sections
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((section) => ({
            ...section,
            metadata: safeParse(section?.metadata, []),
          }));
        this.root.itemStore.items = items
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder);
        this.root.fieldStore.fields = fields;
        this.root.jobPostingStore.jobPosting = result.jobPosting;
        if (aiSuggestions) {
          const { suggestedJobTitle, keywordSuggestions } = aiSuggestions;
          this.root.aiSuggestionsStore.suggestedJobTitle = suggestedJobTitle;
          this.root.aiSuggestionsStore.keywordSuggestions = keywordSuggestions;
        }
      });

      this.root.startSession();

      return {
        success: true,
      };
    } catch (error) {
      console.error('initializeStore error', error);
      return {
        success: false,
        error: 'An error occurred while initializing the document store.',
      };
    }
  };

  renameDocument = async (newValue: string): Promise<StoreResult> => {
    if (!this.document) {
      return {
        success: false,
        error: 'Document not found.',
      };
    }

    const { id, title: prev } = this.document;

    runInAction(() => this.setTitle(newValue));

    try {
      await renameDocument(id, newValue);
      return {
        success: true,
      };
    } catch (error) {
      console.error('renameDocument error', error);
      runInAction(() => {
        if (this.document?.id === id) {
          this.setTitle(prev);
        }
      });
      return {
        success: false,
        error: 'An error occurred while renaming the document.',
      };
    }
  };

  changeDocumentTemplateType = async (templateType: ResumeTemplate) => {
    if (!this.document || this.document.templateType === templateType) return;

    const { id, templateType: prev } = this.document;

    runInAction(() => this.setTemplateType(templateType));

    try {
      await changeDocumentTemplateType(id, templateType);
    } catch (error) {
      console.error('changeDocumentTemplateType error', error);
      runInAction(() => {
        if (this.document?.id === id) {
          this.setTemplateType(prev);
        }
      });
    }
  };

  private setTitle = (title: string) => {
    if (!this.document) return;
    this.document.title = title;
  };

  private setTemplateType = (templateType: ResumeTemplate) => {
    if (!this.document) return;
    this.document.templateType = templateType;
  };
}
