import * as Sentry from '@sentry/react';
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';

const ErrorFallback = ({
  error,
  onReset,
}: {
  error: Error;
  onReset?: () => void;
}) => {
  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='max-w-md w-full space-y-4 text-center'>
        <div className='flex justify-center'>
          <div className='w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center'>
            <AlertTriangleIcon className='w-6 h-6 text-destructive' />
          </div>
        </div>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold'>Something went wrong</h2>
          <p className='text-sm text-muted-foreground'>
            An unexpected error occurred. The issue has been reported
            automatically.
          </p>
        </div>
        {import.meta.env.DEV && error?.message && (
          <pre className='text-left text-xs bg-muted/50 border border-border/50 rounded-md p-3 overflow-auto max-h-32 text-destructive'>
            {error.message}
          </pre>
        )}
        <div className='flex items-center justify-center gap-2'>
          {onReset && (
            <Button variant='outline' onClick={onReset} className='gap-2'>
              <RefreshCwIcon className='w-4 h-4' />
              Try again
            </Button>
          )}
          <Button
            variant='outline'
            onClick={() => window.location.reload()}
            className='gap-2'
          >
            <RefreshCwIcon className='w-4 h-4' />
            Reload page
          </Button>
          <Link to='/' className={buttonVariants({ variant: 'default' })}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
};

export const RouteErrorFallback = ({
  error,
  resetError,
}: {
  error: unknown;
  resetError: () => void;
}) => {
  return <ErrorFallback error={error as Error} onReset={resetError} />;
};

export const GlobalErrorBoundary = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error }) => <ErrorFallback error={error as Error} />}
      onError={(error, componentStack) => {
        console.error('ErrorBoundary caught:', error, componentStack);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};
