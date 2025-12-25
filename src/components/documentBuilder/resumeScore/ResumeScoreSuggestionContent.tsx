import { observer } from 'mobx-react-lite';
import * as motion from 'motion/react-m';
import { AiSuggestionsContent } from '@/components/documentBuilder/aiSuggestions/AiSuggestionsContent';
import { ResumeScoreSuggestionItem } from '@/components/documentBuilder/resumeScore/ResumeScoreSuggestionItem';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import type { UseState } from '@/lib/types/utils.types';
import { SuggestionGroupHeading } from './SuggestionGroupHeading';
import { AnimatedSuggestionsContainer } from './SuggestionsContainer';

interface ResumeScoreSuggestionContentProps {
  setOpen: UseState<boolean>;
}

export const ResumeScoreSuggestionContent = observer(
  ({ setOpen }: ResumeScoreSuggestionContentProps) => {
    const suggestions =
      builderRootStore.templateStore.debouncedResumeStats.suggestions;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className='overflow-hidden'
      >
        <div className='py-4'>
          <AiSuggestionsContent setOpen={setOpen} />
          {suggestions.length > 0 ? (
            <>
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
            </>
          ) : null}
        </div>
      </motion.div>
    );
  }
);
