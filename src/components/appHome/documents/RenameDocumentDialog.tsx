'use client';
import { DEX_Document } from '@/lib/client-db/clientDbSchema';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import { renameDocument } from '@/lib/client-db/clientDbService';
import { Button } from '@/components/ui/button';
import ResponsiveDialog from '@/components/ui/ResponsiveDialog';
import { dialogFooterClassNames } from '@/lib/constants';

interface RenameDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  document: DEX_Document;
}

const RenameDocumentDialog = ({
  isOpen,
  onOpenChange,
  document,
}: RenameDocumentDialogProps) => {
  const [newName, setNewName] = useState(document.title);
  const input = useRef<HTMLInputElement>(null);

  const handleRenameSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newName.replaceAll(' ', '')) {
      {
        showErrorToast('Please enter a name for the document.');
        setNewName('');
        input.current?.focus();
        return;
      }
    }

    try {
      const result = await renameDocument(document.id, newName);
      if (!result) {
        showErrorToast('An error occurred while renaming the document.');
        return;
      }

      showSuccessToast('Document renamed successfully.');
      onOpenChange(false);
    } catch (error) {
      showErrorToast('An error occurred while renaming the document.');
      console.error(error);
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setNewName(document.title);
        }
        onOpenChange(open);
      }}
      title="Rename Document"
      description={`Enter a new name for '${document.title}'`}
    >
      <form onSubmit={handleRenameSubmit} className="space-y-4">
        <div>
          <Label htmlFor="newDocumentName">New Document Name</Label>
          <Input
            id="newDocumentName"
            ref={input}
            onChange={(e) => setNewName(e.target.value)}
            value={newName}
            minLength={1}
            aria-invalid={newName.length === 0 ? 'true' : 'false'}
          />
        </div>
        <div className={dialogFooterClassNames}>
          <Button
            variant={'outline'}
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Rename</Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
};

export default RenameDocumentDialog;
