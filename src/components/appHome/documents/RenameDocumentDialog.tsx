'use client';
import { ReactNode, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showErrorToast, showInfoToast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import ResponsiveDialog from '@/components/ui/ResponsiveDialog';
import { dialogFooterClassNames } from '@/lib/constants';
import { cn } from '@/lib/utils/stringUtils';
import { observer } from 'mobx-react-lite';

interface RenameDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  defaultTitle: string;

  trigger?: ReactNode;
  renderTrigger?: (openDialog: () => void) => ReactNode;
  onSubmit: (enteredTitle: string) => void;
}

const RenameDocumentDialog = observer(
  ({
    isOpen,
    onOpenChange = () => {},
    defaultTitle,
    onSubmit,
    trigger,
  }: RenameDocumentDialogProps) => {
    const [enteredTitle, setEnteredTitle] = useState(defaultTitle || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleRenameSubmit = async () => {
      const normalizedTitle = enteredTitle.trim();
      if (!normalizedTitle) {
        {
          showErrorToast('Please enter a name for the document.');
          setEnteredTitle('');
          inputRef.current?.focus();
          return;
        }
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
        title="Rename Document"
        description={`Enter a new name for '${defaultTitle}'`}
        trigger={trigger}
        footer={
          <div className={dialogFooterClassNames}>
            <Button
              type="button"
              aria-label="Close rename dialog"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              aria-label="Rename"
              disabled={!enteredTitle}
              onClick={handleRenameSubmit}
            >
              Rename
            </Button>
          </div>
        }
      >
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
      </ResponsiveDialog>
    );
  },
);

export default RenameDocumentDialog;
