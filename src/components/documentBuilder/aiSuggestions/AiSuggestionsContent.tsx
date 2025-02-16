import SuggestionGroupHeading from '@/components/documentBuilder/resumeScore/SuggestionGroupHeading';
import AnimatedSuggestionsContainer from '@/components/documentBuilder/resumeScore/SuggestionsContainer';
import AnimatedSuggestionButton from '@/components/documentBuilder/resumeScore/AnimatedSuggestionButton';
import { SparklesIcon } from 'lucide-react';
import {
  getKeywordSuggestionScrollEventName,
  getSummaryValue,
} from '@/lib/helpers/documentBuilderHelpers';
import { useAiSuggestionHelpers } from '@/components/documentBuilder/aiSuggestions/useAiSuggestionHelpers';
import { observer } from 'mobx-react-lite';
import userSettingsStore from '@/lib/stores/userSettingsStore';
import { UseState } from '@/lib/types/utils.types';
import { cn } from '@/lib/utils/stringUtils';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';

interface AiSuggestionsContentProps {
  setOpen: UseState<boolean>;
}

export const aiButtonBaseClassnames =
  'dark:bg-purple-900 hover:bg-purple-800 bg-purple-700 rounded-md';

const AiSuggestionsContent = observer(
  ({ setOpen }: AiSuggestionsContentProps) => {
    const hasWrittenSummary = !!getSummaryValue();
    const { handleWriteProfileSummary, isLoading } = useAiSuggestionHelpers();

    if (!userSettingsStore.editorPreferences.showAiSuggestions) return null;

    const handleWriteSummaryClick = async () => {
      setOpen(false);
      await handleWriteProfileSummary();
    };

    const handleAddWorkExperienceKeywordsClick = () => {
      setOpen(false);

      const event = new CustomEvent(
        getKeywordSuggestionScrollEventName(
          INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
        ),
      );

      setTimeout(() => {
        document.dispatchEvent(event);
      }, 300);
    };

    return (
      <>
        <SuggestionGroupHeading>Tailor Your Resume</SuggestionGroupHeading>
        <AnimatedSuggestionsContainer>
          <AnimatedSuggestionButton
            label={'Add Work Experience keywords'}
            icon={<SparklesIcon className="text-white" />}
            iconContainerClassName={cn(aiButtonBaseClassnames)}
            onClick={handleAddWorkExperienceKeywordsClick}
            disabled={isLoading}
          />
        </AnimatedSuggestionsContainer>

        <SuggestionGroupHeading>AI Assistant</SuggestionGroupHeading>
        <AnimatedSuggestionsContainer>
          <AnimatedSuggestionButton
            label={`${hasWrittenSummary ? 'Improve' : 'Generate'} your profile summary`}
            icon={<SparklesIcon className="text-white" />}
            iconContainerClassName={cn(aiButtonBaseClassnames)}
            onClick={handleWriteSummaryClick}
            disabled={isLoading}
          />
        </AnimatedSuggestionsContainer>
      </>
    );
  },
);

export default AiSuggestionsContent;
