import { Download, Palette, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: '100% Local Data',
    description:
      'Your CV data never leaves your device, ensuring complete privacy and security.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create and edit your CV with instant updates and no lag.',
  },
  {
    icon: Download,
    title: 'Unlimited Downloads',
    description:
      'Download your CV as many times as you need, in multiple formats.',
  },
  {
    icon: Palette,
    title: 'Professional Templates',
    description:
      'Choose from a wide range of professionally designed templates.',
  },
];

export const Features = () => {
  return (
    <section
      id='features'
      className='md:py-32 container px-4 py-24 mx-auto space-y-16'
    >
      <div className='mx-auto max-w-232 text-center'>
        <h2 className='font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl'>
          Key Features
        </h2>
        <p className='text-muted-foreground sm:text-lg mt-4'>
          Discover the power of our CV builder with these key features. Free
          forever. Job hunting is tough enough. Why pay for tools you only use
          when you&apos;re looking for work?
        </p>
      </div>
      <div className='md:grid-cols-2 grid max-w-5xl grid-cols-1 gap-8 mx-auto'>
        {features.map((feature) => (
          <div
            key={feature.title}
            className='bg-background relative p-8 overflow-hidden border rounded-lg'
          >
            <div className='flex items-center gap-4'>
              <feature.icon className='w-8 h-8' />
              <h3 className='font-bold'>{feature.title}</h3>
            </div>
            <p className='text-muted-foreground mt-2'>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
