import { FilePlusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/ResponsiveDialog';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { CreateDocumentForm } from './CreateDocumentForm';

interface CreateDocumentDialogProps {
  triggerVariant?: 'default' | 'sidebar' | 'icon' | 'card';
}

export const CreateDocumentDialog = ({
  triggerVariant = 'default',
}: CreateDocumentDialogProps) => {
  const [open, setOpen] = useState(false);

  const renderTrigger = () => {
    if (triggerVariant === 'default') {
      return (
        <Button variant={open ? 'outline' : 'default'}>
          <PlusIcon className='w-4 h-4' />
          New Document
        </Button>
      );
    }

    if (triggerVariant === 'card') {
      return (
        <div className='flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 hover:border-border hover:bg-muted/50 transition-all duration-200 cursor-pointer min-h-30 p-4'>
          <div className='rounded-lg border border-border/50 bg-muted/40 p-2'>
            <PlusIcon className='w-4 h-4 text-muted-foreground' />
          </div>
          <span className='text-xs font-medium text-muted-foreground'>
            New document
          </span>
        </div>
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
      title='New Document'
      description='Give your document a title, pick a template, and optionally start with sample data.'
      trigger={renderTrigger()}
      open={open}
      onOpenChange={setOpen}
    >
      <CreateDocumentForm setOpen={setOpen} />
    </ResponsiveDialog>
  );
};
