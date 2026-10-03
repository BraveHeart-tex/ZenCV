import { APP_NAME } from '@/lib/appConfig';
import { Icons } from '../misc/icons';

export const Footer = () => {
  return (
    <footer className='border-t border-border/70 bg-secondary/55 px-[var(--page-gutter)]'>
      <div className='mx-auto flex max-w-7xl flex-col gap-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-7'>
        <div className='flex items-center gap-2'>
          <Icons.logo aria-hidden='true' />
          <span className='font-semibold tracking-[-0.035em]'>{APP_NAME}</span>
          <span className='ml-1 text-muted-foreground'>
            © {new Date().getFullYear()}
          </span>
        </div>
        <p className='text-muted-foreground'>
          Built by{' '}
          <a
            href='https://github.com/BraveHeart-tex'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-sm font-medium text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none'
          >
            Bora Karaca
          </a>
        </p>
      </div>
    </footer>
  );
};
