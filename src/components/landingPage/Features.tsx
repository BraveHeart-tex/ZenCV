import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldCheck, Zap, Download, Palette } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck className="text-primary w-10 h-10 mb-4" />,
    title: '100% Local Data',
    description:
      'Your CV data never leaves your device, ensuring complete privacy and security.',
  },
  {
    icon: <Zap className="text-primary w-10 h-10 mb-4" />,
    title: 'Lightning Fast',
    description: 'Create and edit your CV with instant updates and no lag.',
  },
  {
    icon: <Download className="text-primary w-10 h-10 mb-4" />,
    title: 'Unlimited Downloads',
    description:
      'Download your CV as many times as you need, in multiple formats.',
  },
  {
    icon: <Palette className="text-primary w-10 h-10 mb-4" />,
    title: 'Professional Templates',
    description:
      'Choose from a wide range of professionally designed templates.',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary w-full py-12"
    >
      <div className="md:px-6 container px-4 mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="sm:text-5xl mb-4 text-3xl font-bold tracking-tighter text-center">
            Key Features
          </h2>
          <p className="text-muted-foreground max-w-2xl text-center">
            Discover the power of our CV builder with these key features. Free
            forever. Job hunting is tough enough. Why pay for tools you only use
            when you&apos;re looking for work?
          </p>
        </div>
        <div className="md:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-card to-background border-primary/10 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="flex flex-col items-center space-y-4 text-center">
                  {feature.icon}
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground/90 text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
