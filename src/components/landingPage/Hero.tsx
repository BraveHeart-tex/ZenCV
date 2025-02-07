import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/stringUtils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function Hero() {
  return (
    <section className="md:py-32 container px-4 py-24 mx-auto">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-foreground mb-4">
          100% Free and Open Source
        </div>
        <h1 className="md:text-6xl text-4xl font-bold tracking-tight">
          Build Your Professional CV
          <br />
          With Complete Privacy
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-xl">
          Create stunning resumes that stand out. Everything stays on your
          device - no data collection, no tracking, just a modern CV builder
          that respects your privacy.
        </p>
        <div className="sm:flex-row flex flex-col items-center justify-center gap-4 pt-4">
          <Link
            to="/documents"
            className={cn(
              buttonVariants({
                variant: 'default',
                size: 'lg',
                className: 'min-w-[200px]',
              }),
            )}
          >
            Start Building
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <a
            href="#templates"
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: 'min-w-[200px]',
              }),
            )}
          >
            View Templates
          </a>
        </div>
      </div>
    </section>
  );
}
