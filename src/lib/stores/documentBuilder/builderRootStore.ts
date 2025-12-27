import { runInAction } from 'mobx';
import { BuilderJobPostingStore } from '@/lib/stores/documentBuilder/builderJobPostingStore';
import { BuilderAISuggestionsStore } from './builderAISuggestionsStore';
import { BuilderDocumentStore } from './builderDocumentStore';
import { BuilderFieldStore } from './builderFieldStore';
import { BuilderItemStore } from './builderItemStore';
import { BuilderSectionStore } from './builderSectionStore';
import { BuilderTemplateStore } from './builderTemplateStore';
import { BuilderUIStore } from './builderUIStore';

export class BuilderRootStore {
  documentStore: BuilderDocumentStore;
  sectionStore: BuilderSectionStore;
  itemStore: BuilderItemStore;
  fieldStore: BuilderFieldStore;

  UIStore: BuilderUIStore;
  templateStore: BuilderTemplateStore;

  aiSuggestionsStore: BuilderAISuggestionsStore;
  jobPostingStore: BuilderJobPostingStore;

  constructor() {
    this.documentStore = new BuilderDocumentStore(this);
    this.sectionStore = new BuilderSectionStore(this);
    this.itemStore = new BuilderItemStore(this);
    this.fieldStore = new BuilderFieldStore(this);
    this.UIStore = new BuilderUIStore(this);
    this.templateStore = new BuilderTemplateStore(this);
    this.aiSuggestionsStore = new BuilderAISuggestionsStore(this);
    this.jobPostingStore = new BuilderJobPostingStore(this);
  }

  resetState = () => {
    runInAction(() => {
      this.documentStore.document = null;
      this.sectionStore.sections = [];
      this.itemStore.items = [];
      this.fieldStore.fields = [];

      this.jobPostingStore.jobPosting = null;

      this.UIStore.resetState();
      this.aiSuggestionsStore.resetState();
      this.templateStore.resetState();
    });
  };

  dispose = () => {
    this.templateStore.dispose();
    this.aiSuggestionsStore.dispose();
  };
}

export const builderRootStore = new BuilderRootStore();
