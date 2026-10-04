import { CheckIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';

import type { TemplateOptionWithVariants } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { CarouselItem } from '@/components/ui/carousel';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

import { cn } from '@/lib/utils/stringUtils';
import { TemplateImage } from '../TemplateImage';

interface MobileTemplatePickerItemProps {
  template: TemplateOptionWithVariants;
}

export const MobileTemplatePickerItem = observer(
  ({ template }: MobileTemplatePickerItemProps) => {
    const isSelected = builderSession.document?.templateType === template.value;

    const handleSelectTemplate = action(async () => {
      await builderSession.document?.changeTemplate(template.value);
    });

    return (
      <CarouselItem className='basis-1/3 sm:basis-1/4 pl-2'>
        <button
          type='button'
          aria-label={`Select ${template.name} template`}
          aria-pressed={isSelected}
          className='relative flex w-full flex-col gap-1.5 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          onClick={handleSelectTemplate}
        >
          <div
            className={cn(
              'relative aspect-3/4 w-full rounded-md border border-border/70 transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none',
              isSelected && 'border-foreground ring-1 ring-foreground'
            )}
          >
            <div className='absolute inset-0 overflow-hidden rounded-md'>
              <TemplateImage
                template={template}
                variant='card'
                imgProps={{
                  width: 400,
                  height: 566,
                  className: 'object-cover w-full h-full',
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
          </div>

          <p
            className={cn(
              'w-full truncate text-xs font-medium text-center transition-colors motion-reduce:transition-none',
              isSelected ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {template.name}
          </p>
        </button>
      </CarouselItem>
    );
  }
);
