import { makeAutoObservable, ObservableMap } from 'mobx';
import { BuilderRootStore } from './builderRootStore';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { AISuggestion } from '@/lib/types/documentBuilder.types';
import { getSummaryField } from '@/lib/helpers/documentBuilderHelpers';
import { JobAnalysisResult } from '@/lib/validation/jobAnalysisResult.schema';

export class BuilderAISuggestionsStore {
  root: BuilderRootStore;
  suggestedJobTitle: string | null = null;
  keywordSuggestions: string[] | null = null;

  fieldSuggestions: ObservableMap<DEX_Field['id'], AISuggestion> =
    new ObservableMap();

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  setSummarySuggestion(generatedSummary: string) {
    const summaryFieldId = getSummaryField()?.id;

    if (summaryFieldId) {
      this.fieldSuggestions.set(summaryFieldId, {
        type: 'text',
        value: generatedSummary,
        title: 'AI-Suggested Summary',
        description:
          "If you accept the generated summary below, it will replace your current one. Don't worry,you can always make changes later!",
      });
    }
  }

  setJobAnalysisResults = (data: Partial<JobAnalysisResult>) => {
    if (data.keywordSuggestions) {
      this.keywordSuggestions = data.keywordSuggestions;
    }
    if (data.suggestedJobTitle) {
      this.suggestedJobTitle = data.suggestedJobTitle;
    }
  };
}
