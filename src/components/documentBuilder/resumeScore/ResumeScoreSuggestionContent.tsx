import { observer } from 'mobx-react-lite';
import * as motion from 'motion/react-m';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';

const ResumeScoreSuggestionContent = observer(() => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <motion.div
        className="grid grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {documentBuilderStore.resumeStats.suggestions.map(
          (suggestion, index) => (
            <motion.div
              // TODO: FIX THIS!!!
              key={index}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 + index * 0.05,
                duration: 0.2,
                ease: 'easeOut',
              }}
            >
              <motion.span
                className="w-max h-max tabular-nums p-1 text-xs font-medium text-white bg-green-500 rounded-md"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                {suggestion.scoreValue}%
              </motion.span>
              <motion.span
                className="text-sm font-medium"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                {suggestion.label}
              </motion.span>
            </motion.div>
          ),
        )}
      </motion.div>
    </motion.div>
  );
});

export default ResumeScoreSuggestionContent;
