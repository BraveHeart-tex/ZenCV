import TemplateCard from '@/components/landingPage/templates/TemplateCard';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';

const ResumeTemplatesPage = () => {
  return (
    <SidebarInset>
      <header className="shrink-0 flex items-center h-16 gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4 mr-2" />
          <span className="font-medium">Resume Templates</span>
        </div>
      </header>
      <div className="flex flex-col flex-1 gap-4 p-4">
        <div className="md:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-6">
          {templateOptionsWithImages.map((template) => (
            <TemplateCard template={template} key={template.name} />
          ))}
        </div>
      </div>
    </SidebarInset>
  );
};
export default ResumeTemplatesPage;
