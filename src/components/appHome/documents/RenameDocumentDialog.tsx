import { observer } from 'mobx-react-lite';
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResponsiveDialog } from '@/components/ui/ResponsiveDialog';
import { showInfoToast } from '@/components/ui/sonner';
import { dialogFooterClassNames } from '@/lib/constants';
import { cn } from '@/lib/utils/stringUtils';

interface RenameDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  defaultTitle: string;
  trigger?: ReactNode;
  renderTrigger?: (openDialog: () => void) => ReactNode;
  onSubmit: (enteredTitle: string) => Promise<boolean>;
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
      if (isOpen) {
        setEnteredTitle(defaultTitle);
        setErrorMessage('');
      }
    }, [isOpen, defaultTitle]);

    const handleRenameSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting) {
        return;
      }
      setErrorMessage('');
      const normalizedTitle = enteredTitle.trim();
      if (!normalizedTitle) {
        setErrorMessage('Enter a title for this resume.');
        setEnteredTitle('');
        inputRef.current?.focus();
        return;
      }

      if (normalizedTitle === defaultTitle) {
        showInfoToast('You made no changes to the title');
        return;
      }

      setIsSubmitting(true);
      try {
        const renamed = await onSubmit(normalizedTitle);
        if (!renamed) {
          setErrorMessage(
            'Could not rename this resume. Your title is still here. Select Rename to try again.'
          );
        }
      } catch {
        setErrorMessage(
          'Could not rename this resume. Your title is still here. Select Rename to try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <ResponsiveDialog
        open={isOpen}
        autoFocus
        onOpenChange={(open) => {
          if (isSubmitting) {
            return;
          }
          setErrorMessage('');
          if (open) {
            setEnteredTitle(defaultTitle);
          }
          if (!open) {
            setEnteredTitle(defaultTitle);
          }
          onOpenChange(open);
        }}
        title='Rename Resume'
        description={`Enter a new name for '${defaultTitle}'`}
        trigger={trigger}
        footer={
          <div className={dialogFooterClassNames}>
            <Button
              type='button'
              aria-label='Close rename dialog'
              variant='outline'
              className='h-11 md:h-9'
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form='rename-document-form'
              aria-label='Rename'
              className='h-11 md:h-9'
              disabled={!enteredTitle.trim() || isSubmitting}
            >
              {isSubmitting ? 'Renaming...' : 'Rename'}
            </Button>
          </div>
        }
      >
        <form
          onSubmit={handleRenameSubmit}
          id='rename-document-form'
          className='flex flex-col gap-1'
        >
          <Label htmlFor='newDocumentTitle'>Resume title</Label>
          <Input
            id='newDocumentTitle'
            type='text'
            minLength={1}
            maxLength={100}
            disabled={isSubmitting}
            required
            value={enteredTitle}
            onChange={(e) => setEnteredTitle(e.target.value)}
            aria-describedby={errorMessage ? 'rename-resume-error' : undefined}
            aria-invalid={!!errorMessage}
            ref={inputRef}
            className={cn(
              'h-11 md:h-9',
              !enteredTitle &&
                'border-destructive focus-visible:ring-destructive'
            )}
          />
          {errorMessage ? (
            <p
              id='rename-resume-error'
              role='alert'
              className='text-destructive text-sm'
            >
              {errorMessage}
            </p>
          ) : null}
        </form>
      </ResponsiveDialog>
    );
  }
);
