import { PencilIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { RenameDocumentDialog } from '../appHome/documents/RenameDocumentDialog';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export const EditableDocumentTitle = observer(() => {
  const [open, setOpen] = useState(false);
  const documentTitle = builderRootStore.documentStore.document?.title || '';

  const handleRename = action(async (enteredTitle: string) => {
    try {
      const result =
        await builderRootStore.documentStore.renameDocument(enteredTitle);
      if (!result.success) {
        showErrorToast(result.error);
        return;
      }
      showSuccessToast('Document renamed successfully.');
      setOpen(false);
    } catch (error) {
      console.error(error);
      showErrorToast(
        'An error occurred while renaming the document. Please try again.'
      );
    }
  });

  return (
    <div className='flex min-w-0 max-w-full items-center gap-1.5 md:gap-2'>
      <h1 className='scroll-m-20 min-w-0 truncate text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl'>
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
                aria-label='Rename document'
                className='size-9 shrink-0'
                size='icon'
                variant='ghost'
                onClick={() => {
                  setOpen(true);
                }}
              >
                <PencilIcon aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rename document</TooltipContent>
          </Tooltip>
        }
      />
    </div>
  );
});
