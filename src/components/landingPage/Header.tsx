import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { APP_NAME } from '@/lib/appConfig';
import { cn } from '@/lib/utils/stringUtils';
import { Icons } from '../misc/icons';
import { ModeToggle } from '../ui/mode-toggle';

export const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/70 bg-background'>
      <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-[var(--page-gutter)] py-3 md:min-h-[4.25rem] md:flex-nowrap md:py-0'>
        <Link
          className='flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring'
          to='/'
          aria-label={`${APP_NAME} home`}
        >
          <Icons.logo aria-hidden='true' />
          <span className='text-base font-semibold tracking-[-0.04em]'>
            {APP_NAME}
          </span>
        </Link>

        <nav
          aria-label='Main navigation'
          className='order-3 flex w-full items-center justify-center gap-9 border-t border-border/60 pt-3 text-sm md:order-none md:w-auto md:justify-start md:gap-7 md:border-0 md:pt-0'
        >
          {[
            { label: 'Features', href: '#features' },
            { label: 'Templates', href: '#templates' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className='rounded-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none'
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className='ml-auto flex shrink-0 items-center gap-2'>
          <ModeToggle />
          <Link
            to='/documents'
            className={cn(
              buttonVariants({ variant: 'default', size: 'sm' }),
              'min-h-11 gap-1.5 px-3 text-xs sm:px-4'
            )}
          >
            Start building
            <ArrowRight aria-hidden='true' className='size-4' />
          </Link>
        </div>
      </div>
    </header>
  );
};
