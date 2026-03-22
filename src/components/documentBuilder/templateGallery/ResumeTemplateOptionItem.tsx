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

    const handleOptionClick = action(async () => {
      await builderRootStore.documentStore.changeDocumentTemplateType(
        option.value
      );
    });

    return (
      <article
        className='group flex flex-col gap-1.5 cursor-pointer'
        onClick={handleOptionClick}
        onKeyUp={handleOptionClick}
        onKeyDown={handleOptionClick}
      >
        <div
          className={cn(
            'relative rounded-lg transition-all duration-200',
            isSelected
              ? 'ring-2 ring-blue-500 ring-offset-1'
              : 'ring-1 ring-border/50 group-hover:ring-blue-500/50'
          )}
        >
          {/* image + overlay — overflow-hidden here so ring isn't clipped */}
          <div className='absolute inset-0 rounded-lg overflow-hidden'>
            <TemplateImage
              template={option}
              variant='card'
              imgProps={{
                width: 400,
                height: 566,
                className: 'w-full h-full object-cover',
              }}
            />
            {isSelected && (
              <div className='absolute inset-0 bg-blue-500/10 flex items-center justify-center'>
                <span className='bg-blue-500 text-white flex items-center justify-center w-7 h-7 rounded-full shadow-md'>
                  <CheckIcon className='w-4 h-4' />
                </span>
              </div>
            )}
          </div>

          {/* aspect ratio placeholder */}
          <div className='aspect-[1/1.414]' />
        </div>

        <p
          className={cn(
            'text-xs font-medium text-center truncate transition-colors',
            isSelected
              ? 'text-blue-500'
              : 'text-muted-foreground group-hover:text-foreground'
          )}
        >
          {option.name}
        </p>
      </article>
    );
  }
);
