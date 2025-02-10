import { makeAutoObservable, ObservableMap } from 'mobx';
import { BuilderRootStore } from './builderRootStore';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { AISuggestion } from '@/lib/types/documentBuilder.types';
import { getSummaryFieldId } from '@/lib/helpers/documentBuilderHelpers';

export class BuilderAISuggestionsStore {
  root: BuilderRootStore;

  fieldSuggestions: ObservableMap<DEX_Field['id'], AISuggestion> =
    new ObservableMap();

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  setSummarySuggestion(generatedSummary: string) {
    const summaryFieldId = getSummaryFieldId();

    if (summaryFieldId) {
      this.fieldSuggestions.set(summaryFieldId, {
        type: 'text',
        value: generatedSummary,
        title: 'Professional Summary',
        description:
          "If you accept the generated summary below, it will replace your current one. Don't worry,you can always make changes later!",
      });
    }
  }
}
