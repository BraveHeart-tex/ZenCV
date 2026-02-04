'use client';
import { FilePlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/ResponsiveDialog';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { CreateDocumentForm } from './CreateDocumentForm';

interface CreateDocumentDialogProps {
  triggerVariant?: 'default' | 'sidebar' | 'icon';
}

export const CreateDocumentDialog = ({
  triggerVariant = 'default',
}: CreateDocumentDialogProps) => {
  const [open, setOpen] = useState(false);

  const renderTrigger = () => {
    if (triggerVariant === 'default') {
      return (
        <Button variant={open ? 'outline-solid' : 'default'}>
          Create New Document
        </Button>
      );
    }

    if (triggerVariant === 'sidebar') {
      return (
        <SidebarMenuButton variant='outline'>
          <FilePlusIcon /> Create Document
        </SidebarMenuButton>
      );
    }

    if (triggerVariant === 'icon') {
      return (
        <Button variant='outline' size='icon'>
          <FilePlusIcon />
        </Button>
      );
    }
  };

  return (
    <ResponsiveDialog
      title='Create new document'
      description='Use the form below to create a document'
      trigger={renderTrigger()}
      open={open}
      onOpenChange={setOpen}
    >
      <CreateDocumentForm setOpen={setOpen} />
    </ResponsiveDialog>
  );
};
