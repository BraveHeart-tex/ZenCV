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
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { action } from 'mobx';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const ConfirmDialog = observer(() => {
  const isOpen = confirmDialogStore.isOpen;
  const onClose = confirmDialogStore.hideDialog;

  const descriptionContent = (
    <DialogDescription className="text-muted-foreground mt-2">
      {confirmDialogStore.message}
    </DialogDescription>
  );

  return (
    <Dialog open={isOpen} onOpenChange={action(() => onClose())}>
      <DialogContent className="bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-semibold">
            {confirmDialogStore.title}
          </DialogTitle>
          {confirmDialogStore.message ? (
            descriptionContent
          ) : (
            <VisuallyHidden>{descriptionContent}</VisuallyHidden>
          )}
        </DialogHeader>
        <DoNotAskAgainCheckbox />
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={action(() => onClose())}
            className="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {confirmDialogStore.cancelText}
          </Button>
          <Button
            type="submit"
            onClick={action(() => confirmDialogStore.onConfirm())}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {confirmDialogStore.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

const DoNotAskAgainCheckbox = observer(() => {
  if (!confirmDialogStore.doNotAskAgainEnabled) return null;

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="doNotAskAgain"
        checked={confirmDialogStore.doNotAskAgainChecked}
        onCheckedChange={action((checked) => {
          confirmDialogStore.handleDoNotAskAgainCheckedChange(!!checked);
        })}
      />
      <Label htmlFor="doNotAskAgain">Do not ask again</Label>
    </div>
  );
});

export default ConfirmDialog;
