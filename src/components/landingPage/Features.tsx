import {
  ArrowDown,
  Download,
  FileText,
  FolderArchive,
  Palette,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils/stringUtils';

const features = [
  {
    icon: ShieldCheck,
    label: 'Local workspace',
    title: 'Your resume starts and stays in your browser.',
    description:
      'Create, edit, and export without making an account. Your document data is stored locally unless you choose an AI action.',
  },
  {
    icon: Sparkles,
    label: 'Opt-in AI',
    title: 'AI help appears only at the moments you ask for it.',
    description:
      'Generate summaries, improve wording, analyze job posts, and get suggestions from explicit actions in the editor.',
  },
  {
    icon: Download,
    label: 'PDF export',
    title: 'Send polished PDFs without watermarks or limits.',
    description:
      'Preview as you edit, export whenever the version is ready, and keep iterating for every application.',
  },
  {
    icon: Palette,
    label: 'Templates',
    title: 'Choose a layout that fits the role, not the trend.',
    description:
      'Start from five professional resume templates, including options with restrained accent-color customization.',
  },
];

export const Features = () => {
  return (
    <section id='features' className='container mx-auto px-4 py-20 md:py-28'>
      <div className='mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16'>
        <div className='lg:sticky lg:top-24'>
          <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground'>
            <span className='size-1.5 rounded-full bg-emerald-500' />
            Private by default
          </div>
          <h2 className='max-w-xl text-balance text-3xl font-bold tracking-tight md:text-4xl'>
            Built for the messy middle of job hunting.
          </h2>
          <p className='mt-4 max-w-lg text-base leading-relaxed text-muted-foreground'>
            ZenCV keeps the essentials close: structured editing, live preview,
            professional templates, and clear privacy boundaries.
          </p>

          <div className='mt-8 rounded-xl border border-border/70 bg-muted/35 p-5 dark:bg-muted/20 hidden md:block'>
            <div className='flex items-center gap-3 border-b border-border/70 pb-4'>
              <div className='flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'>
                <FileText className='size-5' />
              </div>
              <div>
                <p className='text-sm font-semibold'>Resume data</p>
                <p className='text-sm text-muted-foreground'>
                  Stored in your browser
                </p>
              </div>
            </div>

            <div className='grid gap-3 py-4 text-sm text-muted-foreground sm:grid-cols-3'>
              <div className='rounded-lg bg-background px-3 py-2 text-foreground ring-1 ring-border/70'>
                Edit
              </div>
              <div className='rounded-lg bg-background px-3 py-2 text-foreground ring-1 ring-border/70'>
                Preview
              </div>
              <div className='rounded-lg bg-background px-3 py-2 text-foreground ring-1 ring-border/70'>
                Export PDF
              </div>
            </div>

            <div className='flex items-start gap-3 rounded-lg border border-dashed border-emerald-500/35 bg-emerald-500/8 p-3 text-sm text-emerald-800 dark:text-emerald-200'>
              <FolderArchive className='mt-0.5 size-4 shrink-0' />
              <p>
                AI processing is separate from core editing and only runs after
                a deliberate AI action.
              </p>
            </div>
          </div>
        </div>

        <div className='divide-y divide-border/70 border-y border-border/70'>
          {features.map((feature) => (
            <article
              key={feature.title}
              className='group grid grid-cols-[2.75rem_1fr] gap-4 py-6 sm:gap-5 md:py-7'
            >
              <div className='flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors duration-200 group-hover:bg-foreground group-hover:text-background motion-reduce:transition-none'>
                <feature.icon className='size-5' />
              </div>
              <div>
                <p className='mb-2 text-xs font-semibold text-muted-foreground'>
                  {feature.label}
                </p>
                <h3 className='max-w-2xl text-pretty text-lg font-semibold tracking-tight'>
                  {feature.title}
                </h3>
                <p className='mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground'>
                  {feature.description}
                </p>
              </div>
            </article>
          ))}

          <a
            href='#templates'
            className={cn(
              'group flex items-center justify-between gap-4 py-6 text-sm font-medium outline-hidden transition-colors duration-200 hover:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none',
              'md:py-7'
            )}
          >
            <span>See the resume templates</span>
            <ArrowDown className='size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0' />
          </a>
        </div>
      </div>
    </section>
  );
};
