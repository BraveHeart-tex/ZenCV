import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button';

export const Cta = () => {
  return (
    <section className='px-4 border-t border-border/40'>
      <div className='container py-24 md:py-32 mx-auto max-w-3xl text-center space-y-6'>
        <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground/60'>
          Get started
        </p>
        <h2 className='text-3xl md:text-5xl font-bold tracking-tight'>
          Your next job starts
          <br />
          <span className='text-muted-foreground/70'>with a great CV.</span>
        </h2>
        <p className='text-muted-foreground text-base md:text-lg max-w-lg mx-auto leading-relaxed'>
          Build, customize, and export your resume in minutes. No sign-up. No
          data collection. Completely free.
        </p>
        <div className='pt-2'>
          <Link
            to='/documents'
            className={buttonVariants({ size: 'lg', className: 'gap-2' })}
          >
            Start Building Free
            <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>
    </section>
  );
};
