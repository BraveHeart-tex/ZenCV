import { runInAction } from 'mobx';
import { BuilderDocumentStore } from './builderDocumentStore';
import { BuilderFieldStore } from './builderFieldStore';
import { BuilderItemStore } from './builderItemStore';
import { BuilderSectionStore } from './builderSectionStore';
import { BuilderTemplateStore } from './builderTemplateStore';
import { BuilderUIStore } from './builderUIStore';
import { BuilderAISuggestionsStore } from './builderAISuggestionsStore';
import { BuilderJobPostingStore } from '@/lib/stores/documentBuilder/builderJobPostingStore';

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
      this.UIStore.collapsedItemId = null;
      this.UIStore.itemRefs = new Map();
      this.UIStore.fieldRefs = new Map();
      this.templateStore.debouncedResumeStats = { score: 0, suggestions: [] };
      this.templateStore.debouncedTemplateData = null;

      this.aiSuggestionsStore.keywordSuggestions = [];
      this.aiSuggestionsStore.suggestedJobTitle = '';
      this.jobPostingStore.jobPosting = null;
    });
  };
}

export const builderRootStore = new BuilderRootStore();
