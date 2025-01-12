'use client';
import { Document } from '@/lib/schema';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { confirmDialogStore } from '@/lib/confirmDialogStore';
import { deleteDocument } from '@/lib/service';
import { showErrorToast, showSuccessToast } from './ui/sonner';

const DocumentCard = ({ document }: { document: Document }) => {
  const handleDelete = () => {
    confirmDialogStore.showDialog({
      title: 'Delete Document',
      message: 'Are you sure you want to delete this document?',
      onConfirm: async () => {
        try {
          await deleteDocument(document.id);
          showSuccessToast('Document deleted successfully.');
        } catch (error) {
          console.error(error);
          showErrorToast('An error occurred while deleting the document.');
        }
        confirmDialogStore.hideDialog();
      },
    });
  };

  return (
    <Card className="bg-background border-border hover:border-border-hover w-full max-w-md transition-colors border">
      <CardHeader className="flex flex-row items-center justify-between p-3 space-y-0">
        <CardTitle className="flex-1 mr-2 font-medium truncate">
          {document.title}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground w-6 h-6 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
            // onSelect={() => setIsRenameDialogOpen(true)}
            >
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
          Updated {new Date(document.updatedAt).toLocaleString()}
        </p>
      </CardContent>
      {/* <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Rename Document
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title"
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleRename} className="sm:w-auto w-full">
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </Card>
  );
};

export default DocumentCard;
