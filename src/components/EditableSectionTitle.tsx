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
import { CornerDownLeftIcon, PencilIcon } from 'lucide-react';
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

const EditableSectionTitle = observer(
  ({ sectionId }: { sectionId: number }) => {
    const section = documentBuilderStore.getSectionById(sectionId)!;

    return (
      <div className="flex items-center w-full gap-2">
        <RenameSectionDialog sectionId={sectionId} />
        <h2 className="scroll-m-20 flex-1 text-xl font-semibold tracking-tight">
          {section.title}
        </h2>
      </div>
    );
  },
);

const RenameSectionDialog = observer(({ sectionId }: { sectionId: number }) => {
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
});

export default EditableSectionTitle;
