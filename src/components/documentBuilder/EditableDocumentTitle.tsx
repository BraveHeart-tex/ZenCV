'use client';
import { FormEvent, useRef, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { action } from 'mobx';
import { CornerDownLeftIcon, PencilIcon } from 'lucide-react';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/stringUtils';

const EditableDocumentTitle = observer(() => {
  const documentTitle = documentBuilderStore.document?.title || '';

  const [enteredTitle, setEnteredTitle] = useState(documentTitle);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRename = action(async (event: FormEvent) => {
    event.preventDefault();
    if (!enteredTitle.replaceAll(' ', '').length) {
      showErrorToast('Please enter a new name for the document.');
      inputRef?.current?.focus();
      return;
    }

    await documentBuilderStore.renameDocument(enteredTitle);
    showSuccessToast('Document renamed successfully.');
    setIsRenameDialogOpen(false);
  });

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setEnteredTitle(documentTitle);
                  setIsRenameDialogOpen(true);
                }}
              >
                <PencilIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rename document</TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogDescription>
              Enter a new name for &quot;{documentTitle}&quot;
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRename} className="space-y-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="newDocumentTitle">New Document Title</Label>
              <div className="relative">
                <Input
                  id="newDocumentTitle"
                  type="text"
                  minLength={1}
                  required
                  value={enteredTitle}
                  onChange={(e) => setEnteredTitle(e.target.value)}
                  aria-invalid={enteredTitle ? 'false' : 'true'}
                  ref={inputRef}
                  className={cn(
                    'pr-10',
                    !enteredTitle &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <CornerDownLeftIcon className="top-1/2 right-2 bg-muted text-muted-foreground absolute p-1 -translate-y-1/2 rounded-md" />
              </div>
              {!enteredTitle && (
                <p className="text-destructive text-xs font-medium">
                  Please enter a document title
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
                aria-label="Rename"
                disabled={!enteredTitle}
              >
                Rename
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <h1 className="scroll-m-20 first:mt-0 flex-1 text-3xl font-semibold tracking-tight">
        {documentTitle}
      </h1>
    </div>
  );
});

export default EditableDocumentTitle;
