import SuggestionGroupHeading from '@/components/documentBuilder/resumeScore/SuggestionGroupHeading';
import AnimatedSuggestionsContainer from '@/components/documentBuilder/resumeScore/SuggestionsContainer';
import AnimatedSuggestionButton from '@/components/documentBuilder/resumeScore/AnimatedSuggestionButton';
import { SparklesIcon } from 'lucide-react';
import { getSummaryValue } from '@/lib/helpers/documentBuilderHelpers';
import { useAiSuggestionHelpers } from '@/components/documentBuilder/aiSuggestions/useAiSuggestionHelpers';
import { observer } from 'mobx-react-lite';
import userSettingsStore from '@/lib/stores/userSettingsStore';
import { UseState } from '@/lib/types/utils.types';

interface AiSuggestionsContentProps {
  setOpen: UseState<boolean>;
}

const AiSuggestionsContent = observer(
  ({ setOpen }: AiSuggestionsContentProps) => {
    const hasWrittenSummary = !!getSummaryValue();
    const { handleWriteProfileSummary, isLoading } = useAiSuggestionHelpers();

    if (!userSettingsStore.editorPreferences.showAiSuggestions) return null;

    return (
      <>
        <SuggestionGroupHeading>AI Assistant</SuggestionGroupHeading>
        <AnimatedSuggestionsContainer>
          <AnimatedSuggestionButton
            label={`${hasWrittenSummary ? 'Improve' : 'Generate'} your profile summary`}
            icon={<SparklesIcon className="text-white" />}
            iconContainerClassName="dark:bg-purple-900 bg-purple-700 hover:bg-purple-800"
            onClick={() => {
              setOpen(false);
              handleWriteProfileSummary();
            }}
            disabled={isLoading}
          />
        </AnimatedSuggestionsContainer>
      </>
    );
  },
);

export default AiSuggestionsContent;
