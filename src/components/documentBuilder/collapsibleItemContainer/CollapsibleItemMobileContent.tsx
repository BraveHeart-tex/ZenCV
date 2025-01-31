import { DEX_Item } from '@/lib/client-db/clientDbSchema';
import { getTriggerContent } from '@/lib/helpers/documentBuilderHelpers';
import { observer } from 'mobx-react-lite';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { ArrowLeftIcon } from 'lucide-react';

interface CollapsibleItemMobileContentProps {
  itemId: DEX_Item['id'];
  children: React.ReactNode;
}

const CollapsibleItemMobileContent = observer(
  ({ itemId, children }: CollapsibleItemMobileContentProps) => {
    const open = itemId === documentBuilderStore.collapsedItemId;
    const { title, description } = getTriggerContent(itemId);

    // TODO: Will convert this to a drawer for better UX
    return (
      <Sheet
        open={open}
        onOpenChange={() => {
          documentBuilderStore.toggleItem(itemId);
        }}
      >
        <SheetContent className="w-full max-w-full! sm:max-w-full overflow-auto">
          <SheetHeader className="items-center space-y-1">
            <SheetTitle>
              <Button
                className="top-1 left-1 size-8 absolute"
                onClick={() => documentBuilderStore.toggleItem(itemId)}
                size="icon"
                variant="secondary"
              >
                <ArrowLeftIcon />
              </Button>
              {title}
            </SheetTitle>
            <SheetDescription>
              {description || '(Not Specified)'}
            </SheetDescription>
          </SheetHeader>

          <div className={'mt-4 space-y-4  overflow-auto'}>
            {children}
            <SheetFooter className="mt-4">
              <Button onClick={() => documentBuilderStore.toggleItem(itemId)}>
                Done
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  },
);
export default CollapsibleItemMobileContent;
