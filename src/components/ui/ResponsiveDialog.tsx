import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

interface ResponsiveDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
  autoFocus?: boolean;
}

export const ResponsiveDialog = ({
  open,
  onOpenChange = () => {},
  trigger,
  title,
  description,
  footer,
  children,
  autoFocus = false,
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)', false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
        <DialogContent className='max-h-[98%] overflow-hidden px-0 w-full'>
          <DialogHeader className='px-6'>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className='flex-1 px-6 py-2 overflow-y-auto'>{children}</div>
          {footer ? (
            <DialogFooter className='lg:gap-0 gap-1 px-6'>
              {footer}
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} autoFocus={autoFocus}>
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent className='max-h-[98%] overflow-clip px-0 w-full'>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className='min-h-0 flex-1 w-full px-4 py-2 overflow-y-auto'>
          {children}
        </div>
        {footer ? (
          <DrawerFooter className='shrink-0 lg:gap-0 gap-1 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
            {footer}
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
};
