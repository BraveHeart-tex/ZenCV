import { CheckIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import type { TemplateOption } from '@/lib/types/documentBuilder.types';
import { cn } from '@/lib/utils/stringUtils';

const aspectRatio = 0.75;
const width = 300;
const height = width / aspectRatio;

interface ResumeTemplateOptionItemProps {
  option: TemplateOption;
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
          <Image
            src={option.image}
            width={width}
            height={height}
            alt={`Template ${option.name}`}
            className={cn(
              'ring-2 ring-transparent group-hover:ring-blue-500 object-cover transition-all duration-300 rounded-md',
              isSelected && 'ring-2 ring-blue-500'
            )}
          />
        </div>
      </article>
    );
  }
);
