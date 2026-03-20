import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { APP_NAME } from '@/lib/appConfig';
import { Icons } from '../misc/icons';
import { ModeToggle } from '../ui/mode-toggle';

export const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md px-4'>
      <div className='h-14 max-w-7xl flex items-center mx-auto gap-8'>
        <Link className='flex items-center gap-2 shrink-0' to='/'>
          <Icons.logo />
          <span className='font-semibold tracking-tight text-sm'>
            {APP_NAME}
          </span>
        </Link>

        <nav className='md:flex hidden items-center gap-6 text-sm'>
          {['Features', 'Templates'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className='text-muted-foreground hover:text-foreground transition-colors duration-200'
            >
              {item}
            </a>
          ))}
        </nav>

        <div className='flex items-center gap-2 ml-auto'>
          <ModeToggle />
          <Link
            to='/documents'
            className={buttonVariants({ variant: 'default', size: 'sm' })}
          >
            Start Building
            <ArrowRight className='w-3.5 h-3.5 ml-1.5' />
          </Link>
        </div>
      </div>
    </header>
  );
};
