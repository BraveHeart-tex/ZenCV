import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
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

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locked = useRef(false);
  const confirm = async () => {
    if (locked.current) {
      return;
    }
    locked.current = true;
    setPending(true);
    setError(null);
    try {
      await confirmDialogStore.onConfirm();
    } catch {
      setError(confirmDialogStore.errorMessage);
    } finally {
      locked.current = false;
      setPending(false);
    }
  };
  const close = () => {
    if (!locked.current) {
      setError(null);
      void confirmDialogStore.hideDialog();
    }
  };
  const isOpen = confirmDialogStore.isOpen;
  const onClose = close;
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

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
        disabled={pending}
        variant='outline'
        onClick={action(() => {
          confirmDialogStore?.onCancel?.();
          onClose();
        })}
        className='min-h-11 bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors'
      >
        {confirmDialogStore.cancelText}
      </Button>
      <Button
        type='button'
        disabled={pending}
        aria-busy={pending}
        variant={confirmDialogStore.destructive ? 'destructive' : 'default'}
        onClick={() => void confirm()}
        className='min-h-11'
      >
        {pending
          ? confirmDialogStore.pendingText
          : confirmDialogStore.confirmText}
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
          {error && (
            <p role='alert' className='text-sm text-destructive'>
              {error}
            </p>
          )}
          <DoNotAskAgainCheckbox />
          <DialogFooter className='mt-6'>{actionButtons}</DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={isOpen}
      autoFocus
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
          {error && (
            <p role='alert' className='text-sm text-destructive'>
              {error}
            </p>
          )}
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
  if (!confirmDialogStore.doNotAskAgainEnabled) {
    return null;
  }

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
