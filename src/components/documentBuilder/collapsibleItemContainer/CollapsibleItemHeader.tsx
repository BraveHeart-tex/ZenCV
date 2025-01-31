import { DEX_Item } from '@/lib/client-db/clientDbSchema';
import { getTriggerContent } from '@/lib/helpers/documentBuilderHelpers';
import { cn } from '@/lib/utils/stringUtils';
import { observer } from 'mobx-react-lite';

const CollapsibleItemHeader = observer(
  ({ itemId }: { itemId: DEX_Item['id'] }) => {
    const { title, description } = getTriggerContent(itemId);
    return (
      <div
        className={cn(
          'flex flex-col min-h-9 max-w-[18rem] sm:max-w-full overflow-hidden',
          !description && 'justify-center',
        )}
      >
        <span className="max-w-full text-left break-words whitespace-normal">
          {title}
        </span>
        <span
          className={cn(
            'text-xs text-muted-foreground opacity-100 transition-all ease-in whitespace-normal break-words text-left',
            !description && 'opacity-0',
          )}
        >
          {description}
        </span>
      </div>
    );
  },
);

export default CollapsibleItemHeader;
