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
}

export const ResponsiveDialog = ({
  open,
  onOpenChange = () => {},
  trigger,
  title,
  description,
  footer,
  children,
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)', false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className='max-h-[98%] overflow-hidden px-0 w-full'>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className='flex-1 w-full h-full px-4 py-2 overflow-y-auto'>
          {children}
        </div>
        {footer ? (
          <DrawerFooter className='lg:gap-0 gap-1 px-4'>{footer}</DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
};
