import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Button } from './ui/button';
import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { showErrorToast, showSuccessToast } from './ui/sonner';
import { createDocument } from '@/lib/service';

const CreateDocumentPopover = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name) {
      showErrorToast('Please enter a name for the document.');
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

      showSuccessToast('Document created successfully.');
      setName('');
    } catch (error) {
      showErrorToast('An error occurred while creating the document.');
      console.error(error);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setName('');
        }
        setOpen(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant={open ? 'outline' : 'default'}>
          Create New Document
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={1}
              aria-invalid={name ? 'false' : 'true'}
              required
            />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
export default CreateDocumentPopover;
