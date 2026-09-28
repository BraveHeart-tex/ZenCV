import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { persistedTypeForSectionKey } from '@/lib/builderDocument/builderDocument';
import { snapshotSection } from '@/lib/builderDocument/resumeDocumentSnapshot';
import {
  getTextColorForBackground,
  scrollItemIntoView,
} from '@/lib/helpers/documentBuilderHelpers';
import { scrollToCenterAndFocus } from '@/lib/helpers/domHelpers';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import {
  OTHER_SECTION_OPTIONS,
  SUGGESTION_ACTION_TYPES,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { ResumeSuggestion } from '@/lib/types/documentBuilder.types';
import { AnimatedSuggestionButton } from './AnimatedSuggestionButton';

const scoreValueBgColor = '#388e3c'; // Green
const scoreValueTextColor = getTextColorForBackground(scoreValueBgColor);

interface ResumeScoreSuggestionItemProps {
  suggestion: ResumeSuggestion;

  setOpen: (open: boolean) => void;
}

export const ResumeScoreSuggestionItem = observer(
  ({ suggestion, setOpen }: ResumeScoreSuggestionItemProps) => {
    const handleSuggestionClick = action(async () => {
      setOpen(false);
      if (suggestion.actionType === SUGGESTION_ACTION_TYPES.FOCUS_FIELD) {
        const { fieldKey, sectionKey } = suggestion;
        if (!fieldKey) {
          return;
        }

        const elementRef = builderSession.UIStore.getFieldRefBySemanticKey(
          sectionKey,
          fieldKey
        );

        if (!elementRef) {
          console.warn(
            `No element ref found for field ${fieldKey} in section ${sectionKey}`
          );
          return;
        }

        scrollToCenterAndFocus(elementRef);
        return;
      }

      if (suggestion.actionType === SUGGESTION_ACTION_TYPES.ADD_ITEM) {
        const document = builderSession.document;
        const section = document?.section(suggestion.sectionKey);

        if (!section) {
          const sectionOption = OTHER_SECTION_OPTIONS.find(
            (sectionOption) =>
              sectionOption.type ===
              persistedTypeForSectionKey(suggestion.sectionKey)
          );
          if (!sectionOption) {
            return;
          }

          const result = await document?.addSection(sectionOption);
          const itemId = result?.success ? result.data?.itemId : undefined;

          if (itemId) {
            scrollItemIntoView(itemId);
          }
          return;
        }

        const semanticItems = snapshotSection(
          builderSession.resumeDocumentSnapshot,
          suggestion.sectionKey
        )?.items;
        const firstEmptyItemId = semanticItems
          ?.filter((item) =>
            Object.values(item.values).every((value) => !value)
          )
          .toSorted((a, b) => a.displayOrder - b.displayOrder)[0]?.id;
        const firstEmptySectionItem = firstEmptyItemId
          ? section.items.find((item) => item.id === firstEmptyItemId)
          : undefined;

        if (firstEmptySectionItem) {
          scrollItemIntoView(firstEmptySectionItem.id);
          return;
        }

        const addedItemId = await builderSession.addItem(section.id);
        if (!addedItemId) {
          return;
        }

        scrollItemIntoView(addedItemId);
        return;
      }
    });

    return (
      <AnimatedSuggestionButton
        label={suggestion.label}
        onClick={handleSuggestionClick}
        scoreValue={suggestion.scoreValue}
        scoreValueBgColor={scoreValueBgColor}
        scoreValueTextColor={scoreValueTextColor}
      />
    );
  }
);
