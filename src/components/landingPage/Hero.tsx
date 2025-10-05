import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/stringUtils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="md:py-32 container px-4 py-24 mx-auto">
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-foreground mb-4">
          100% Free and Open Source
        </div>
        <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl py-1">
          Build Your Professional CV
          <br />
          With Complete Privacy
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Create stunning resumes that stand out. Everything stays on your
          device - no data collection, no tracking, just a modern CV builder
          that respects your privacy.
        </p>
        <div className="sm:flex-row flex flex-col items-center justify-center gap-4 pt-4">
          <Link
            href="/documents"
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
          <Link
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
          </Link>
        </div>
      </div>
    </section>
  );
}
