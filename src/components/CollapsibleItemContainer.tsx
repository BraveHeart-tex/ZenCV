'use client';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import * as motion from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
// import type { FIELD_DND_INDEX_PREFIX } from '@/lib/constants';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
import { PopoverClose } from '@radix-ui/react-popover';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  EllipsisIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import { GripVertical } from 'lucide-react';
import type React from 'react';
import { useMedia } from 'react-use';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { observer } from 'mobx-react-lite';

interface CollapsibleSectionItemContainerProps {
  // id: `${FIELD_DND_INDEX_PREFIX}-${number}`;
  triggerTitle?: string;
  triggerDescription?: string;
  children: React.ReactNode;
  itemId: number;
}

const CollapsibleSectionItemContainer = observer(
  ({
    triggerTitle,
    triggerDescription,
    children,
    itemId,
    // id,
  }: CollapsibleSectionItemContainerProps) => {
    const open = itemId === documentBuilderStore.collapsedItemId;

    const isMobileOrTablet = useMedia('(max-width: 1024px)', false);
    // const {
    //   attributes,
    //   listeners,
    //   setNodeRef,
    //   transform,
    //   transition,
    //   isDragging,
    //   isOver,
    //   isSorting,
    // } = useSortable({ id });

    // const shouldShowDeleteButton =
    //   !isDragging && !isOver && !isSorting;
    // const shouldShowDragButton = !isDragging && !isOver && !isSorting;

    const shouldShowDeleteButton = true;
    const shouldShowDragButton = true;

    const handleDeleteItemClick = () => {};

    return (
      <div
        className="group relative w-full mt-4"
        // ref={setNodeRef}
        // style={{
        //   transition,
        //   transform: CSS.Translate.toString(transform),
        // }}
        // {...attributes}
      >
        {shouldShowDragButton ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-grab lg:pointer-events-none lg:group-hover:pointer-events-auto lg:opacity-0 lg:group-hover:opacity-100 absolute -left-7 lg:-left-8 top-[19px] z-10 w-8 h-8 text-muted-foreground transition-all"
                  /*{...listeners}*/
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
                  // if (isDragging || isSorting || isOver) return;
                  documentBuilderStore.toggleItem(itemId);
                }}
              >
                <div
                  className={cn(
                    'flex flex-col min-h-9',
                    !triggerDescription && 'justify-center',
                  )}
                >
                  <span className="max-w-full truncate">{triggerTitle}</span>
                  <span
                    className={cn(
                      'text-xs text-muted-foreground opacity-100 transition-all ease-in',
                      !triggerDescription && 'opacity-0',
                    )}
                  >
                    {triggerDescription}
                  </span>
                </div>
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
                        onClick={() => documentBuilderStore.toggleItem(itemId)}
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
                      <Button className="w-full rounded-none">Cancel</Button>
                    </PopoverClose>
                  </PopoverContent>
                </Popover>
              ) : (
                <ChevronDownIcon
                  onClick={() => documentBuilderStore.toggleItem(itemId)}
                  className={cn(
                    'mr-2 group-hover:text-primary text-muted-foreground transition-all cursor-pointer',
                    open ? 'rotate-180' : 'rotate-0',
                  )}
                />
              )}
            </div>
          </div>
          <AnimatePresence initial={false}>
            {open && !isMobileOrTablet && (
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
        </motion.div>
        {shouldShowDeleteButton ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={
                    'hidden absolute -right-9 top-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all text-muted-foreground ease-out lg:flex'
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
        {isMobileOrTablet ? (
          <Sheet
            open={open}
            onOpenChange={() => {
              documentBuilderStore.toggleItem(itemId);
            }}
          >
            <SheetContent className="min-w-full">
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
                  {triggerTitle}
                </SheetTitle>
                <SheetDescription>
                  {triggerDescription || '(Not Specified)'}
                </SheetDescription>
              </SheetHeader>
              <div className={cn('mt-4')}>{children}</div>
              <SheetFooter className="mt-4">
                <Button onClick={() => documentBuilderStore.toggleItem(itemId)}>
                  Done
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ) : null}
      </div>
    );
  },
);

export default CollapsibleSectionItemContainer;
