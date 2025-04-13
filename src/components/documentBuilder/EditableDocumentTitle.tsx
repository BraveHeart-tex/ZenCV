'use client';
import { action } from 'mobx';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import { observer } from 'mobx-react-lite';
import RenameDocumentDialog from '../appHome/documents/RenameDocumentDialog';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { PencilIcon } from 'lucide-react';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

const EditableDocumentTitle = observer(() => {
  const [open, setOpen] = useState(false);
  const documentTitle = builderRootStore.documentStore.document?.title || '';

  const handleRename = action(async (enteredTitle: string) => {
    try {
      await builderRootStore.documentStore.renameDocument(enteredTitle);
      showSuccessToast('Document renamed successfully.');
      setOpen(false);
    } catch (error) {
      console.error(error);
      showErrorToast(
        'An error occurred while renaming the document. Please try again.',
      );
    }
  });

  return (
    <div className="flex items-center gap-2 max-w-[95%]">
      <h1 className="scroll-m-20 first:mt-0 md:text-3xl overflow-hidden text-2xl font-semibold tracking-tight truncate">
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
