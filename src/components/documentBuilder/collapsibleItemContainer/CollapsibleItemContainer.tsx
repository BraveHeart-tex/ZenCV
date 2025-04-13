'use client';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import * as motion from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PopoverClose } from '@radix-ui/react-popover';
import {
  ChevronDownIcon,
  EllipsisIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import { GripVertical } from 'lucide-react';
import type React from 'react';
import { useMedia } from 'react-use';
import { observer } from 'mobx-react-lite';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { action, runInAction } from 'mobx';
import { showSuccessToast } from '@/components/ui/sonner';
import { DEX_Item } from '@/lib/client-db/clientDbSchema';
import { cn, getItemContainerId } from '@/lib/utils/stringUtils';
import CollapsibleItemHeader from './CollapsibleItemHeader';
import CollapsibleItemMobileContent from './CollapsibleItemMobileContent';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { useEffect } from 'react';
import userSettingsStore from '@/lib/stores/userSettingsStore';
import UserSettingsService from '@/lib/client-db/userSettingsService';

interface CollapsibleSectionItemContainerProps {
  children: React.ReactNode;
  itemId: DEX_Item['id'];
}

const CollapsibleSectionItemContainer = observer(
  ({ children, itemId }: CollapsibleSectionItemContainerProps) => {
    const isMobileOrTablet = useMedia('(max-width: 1024px)', false);
    const open = itemId === builderRootStore.UIStore.collapsedItemId;

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
      isOver,
      isSorting,
    } = useSortable({ id: itemId });

    useEffect(() => {
      if (!open) return;
      if (window.innerWidth < 768) return;

      builderRootStore.UIStore.focusFirstFieldInItem(itemId);
    }, [open, itemId]);

    const shouldShowDeleteButton = !isDragging && !isOver && !isSorting;
    const shouldShowDragButton = !isDragging && !isOver && !isSorting;

    const handleDeleteItemClick = action(async () => {
      const shouldNotAskForConfirmation =
        !userSettingsStore.editorPreferences.askBeforeDeletingItem;

      if (shouldNotAskForConfirmation) {
        await builderRootStore.itemStore.removeItem(itemId);
        showSuccessToast('Entry deleted successfully.');
        return;
      }

      confirmDialogStore.showDialog({
        title: 'Are you sure you want to delete this entry?',
        message: 'This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          await builderRootStore.itemStore.removeItem(itemId);
          showSuccessToast('Entry deleted successfully.');

          runInAction(() => {
            confirmDialogStore.hideDialog();
          });

          UserSettingsService.handleEditorPreferenceChange(
            'askBeforeDeletingItem',
            confirmDialogStore.doNotAskAgainChecked ? false : true,
          );
        },
        doNotAskAgainEnabled: true,
      });
    });

    return (
      <>
        <div
          className={cn(
            'group relative w-full',
            isDragging && 'max-h-[17rem] overflow-hidden',
          )}
          ref={(ref) => {
            setNodeRef(ref);
            builderRootStore.UIStore.setElementRef(
              getItemContainerId(itemId),
              ref,
            );
          }}
          style={{
            transition,
            transform: CSS.Translate.toString(transform),
          }}
          id={getItemContainerId(itemId)}
          {...attributes}
        >
          {shouldShowDragButton ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-grab lg:pointer-events-none lg:group-hover:pointer-events-auto lg:opacity-0 lg:group-hover:opacity-100 absolute -left-7 lg:-left-8 top-[19px] z-10 w-8 h-8 text-muted-foreground transition-all"
                    {...listeners}
                  >
                    <GripVertical />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Click and drag to move</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
          <motion.div
            className={cn(
              'rounded-md border flex flex-col transition-all w-full',
              open && 'max-h-max',
            )}
          >
            <div className="flex items-center justify-center w-full h-full">
              <div className="group flex items-center justify-between w-full h-full">
                <Button
                  variant="ghost"
                  className="hover:bg-transparent hover:text-primary flex items-center justify-start w-full h-full py-4 text-left bg-transparent"
                  onClick={() => {
                    if (isDragging || isSorting || isOver) return;
                    builderRootStore.UIStore.toggleItem(itemId);
                  }}
                >
                  <CollapsibleItemHeader itemId={itemId} />
                </Button>
                {isMobileOrTablet ? (
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisIcon className="group text-muted-foreground mr-2 transition-all" />
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start w-full gap-2 py-6 border-b rounded-none"
                          onClick={() =>
                            builderRootStore.UIStore.toggleItem(itemId)
                          }
                        >
                          <PencilIcon className="text-primary" size={18} />
                          <span className="text-sm">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start w-full gap-2 py-6"
                          onClick={handleDeleteItemClick}
                        >
                          <TrashIcon className="text-primary" size={18} />
                          <span className="text-sm">Delete</span>
                        </Button>
                      </div>
                      <PopoverClose asChild>
                        <Button className="w-full">Cancel</Button>
                      </PopoverClose>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <ChevronDownIcon
                    onClick={() => builderRootStore.UIStore.toggleItem(itemId)}
                    className={cn(
                      'mr-2 group-hover:text-primary text-muted-foreground transition-all cursor-pointer',
                      open ? 'rotate-180' : 'rotate-0',
                    )}
                  />
                )}
              </div>
            </div>
            {!isMobileOrTablet ? (
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        opacity: { duration: 0.15, delay: 0.15 },
                        width: { duration: 0.15 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        opacity: { duration: 0.15 },
                        width: { duration: 0.15, delay: 0.15 },
                      },
                    }}
                  >
                    <div className="grid grid-cols-2 gap-4 p-4">{children}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : null}
          </motion.div>
          {shouldShowDeleteButton ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={
                      'hidden absolute -right-9 top-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all ease-out lg:flex'
                    }
                    onClick={handleDeleteItemClick}
                    size="icon"
                    variant="ghost"
                  >
                    <TrashIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>

        {isMobileOrTablet ? (
          <CollapsibleItemMobileContent itemId={itemId}>
            {children}
          </CollapsibleItemMobileContent>
        ) : null}
      </>
    );
  },
);

export default CollapsibleSectionItemContainer;
