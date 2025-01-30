'use client';
import { action } from 'mobx';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import RenameDocumentDialog from '../appHome/documents/RenameDocumentDialog';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { PencilIcon } from 'lucide-react';

const EditableDocumentTitle = observer(() => {
  const [open, setOpen] = useState(false);
  const documentTitle = documentBuilderStore.document?.title || '';

  const handleRename = action(async (enteredTitle: string) => {
    try {
      await documentBuilderStore.renameDocument(enteredTitle);
      showSuccessToast('Document renamed successfully.');
    } catch (error) {
      console.error(error);
      showErrorToast(
        'An error occurred while renaming the document. Please try again.',
      );
    }
  });

  return (
    <div className="flex items-center gap-2">
      <h1 className="scroll-m-20 first:mt-0 md:text-3xl text-2xl font-semibold tracking-tight">
        {documentTitle}
      </h1>
      <RenameDocumentDialog
        isOpen={open}
        onOpenChange={setOpen}
        defaultTitle={documentTitle}
        onSubmit={handleRename}
        trigger={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <PencilIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rename document</TooltipContent>
          </Tooltip>
        }
      />
    </div>
  );
});

export default EditableDocumentTitle;
