'use client';
import * as motion from 'motion/react-m';
import { observer } from 'mobx-react-lite';
import { SUGGESTION_ACTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { scrollToCenterAndFocus } from '@/lib/helpers/domHelpers';
import { ResumeSuggestion } from '@/lib/types/documentBuilder.types';

const ResumeScoreSuggestionItem = observer(
  ({ suggestion }: { suggestion: ResumeSuggestion }) => {
    const handleSuggestionClick = () => {
      if (suggestion.actionType === SUGGESTION_ACTION_TYPES.FOCUS_FIELD) {
        const { fieldName, sectionType } = suggestion;
        if (!fieldName) return;

        const elementRef =
          documentBuilderStore.getFieldRefByFieldNameAndSection(
            fieldName,
            sectionType,
          );
        if (!elementRef) return;

        scrollToCenterAndFocus(elementRef);
      }

      if (suggestion.actionType === SUGGESTION_ACTION_TYPES.ADD_ITEM) {
        // TODO:
      }

      if (suggestion.actionType === SUGGESTION_ACTION_TYPES.ADD_SECTION) {
        // TODO:
      }
    };

    return (
      <motion.button
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        onClick={handleSuggestionClick}
      >
        <motion.span
          className="w-[2.5rem] h-max tabular-nums p-1 text-xs font-medium text-white bg-green-500 rounded-md"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          +{suggestion.scoreValue}%
        </motion.span>
        <motion.span
          className="text-sm font-medium"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {suggestion.label}
        </motion.span>
      </motion.button>
    );
  },
);

export default ResumeScoreSuggestionItem;
