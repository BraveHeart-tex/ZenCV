import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/stringUtils';

export const SettingsSectionHeader = ({
  title,
  description,
  destructive,
}: {
  title: string;
  description?: string;
  destructive?: boolean;
}) => (
  <div className='space-y-1'>
    <h2
      className={cn(
        'text-base font-semibold',
        destructive && 'text-destructive'
      )}
    >
      {title}
    </h2>
    {description && (
      <p className='text-sm text-muted-foreground'>{description}</p>
    )}
  </div>
);

export const SettingsRow = ({
  label,
  htmlFor,
  description,
  disabled,
  action,
  children,
  stackOnMobile = false,
}: {
  stackOnMobile?: boolean;
  label: string;
  htmlFor?: string;
  description?: string;
  disabled?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      'flex items-center justify-between gap-6 py-4 border-b border-border/60 last:border-0',
      stackOnMobile &&
        'flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6'
    )}
  >
    <div className='min-w-0 flex-1 space-y-1'>
      {htmlFor ? (
        <Label
          htmlFor={htmlFor}
          className={cn(
            'text-sm font-medium leading-5 cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </Label>
      ) : (
        <p className='text-sm font-medium leading-5'>{label}</p>
      )}
      {description && (
        <p
          id={htmlFor ? `${htmlFor}-description` : undefined}
          className='text-sm leading-5 text-muted-foreground'
        >
          {description}
        </p>
      )}
      {action}
    </div>
    <div className='shrink-0 max-w-full'>{children}</div>
  </div>
);
