import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button';

export const Cta = () => {
  return (
    <section className='border-t border-border/40 px-4'>
      <div className='container mx-auto max-w-3xl space-y-6 py-24 text-center md:py-32'>
        <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/70'>
          Get started
        </p>
        <h2 className='text-balance text-3xl font-bold tracking-tight md:text-5xl'>
          Your next job starts
          <br />
          <span className='text-muted-foreground/75'>with a clear CV.</span>
        </h2>
        <p className='mx-auto max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg'>
          Build, customize, and export your resume in minutes. No sign-up. No
          subscription. Completely free.
        </p>
        <div className='pt-2'>
          <Link
            to='/documents'
            className={buttonVariants({ size: 'lg', className: 'gap-2' })}
          >
            Start building free
            <ArrowRight className='size-4' />
          </Link>
        </div>
      </div>
    </section>
  );
};
