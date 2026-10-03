import { observer } from 'mobx-react-lite';
import type { ItemId } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { SECTIONS_WITH_RICH_TEXT_CHARACTER_COUNTER } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { removeHTMLTags } from '@/lib/utils/stringUtils';

export const RichTextCharacterCounter = observer(
  ({
    enabled,
    fieldValue,
    itemId,
  }: {
    enabled: boolean;
    fieldValue: string;
    itemId: ItemId;
  }) => {
    const sectionKey = builderSession.getItem(itemId)?.sectionKey;
    if (
      !enabled ||
      !sectionKey ||
      !SECTIONS_WITH_RICH_TEXT_CHARACTER_COUNTER.has(sectionKey)
    ) {
      return null;
    }
    return (
      <div className='text-muted-foreground flex flex-wrap items-start justify-between gap-x-4 gap-y-1 pt-2 text-xs leading-5'>
        <p className='max-w-[48ch]'>
          {sectionKey === 'summary'
            ? 'Briefly describe your experience and what you bring to this role.'
            : 'Describe your contributions and results. Include specifics where useful.'}
        </p>
        <span className='ml-auto shrink-0 tabular-nums'>
          {removeHTMLTags(fieldValue).length} characters
        </span>
      </div>
    );
  }
);
