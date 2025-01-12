'use client';
import { confirmDialogStore } from '@/lib/confirmDialogStore';
import { observer } from 'mobx-react-lite';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

const ConfirmDialog = observer(() => {
  const isOpen = confirmDialogStore.isOpen;
  const onClose = confirmDialogStore.hideDialog;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-semibold">
            {confirmDialogStore.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            {confirmDialogStore.message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {confirmDialogStore.cancelText}
          </Button>
          <Button
            type="submit"
            onClick={confirmDialogStore.onConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {confirmDialogStore.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default ConfirmDialog;
