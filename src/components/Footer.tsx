import { Icons } from './icons';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="md:h-24 md:flex-row md:py-0 container flex flex-col items-center justify-between py-10 mx-auto space-y-4">
        <div className="md:flex-row md:space-y-0 md:space-x-4 flex flex-col items-center space-y-4">
          <Icons.logo />
          <p className="md:text-left text-sm leading-loose text-center">
            Built by OwnYourCV. The source code is available on{' '}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 font-medium underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
