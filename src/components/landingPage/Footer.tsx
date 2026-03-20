import { APP_NAME } from '@/lib/appConfig';
import { Icons } from '../misc/icons';

export const Footer = () => {
  return (
    <footer className='border-t border-border/70 px-4'>
      <div className='container h-16 mx-auto flex items-center justify-between max-w-7xl'>
        <div className='flex items-center gap-2'>
          <Icons.logo />
          <span className='text-sm font-semibold tracking-tight'>
            {APP_NAME}
          </span>
          <span className='text-muted-foreground/70 text-sm ml-2'>
            © {new Date().getFullYear()}
          </span>
        </div>
        <p className='text-sm text-muted-foreground/60'>
          Built by{' '}
          <a
            href='https://github.com/BraveHeart-tex'
            target='_blank'
            rel='noreferrer'
            className='text-foreground/70 hover:text-foreground font-medium transition-colors underline underline-offset-4'
          >
            Bora Karaca
          </a>
        </p>
      </div>
    </footer>
  );
};
