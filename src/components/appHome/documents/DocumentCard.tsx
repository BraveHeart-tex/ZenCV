// DocumentCard.tsx
import {
  ArrowUpRight,
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
import type { DEX_Document } from '@/lib/client-db/clientDbSchema';
import {
  copyDocument,
  deleteDocument,
  renameDocument,
} from '@/lib/client-db/documentService';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { cn } from '@/lib/utils/stringUtils';
import { RenameDocumentDialog } from './RenameDocumentDialog';

interface DocumentCardProps {
  document: DEX_Document;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (event: Event) => {
    event.stopImmediatePropagation();
    confirmDialogStore.showDialog({
      title: 'Delete Resume',
      message: `Delete "${document.title}"? This permanently removes it from this browser. You can only restore it from a backup exported before deletion.`,
      confirmText: 'Delete resume',
      onConfirm: action(async () => {
        try {
          await deleteDocument(document.id);
          showSuccessToast('Resume deleted.');
          if (builderSession.document?.id === document.id) {
            builderSession.resetState();
            builderSession.dispose();
          }
        } catch (error) {
          console.error(error);
          showErrorToast(
            'Could not delete this resume. Try Delete again from its actions menu.'
          );
        }
        confirmDialogStore.hideDialog();
      }),
    });
  };

  const handleRenameSubmit = async (enteredTitle: string) => {
    try {
      const result = await renameDocument(document.id, enteredTitle);
      if (!result) {
        return false;
      }
      showSuccessToast('Resume renamed.');
      setIsRenameDialogOpen(false);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleCopyDocument = async () => {
    try {
      await copyDocument(document.id);
      showSuccessToast('Resume duplicated.');
    } catch (error) {
      console.error(error);
      showErrorToast(
        'Could not duplicate this resume. Try Duplicate again from its actions menu.'
      );
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
          'flex min-h-[13rem] min-w-0 flex-col gap-6 rounded-md border border-border/70 bg-card/40 p-4 sm:p-5'
        )}
      >
        <div className='flex min-w-0 items-start justify-between gap-3'>
          <div className='min-w-0 flex-1 space-y-3'>
            <h3
              className='break-words text-lg font-semibold leading-snug tracking-tight [overflow-wrap:anywhere]'
              title={document.title}
            >
              {document.title}
            </h3>
            <p className='flex min-w-0 items-center gap-2 text-sm text-muted-foreground'>
              <FileText
                aria-hidden='true'
                className='size-4 shrink-0 text-editorial-accent'
                strokeWidth={1.75}
              />
              <span className='min-w-0 truncate'>{templateName} template</span>
            </p>
          </div>

          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                aria-label={`Actions for ${document.title}`}
                className='size-11 shrink-0 p-0 text-muted-foreground hover:bg-muted/60 hover:text-foreground sm:size-9'
              >
                <MoreHorizontal aria-hidden='true' className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem
                onSelect={() => navigate(`/builder/${document.id}`)}
              >
                <FileSymlink className='w-4 h-4 mr-1' />
                Edit resume
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

        <div className='mt-auto flex min-w-0 items-center justify-between gap-3 border-t border-border/60 pt-3'>
          <time
            dateTime={document.updatedAt}
            className='min-w-0 flex-1 text-xs leading-5 tabular-nums text-muted-foreground'
          >
            Updated {formattedDate}
          </time>
          <Button
            asChild
            variant='outline'
            className='h-11 shrink-0 px-3 sm:h-9'
          >
            <Link
              to={`/builder/${document.id}`}
              aria-label={`Open ${document.title}`}
            >
              <ArrowUpRight aria-hidden='true' className='size-4' />
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
