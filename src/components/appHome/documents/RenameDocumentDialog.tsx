'use client';
import { observer } from 'mobx-react-lite';
import { type FormEvent, type ReactNode, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResponsiveDialog } from '@/components/ui/ResponsiveDialog';
import { showErrorToast, showInfoToast } from '@/components/ui/sonner';
import { dialogFooterClassNames } from '@/lib/constants';
import { cn } from '@/lib/utils/stringUtils';

interface RenameDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  defaultTitle: string;
  trigger?: ReactNode;
  renderTrigger?: (openDialog: () => void) => ReactNode;
  onSubmit: (enteredTitle: string) => void;
}

export const RenameDocumentDialog = observer(
  ({
    isOpen,
    onOpenChange = () => {},
    defaultTitle,
    onSubmit,
    trigger,
  }: RenameDocumentDialogProps) => {
    const [enteredTitle, setEnteredTitle] = useState(defaultTitle || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleRenameSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const normalizedTitle = enteredTitle.trim();
      if (!normalizedTitle) {
        showErrorToast('Please enter a name for the document.');
        setEnteredTitle('');
        inputRef.current?.focus();
        return;
      }

      if (normalizedTitle === defaultTitle) {
        showInfoToast('You made no changes to the title');
        return;
      }

      onSubmit(enteredTitle);
    };

    return (
      <ResponsiveDialog
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            setEnteredTitle(defaultTitle);
          }
          if (!open) {
            setEnteredTitle(defaultTitle);
          }
          onOpenChange(open);
        }}
        title='Rename Document'
        description={`Enter a new name for '${defaultTitle}'`}
        trigger={trigger}
        footer={
          <div className={dialogFooterClassNames}>
            <Button
              type='button'
              aria-label='Close rename dialog'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form='rename-document-form'
              aria-label='Rename'
              disabled={!enteredTitle}
            >
              Rename
            </Button>
          </div>
        }
      >
        <form
          onSubmit={handleRenameSubmit}
          id='rename-document-form'
          className='flex flex-col gap-1'
        >
          <Label htmlFor='newDocumentTitle'>New Document Title</Label>
          <Input
            id='newDocumentTitle'
            type='text'
            minLength={1}
            required
            value={enteredTitle}
            onChange={(e) => setEnteredTitle(e.target.value)}
            aria-invalid={enteredTitle ? 'false' : 'true'}
            ref={inputRef}
            className={cn(
              !enteredTitle &&
                'border-destructive focus-visible:ring-destructive'
            )}
          />
          {!enteredTitle && (
            <p className='text-destructive text-xs font-medium'>
              Please enter a document title
            </p>
          )}
        </form>
      </ResponsiveDialog>
    );
  }
);
