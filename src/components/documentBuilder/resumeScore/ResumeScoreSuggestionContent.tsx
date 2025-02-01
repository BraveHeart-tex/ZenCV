import { observer } from 'mobx-react-lite';
import * as motion from 'motion/react-m';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import ResumeScoreSuggestionItem from '@/components/documentBuilder/resumeScore/ResumeScoreSuggestionItem';

const ResumeScoreSuggestionContent = observer(() => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <motion.div
        className="md:grid-cols-2 grid gap-4"
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
    </motion.div>
  );
});

export default ResumeScoreSuggestionContent;
