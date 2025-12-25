'use client';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { DEX_Item } from '@/lib/client-db/clientDbSchema';
import {
  getTextColorForBackground,
  scrollItemIntoView,
} from '@/lib/helpers/documentBuilderHelpers';
import { scrollToCenterAndFocus } from '@/lib/helpers/domHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
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
        const { fieldName, sectionType } = suggestion;
        if (!fieldName) return;

        const elementRef =
          builderRootStore.UIStore.getFieldRefByFieldNameAndSection(
            fieldName,
            sectionType
          );

        if (!elementRef) {
          console.warn(
            `No element ref found for field ${fieldName} in section ${sectionType}`
          );
          return;
        }

        scrollToCenterAndFocus(elementRef);
        return;
      }

      if (suggestion.actionType === SUGGESTION_ACTION_TYPES.ADD_ITEM) {
        const section = builderRootStore.sectionStore.sections.find(
          (section) => section.type === suggestion.sectionType
        );

        if (!section) {
          const sectionOption = OTHER_SECTION_OPTIONS.find(
            (sectionOption) => sectionOption.type === suggestion.sectionType
          );
          if (!sectionOption) return;

          const result =
            await builderRootStore.sectionStore.addNewSection(sectionOption);
          const itemId = result?.itemId;

          if (itemId) {
            scrollItemIntoView(itemId);
          }
          return;
        }

        const firstEmptySectionItem = builderRootStore.itemStore.items
          .filter((item) => item.sectionId === section.id)
          .reduce(
            (best, item) => {
              const fields = builderRootStore.fieldStore.getFieldsByItemId(
                item.id
              );
              if (fields.every((field) => !field.value)) {
                return !best || item.displayOrder < best?.displayOrder
                  ? item
                  : best;
              }
              return best;
            },
            null as DEX_Item | null
          );

        if (firstEmptySectionItem) {
          scrollItemIntoView(firstEmptySectionItem.id);
          return;
        }

        const addedItemId = await builderRootStore.itemStore.addNewItemEntry(
          section.id
        );
        if (!addedItemId) return;

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
