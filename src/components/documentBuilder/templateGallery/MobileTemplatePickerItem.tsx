import { CheckIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';

import type { TemplateOptionWithVariants } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { CarouselItem } from '@/components/ui/carousel';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

import { cn } from '@/lib/utils/stringUtils';
import { TemplateImage } from '../TemplateImage';

interface MobileTemplatePickerItemProps {
  template: TemplateOptionWithVariants;
}

export const MobileTemplatePickerItem = observer(
  ({ template }: MobileTemplatePickerItemProps) => {
    const isSelected =
      builderRootStore.documentStore.document?.templateType === template.value;

    const handleSelectTemplate = action(async () => {
      await builderRootStore.documentStore.changeDocumentTemplateType(
        template.value
      );
    });

    return (
      <CarouselItem className='basis-1/3 sm:basis-1/4 pl-2'>
        <button
          type='button'
          className='relative w-full flex flex-col gap-1.5 cursor-pointer'
          onClick={handleSelectTemplate}
        >
          <div
            className={cn(
              'relative aspect-3/4 rounded-lg w-full transition-all duration-200 border border-transparent',
              isSelected && 'border-blue-500'
            )}
          >
            <div className='absolute inset-0 rounded-lg overflow-hidden'>
              <TemplateImage
                template={template}
                variant='card'
                imgProps={{
                  width: 400,
                  height: 566,
                  className: 'object-cover w-full h-full',
                  alt: template.name,
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
          </div>

          <p
            className={cn(
              'text-xs font-medium text-center truncate w-full transition-colors',
              isSelected ? 'text-blue-500' : 'text-muted-foreground'
            )}
          >
            {template.name}
          </p>
        </button>
      </CarouselItem>
    );
  }
);
