import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { m, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateImage } from '@/components/documentBuilder/TemplateImage';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/stringUtils';

const heroTemplates = templateOptionsWithImages.slice(0, 3);

const facts = [
  { title: 'No account', detail: 'Start in your browser' },
  { title: 'Local storage', detail: 'Resume data stays here' },
  { title: 'Live preview', detail: 'See each page take shape' },
  { title: 'PDF + JSON', detail: 'Unlimited PDFs; JSON backup & restore' },
];

export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const entrance = shouldReduceMotion ? false : { opacity: 0, y: 10 };

  return (
    <section
      aria-labelledby='landing-title'
      className='overflow-hidden border-b border-border/70'
    >
      <div className='mx-auto w-full max-w-7xl px-[var(--page-gutter)] pb-14 pt-10 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24'>
        <div className='mx-auto max-w-6xl text-center'>
          <p className='mb-6 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:mb-7'>
            Free and open-source CV builder
          </p>

          <m.h1
            id='landing-title'
            initial={entrance}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className='mx-auto max-w-6xl text-balance text-[clamp(2.625rem,8.35vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-foreground'
          >
            <span className='hidden sm:block'>
              Build a resume you
              <br />
              feel good sending.
            </span>
            <span className='sm:hidden'>
              <span className='block'>Build a resume</span>
              <span className='block'>you feel good</span>
              <span className='block'>sending.</span>
            </span>
          </m.h1>

          <p className='mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg md:text-xl'>
            A private-first CV builder with structured editing, live PDF
            preview, and professional templates.
          </p>

          <ul className='mx-auto mt-8 grid max-w-4xl grid-cols-2 border-y border-border/70 text-left sm:mt-10 sm:grid-cols-4'>
            {facts.map((fact, index) => (
              <li
                key={fact.title}
                className={cn(
                  'min-w-0 px-3 py-3.5 sm:px-4 sm:py-4',
                  index > 0 && 'border-l border-border/60',
                  index === 2 && 'border-l-0 sm:border-l',
                  index > 1 && 'border-t border-border/60 sm:border-t-0'
                )}
              >
                <p className='text-sm font-semibold tracking-tight text-foreground'>
                  {fact.title}
                </p>
                <p className='mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[0.8125rem]'>
                  {fact.detail}
                </p>
              </li>
            ))}
          </ul>

          <div className='mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:mt-8 sm:flex-row'>
            <Link
              to='/documents'
              className={cn(
                buttonVariants({ size: 'lg' }),
                'min-h-11 w-full gap-2 sm:w-auto'
              )}
            >
              Start for free
              <ArrowRight className='size-4' />
            </Link>
            <a
              href='#templates'
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'min-h-11 w-full gap-2 sm:w-auto'
              )}
            >
              Browse templates
              <ArrowDownRight className='size-4' />
            </a>
          </div>
        </div>

        <m.div
          role='group'
          aria-label='Resume template previews'
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.75,
            delay: shouldReduceMotion ? 0 : 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className='mx-auto mt-8 flex max-w-5xl items-start justify-center pt-2 sm:mt-16 lg:mt-20'
        >
          {heroTemplates.map((template, index) => (
            <a
              key={template.name}
              href='#templates'
              aria-label={`Browse the ${template.name} resume template`}
              className={cn(
                'group relative block aspect-[400/566] w-[min(53vw,12.5rem)] shrink-0 overflow-hidden border border-border/60 bg-white shadow-editorial transition-[box-shadow,transform] duration-300 ease-(--ease-out-quart) hover:-translate-y-1 hover:shadow-overlay focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:w-[min(34vw,17rem)] lg:w-[min(25vw,18rem)]',
                index > 0 && '-ml-20',
                index === 0 && 'mt-4 rotate-[-2deg] md:rotate-[-2.5deg]',
                index === 1 && 'z-10',
                index === 2 && 'mt-4 hidden rotate-[2deg] lg:block'
              )}
            >
              <TemplateImage
                template={template}
                variant='card'
                imgProps={{
                  width: 400,
                  height: 566,
                  sizes:
                    '(min-width: 1024px) 288px, (min-width: 768px) 272px, 200px',
                  className:
                    'block h-full w-full object-cover transition-transform duration-500 ease-(--ease-out-quart) group-hover:scale-[1.01] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                  alt: `${template.name} resume template preview`,
                }}
              />
            </a>
          ))}
        </m.div>
      </div>
    </section>
  );
};
