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
}: {
  label: string;
  htmlFor?: string;
  description?: string;
  disabled?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className='flex items-center justify-between gap-4 py-3 border-b border-border/40 last:border-0'>
    <div className='flex items-center gap-1.5 min-w-0'>
      <Label
        htmlFor={htmlFor}
        className={cn(
          'text-sm font-normal cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {label}
      </Label>
      {description && (
        <p className='text-xs text-muted-foreground'>{description}</p>
      )}
      {action}
    </div>
    {children}
  </div>
);
