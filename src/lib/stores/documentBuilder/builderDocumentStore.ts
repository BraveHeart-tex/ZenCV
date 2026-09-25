import { makeAutoObservable } from 'mobx';
import type { DEX_Document } from '@/lib/client-db/clientDbSchema';
import {
  DEFAULT_ACCENT_COLOR,
  getDefaultAccentColorForTemplate,
  parseTemplateSettings,
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
    const document = this.root.activeDocument;
    if (!document) {
      return { success: false, error: 'Builder document is not ready.' };
    }
    return document.rename(newValue);
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
    const document = this.root.activeDocument;
    if (!document || document.templateType === templateType) {
      return;
    }
    await document.changeTemplate(templateType);
  }

  async updateAccentColor(color: string): Promise<StoreResult> {
    const document = this.root.activeDocument;
    if (!document) {
      return { success: false, error: 'Builder document is not ready.' };
    }
    return document.changeAccent(color);
  }
}
