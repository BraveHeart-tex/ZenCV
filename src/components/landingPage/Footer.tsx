import { APP_NAME } from '@/lib/appConfig';
import { Icons } from '../misc/icons';

export const Footer = () => {
  return (
    <footer className='bg-background/80 w-full px-4 border-t'>
      <div className='md:h-24 md:flex-row md:py-0 container flex flex-col items-center justify-between py-10 mx-auto space-y-4'>
        <div className='md:flex-row md:space-y-0 md:space-x-4 flex flex-col items-center justify-between w-full space-y-4'>
          <div className='flex items-center gap-2'>
            <span className='flex items-center space-x-2'>
              <Icons.logo />
              <span className='text-sm font-bold'>{APP_NAME}</span>
            </span>
            <p className='text-sm leading-loose text-center'>
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <p className='md:text-left ml-auto text-sm leading-loose text-center'>
            Built by{' '}
            <a
              href='https://github.com/BraveHeart-tex'
              target='_blank'
              rel='noreferrer'
              className='underline-offset-4 font-bold underline'
            >
              Bora Karaca
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
