// DocumentCard.tsx
import {
  BriefcaseBusinessIcon,
  CopyIcon,
  FileSymlink,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash,
} from 'lucide-react';
import { action } from 'mobx';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import type { DEX_DocumentWithJobPosting } from '@/lib/client-db/clientDbSchema';
import {
  copyDocument,
  deleteDocument,
  renameDocument,
} from '@/lib/client-db/documentService';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { cn } from '@/lib/utils/stringUtils';
import { RenameDocumentDialog } from './RenameDocumentDialog';

interface DocumentCardProps {
  document: DEX_DocumentWithJobPosting;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (event: Event) => {
    event.stopImmediatePropagation();
    confirmDialogStore.showDialog({
      title: 'Delete Resume',
      message: 'Are you sure you want to delete this resume?',
      onConfirm: action(async () => {
        try {
          await deleteDocument(document.id);
          showSuccessToast('Resume deleted successfully.');
          if (builderRootStore.documentStore?.document?.id === document.id) {
            builderRootStore.resetState();
            builderRootStore.dispose();
          }
        } catch (error) {
          console.error(error);
          showErrorToast('An error occurred while deleting the resume.');
        }
        confirmDialogStore.hideDialog();
      }),
    });
  };

  const handleRenameSubmit = async (enteredTitle: string) => {
    try {
      const result = await renameDocument(document.id, enteredTitle);
      if (!result) {
        showErrorToast('An error occurred while renaming the resume.');
        return;
      }
      showSuccessToast('Resume renamed successfully.');
      setIsRenameDialogOpen(false);
    } catch (error) {
      showErrorToast('An error occurred while renaming the resume.');
      console.error(error);
    }
  };

  const handleCopyDocument = async () => {
    try {
      await copyDocument(document.id);
      showSuccessToast('Resume duplicated successfully.');
    } catch (error) {
      console.error(error);
      showErrorToast((error as Error).message);
    }
  };

  const formattedDate = document.updatedAt
    ? new Intl.DateTimeFormat(navigator.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(document.updatedAt))
    : null;

  const templateName =
    templateOptionsWithImages.find(
      (template) => template.value === document.templateType
    )?.name ?? 'Resume';

  return (
    <>
      <article
        className={cn(
          'group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4',
          'hover:border-border hover:shadow-md hover:bg-accent/30',
          'shadow-sm transition-all duration-200'
        )}
      >
        <div className='flex items-start justify-between gap-3 sm:gap-2'>
          <div className='min-w-0 flex-1 space-y-1.5 pr-1'>
            <h3
              className='line-clamp-2 text-sm font-semibold leading-snug lg:truncate'
              title={document.title}
            >
              {document.title}
            </h3>
            <div className='flex min-w-0 flex-wrap items-center gap-1.5'>
              <span className='inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground'>
                <FileText className='h-3 w-3' />
                {templateName}
              </span>
              <span className='inline-flex items-center rounded-md border border-border/70 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground'>
                Local resume
              </span>
            </div>
          </div>

          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className={cn(
                  'h-11 w-11 shrink-0 p-0 text-muted-foreground/50 lg:h-7 lg:w-7',
                  'max-md:opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-150',
                  'hover:text-foreground hover:bg-muted/60',
                  isOpen && 'opacity-100'
                )}
              >
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem
                onSelect={() => navigate(`/builder/${document.id}`)}
              >
                <FileSymlink className='w-4 h-4 mr-1' />
                Open in Builder
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsRenameDialogOpen(true)}>
                <Pencil className='w-4 h-4 mr-1' />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleCopyDocument}>
                <CopyIcon className='w-4 h-4 mr-1' />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleDelete}
                className='text-destructive focus:text-destructive hover:bg-destructive/10!'
              >
                <Trash className='w-4 h-4 mr-1' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {document.jobPosting && (
          <div className='flex items-center gap-1.5 min-w-0'>
            <div className='shrink-0 bg-muted p-1 rounded-md'>
              <BriefcaseBusinessIcon className='w-3 h-3 text-muted-foreground' />
            </div>
            <span className='text-xs text-muted-foreground truncate'>
              {document.jobPosting.jobTitle}
              <span className='text-muted-foreground/50 mx-1'>at</span>
              {document.jobPosting.companyName}
            </span>
          </div>
        )}

        <div className='mt-auto flex items-center justify-between gap-3 border-t border-border pt-3 lg:pt-2'>
          <span className='min-w-0 truncate text-xs tabular-nums text-muted-foreground'>
            Updated {formattedDate}
          </span>
          <Button
            asChild
            size='sm'
            variant='outline'
            className='h-11 shrink-0 px-3 lg:h-8'
          >
            <Link to={`/builder/${document.id}`}>
              <FileSymlink className='w-4 h-4' />
              Open
            </Link>
          </Button>
        </div>
      </article>

      <RenameDocumentDialog
        defaultTitle={document.title}
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        onSubmit={handleRenameSubmit}
      />
    </>
  );
};
