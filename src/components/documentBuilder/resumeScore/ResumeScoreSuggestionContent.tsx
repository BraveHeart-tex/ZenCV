import { observer } from 'mobx-react-lite';
import * as motion from 'motion/react-m';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import ResumeScoreSuggestionItem from '@/components/documentBuilder/resumeScore/ResumeScoreSuggestionItem';

interface ResumeScoreSuggestionContentProps {
  setOpen: (open: boolean) => void;
}

const ResumeScoreSuggestionContent = observer(
  ({ setOpen }: ResumeScoreSuggestionContentProps) => {
    if (documentBuilderStore.debouncedResumeStats.suggestions.length === 0) {
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
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="scroll-m-20 text-lg font-semibold tracking-tight"
          >
            Boost Your Resume Score
          </motion.h3>
          <motion.div
            className="md:grid-cols-2 grid gap-2 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {documentBuilderStore.debouncedResumeStats.suggestions.map(
              (suggestion) => (
                <ResumeScoreSuggestionItem
                  setOpen={setOpen}
                  suggestion={suggestion}
                  key={suggestion.key}
                />
              ),
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  },
);

export default ResumeScoreSuggestionContent;
