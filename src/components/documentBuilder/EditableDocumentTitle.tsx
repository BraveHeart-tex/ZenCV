import { PencilIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { showSuccessToast } from '@/components/ui/sonner';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { RenameDocumentDialog } from '../appHome/documents/RenameDocumentDialog';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export const EditableDocumentTitle = observer(() => {
  const [open, setOpen] = useState(false);
  const document = builderSession.document;
  const documentTitle = document?.title || '';

  const handleRename = action(async (enteredTitle: string) => {
    try {
      if (!document) {
        return false;
      }
      const result = await document.rename(enteredTitle);
      if (!result.success) {
        return false;
      }
      showSuccessToast('Resume renamed.');
      setOpen(false);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  return (
    <div className='flex min-w-0 max-w-full items-center gap-1.5 md:gap-2'>
      <h1 className='scroll-m-20 min-w-0 truncate text-base font-semibold tracking-tight sm:text-lg'>
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
                aria-label='Rename resume'
                className='size-8 shrink-0'
                size='icon'
                variant='ghost'
                onClick={() => {
                  setOpen(true);
                }}
              >
                <PencilIcon aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rename resume</TooltipContent>
          </Tooltip>
        }
      />
    </div>
  );
});
