import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateImage } from '@/components/documentBuilder/TemplateImage';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/stringUtils';

const heroTemplates = templateOptionsWithImages.slice(0, 3);

export const Hero = () => {
  return (
    <section className='landing-hero overflow-hidden'>
      <div className='container mx-auto px-4 pt-20 pb-12 md:pt-28 md:pb-20'>
        <div className='mx-auto max-w-3xl space-y-6 text-center'>
          <div
            className='inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-sm'
            style={{ animation: 'fadeUp 0.5s ease both' }}
          >
            <span className='size-1.5 shrink-0 rounded-full bg-emerald-500' />
            Free and open source. No account required.
          </div>

          <h1
            className='text-balance text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4.5rem]'
            style={{ animation: 'fadeUp 0.5s 0.1s ease both' }}
          >
            Build a resume you
            <br />
            <span className='relative inline-block text-muted-foreground/75'>
              feel good sending.
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

          <p
            className='mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg'
            style={{ animation: 'fadeUp 0.5s 0.2s ease both' }}
          >
            A private-first CV builder with structured editing, live PDF
            preview, professional templates, and optional AI help when you
            choose it.
          </p>

          <div
            className='flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row'
            style={{ animation: 'fadeUp 0.5s 0.3s ease both' }}
          >
            <Link
              to='/documents'
              className={cn(buttonVariants({ size: 'lg' }), 'min-w-40 gap-2')}
            >
              Start for free
              <ArrowRight className='size-4' />
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

          <p
            className='pt-2 text-xs text-muted-foreground/70'
            style={{ animation: 'fadeUp 0.5s 0.4s ease both' }}
          >
            Local browser storage. Unlimited PDF export. JSON backup and
            restore.
          </p>
        </div>
      </div>

      <div
        className='mx-auto flex w-full max-w-6xl justify-center gap-3 px-4 pb-4 sm:gap-5 md:pb-8'
        style={{ animation: 'fadeUp 0.55s 0.45s ease both' }}
      >
        {heroTemplates.map((template, index) => (
          <a
            key={template.name}
            href='#templates'
            className={cn(
              'group block w-[34vw] min-w-32 max-w-64 overflow-hidden rounded-lg border border-border/70 bg-muted/25 shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-(--ease-out-quart) hover:-translate-y-1 hover:border-foreground/20 hover:shadow-md focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0',
              index === 1 && 'mt-6 sm:mt-10',
              index === 2 && 'hidden sm:block'
            )}
          >
            <TemplateImage
              template={template}
              variant='card'
              imgProps={{
                width: 400,
                height: 566,
                className:
                  'aspect-[400/566] w-full object-cover transition-transform duration-500 ease-(--ease-out-quart) group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                alt: `${template.name} resume template preview`,
              }}
            />
          </a>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-hero * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
};
