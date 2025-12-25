import { useAuth } from '@clerk/nextjs';
import { SparklesIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useAiSuggestionHelpers } from '@/components/documentBuilder/aiSuggestions/useAiSuggestionHelpers';
import { AnimatedSuggestionButton } from '@/components/documentBuilder/resumeScore/AnimatedSuggestionButton';
import { SuggestionGroupHeading } from '@/components/documentBuilder/resumeScore/SuggestionGroupHeading';
import { AnimatedSuggestionsContainer } from '@/components/documentBuilder/resumeScore/SuggestionsContainer';
import {
  getKeywordSuggestionScrollEventName,
  getSummaryValue,
} from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';
import type { SectionType } from '@/lib/types/documentBuilder.types';
import type { UseState } from '@/lib/types/utils.types';
import { cn } from '@/lib/utils/stringUtils';

interface AiSuggestionsContentProps {
  setOpen: UseState<boolean>;
}

export const aiButtonBaseClassnames =
  'dark:bg-purple-900 hover:bg-purple-800 bg-purple-700 rounded-md';

export const AiSuggestionsContent = observer(
  ({ setOpen }: AiSuggestionsContentProps) => {
    const { isSignedIn } = useAuth();
    const hasWrittenSummary = !!getSummaryValue();
    const { handleWriteProfileSummary, isLoading } = useAiSuggestionHelpers();

    if (!userSettingsStore.editorPreferences.showAiSuggestions || !isSignedIn) {
      return null;
    }

    const shouldShowTailorSuggestions =
      userSettingsStore.editorPreferences.showAiSuggestions &&
      builderRootStore.aiSuggestionsStore.keywordSuggestions.length &&
      builderRootStore.aiSuggestionsStore.usedKeywords.size !==
        builderRootStore.aiSuggestionsStore.keywordSuggestions.length;

    const handleWriteSummaryClick = async () => {
      setOpen(false);
      await handleWriteProfileSummary();
    };

    const handleAddKeywordsClick = (sectionType: SectionType) => {
      setOpen(false);

      const event = new CustomEvent(
        getKeywordSuggestionScrollEventName(sectionType)
      );

      setTimeout(() => {
        document.dispatchEvent(event);
      }, 300);
    };

    return (
      <>
        {shouldShowTailorSuggestions ? (
          <>
            <SuggestionGroupHeading>Tailor Your Resume</SuggestionGroupHeading>
            <AnimatedSuggestionsContainer>
              <AnimatedSuggestionButton
                label={`Add Work Experience keywords (${builderRootStore.aiSuggestionsStore.usedKeywords.size} / ${builderRootStore.aiSuggestionsStore.keywordSuggestions.length})`}
                icon={<SparklesIcon className='text-white' />}
                iconContainerClassName={cn(aiButtonBaseClassnames)}
                onClick={() =>
                  handleAddKeywordsClick(INTERNAL_SECTION_TYPES.WORK_EXPERIENCE)
                }
                disabled={isLoading}
              />
              <AnimatedSuggestionButton
                label={`Add Summary keywords (${builderRootStore.aiSuggestionsStore.usedKeywords.size} / ${builderRootStore.aiSuggestionsStore.keywordSuggestions.length})`}
                icon={<SparklesIcon className='text-white' />}
                iconContainerClassName={cn(aiButtonBaseClassnames)}
                onClick={() =>
                  handleAddKeywordsClick(INTERNAL_SECTION_TYPES.SUMMARY)
                }
                disabled={isLoading}
              />
            </AnimatedSuggestionsContainer>
          </>
        ) : null}
        <SuggestionGroupHeading>AI Assistant</SuggestionGroupHeading>
        <AnimatedSuggestionsContainer>
          <AnimatedSuggestionButton
            label={`${hasWrittenSummary ? 'Improve' : 'Generate'} your profile summary`}
            icon={<SparklesIcon className='text-white' />}
            iconContainerClassName={cn(aiButtonBaseClassnames)}
            onClick={handleWriteSummaryClick}
            disabled={isLoading}
          />
        </AnimatedSuggestionsContainer>
      </>
    );
  }
);
