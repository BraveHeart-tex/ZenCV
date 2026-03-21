import { makeAutoObservable, runInAction } from 'mobx';
import type { DEX_Document } from '@/lib/client-db/clientDbSchema';
import {
  getFullDocumentStructure,
  renameDocument,
  updateDocument,
} from '@/lib/client-db/documentService';
import {
  DEFAULT_ACCENT_COLOR,
  getDefaultAccentColorForTemplate,
  parseTemplateSettings,
  serializeTemplateSettings,
} from '@/lib/constants/accentColors';
import type {
  ResumeTemplate,
  StoreResult,
} from '@/lib/types/documentBuilder.types';
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

  setDocument = (document: DEX_Document) => {
    this.document = document;
  };

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

      this.root.hydrateFromBackend(result);
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

  get accentColor(): string {
    if (!this.document) {
      return DEFAULT_ACCENT_COLOR;
    }

    const settings = parseTemplateSettings(this.document.templateSettings);
    return (
      settings[this.document.templateType]?.accentColor ??
      getDefaultAccentColorForTemplate(this.document.templateType)
    );
  }

  changeDocumentTemplateType = async (templateType: ResumeTemplate) => {
    if (!this.document || this.document.templateType === templateType) {
      return;
    }

    const {
      id,
      templateType: prevType,
      templateSettings: prevSettings,
    } = this.document;

    // batch both changes together — single reaction fire
    runInAction(() => {
      this.setTemplateType(templateType);
      // pre-resolve the accent color for the new template into templateSettings
      // so accentColor getter returns the right value in the same tick
      if (this.document) {
        const settings = parseTemplateSettings(this.document.templateSettings);
        if (!settings[templateType]) {
          settings[templateType] = {
            accentColor: getDefaultAccentColorForTemplate(templateType),
          };
          this.document.templateSettings = serializeTemplateSettings(settings);
        }
      }
    });

    try {
      await updateDocument(id, {
        templateType,
        templateSettings: this.document.templateSettings,
      });
    } catch (error) {
      console.error('changeDocumentTemplateType error', error);
      runInAction(() => {
        if (this.document?.id === id) {
          this.setTemplateType(prevType);
          this.document.templateSettings = prevSettings;
        }
      });
    }
  };

  private setTitle = (title: string) => {
    if (!this.document) {
      return;
    }
    this.document.title = title;
  };

  private setTemplateType = (templateType: ResumeTemplate) => {
    if (!this.document) {
      return;
    }
    this.document.templateType = templateType;
  };

  updateAccentColor = async (color: string): Promise<StoreResult> => {
    if (!this.document) {
      return { success: false, error: 'Document not found.' };
    }

    const settings = parseTemplateSettings(this.document.templateSettings);
    const newSettings = serializeTemplateSettings({
      ...settings,
      [this.document.templateType]: { accentColor: color },
    });

    const prev = this.document.templateSettings;
    runInAction(() => {
      if (this.document) {
        this.document.templateSettings = newSettings;
      }
    });

    try {
      await updateDocument(this.document.id, { templateSettings: newSettings });
      return { success: true };
    } catch {
      runInAction(() => {
        if (this.document) {
          this.document.templateSettings = prev;
        }
      });
      return { success: false, error: 'Failed to update accent color.' };
    }
  };
}
