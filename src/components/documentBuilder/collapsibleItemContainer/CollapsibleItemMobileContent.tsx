import { DEX_Item } from '@/lib/client-db/clientDbSchema';
import { getTriggerContent } from '@/lib/helpers/documentBuilderHelpers';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface CollapsibleItemMobileContentProps {
  itemId: DEX_Item['id'];
  children: React.ReactNode;
}

const CollapsibleItemMobileContent = observer(
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
        <DrawerContent>
          <div className="flex flex-col h-[calc(100vh-4rem)]">
            <DrawerHeader className="items-center flex-shrink-0 space-y-1">
              <DrawerTitle>
                <Button
                  className="top-1 left-1 size-8 absolute"
                  onClick={() => builderRootStore.UIStore.toggleItem(itemId)}
                  size="icon"
                  variant="secondary"
                >
                  <XIcon />
                </Button>
                {title}
              </DrawerTitle>
              <DrawerDescription>
                {description || '(Not Specified)'}
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 px-4 space-y-4 overflow-y-auto">
              {children}
            </div>
            <DrawerFooter className="flex-shrink-0">
              <Button
                onClick={() => builderRootStore.UIStore.toggleItem(itemId)}
              >
                Done
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
);
export default CollapsibleItemMobileContent;
