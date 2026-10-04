import { ArrowRight, FilePlusIcon, PlusIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/ResponsiveDialog';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils/stringUtils';
import { CreateDocumentForm } from './CreateDocumentForm';

interface CreateDocumentDialogProps {
  triggerVariant?: 'default' | 'sidebar' | 'icon' | 'card';
  triggerClassName?: string;
}

export const CreateDocumentDialog = ({
  triggerVariant = 'default',
  triggerClassName,
}: CreateDocumentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const formId = useId();

  const renderTrigger = () => {
    if (triggerVariant === 'default') {
      return (
        <Button
          variant={open ? 'outline' : 'default'}
          className={cn('h-11 lg:h-9', triggerClassName)}
        >
          <PlusIcon className='w-4 h-4' />
          New Resume
        </Button>
      );
    }

    if (triggerVariant === 'card') {
      return (
        <button
          type='button'
          className='flex min-h-30 w-full min-w-0 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border/70 bg-transparent p-4 text-center transition-all duration-200 hover:border-border hover:bg-muted/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none'
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
        <SidebarMenuButton
          variant='outline'
          tooltip='New Resume'
          className='h-10 rounded-md border-transparent bg-sidebar-primary px-3 font-semibold text-sidebar-primary-foreground shadow-none transition-colors duration-[var(--duration-quick)] ease-[var(--ease-out-quart)] hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground [&_svg]:text-editorial-accent group-data-[collapsible=icon]:size-10! motion-reduce:transition-none'
        >
          <FilePlusIcon /> New Resume
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
      onOpenChange={(nextOpen) => {
        if (!isCreating) {
          setOpen(nextOpen);
        }
      }}
      autoFocus
      footer={
        <div className='flex w-full items-center justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            className='h-11 md:h-9'
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            form={formId}
            className='h-11 gap-2 md:h-9'
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create resume'}
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      }
    >
      <CreateDocumentForm
        setOpen={setOpen}
        formId={formId}
        onSubmittingChange={setIsCreating}
      />
    </ResponsiveDialog>
  );
};
