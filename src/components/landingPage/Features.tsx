import { Download, Palette, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/stringUtils';

const features = [
  {
    icon: ShieldCheck,
    title: 'Local by default',
    description:
      'Your resume documents live in your browser. Core editing and PDF export work without an account.',
    accent: 'text-emerald-500',
    bg: 'bg-emerald-500/8',
  },
  {
    icon: Sparkles,
    title: 'AI when you ask',
    description:
      'Generate summaries, improve wording, and analyze job posts only when you explicitly choose an AI action.',
    accent: 'text-primary',
    bg: 'bg-muted',
  },
  {
    icon: Download,
    title: 'Unlimited PDF export',
    description:
      'Export to PDF as many times as you need. No watermarks, no limits.',
    accent: 'text-primary',
    bg: 'bg-muted',
  },
  {
    icon: Palette,
    title: 'Professional templates',
    description:
      'Choose from five polished resume layouts, including templates with accent-color customization.',
    accent: 'text-primary',
    bg: 'bg-muted',
  },
];

export const Features = () => {
  return (
    <section id='features' className='container mx-auto px-4 py-20 md:py-28'>
      <div className='mx-auto max-w-5xl'>
        <div className='mb-12 space-y-3'>
          <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground/70'>
            Features
          </p>
          <h2 className='max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-4xl'>
            Everything you need
            <span className='text-muted-foreground/75'>
              {' '}
              Nothing you don't.
            </span>
          </h2>
          <p className='max-w-xl text-base text-muted-foreground'>
            Job hunting is stressful enough. Your CV builder shouldn't add to
            it. Free, open source, no account needed.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                'group relative rounded-xl border border-border/70 bg-card p-6 transition-[background-color,border-color,box-shadow] duration-200 hover:border-foreground/15 hover:shadow-sm',
                i === 0 &&
                  'md:col-span-2 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8'
              )}
            >
              <div>
                <div
                  className={cn(
                    'mb-4 inline-flex rounded-lg p-2.5',
                    feature.bg
                  )}
                >
                  <feature.icon className={cn('size-5', feature.accent)} />
                </div>
                <h3 className='mb-1.5 text-base font-semibold'>
                  {feature.title}
                </h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {feature.description}
                </p>
              </div>
              {i === 0 && (
                <div className='hidden w-56 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 md:block'>
                  <p className='font-medium'>Private workspace</p>
                  <p className='mt-1 text-emerald-700/75 dark:text-emerald-300/75'>
                    Resume data stays local unless you run an AI action.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
