'use client';
import * as motion from 'motion/react-m';
import { observer } from 'mobx-react-lite';
import { ResumeSuggestion } from '@/lib/types';

const ResumeScoreSuggestionItem = observer(
  ({ suggestion }: { suggestion: ResumeSuggestion }) => {
    return (
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
      >
        <motion.span
          className="w-max h-max tabular-nums p-1 text-xs font-medium text-white bg-green-500 rounded-md"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {suggestion.scoreValue}%
        </motion.span>
        <motion.span
          className="text-sm font-medium"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {suggestion.label}
        </motion.span>
      </motion.div>
    );
  },
);

export default ResumeScoreSuggestionItem;
