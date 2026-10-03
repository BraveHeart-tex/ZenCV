import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateCard } from '@/components/landingPage/templates/TemplateCard';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export function ResumeTemplatesPage() {
  return (
    <SidebarInset className='min-w-0 overflow-x-hidden'>
      <header className='shrink-0 flex items-center h-16 gap-2 border-b'>
        <div className='flex min-w-0 items-center gap-2 px-3'>
          <SidebarTrigger className='h-11 w-11 lg:h-7 lg:w-7' />
          <Separator orientation='vertical' className='h-4 mr-2' />
          <h1 className='truncate font-medium'>Resume Templates</h1>
        </div>
      </header>
      <div className='@container flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-6'>
        <p className='text-sm text-muted-foreground'>
          Compare five layouts, then create a new resume with your favorite.
        </p>
        <div className='grid grid-cols-1 gap-4 @min-[20rem]:grid-cols-2 @min-[48rem]:grid-cols-3 @min-[80rem]:grid-cols-5'>
          {templateOptionsWithImages.map((template) => (
            <TemplateCard
              template={template}
              key={template.name}
              headingLevel={2}
              previewSizes='(min-width: 1536px) 20vw, (min-width: 1024px) 33vw, (min-width: 360px) 50vw, 100vw'
            />
          ))}
        </div>
      </div>
    </SidebarInset>
  );
}
