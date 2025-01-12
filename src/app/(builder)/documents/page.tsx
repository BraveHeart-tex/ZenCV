import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const DocumentsPage = () => {
  return (
    <SidebarInset>
      <header className="shrink-0 flex items-center h-16 gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4 mr-2" />
          Documents
        </div>
      </header>
      <div className="flex flex-col flex-1 gap-4 p-4">
        <div className="auto-rows-min md:grid-cols-3 grid gap-4">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </SidebarInset>
  );
};

export default DocumentsPage;
