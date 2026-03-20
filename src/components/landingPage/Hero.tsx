import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/stringUtils';

export const Hero = () => {
  return (
    <section className='container px-4 pt-24 pb-20 md:pt-36 md:pb-28 mx-auto'>
      <div className='max-w-3xl mx-auto text-center space-y-6'>
        {/* Badge */}
        <div
          className='inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-3.5 py-1 text-xs font-medium text-muted-foreground tracking-wide uppercase'
          style={{ animation: 'fadeUp 0.5s ease both' }}
        >
          <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0' />
          Free & Open Source · No account required
        </div>

        {/* Headline */}
        <h1
          className='text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.08] text-foreground'
          style={{ animation: 'fadeUp 0.5s 0.1s ease both' }}
        >
          Build a resume that
          <br />
          <span className='relative inline-block text-muted-foreground/70'>
            gets you hired.
            <svg
              viewBox='0 0 300 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='absolute -bottom-2 left-0 w-full'
              preserveAspectRatio='none'
            >
              <title>Hero underline</title>
              <path
                d='M2 9.5C50 3.5 100 1 150 4C200 7 250 9 298 5'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                className='text-primary'
                style={{
                  strokeDasharray: 320,
                  strokeDashoffset: 320,
                  animation: 'drawLine 0.6s 0.7s ease forwards',
                }}
              />
            </svg>
          </span>
        </h1>

        {/* Subheading */}
        <p
          className='max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed'
          style={{ animation: 'fadeUp 0.5s 0.2s ease both' }}
        >
          A private-first CV builder. Everything lives on your device — no
          tracking, no subscriptions, just a fast and beautiful editor.
        </p>

        {/* CTAs */}
        <div
          className='flex flex-col sm:flex-row items-center justify-center gap-3 pt-2'
          style={{ animation: 'fadeUp 0.5s 0.3s ease both' }}
        >
          <Link
            to='/documents'
            className={cn(buttonVariants({ size: 'lg' }), 'min-w-40 gap-2')}
          >
            Start for free
            <ArrowRight className='w-4 h-4' />
          </Link>
          <a
            href='#templates'
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'min-w-40'
            )}
          >
            Browse templates
          </a>
        </div>

        {/* Social proof line */}
        <p
          className='text-xs text-muted-foreground/60 pt-2'
          style={{ animation: 'fadeUp 0.5s 0.4s ease both' }}
        >
          No sign-up required · Export to PDF instantly · ATS-friendly
        </p>
      </div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  );
};
