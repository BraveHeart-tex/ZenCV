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
        <Button variant={open ? 'outline' : 'default'} className='h-11 lg:h-9'>
          <PlusIcon className='w-4 h-4' />
          New Resume
        </Button>
      );
    }

    if (triggerVariant === 'card') {
      return (
        <button
          type='button'
          className='flex min-h-30 w-full min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-transparent p-4 text-center transition-all duration-200 hover:border-border hover:bg-muted/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        >
          <div className='rounded-lg border border-border/50 bg-muted/40 p-2'>
            <PlusIcon className='w-4 h-4 text-muted-foreground' />
          </div>
          <span className='wrap-break-word text-xs font-medium text-muted-foreground'>
            New resume
          </span>
        </button>
      );
    }

    if (triggerVariant === 'sidebar') {
      return (
        <SidebarMenuButton variant='outline'>
          <FilePlusIcon /> Create Resume
        </SidebarMenuButton>
      );
    }

    if (triggerVariant === 'icon') {
      return (
        <Button
          variant='outline'
          size='icon'
          aria-label='Create resume'
          className='h-11 w-11 lg:h-9 lg:w-9'
        >
          <FilePlusIcon />
        </Button>
      );
    }
  };

  return (
    <ResponsiveDialog
      title='New Resume'
      description='Give your resume a title, pick a template, and optionally start with sample data.'
      trigger={renderTrigger()}
      open={open}
      onOpenChange={setOpen}
    >
      <CreateDocumentForm setOpen={setOpen} />
    </ResponsiveDialog>
  );
};
