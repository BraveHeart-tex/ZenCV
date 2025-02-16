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

type EmotionIconExpression = ComponentProps<
  typeof SmoothEmotionIcon
>['expression'];

interface EmotionRange {
  expression: EmotionIconExpression;
  min: number;
  max: number;
}

const summaryEmotionRanges: EmotionRange[] = [
  { expression: 'sad', min: 0, max: 99 },
  { expression: 'neutral', min: 100, max: 398 },
  { expression: 'happy', min: 399, max: 599 },
  { expression: 'neutral', min: 600, max: Infinity },
];

const workExperienceEmotionRanges: EmotionRange[] = [
  { expression: 'sad', min: 0, max: 99 },
  { expression: 'neutral', min: 100, max: 198 },
  { expression: 'happy', min: 199, max: Infinity },
];

const getExpression = (
  value: string,
  ranges: EmotionRange[],
): EmotionIconExpression => {
  const length = value.trim().length;
  const found = ranges.find(
    (range) => length >= range.min && length <= range.max,
  );
  return found ? found.expression : 'neutral';
};

const RichTextCharacterCounter = observer(
  ({ fieldValue, itemId }: RichTextCharacterCounterProps) => {
    const sectionType = getSectionTypeByItemId(itemId);

    if (!sectionType || !SECTIONS_WITH_RICH_TEXT_AI.has(sectionType)) {
      return null;
    }

    const trimmedValue = removeHTMLTags(fieldValue);

    const renderCounter = () => {
      if (sectionType === INTERNAL_SECTION_TYPES.SUMMARY) {
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
                  <SmoothEmotionIcon
                    expression={getExpression(
                      trimmedValue,
                      summaryEmotionRanges,
                    )}
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      }

      if (
        sectionType === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE ||
        sectionType === INTERNAL_SECTION_TYPES.INTERNSHIPS
      ) {
        return (
          <div className="flex items-center justify-between w-full gap-8 pt-1 text-sm">
            <p className="text-muted-foreground lg:inline hidden">
              Write 200+ characters for better interview chances
            </p>
            <div className="flex items-center ml-auto">
              <p
                className={cn(
                  'transition-[padding-right] duration-300 ease',
                  trimmedValue.length > 0 && 'pr-1',
                )}
              >
                <span className="text-foreground">{trimmedValue.length}</span>{' '}
                <span className="text-muted-foreground"> / 200+</span>
              </p>
              <div className="h-[1.75rem]">
                {trimmedValue.length > 0 ? (
                  <SmoothEmotionIcon
                    expression={getExpression(
                      trimmedValue,
                      workExperienceEmotionRanges,
                    )}
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      }

      return null;
    };

    return <div className="w-full">{renderCounter()}</div>;
  },
);

export default RichTextCharacterCounter;
