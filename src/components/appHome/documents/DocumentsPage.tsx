import { DocumentsPageClient } from '@/components/appHome/documents/DocumentsPageClient';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export const DocumentsPage = () => {
  return (
    <SidebarInset className='min-w-0 overflow-x-hidden'>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b'>
        <div className='flex min-w-0 items-center gap-2 px-3'>
          <SidebarTrigger className='h-11 w-11 lg:h-7 lg:w-7' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <h1 className='truncate font-medium'>Documents</h1>
        </div>
      </header>
      <div className='flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 sm:p-6'>
        <DocumentsPageClient />
      </div>
    </SidebarInset>
  );
};
