import { makeAutoObservable, runInAction } from 'mobx';
import type { DEX_Document } from '@/lib/client-db/clientDbSchema';
import {
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
    makeAutoObservable(
      this,
      {
        root: false,
      },
      { autoBind: true }
    );
  }

  setDocument(document: DEX_Document) {
    this.document = document;
  }

  async initializeStore(documentId: DEX_Document['id']): Promise<StoreResult> {
    const state = await this.root.session.load(documentId);
    if (state.status === 'ready') {
      return {
        success: true,
      };
    }
    return {
      success: false,
      error:
        state.status === 'failed'
          ? state.message
          : 'The document could not be loaded.',
    };
  }

  async renameDocument(newValue: string): Promise<StoreResult> {
    const document = this.root.document;
    if (!this.document) {
      return {
        success: false,
        error: 'Document not found.',
      };
    }
    if (!document) {
      const previous = this.document.title;
      this.setTitle(newValue);
      try {
        await renameDocument(this.document.id, newValue);
        return { success: true };
      } catch {
        this.setTitle(previous);
        return {
          success: false,
          error: 'An error occurred while renaming the document.',
        };
      }
    }

    const result = await document.rename(newValue);
    if (result.success) {
      runInAction(() => this.setTitle(document.title));
    }
    return result;
  }

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

  async changeDocumentTemplateType(templateType: ResumeTemplate) {
    const document = this.root.document;
    if (!this.document || document?.templateType === templateType) {
      return;
    }
    if (!document) {
      const previous = {
        templateType: this.document.templateType,
        templateSettings: this.document.templateSettings,
      };
      const settings = parseTemplateSettings(this.document.templateSettings);
      if (!settings[templateType]) {
        settings[templateType] = {
          accentColor: getDefaultAccentColorForTemplate(templateType),
        };
      }
      this.setTemplateType(templateType);
      this.document.templateSettings = serializeTemplateSettings(settings);
      try {
        await updateDocument(this.document.id, {
          templateType,
          templateSettings: this.document.templateSettings,
        });
      } catch {
        this.setTemplateType(previous.templateType);
        this.document.templateSettings = previous.templateSettings;
      }
      return;
    }
    const settings = parseTemplateSettings(document.templateSettings);
    if (!settings[templateType]) {
      settings[templateType] = {
        accentColor: getDefaultAccentColorForTemplate(templateType),
      };
    }
    const result = await document.updateDocument({
      templateType,
      templateSettings: serializeTemplateSettings(settings),
    });
    if (result.success) {
      runInAction(() => {
        if (this.document?.id === document.id) {
          this.setTemplateType(document.templateType);
          this.document.templateSettings = document.templateSettings;
        }
      });
    }
  }

  private setTitle(title: string) {
    if (!this.document) {
      return;
    }
    this.document.title = title;
  }

  private setTemplateType(templateType: ResumeTemplate) {
    if (!this.document) {
      return;
    }
    this.document.templateType = templateType;
  }

  async updateAccentColor(color: string): Promise<StoreResult> {
    const document = this.root.document;
    if (!this.document) {
      return { success: false, error: 'Document not found.' };
    }
    if (!document) {
      const previous = this.document.templateSettings;
      const settings = parseTemplateSettings(previous);
      const templateSettings = serializeTemplateSettings({
        ...settings,
        [this.document.templateType]: { accentColor: color },
      });
      this.document.templateSettings = templateSettings;
      try {
        await updateDocument(this.document.id, { templateSettings });
        return { success: true };
      } catch {
        this.document.templateSettings = previous;
        return { success: false, error: 'Failed to update accent color.' };
      }
    }

    const settings = parseTemplateSettings(document.templateSettings);
    const newSettings = serializeTemplateSettings({
      ...settings,
      [document.templateType]: { accentColor: color },
    });

    const result = await document.updateDocument({
      templateType: document.templateType,
      templateSettings: newSettings,
    });
    if (result.success) {
      runInAction(() => {
        if (this.document?.id === document.id) {
          this.document.templateSettings = document.templateSettings;
        }
      });
    }
    return result;
  }
}
