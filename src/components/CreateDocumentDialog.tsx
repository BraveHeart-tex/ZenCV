import { Button } from './ui/button';
import { useRef, useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { showErrorToast, showSuccessToast } from './ui/sonner';
import { createDocument } from '@/lib/service';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useRouter } from 'next/navigation';

const CreateDocumentDialog = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.replaceAll(' ', '')) {
      showErrorToast('Please enter a name for the document.');
      setName('');
      input.current?.focus();
      return;
    }

    try {
      const documentId = await createDocument({ title: name });

      if (!documentId) {
        showErrorToast(
          'An error occurred while creating the document. Please try again.',
        );
        return;
      }

      router.push(`/documents/${documentId}`);
      showSuccessToast('Document created successfully.');
      setName('');
      setOpen(false);
    } catch (error) {
      showErrorToast('An error occurred while creating the document.');
      console.error(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setName('');
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={open ? 'outline' : 'default'}>
          Create New Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              ref={input}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={1}
              aria-invalid={name ? 'false' : 'true'}
              required
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateDocumentDialog;
