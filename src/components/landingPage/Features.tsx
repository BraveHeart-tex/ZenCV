import { Download, Palette, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils/stringUtils';

const features = [
  {
    icon: ShieldCheck,
    title: '100% Local Data',
    description:
      'Your CV data never leaves your device. No servers, no syncing, no data collection. Complete privacy by design.',
    accent: 'text-emerald-500',
    bg: 'bg-emerald-500/8',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Instant updates as you type with zero lag. The editor feels native.',
    accent: 'text-amber-500',
    bg: 'bg-amber-500/8',
  },
  {
    icon: Download,
    title: 'Unlimited Downloads',
    description:
      'Export to PDF as many times as you need. No watermarks, no limits.',
    accent: 'text-blue-500',
    bg: 'bg-blue-500/8',
  },
  {
    icon: Palette,
    title: 'Professional Templates',
    description:
      'ATS-friendly templates designed by professionals to stand out.',
    accent: 'text-violet-500',
    bg: 'bg-violet-500/8',
  },
];

export const Features = () => {
  return (
    <section id='features' className='container px-4 py-20 md:py-28 mx-auto'>
      <div className='max-w-5xl mx-auto'>
        {/* Section label */}
        <div className='mb-14 space-y-3'>
          <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground/60'>
            Features
          </p>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Everything you need.
            <span className='text-muted-foreground/70'>
              {' '}
              Nothing you don't.
            </span>
          </h2>
          <p className='text-muted-foreground max-w-lg text-base'>
            Job hunting is stressful enough. Your CV builder shouldn't add to
            it. Free forever, no account needed.
          </p>
        </div>

        {/* Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                'group relative rounded-xl border border-border/50 bg-card/30 p-6 transition-all duration-300 hover:border-border hover:bg-card/60 hover:shadow-sm',
                i === 0 &&
                  'md:col-span-2 md:grid md:grid-cols-2 md:gap-6 md:items-center'
              )}
            >
              <div className={i === 0 ? '' : ''}>
                <div
                  className={cn(
                    'inline-flex p-2.5 rounded-lg mb-4',
                    feature.bg
                  )}
                >
                  <feature.icon className={cn('w-5 h-5', feature.accent)} />
                </div>
                <h3 className='font-semibold text-base mb-1.5'>
                  {feature.title}
                </h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {feature.description}
                </p>
              </div>
              {i === 0 && (
                <div className='hidden md:flex items-center justify-center'>
                  <div className='w-24 h-24 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center'>
                    <ShieldCheck className='w-10 h-10 text-emerald-500/60' />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
