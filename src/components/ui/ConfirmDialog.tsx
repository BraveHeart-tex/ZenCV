'use client';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './drawer';

export const ConfirmDialog = observer(() => {
  const isDesktop = useMediaQuery('(min-width: 768px)', false);

  const isOpen = confirmDialogStore.isOpen;
  const onClose = confirmDialogStore.hideDialog;

  const descriptionContent = isDesktop ? (
    <DialogDescription className='text-muted-foreground mt-2'>
      {confirmDialogStore.message}
    </DialogDescription>
  ) : (
    <DrawerDescription className='text-muted-foreground mt-2'>
      {confirmDialogStore.message}
    </DrawerDescription>
  );

  const actionButtons = (
    <>
      <Button
        type='button'
        variant='outline'
        onClick={action(() => {
          confirmDialogStore?.onCancel?.();
          onClose();
        })}
        className='bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors'
      >
        {confirmDialogStore.cancelText}
      </Button>
      <Button
        type='submit'
        onClick={action(() => confirmDialogStore.onConfirm())}
        className='bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
      >
        {confirmDialogStore.confirmText}
      </Button>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={action(() => {
          onClose();
        })}
      >
        <DialogContent className='bg-background border-border'>
          <DialogHeader>
            <DialogTitle className='text-foreground text-xl font-semibold'>
              {confirmDialogStore.title}
            </DialogTitle>
            {confirmDialogStore.message ? (
              descriptionContent
            ) : (
              <VisuallyHidden>{descriptionContent}</VisuallyHidden>
            )}
          </DialogHeader>
          <DoNotAskAgainCheckbox />
          <DialogFooter className='mt-6'>{actionButtons}</DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={action(() => {
        onClose();
      })}
    >
      <DrawerContent className='bg-background border-border'>
        <DrawerHeader>
          <DrawerTitle className='text-foreground text-xl font-semibold'>
            {confirmDialogStore.title}
          </DrawerTitle>
          {confirmDialogStore.message ? (
            descriptionContent
          ) : (
            <VisuallyHidden>{descriptionContent}</VisuallyHidden>
          )}
        </DrawerHeader>
        <div className='px-4'>
          <DoNotAskAgainCheckbox />
        </div>
        <DrawerFooter className='flex-col-reverse mt-6'>
          {actionButtons}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});

const DoNotAskAgainCheckbox = observer(() => {
  if (!confirmDialogStore.doNotAskAgainEnabled) return null;

  return (
    <div className='flex items-center space-x-2'>
      <Checkbox
        id='doNotAskAgain'
        checked={confirmDialogStore.doNotAskAgainChecked}
        onCheckedChange={action((checked) => {
          confirmDialogStore.handleDoNotAskAgainCheckedChange(!!checked);
        })}
      />
      <Label htmlFor='doNotAskAgain'>Do not ask again</Label>
    </div>
  );
});
