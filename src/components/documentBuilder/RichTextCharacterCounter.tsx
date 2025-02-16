import { observer } from 'mobx-react-lite';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { getSectionTypeByItemId } from '@/lib/helpers/documentBuilderHelpers';
import {
  INTERNAL_SECTION_TYPES,
  SECTIONS_WITH_RICH_TEXT_AI,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { cn, removeHTMLTags } from '@/lib/utils/stringUtils';
import SmoothEmotionIcon from '@/components/misc/SmoothEmotionIcon';
import type { ComponentProps } from 'react';

interface RichTextCharacterCounterProps {
  fieldValue: DEX_Field['value'];
  itemId: DEX_Field['itemId'];
}

const RichTextCharacterCounter = observer(
  ({ fieldValue, itemId }: RichTextCharacterCounterProps) => {
    const sectionType = getSectionTypeByItemId(itemId);

    if (!sectionType || !SECTIONS_WITH_RICH_TEXT_AI.has(sectionType)) {
      return null;
    }

    const renderCounter = () => {
      if (sectionType === INTERNAL_SECTION_TYPES.SUMMARY) {
        const trimmedValue = removeHTMLTags(fieldValue);

        const getExpression = (): ComponentProps<
          typeof SmoothEmotionIcon
        >['expression'] => {
          if (trimmedValue.length < 100) {
            return 'sad';
          }
          if (trimmedValue.length < 399) {
            return 'neutral';
          }
          if (trimmedValue.length < 600) {
            return 'happy';
          }
          return 'neutral';
        };

        return (
          <div className="flex items-center justify-between w-full gap-8 pt-1 text-sm">
            <p className="text-muted-foreground lg:inline hidden">
              Keep it between 400-600 characters for better interview chances.
            </p>

            <div className="flex items-center ml-auto">
              <p
                className={cn(
                  'transition-[padding-right] duration-300 ease',
                  trimmedValue.length > 0 && 'pr-1',
                )}
              >
                <span className="text-foreground">{trimmedValue.length}</span>{' '}
                <span className="text-muted-foreground"> / 600</span>
              </p>
              <div className="h-[1.75rem]">
                {trimmedValue.length > 0 ? (
                  <SmoothEmotionIcon expression={getExpression()} />
                ) : null}
              </div>
            </div>
          </div>
        );
      }

      if (sectionType === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE) {
        return <></>;
      }

      if (sectionType === INTERNAL_SECTION_TYPES.INTERNSHIPS) {
        return <></>;
      }

      return null;
    };

    return <div className="w-full">{renderCounter()}</div>;
  },
);

export default RichTextCharacterCounter;
