import type { LucideIcon } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface ApplicationPageHeaderProps {
  title: string;
  icon: LucideIcon;
}

export const ApplicationPageHeader = ({
  title,
  icon: PageIcon,
}: ApplicationPageHeaderProps) => {
  return (
    <header className='sticky top-0 z-20 shrink-0 border-b border-sidebar-border/70 bg-background/95 backdrop-blur-sm'>
      <div className='mx-auto flex h-16 w-full max-w-[var(--content-max-width)] items-center gap-2 px-[var(--page-gutter)]'>
        <SidebarTrigger className='-ml-2 size-11 shrink-0 rounded-md' />
        <div className='flex min-w-0 items-center gap-2.5'>
          <PageIcon
            aria-hidden='true'
            className='size-4 shrink-0 text-editorial-accent'
            strokeWidth={1.75}
          />
          <h1 className='truncate text-sm font-semibold tracking-tight sm:text-base'>
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
};
