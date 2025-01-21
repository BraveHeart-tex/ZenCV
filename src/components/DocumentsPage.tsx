'use client';
import DocumentsPageClient from '@/components/DocumentsPageClient';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const DocumentsPage = () => {
  return (
    <SidebarInset>
      <header className="shrink-0 flex items-center h-16 gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4 mr-2" />
          <span>Documents</span>
        </div>
      </header>
      <div className="flex flex-col flex-1 gap-4 p-4">
        <DocumentsPageClient />
      </div>
    </SidebarInset>
  );
};

export default DocumentsPage;
