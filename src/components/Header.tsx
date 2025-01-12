'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Icons } from './icons';

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-14 max-w-screen-2xl container flex items-center mx-auto">
        <div className="md:flex hidden mr-4">
          <Link className="flex items-center mr-6 space-x-2" href="/">
            <Icons.logo />
            <span className="sm:inline-block hidden font-bold">OwnYourCv</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a
              className="hover:text-foreground/80 text-foreground/60 transition-colors"
              href="#features"
            >
              Features
            </a>
            <a
              className="hover:text-foreground/80 text-foreground/60 transition-colors"
              href="#templates"
            >
              Templates
            </a>
            <a
              className="hover:text-foreground/80 text-foreground/60 transition-colors"
              href="#faq"
            >
              FAQ
            </a>
          </nav>
        </div>
        <div className="md:justify-end flex items-center justify-between flex-1 space-x-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="mr-6"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <SunIcon className="dark:-rotate-90 dark:scale-0 w-6 h-6 transition-all scale-100 rotate-0" />
            <MoonIcon className="dark:rotate-0 dark:scale-100 absolute w-6 h-6 transition-all scale-0 rotate-90" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Link
            href="/documents"
            className={buttonVariants({
              variant: 'default',
            })}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
