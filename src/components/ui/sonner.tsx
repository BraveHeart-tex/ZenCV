'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTheme } from 'next-themes';
import { ExternalToast, Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)', false);

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      position={isMobile ? 'top-center' : 'bottom-right'}
      {...props}
    />
  );
};

const showErrorToast = (message: string, data?: ExternalToast) => {
  return toast.error(message, data);
};

const showInfoToast = (message: string, data?: ExternalToast) => {
  return toast.info(message, data);
};

const showSuccessToast = (message: string, data?: ExternalToast) => {
  return toast.success(message, data);
};

const showLoadingToast = (message: string, data?: ExternalToast) => {
  return toast.loading(message, data);
};

export {
  Toaster,
  showErrorToast,
  showSuccessToast,
  showInfoToast,
  showLoadingToast,
};
