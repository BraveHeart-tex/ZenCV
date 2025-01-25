import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router';
import { Icons } from '../misc/icons';
import { ModeToggle } from '../ui/mode-toggle';
import { APP_NAME } from '@/lib/appConfig';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-14 max-w-screen-2xl container flex items-center mx-auto">
        <div className="md:flex hidden mr-4">
          <Link className="flex items-center mr-6 space-x-2" to="/public">
            <Icons.logo />
            <span className="sm:inline-block hidden font-bold">{APP_NAME}</span>
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
          <ModeToggle />
          <Link
            to="/documents"
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
