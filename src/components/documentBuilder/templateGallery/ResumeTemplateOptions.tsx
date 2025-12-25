import { templateOptionsWithImages } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { ResumeTemplateOptionItem } from './ResumeTemplateOptionItem';

export const ResumeTemplateOptions = () => {
  return (
    <aside className='lg:block hidden p-4 bg-transparent'>
      <div className='grid h-full grid-cols-2 gap-4 p-2 overflow-auto'>
        {templateOptionsWithImages.map((option) => (
          <ResumeTemplateOptionItem key={option.value} option={option} />
        ))}
      </div>
    </aside>
  );
};
