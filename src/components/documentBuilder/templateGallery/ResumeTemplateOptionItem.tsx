import { CheckIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { TemplateOptionWithVariants } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { cn } from '@/lib/utils/stringUtils';
import { TemplateImage } from '../TemplateImage';

interface ResumeTemplateOptionItemProps {
  option: TemplateOptionWithVariants;
}

export const ResumeTemplateOptionItem = observer(
  ({ option }: ResumeTemplateOptionItemProps) => {
    const isSelected =
      builderRootStore.documentStore.document?.templateType === option.value;

    const handlOptionClick = action(async () => {
      await builderRootStore.documentStore.changeDocumentTemplateType(
        option.value
      );
    });

    return (
      <article
        className='group relative flex flex-col gap-1 cursor-pointer'
        onClick={handlOptionClick}
        onKeyUp={handlOptionClick}
        onKeyDown={handlOptionClick}
      >
        <h3 className='text-base font-medium text-center'>{option.name}</h3>
        <div className='relative'>
          {isSelected && (
            <span className='bg-primary text-primary-foreground dark:bg-background dark:text-foreground top-1/2 left-1/2 absolute flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full'>
              <CheckIcon />
            </span>
          )}
          <div
            className={cn(
              'ring-2 ring-transparent group-hover:ring-blue-500 transition-all duration-300 rounded-md overflow-hidden',
              isSelected && 'ring-2 ring-blue-500'
            )}
          >
            <TemplateImage template={option} variant='card' />
          </div>
        </div>
      </article>
    );
  }
);
