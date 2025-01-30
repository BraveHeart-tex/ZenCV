'use client';
import { FormEvent, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { action } from 'mobx';
import { PencilIcon } from 'lucide-react';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/stringUtils';
import ResponsiveDialog from '../ui/ResponsiveDialog';
import { dialogFooterClassNames } from '@/lib/constants';

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
      <h1 className="scroll-m-20 first:mt-0 md:text-3xl text-2xl font-semibold tracking-tight">
        {documentTitle}
      </h1>
      <ResponsiveDialog
        title="Rename Document"
        description={`Enter a new name for '${documentTitle}'`}
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        trigger={
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
        }
      >
        <form onSubmit={handleRename} className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="newDocumentTitle">New Document Title</Label>
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
                !enteredTitle &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />
            {!enteredTitle && (
              <p className="text-destructive text-xs font-medium">
                Please enter a document title
              </p>
            )}
          </div>
          <div className={dialogFooterClassNames}>
            <Button
              type="button"
              aria-label="Close rename dialog"
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" aria-label="Rename" disabled={!enteredTitle}>
              Rename
            </Button>
          </div>
        </form>
      </ResponsiveDialog>
    </div>
  );
});

export default EditableDocumentTitle;
