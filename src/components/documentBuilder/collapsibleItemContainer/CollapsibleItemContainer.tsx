import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PopoverClose } from '@radix-ui/react-popover';
import {
  ChevronDownIcon,
  EllipsisIcon,
  GripVertical,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useEffect } from 'react';
import { useMedia } from 'react-use';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { showSuccessToast } from '@/components/ui/sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ItemId } from '@/lib/builderDocument/builderDocument';
import { handleEditorPreferenceChange } from '@/lib/client-db/userSettingsService';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';
import { cn, getItemContainerId } from '@/lib/utils/stringUtils';
import { CollapsibleItemHeader } from './CollapsibleItemHeader';
import { CollapsibleItemMobileContent } from './CollapsibleItemMobileContent';
import { getCollapsibleItemContent } from './getCollapsibleItemContent';

interface CollapsibleSectionItemContainerProps {
  children: React.ReactNode;
  itemId: ItemId;
}

export const CollapsibleSectionItemContainer = observer(
  ({ children, itemId }: CollapsibleSectionItemContainerProps) => {
    const isMobileOrTablet = useMedia('(max-width: 1024px)', false);
    const open = builderSession.UIStore.isItemOpen(itemId);
    const entryTitle = getCollapsibleItemContent(itemId).title;
    const entryItem = builderSession.getItem(itemId);
    const entrySection = entryItem
      ? builderSession.getSection(entryItem.sectionId)
      : undefined;
    const entryNumber = (entrySection?.itemIds.indexOf(itemId) ?? 0) + 1;
    const entryLabel = `${entryTitle}, ${entrySection?.title ?? 'entry'} ${entryNumber}`;

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
      if (!open) {
        return;
      }
      if (window.innerWidth < 768) {
        return;
      }

      builderSession.UIStore.focusFirstFieldInItem(itemId);
    }, [open, itemId]);

    const shouldShowDeleteButton = !isDragging && !isOver && !isSorting;

    const handleDeleteItemClick = action(async () => {
      const shouldNotAskForConfirmation =
        !userSettingsStore.editorPreferences.askBeforeDeletingItem;

      if (shouldNotAskForConfirmation) {
        if (await builderSession.removeItem(itemId)) {
          showSuccessToast('Entry deleted successfully.');
        }
        return;
      }

      confirmDialogStore.showDialog({
        title: 'Are you sure you want to delete this entry?',
        message: 'This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          if (await builderSession.removeItem(itemId)) {
            showSuccessToast('Entry deleted successfully.');
          }

          runInAction(() => {
            confirmDialogStore.hideDialog();
          });

          handleEditorPreferenceChange(
            'askBeforeDeletingItem',
            !confirmDialogStore.doNotAskAgainChecked
          );
        },
        doNotAskAgainEnabled: true,
      });
    });

    return (
      <>
        <div
          className={cn(
            'group relative w-full border-t border-border/75',
            isDragging && 'max-h-68 overflow-hidden'
          )}
          ref={(ref) => {
            setNodeRef(ref);
            builderSession.UIStore.setElementRef(
              getItemContainerId(itemId),
              ref
            );
          }}
          style={{
            transition,
            transform: CSS.Translate.toString(transform),
          }}
          id={getItemContainerId(itemId)}
        >
          {isMobileOrTablet ? (
            <div className='absolute top-0 left-0 z-10'>
              <Button
                variant='ghost'
                size='icon'
                aria-label={`Drag ${entryLabel}`}
                className='cursor-grab touch-none size-11'
                {...attributes}
                {...listeners}
              >
                <GripVertical />
              </Button>
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label={`Drag ${entryLabel}`}
                    className='absolute -left-7 top-4 z-10 h-9 w-9 cursor-grab text-muted-foreground/70 transition-[background-color,color,opacity] duration-150 ease-out hover:text-foreground lg:-left-8 lg:opacity-60 lg:hover:opacity-100'
                    {...attributes}
                    {...listeners}
                  >
                    <GripVertical />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Click and drag to move</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <div className={cn('flex w-full flex-col py-1', open && 'max-h-max')}>
            <div className='flex items-center justify-center w-full h-full'>
              <div className='group flex items-center justify-between w-full h-full'>
                <Button
                  variant='ghost'
                  className={cn(
                    'hover:bg-secondary/40 hover:text-foreground flex min-h-14 w-full items-center justify-start py-3 text-left bg-transparent',
                    open && 'bg-secondary/50 hover:bg-secondary/50',
                    isMobileOrTablet && 'pl-12'
                  )}
                  aria-expanded={open}
                  onClick={() => {
                    if (isDragging || isSorting || isOver) {
                      return;
                    }
                    builderSession.UIStore.toggleItem(itemId);
                  }}
                >
                  <CollapsibleItemHeader itemId={itemId} />
                </Button>
                {isMobileOrTablet ? (
                  <Popover>
                    <PopoverTrigger
                      aria-label={`Open actions for ${entryLabel}`}
                      className='flex size-11 shrink-0 items-center justify-center'
                    >
                      <EllipsisIcon className='group mr-2 text-muted-foreground transition-all motion-reduce:transition-none' />
                    </PopoverTrigger>
                    <PopoverContent className='p-0'>
                      <div className='flex flex-col'>
                        <Button
                          variant='ghost'
                          className='flex min-h-11 w-full items-center justify-start gap-2 rounded-none border-b py-3'
                          onClick={() =>
                            builderSession.UIStore.toggleItem(itemId)
                          }
                        >
                          <PencilIcon className='text-primary' size={18} />
                          <span className='text-sm'>Edit</span>
                        </Button>
                        <Button
                          variant='ghost'
                          className='flex min-h-11 w-full items-center justify-start gap-2 py-3'
                          onClick={handleDeleteItemClick}
                        >
                          <TrashIcon className='text-primary' size={18} />
                          <span className='text-sm'>Delete</span>
                        </Button>
                      </div>
                      <PopoverClose asChild>
                        <Button className='w-full'>Cancel</Button>
                      </PopoverClose>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label={`${open ? 'Collapse' : 'Expand'} entry: ${entryLabel}`}
                    aria-expanded={open}
                    tabIndex={-1}
                    onClick={() => builderSession.UIStore.toggleItem(itemId)}
                    className={cn(
                      'mr-2 text-muted-foreground transition-all motion-reduce:transition-none group-hover:text-primary',
                      open ? '[&_svg]:rotate-180' : '[&_svg]:rotate-0'
                    )}
                  >
                    <ChevronDownIcon className='transition-transform motion-reduce:transition-none' />
                  </Button>
                )}
              </div>
            </div>
            {!isMobileOrTablet && open ? (
              <div className='grid grid-cols-1 gap-x-4 gap-y-5 px-3 pb-5 pt-1 sm:grid-cols-2 sm:px-4'>
                {children}
              </div>
            ) : null}
          </div>
          {shouldShowDeleteButton ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={
                      'absolute -right-9 top-4 hidden opacity-60 transition-[background-color,color,opacity] duration-150 ease-out hover:opacity-100 lg:flex'
                    }
                    onClick={handleDeleteItemClick}
                    size='icon'
                    variant='ghost'
                    aria-label={`Delete ${entryLabel}`}
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
  }
);
