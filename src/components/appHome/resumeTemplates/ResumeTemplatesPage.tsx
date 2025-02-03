'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const ResumeTemplatesPage = () => {
  return (
    <SidebarInset>
      <header className="shrink-0 flex items-center h-16 gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4 mr-2" />
          <span>Resume Templates</span>
        </div>
      </header>
      <div className="flex flex-col flex-1 gap-4 p-4">Resume templates</div>
    </SidebarInset>
  );
};
export default ResumeTemplatesPage;
