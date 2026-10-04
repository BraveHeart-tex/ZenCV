import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { TemplateCard } from '@/components/landingPage/templates/TemplateCard';

export function ResumeTemplatesPage() {
  return (
    <div className='@container min-w-0 flex flex-1 flex-col gap-8'>
      <p className='max-w-[38rem] text-sm leading-6 text-muted-foreground sm:text-base'>
        Compare five layouts, then create a new resume with your favorite.
      </p>
      <section
        aria-describedby='resume-template-gallery-help'
        aria-label='Resume template gallery'
        className='grid min-w-0 grid-flow-col auto-cols-[82%] snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-1 pb-4 @min-[28rem]:grid-flow-row @min-[28rem]:grid-cols-2 @min-[28rem]:gap-x-5 @min-[28rem]:overflow-visible @min-[28rem]:snap-none @min-[52.5rem]:grid-cols-3'
        onFocusCapture={(event) => {
          const focusTarget = event.target;
          if (focusTarget instanceof HTMLElement) {
            focusTarget.closest('article')?.scrollIntoView({
              block: 'nearest',
              inline: 'nearest',
            });
          }
        }}
      >
        {templateOptionsWithImages.map((template) => (
          <TemplateCard
            template={template}
            key={template.name}
            headingLevel={2}
            presentation='gallery'
            previewSizes='(min-width: 1536px) 20vw, (min-width: 1024px) 33vw, (min-width: 360px) 50vw, 100vw'
          />
        ))}
      </section>
      <p className='sr-only' id='resume-template-gallery-help'>
        Tab to reach each preview and create action. On narrow screens, the
        gallery scrolls each focused template into view.
      </p>
    </div>
  );
}
