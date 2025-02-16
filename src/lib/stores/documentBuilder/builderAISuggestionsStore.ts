import { makeAutoObservable, ObservableMap, reaction, runInAction } from 'mobx';
import { builderRootStore, BuilderRootStore } from './builderRootStore';
import { DEX_Field, FIELD_TYPES } from '@/lib/client-db/clientDbSchema';
import { AISuggestion } from '@/lib/types/documentBuilder.types';
import { getSummaryField } from '@/lib/helpers/documentBuilderHelpers';
import { JobAnalysisResult } from '@/lib/validation/jobAnalysisResult.schema';
import debounce from '@/lib/utils/debounce';
import { SECTIONS_WITH_KEYWORD_SUGGESTION_WIDGET } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { removeHTMLTags } from '@/lib/utils/stringUtils';

const KEYWORD_CHECK_REACTION_DELAY_MS = 500 as const;

export class BuilderAISuggestionsStore {
  root: BuilderRootStore;
  suggestedJobTitle: string | null = null;
  keywordSuggestions: string[] = [];
  usedKeywords = new Set<string>();

  fieldSuggestions: ObservableMap<DEX_Field['id'], AISuggestion> =
    new ObservableMap();

  constructor(root: BuilderRootStore) {
    this.root = root;
    makeAutoObservable(this);
    this.setupReactions();
  }

  private setupReactions = () => {
    const checkUsedKeywords = debounce((values: string[]) => {
      this.usedKeywords.clear();

      if (this.keywordSuggestions.length === 0) return;

      this.keywordSuggestions.forEach((keyword) => {
        values.forEach((value) => {
          if (value.includes(keyword.toLowerCase())) {
            runInAction(() => {
              this.usedKeywords.add(keyword);
            });
          }
        });
      });
    }, KEYWORD_CHECK_REACTION_DELAY_MS);

    reaction(
      () => {
        return {
          values: this.richTextFieldsWithKeywordChecks.map((field) =>
            removeHTMLTags(field.value).toLowerCase(),
          ),
          keywords: this.keywordSuggestions,
        };
      },
      ({ values }) => checkUsedKeywords(values),
    );
  };

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

  applySuggestedJobTitle = async (fieldId: DEX_Field['id']) => {
    if (!this.suggestedJobTitle) return;

    await builderRootStore.fieldStore.setFieldValue(
      fieldId,
      this.suggestedJobTitle,
    );

    runInAction(() => {
      this.suggestedJobTitle = '';
    });
  };

  get richTextFieldsWithKeywordChecks() {
    return this.root.sectionStore.sections
      .filter((section) =>
        SECTIONS_WITH_KEYWORD_SUGGESTION_WIDGET.has(section.type),
      )
      .flatMap((section) => {
        const items = this.root.itemStore.getItemsBySectionId(section.id);
        return items.flatMap((item) =>
          this.root.fieldStore
            .getFieldsByItemId(item.id)
            .filter((field) => field.type === FIELD_TYPES.RICH_TEXT),
        );
      });
  }

  resetState = () => {
    this.keywordSuggestions = [];
    this.suggestedJobTitle = '';
    this.usedKeywords.clear();
  };
}
