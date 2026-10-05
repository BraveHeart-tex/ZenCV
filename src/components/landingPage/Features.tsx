import {
  ArrowRight,
  Eye,
  FileDown,
  HardDrive,
  Palette,
  PencilLine,
} from 'lucide-react';
import { LandingSectionIntro } from '@/components/landingPage/LandingSectionIntro';

const features = [
  {
    icon: HardDrive,
    label: 'Local workspace',
    title: 'Your resume starts and stays in your browser.',
    description:
      'Create, edit, and export without making an account. Your document data is stored locally in your browser.',
  },
  {
    icon: Eye,
    label: 'Live preview',
    title: 'See the page take shape as you work.',
    description:
      'Review the resume preview while you edit, then export a PDF when the version is ready.',
  },
  {
    icon: Palette,
    label: 'Six templates',
    title: 'Choose a layout that fits the role, not the trend.',
    description:
      'Start from six resume templates, including options with restrained accent-color customization.',
  },
];

const workflowSteps = [
  {
    icon: PencilLine,
    title: 'Edit',
    description: 'Build your document in the browser.',
  },
  {
    icon: Eye,
    title: 'Preview',
    description: 'Review the layout as you work.',
  },
  {
    icon: FileDown,
    title: 'Export PDF',
    description: 'Download a copy when it is ready.',
  },
];

export const Features = () => {
  return (
    <section
      id='features'
      aria-labelledby='features-title'
      className='scroll-mt-28 px-[var(--page-gutter)] py-20 sm:py-24 lg:py-32'
    >
      <div className='mx-auto max-w-6xl'>
        <LandingSectionIntro
          titleId='features-title'
          title='Built for the messy middle of job hunting.'
          description='ZenCV keeps the essentials close: structured editing, live preview, professional templates, and clear privacy boundaries.'
        />

        <div className='mx-auto mt-14 max-w-6xl border-y border-border/70 sm:mt-16'>
          {features.map((feature) => (
            <article
              key={feature.title}
              className='grid gap-3 border-b border-border/60 py-6 last:border-b-0 sm:gap-4 sm:py-7 md:grid-cols-[minmax(8.5rem,0.72fr)_minmax(0,1fr)_minmax(0,1.2fr)] md:items-start md:gap-6 lg:gap-10'
            >
              <div className='flex items-center gap-3 md:items-start md:pt-1'>
                <feature.icon
                  aria-hidden='true'
                  className='size-4 shrink-0 text-muted-foreground'
                />
                <span className='text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground'>
                  {feature.label}
                </span>
              </div>
              <h3 className='max-w-sm text-pretty text-xl font-semibold leading-snug tracking-[-0.025em] sm:text-2xl'>
                {feature.title}
              </h3>
              <p className='max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed'>
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        <div className='mx-auto mt-14 grid max-w-6xl gap-7 sm:mt-16 md:grid-cols-[minmax(12rem,0.72fr)_minmax(0,1.7fr)] md:items-center md:gap-10 lg:gap-16'>
          <div>
            <h3 className='text-2xl font-semibold tracking-[-0.035em] sm:text-3xl'>
              Edit, review, export.
            </h3>
            <p className='mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base'>
              Resume data stays in your browser during this core workflow.
            </p>
          </div>

          <ol className='grid list-none border-y border-border/70 sm:grid-cols-3 sm:divide-x sm:divide-border/60'>
            {workflowSteps.map((step) => (
              <li
                key={step.title}
                className='flex items-start gap-3 border-b border-border/60 py-4 last:border-b-0 sm:flex-col sm:gap-5 sm:border-b-0 sm:px-5 sm:py-5 first:sm:pl-0 last:sm:pr-0'
              >
                <step.icon
                  aria-hidden='true'
                  className='mt-0.5 size-4 shrink-0 text-muted-foreground sm:mt-0'
                />
                <div>
                  <h4 className='text-sm font-semibold text-foreground'>
                    {step.title}
                  </h4>
                  <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <a
          href='#templates'
          className='group mx-auto mt-10 flex min-h-11 w-fit items-center gap-2 rounded-sm text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none sm:mt-12'
        >
          See the resume templates
          <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0' />
        </a>
      </div>
    </section>
  );
};
