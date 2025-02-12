'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { FilePlusIcon } from 'lucide-react';
import ResponsiveDialog from '@/components/ui/ResponsiveDialog';
import CreateDocumentForm from './CreateDocumentForm';

interface CreateDocumentDialogProps {
  triggerVariant?: 'default' | 'sidebar' | 'icon';
}

const CreateDocumentDialog = ({
  triggerVariant = 'default',
}: CreateDocumentDialogProps) => {
  const [open, setOpen] = useState(false);

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
      onOpenChange={setOpen}
    >
      <CreateDocumentForm setOpen={setOpen} />
    </ResponsiveDialog>
  );
};
export default CreateDocumentDialog;
