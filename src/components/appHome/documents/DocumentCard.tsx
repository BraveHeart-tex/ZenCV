'use client';
import { DEX_Document } from '@/lib/client-db/clientDbSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileSymlink, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import RenameDocumentDialog from './RenameDocumentDialog';
import { useState } from 'react';
import { action } from 'mobx';
import { useNavigate } from 'react-router';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import DocumentService from '@/lib/client-db/documentService';

interface DocumentCardProps {
  document: DEX_Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (event: Event) => {
    event.stopImmediatePropagation();
    confirmDialogStore.showDialog({
      title: 'Delete Document',
      message: 'Are you sure you want to delete this document?',
      onConfirm: action(async () => {
        try {
          await DocumentService.deleteDocument(document.id);
          showSuccessToast('Document deleted successfully.');
          if (builderRootStore.documentStore?.document?.id === document.id) {
            builderRootStore.resetState();
          }
        } catch (error) {
          console.error(error);
          showErrorToast('An error occurred while deleting the document.');
        }
        confirmDialogStore.hideDialog();
      }),
    });
  };

  const prefetchDocumentData = action(async () => {
    await builderRootStore.documentStore.initializeStore(document.id);
  });

  const handleRenameSubmit = async (enteredTitle: string) => {
    try {
      const result = await DocumentService.renameDocument(
        document.id,
        enteredTitle,
      );
      if (!result) {
        showErrorToast('An error occurred while renaming the document.');
        return;
      }

      showSuccessToast('Document renamed successfully.');
      setIsRenameDialogOpen(false);
    } catch (error) {
      showErrorToast('An error occurred while renaming the document.');
      console.error(error);
    }
  };

  return (
    <>
      <Card
        onMouseEnter={prefetchDocumentData}
        className="bg-background border-border hover:border-border-hover w-full transition-colors border cursor-pointer"
        onMouseDown={() => {
          if (isOpen) return;
          navigate(`/builder/${document.id}`);
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between p-3 space-y-0">
          <CardTitle className="flex-1 mr-2 font-medium truncate">
            {document.title}
          </CardTitle>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground w-7 h-7 p-0"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => navigate(`/builder/${document.id}`)}
              >
                <FileSymlink className="w-4 h-4 mr-2" />
                Edit in CV Builder
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsRenameDialogOpen(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDelete}>
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-muted-foreground text-sm font-medium">
            Updated{' '}
            {new Intl.DateTimeFormat(navigator.language, {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(new Date(document.updatedAt))}
          </p>
        </CardContent>
      </Card>
      <RenameDocumentDialog
        defaultTitle={document.title}
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        onSubmit={handleRenameSubmit}
      />
    </>
  );
};

export default DocumentCard;
