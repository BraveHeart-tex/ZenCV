import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils/stringUtils';
import { buttonVariants } from '../ui/button';

export const Cta = () => {
  return (
    <section
      aria-labelledby='closing-title'
      className='border-y border-border/70 bg-secondary/55 px-[var(--page-gutter)] py-20 text-center sm:py-24 lg:py-32'
    >
      <div className='mx-auto max-w-5xl'>
        <h2
          id='closing-title'
          className='mx-auto max-w-4xl text-balance text-[clamp(2.75rem,7vw,6.75rem)] font-semibold leading-[0.96] tracking-[-0.04em]'
        >
          Your next job starts <br className='hidden sm:block' />
          <span className='text-muted-foreground'>with a clear CV.</span>
        </h2>
        <p className='mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg'>
          Build, customize, and export your resume in minutes. No sign-up. No
          subscription. Completely free.
        </p>
        <div className='mt-8 sm:mt-9'>
          <Link
            to='/documents'
            className={cn(
              buttonVariants({ size: 'lg' }),
              'min-h-11 w-full max-w-xs gap-2 sm:w-auto'
            )}
          >
            Start building free
            <ArrowRight aria-hidden='true' className='size-4' />
          </Link>
        </div>
      </div>
    </section>
  );
};
