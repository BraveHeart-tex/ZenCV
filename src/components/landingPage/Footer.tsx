import { APP_NAME } from '@/lib/appConfig';
import { Icons } from '../misc/icons';

export const Footer = () => {
  return (
    <footer className='border-t border-border/70 px-4'>
      <div className='container min-h-20 mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5 max-w-6xl'>
        <div className='flex items-center gap-2'>
          <Icons.logo />
          <span className='text-sm font-semibold tracking-tight'>
            {APP_NAME}
          </span>
          <span className='text-muted-foreground text-sm ml-2'>
            © {new Date().getFullYear()}
          </span>
        </div>
        <p className='text-sm text-muted-foreground'>
          Built by{' '}
          <a
            href='https://github.com/BraveHeart-tex'
            target='_blank'
            rel='noreferrer'
            className='text-foreground/70 hover:text-foreground font-medium transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring underline underline-offset-4'
          >
            Bora Karaca
          </a>
        </p>
      </div>
    </footer>
  );
};
