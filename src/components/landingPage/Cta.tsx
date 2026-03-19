import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button';

export const Cta = () => {
  return (
    <section className='px-4 border-t'>
      <div className='md:py-32 container flex flex-col items-center gap-4 py-24 mx-auto text-center'>
        <h2 className='font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl'>
          Ready to get started?
        </h2>
        <p className='max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8'>
          Visually craft your CV within minutes, without any data collection or
          tracking. Export as PDF with unlimited downloads.
        </p>
        <Link
          to='/documents'
          className={buttonVariants({ size: 'lg', className: 'mt-4' })}
        >
          Start Building
        </Link>
      </div>
    </section>
  );
};
