import type { LucideIcon } from 'lucide-react';
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
  <div
    className={cn(
      'grid gap-1.5',
      description && 'sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-8'
    )}
  >
    <h2
      className={cn(
        'text-lg font-semibold tracking-tight',
        destructive && 'text-destructive'
      )}
    >
      {title}
    </h2>
    {description && (
      <p className='max-w-prose text-sm leading-6 text-muted-foreground'>
        {description}
      </p>
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
  destructive = false,
  icon: Icon,
}: {
  stackOnMobile?: boolean;
  destructive?: boolean;
  icon?: LucideIcon;
  label: string;
  htmlFor?: string;
  description?: string;
  disabled?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      'flex min-w-0 items-center justify-between gap-6 border-b border-border/60 py-5 last:border-0',
      stackOnMobile &&
        'flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6'
    )}
  >
    <div className='flex min-w-0 flex-1 items-start gap-3'>
      {Icon && (
        <Icon
          aria-hidden='true'
          className={cn(
            'mt-0.5 size-4 shrink-0',
            destructive ? 'text-destructive' : 'text-muted-foreground'
          )}
          strokeWidth={1.75}
        />
      )}
      <div className='min-w-0 flex-1 space-y-1'>
        {htmlFor ? (
          <Label
            htmlFor={htmlFor}
            className={cn(
              'cursor-pointer text-sm font-medium leading-5',
              destructive && 'text-destructive',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {label}
          </Label>
        ) : (
          <p
            className={cn(
              'text-sm font-medium leading-5',
              destructive && 'text-destructive'
            )}
          >
            {label}
          </p>
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
    </div>
    <div
      className={cn(
        'flex max-w-full shrink-0',
        stackOnMobile && 'w-full justify-end sm:w-auto sm:justify-start'
      )}
    >
      {children}
    </div>
  </div>
);
