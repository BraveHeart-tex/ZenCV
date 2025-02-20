import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router';
import { Icons } from '../misc/icons';
import { ModeToggle } from '../ui/mode-toggle';
import { APP_NAME } from '@/lib/appConfig';
import { ArrowRight } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="h-14 max-w-screen-2xl container flex items-center mx-auto">
        <Link className="flex items-center mr-6 space-x-2" to="/">
          <Icons.logo />
          <span className="inline-block font-bold">{APP_NAME}</span>
        </Link>
        <div className="md:flex hidden mr-4">
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
          </nav>
        </div>
        <div className="flex items-center justify-end flex-1 space-x-2">
          <ModeToggle />
          <Link
            to="/documents"
            className={buttonVariants({
              variant: 'default',
            })}
          >
            Start Building
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </header>
  );
}
