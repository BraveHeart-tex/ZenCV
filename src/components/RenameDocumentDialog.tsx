'use client';
import { DEX_Document } from '@/lib/schema';
import { useRef, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { showErrorToast, showSuccessToast } from './ui/sonner';
import { renameDocument } from '@/lib/service';
import { DialogDescription } from '@radix-ui/react-dialog';
import { CornerDownLeftIcon } from 'lucide-react';
import { Button } from './ui/button';

const RenameDocumentDialog = ({
  isOpen,
  onOpenChange,
  document,
}: {
  document: DEX_Document;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) => {
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
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setNewName(document.title);
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Document</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Enter a new name for &quot;{document.title}&quot;
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <div className="relative">
            <Label htmlFor="newDocumentName" className="sr-only">
              New Document Name
            </Label>
            <Input
              id="newDocumentName"
              className="pr-10"
              ref={input}
              onChange={(e) => setNewName(e.target.value)}
              value={newName}
              minLength={1}
              aria-invalid={newName.length === 0 ? 'true' : 'false'}
            />
            <CornerDownLeftIcon className="top-1/2 right-2 bg-muted text-muted-foreground absolute p-1 -translate-y-1/2 rounded-md" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button variant={'outline'} type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Rename</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameDocumentDialog;
