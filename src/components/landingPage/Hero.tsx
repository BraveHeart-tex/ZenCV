import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router';

export default function Hero() {
  return (
    <section className="md:py-24 lg:py-32 xl:py-48 w-full py-12">
      <div className="md:px-6 container px-4 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="sm:text-4xl md:text-5xl lg:text-6xl/none text-3xl font-bold tracking-tighter">
              Craft Your Perfect CV, Locally
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Build professional CVs with our intuitive, local-first builder.
              Your data stays on your device, ensuring privacy and security.
            </p>
          </div>
          <div className="space-x-4">
            <Link
              to="/documents"
              className={buttonVariants({
                variant: 'default',
                size: 'lg',
              })}
            >
              Start Building
            </Link>
            <Link
              to="/#features"
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
              })}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
