'use client';
import { FormEvent, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CornerDownLeftIcon, PencilIcon, TrashIcon } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import { action } from 'mobx';
import { DELETABLE_INTERNAL_SECTION_TYPES } from '@/lib/constants';
import { confirmDialogStore } from '@/lib/confirmDialogStore';
import {
  getSectionDeleteConfirmationPreference,
  setSectionDeleteConfirmationPreference,
} from '@/lib/userSettings';
import { DEX_Section } from '@/lib/schema';

const EditableSectionTitle = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const section = documentBuilderStore.getSectionById(sectionId)!;

    const isSectionDeletable = DELETABLE_INTERNAL_SECTION_TYPES.includes(
      section.type as (typeof DELETABLE_INTERNAL_SECTION_TYPES)[number],
    );

    const handleDeleteSection = action(async () => {
      const shouldNotAskConfirmation =
        await getSectionDeleteConfirmationPreference();

      if (shouldNotAskConfirmation) {
        await documentBuilderStore.removeSection(sectionId);
        showSuccessToast('Section removed successfully.');
        return;
      }

      confirmDialogStore.showDialog({
        title: `Are you sure you want to delete "${section.title}"?`,
        message: 'This action cannot be undone',
        doNotAskAgainEnabled: true,
        onConfirm: async () => {
          const doNotAskAgain = confirmDialogStore.doNotAskAgainChecked;

          await documentBuilderStore.removeSection(sectionId);
          showSuccessToast('Section removed successfully.');

          if (doNotAskAgain) {
            await setSectionDeleteConfirmationPreference(doNotAskAgain);
          }

          confirmDialogStore.hideDialog();
        },
      });
    });

    return (
      <div className="group flex items-center w-full gap-2">
        <RenameSectionDialog sectionId={sectionId} />
        <h2 className="scroll-m-20 flex-1 text-xl font-semibold tracking-tight">
          {section.title}
        </h2>
        {isSectionDeletable && (
          <div className="lg:opacity-0 lg:-translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteSection}
                >
                  <TrashIcon size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete {`"${section.title}"`}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);

const RenameSectionDialog = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const [open, setOpen] = useState(false);
    const section = documentBuilderStore.getSectionById(sectionId)!;
    const [enteredTitle, setEnteredTitle] = useState(section.title || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleRenameSectionSubmit = action(async (event: FormEvent) => {
      event.preventDefault();
      if (!enteredTitle.replaceAll(' ', '').trim()) {
        showErrorToast('New section title cannot be empty.');
        inputRef?.current?.focus();
        return;
      }

      await documentBuilderStore.renameSection(sectionId, enteredTitle);
      showSuccessToast('Section renamed successfully');
      setOpen(false);
    });

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setEnteredTitle(section.title);
                  setOpen(true);
                }}
              >
                <PencilIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rename {`"${section.title}"`}</TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {`"${section.title}"`}</DialogTitle>
            <VisuallyHidden>
              <DialogDescription>
                Use the form below to rename the {`"${section.title}"`}{' '}
                {!section.title.includes('section') && 'section'}
              </DialogDescription>
            </VisuallyHidden>
          </DialogHeader>
          <form onSubmit={handleRenameSectionSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="newSectionTitle">New Section Title</Label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  id="newSectionTitle"
                  type="text"
                  minLength={1}
                  required
                  aria-invalid={enteredTitle ? 'false' : 'true'}
                  value={enteredTitle}
                  onChange={(event) => setEnteredTitle(event.target.value)}
                  className={cn(
                    'pr-10',
                    !enteredTitle &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <CornerDownLeftIcon className="top-1/2 right-2 bg-muted text-muted-foreground absolute p-1 -translate-y-1/2 rounded-md" />
              </div>
              {!enteredTitle && (
                <p className="text-destructive text-sm font-medium">
                  New section title cannot be empty
                </p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  aria-label="Close rename dialog"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                aria-label="Rename section"
                disabled={!enteredTitle}
              >
                Rename
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);

export default EditableSectionTitle;
