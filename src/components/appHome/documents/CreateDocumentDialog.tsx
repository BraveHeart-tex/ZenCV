import { Button } from '@/components/ui/button';
import { type FormEvent, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import { createDocument } from '@/lib/client-db/clientDbService';
import { useNavigate } from 'react-router';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { FilePlusIcon } from 'lucide-react';
import { dialogFooterClassNames } from '@/lib/constants';
import ResponsiveDialog from '@/components/ui/ResponsiveDialog';

interface CreateDocumentDialogProps {
  triggerVariant?: 'default' | 'sidebar' | 'icon';
}

const CreateDocumentDialog = ({
  triggerVariant = 'default',
}: CreateDocumentDialogProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent) => {
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

      await documentBuilderStore.initializeStore(documentId);
      showSuccessToast('Document created successfully.');
      setName('');
      setOpen(false);
      navigate(`/builder/${documentId}`);
    } catch (error) {
      showErrorToast('An error occurred while creating the document.');
      console.error(error);
    }
  };

  const renderTrigger = () => {
    if (triggerVariant === 'default') {
      return (
        <Button variant={open ? 'outline' : 'default'}>
          Create New Document
        </Button>
      );
    }

    if (triggerVariant === 'sidebar') {
      return (
        <SidebarMenuButton variant="outline">
          <FilePlusIcon /> Create Document
        </SidebarMenuButton>
      );
    }

    if (triggerVariant === 'icon') {
      return (
        <Button variant="outline" size="icon">
          <FilePlusIcon />
        </Button>
      );
    }
  };

  return (
    <ResponsiveDialog
      title="Create new document"
      description="Use the form below to create a document"
      trigger={renderTrigger()}
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setName('');
        }
        setOpen(isOpen);
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            ref={input}
            id="name"
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
            minLength={1}
            aria-invalid={name ? 'false' : 'true'}
            required
          />
        </div>
        <div className={dialogFooterClassNames}>
          <Button
            variant="outline"
            aria-label="Close create document dialog"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
};
export default CreateDocumentDialog;
