import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { DEX_Item } from '@/lib/client-db/clientDbSchema';
import { getTriggerContent } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface CollapsibleItemMobileContentProps {
  itemId: DEX_Item['id'];
  children: React.ReactNode;
}

export const CollapsibleItemMobileContent = observer(
  ({ itemId, children }: CollapsibleItemMobileContentProps) => {
    const open = itemId === builderRootStore.UIStore.collapsedItemId;
    const { title, description } = getTriggerContent(itemId);

    return (
      <Drawer
        open={open}
        onOpenChange={() => {
          builderRootStore.UIStore.toggleItem(itemId);
        }}
      >
        <DrawerContent className='max-h-[98%] overflow-hidden px-0 w-full'>
          <DrawerHeader className='flex-shrink-0'>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>
              {description || '(Not Specified)'}
            </DrawerDescription>
          </DrawerHeader>
          <div className='flex-1 w-full h-full px-4 py-2 space-y-4 overflow-y-auto'>
            {children}
          </div>
          <DrawerFooter className='flex-shrink-0'>
            <Button onClick={() => builderRootStore.UIStore.toggleItem(itemId)}>
              Done
            </Button>
            <DrawerClose asChild>
              <Button variant='outline'>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
);
