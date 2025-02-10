import { observer } from 'mobx-react-lite';
import * as motion from 'motion/react-m';
import ResumeScoreSuggestionItem from '@/components/documentBuilder/resumeScore/ResumeScoreSuggestionItem';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { SparklesIcon } from 'lucide-react';
import AnimatedSuggestionsContainer from './SuggestionsContainer';
import SuggestionGroupHeading from './SuggestionGroupHeading';
import AnimatedSuggestionButton from './AnimatedSuggestionButton';

interface ResumeScoreSuggestionContentProps {
  setOpen: (open: boolean) => void;
}

const ResumeScoreSuggestionContent = observer(
  ({ setOpen }: ResumeScoreSuggestionContentProps) => {
    const suggestions =
      builderRootStore.templateStore.debouncedResumeStats.suggestions;

    if (suggestions.length === 0) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="py-4">
          <SuggestionGroupHeading>AI Assistant</SuggestionGroupHeading>
          <AnimatedSuggestionsContainer>
            <AnimatedSuggestionButton
              label="Write your profile summary"
              icon={<SparklesIcon className="text-white" />}
              iconContainerClassName="dark:bg-purple-900 bg-purple-700 hover:bg-purple-800"
            />
          </AnimatedSuggestionsContainer>

          <SuggestionGroupHeading>
            Boost Your Resume Score
          </SuggestionGroupHeading>

          <AnimatedSuggestionsContainer>
            {suggestions.map((suggestion) => (
              <ResumeScoreSuggestionItem
                setOpen={setOpen}
                suggestion={suggestion}
                key={suggestion.key}
              />
            ))}
          </AnimatedSuggestionsContainer>
        </div>
      </motion.div>
    );
  },
);

export default ResumeScoreSuggestionContent;
