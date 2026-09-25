import { observer } from 'mobx-react-lite';
import {
  type ItemId,
  WorkExperienceItemModel,
} from '@/lib/builderDocument/builderDocument';
import { getTriggerContent } from '@/lib/helpers/documentBuilderHelpers';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { cn } from '@/lib/utils/stringUtils';

export const CollapsibleItemHeader = observer(
  ({ itemId }: { itemId: ItemId }) => {
    const item = builderSession.getItem(itemId);
    const workExperienceEntry =
      item instanceof WorkExperienceItemModel ? item.entry : undefined;
    const { title, description } = workExperienceEntry
      ? {
          title: workExperienceEntry.heading,
          description: workExperienceEntry.dateDescription,
        }
      : getTriggerContent(itemId);
    return (
      <div
        className={cn(
          'flex flex-col min-h-9 max-w-[18rem] sm:max-w-full overflow-hidden',
          !description && 'justify-center'
        )}
      >
        <span className='max-w-full text-left wrap-break-word whitespace-normal'>
          {title}
        </span>
        <span
          className={cn(
            'text-xs text-muted-foreground opacity-100 transition-all ease-in whitespace-normal wrap-break-word text-left',
            !description && 'opacity-0'
          )}
        >
          {description}
        </span>
      </div>
    );
  }
);
