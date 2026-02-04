import * as motion from 'motion/react-m';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/stringUtils';

interface AnimatedSuggestionButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  label: string;
  scoreValue?: number;
  scoreValueBgColor?: string;
  scoreValueTextColor?: string;
  className?: string;
  iconContainerClassName?: string;
  disabled?: boolean;
}

export const AnimatedSuggestionButton = ({
  onClick,
  icon,
  label,
  scoreValue,
  scoreValueBgColor,
  scoreValueTextColor,
  className,
  iconContainerClassName,
  disabled,
}: AnimatedSuggestionButtonProps) => {
  return (
    <Button
      size='sm'
      asChild
      variant='ghost'
      className={cn(`justify-start p-0 py-0`, className)}
    >
      <motion.button
        className='hover:bg-muted flex items-center gap-2 rounded-md'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        onClick={onClick}
        disabled={disabled}
      >
        {scoreValue !== undefined && (
          <motion.span
            className='w-10 h-max p-1 text-xs rounded-md'
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            style={{
              backgroundColor: scoreValueBgColor,
              color: scoreValueTextColor,
            }}
          >
            +{scoreValue}%
          </motion.span>
        )}
        {icon && (
          <span
            className={cn(
              'w-10 h-max p-1 text-xs rounded-md flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4',
              iconContainerClassName
            )}
          >
            {icon}
          </span>
        )}
        <motion.span
          className='text-sm font-medium'
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {label}
        </motion.span>
      </motion.button>
    </Button>
  );
};
