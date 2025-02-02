import { observer } from 'mobx-react-lite';
import * as motion from 'motion/react-m';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import ResumeScoreSuggestionItem from '@/components/documentBuilder/resumeScore/ResumeScoreSuggestionItem';

const ResumeScoreSuggestionContent = observer(() => {
  if (documentBuilderStore.debouncedResumeStats.suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="py-4"
    >
      <div>
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Boost Your Resume Score
        </h3>
        <motion.div
          className="md:grid-cols-2 grid gap-4 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {documentBuilderStore.debouncedResumeStats.suggestions.map(
            (suggestion) => (
              <ResumeScoreSuggestionItem
                suggestion={suggestion}
                key={suggestion.key}
              />
            ),
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});

export default ResumeScoreSuggestionContent;
