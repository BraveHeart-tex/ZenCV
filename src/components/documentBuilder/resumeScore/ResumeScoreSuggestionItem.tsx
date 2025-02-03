'use client';
import * as motion from 'motion/react-m';
import { observer } from 'mobx-react-lite';
import {
  OTHER_SECTION_OPTIONS,
  SUGGESTION_ACTION_TYPES,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { scrollToCenterAndFocus } from '@/lib/helpers/domHelpers';
import { ResumeSuggestion } from '@/lib/types/documentBuilder.types';
import { Button } from '@/components/ui/button';
import { action } from 'mobx';
import { DEX_Item } from '@/lib/client-db/clientDbSchema';
import {
  getTextColorForBackground,
  scrollItemIntoView,
} from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

const scoreValueBgColor = '#388e3c'; // Green
const scoreValueTextColor = getTextColorForBackground(scoreValueBgColor);

interface ResumeScoreSuggestionItemProps {
  suggestion: ResumeSuggestion;

  setOpen: (open: boolean) => void;
}

const ResumeScoreSuggestionItem = observer(
  ({ suggestion, setOpen }: ResumeScoreSuggestionItemProps) => {
    const handleSuggestionClick = action(async () => {
      setOpen(false);
      if (suggestion.actionType === SUGGESTION_ACTION_TYPES.FOCUS_FIELD) {
        const { fieldName, sectionType } = suggestion;
        if (!fieldName) return;

        const elementRef =
          builderRootStore.UIStore.getFieldRefByFieldNameAndSection(
            fieldName,
            sectionType,
          );

        if (!elementRef) {
          console.warn(
            `No element ref found for field ${fieldName} in section ${sectionType}`,
          );
          return;
        }

        scrollToCenterAndFocus(elementRef);
        return;
      }

      if (suggestion.actionType === SUGGESTION_ACTION_TYPES.ADD_ITEM) {
        const section = builderRootStore.sectionStore.sections.find(
          (section) => section.type === suggestion.sectionType,
        );

        if (!section) {
          const sectionOption = OTHER_SECTION_OPTIONS.find(
            (sectionOption) => sectionOption.type === suggestion.sectionType,
          );
          if (!sectionOption) return;

          const result =
            await builderRootStore.sectionStore.addNewSection(sectionOption);
          const itemId = result?.itemId;

          if (itemId) {
            scrollItemIntoView(itemId, () => {
              builderRootStore.UIStore.focusFirstFieldInItem(itemId);
            });
          }
          return;
        }

        const firstEmptySectionItem = builderRootStore.itemStore.items
          .filter((item) => item.sectionId === section.id)
          .reduce(
            (best, item) => {
              const fields = builderRootStore.fieldStore.getFieldsByItemId(
                item.id,
              );
              if (fields.every((field) => !field.value)) {
                return !best || item.displayOrder < best?.displayOrder
                  ? item
                  : best;
              }
              return best;
            },
            null as DEX_Item | null,
          );

        if (firstEmptySectionItem) {
          scrollItemIntoView(firstEmptySectionItem.id, () => {
            builderRootStore.UIStore.focusFirstFieldInItem(
              firstEmptySectionItem.id,
            );
          });
          return;
        }

        const addedItemId = await builderRootStore.itemStore.addNewItemEntry(
          section.id,
        );
        if (!addedItemId) return;

        scrollItemIntoView(addedItemId, () => {
          builderRootStore.UIStore.focusFirstFieldInItem(addedItemId);
        });
        return;
      }
    });

    return (
      <Button
        size="sm"
        asChild
        variant="ghost"
        className="justify-start p-0 py-0"
      >
        <motion.button
          className="hover:bg-muted flex items-center gap-2 rounded-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
          onClick={handleSuggestionClick}
        >
          <motion.span
            className="w-[2.5rem] h-max p-1 text-xs rounded-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            style={{
              backgroundColor: scoreValueBgColor,
              color: scoreValueTextColor,
            }}
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
      </Button>
    );
  },
);

export default ResumeScoreSuggestionItem;
