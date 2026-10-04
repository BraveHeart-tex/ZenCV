import { CheckIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { TemplateOptionWithVariants } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { cn } from '@/lib/utils/stringUtils';
import { TemplateImage } from '../TemplateImage';

interface ResumeTemplateOptionItemProps {
  option: TemplateOptionWithVariants;
}

export const ResumeTemplateOptionItem = observer(
  ({ option }: ResumeTemplateOptionItemProps) => {
    const isSelected = builderSession.document?.templateType === option.value;

    const handleOptionClick = action(async () => {
      await builderSession.document?.changeTemplate(option.value);
    });

    return (
      <button
        type='button'
        aria-label={`Select ${option.name} template`}
        aria-pressed={isSelected}
        className='group flex min-w-0 flex-col gap-1.5 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        onClick={handleOptionClick}
      >
        <div
          className={cn(
            'relative rounded-md ring-1 ring-border/70 transition-[box-shadow,ring-color] duration-150 motion-reduce:transition-none',
            isSelected
              ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
              : 'group-hover:ring-foreground/45'
          )}
        >
          <div className='absolute inset-0 overflow-hidden rounded-md'>
            <TemplateImage
              template={option}
              variant='card'
              imgProps={{
                width: 400,
                height: 566,
                className: 'w-full h-full object-cover',
                alt: '',
              }}
            />
            {isSelected && (
              <div className='absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border border-border/70 bg-background/95 text-foreground shadow-sm'>
                <span className='sr-only'>Selected</span>
                <CheckIcon aria-hidden='true' className='size-4' />
              </div>
            )}
          </div>

          {/* aspect ratio placeholder */}
          <div className='aspect-[1/1.414]' />
        </div>

        <p
          className={cn(
            'truncate text-xs font-medium text-center transition-colors motion-reduce:transition-none',
            isSelected
              ? 'text-foreground'
              : 'text-muted-foreground group-hover:text-foreground'
          )}
        >
          {option.name}
        </p>
      </button>
    );
  }
);
