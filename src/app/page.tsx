import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="sm:items-start flex flex-col items-center row-start-2 gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="scroll-m-20 lg:text-5xl text-4xl font-extrabold tracking-tight">
            <u>Local</u>-First CV Builder
          </h1>
          <p className="text-muted-foreground">
            Create and download your CV in minutes, with unlimited downloads and
            a variety of templates.
          </p>
        </div>
        <Link
          className={cn(
            buttonVariants({
              variant: 'default',
            }),
          )}
          href="/documents"
        >
          Use the App
        </Link>
      </main>
    </div>
  );
}
