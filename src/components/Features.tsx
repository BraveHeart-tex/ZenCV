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
      className="md:py-24 lg:py-32 bg-secondary w-full py-12"
    >
      <div className="md:px-6 container px-4 mx-auto">
        <h2 className="sm:text-5xl mb-12 text-3xl font-bold tracking-tighter text-center">
          Key Features
        </h2>
        <div className="md:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card">
              <CardHeader>
                <CardTitle className="flex flex-col items-center text-center">
                  {feature.icon}
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
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
