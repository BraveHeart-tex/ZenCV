'use client';
import { DEX_Document } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { FileSymlink, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { confirmDialogStore } from '@/lib/confirmDialogStore';
import { deleteDocument } from '@/lib/service';
import { showErrorToast, showSuccessToast } from './ui/sonner';
import RenameDocumentDialog from './RenameDocumentDialog';
import { useState } from 'react';
import { action } from 'mobx';
import { useNavigate } from 'react-router';

const DocumentCard = ({ document }: { document: DEX_Document }) => {
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
          await deleteDocument(document.id);
          showSuccessToast('Document deleted successfully.');
        } catch (error) {
          console.error(error);
          showErrorToast('An error occurred while deleting the document.');
        }
        confirmDialogStore.hideDialog();
      }),
    });
  };

  return (
    <>
      <Card
        className="bg-background border-border hover:border-border-hover w-full max-w-md transition-colors border cursor-pointer"
        onClick={() => {
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
        document={document}
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
      />
    </>
  );
};

export default DocumentCard;
