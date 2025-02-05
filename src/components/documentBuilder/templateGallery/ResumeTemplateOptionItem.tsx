import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { TemplateOption } from '@/lib/types/documentBuilder.types';
import { cn } from '@/lib/utils/stringUtils';
import { CheckIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';

interface ResumeTemplateOptionItemProps {
  option: TemplateOption;
}

const ResumeTemplateOptionItem = observer(
  ({ option }: ResumeTemplateOptionItemProps) => {
    const isSelected =
      builderRootStore.documentStore.document?.templateType === option.value;

    return (
      <article
        className="group relative flex flex-col gap-1 cursor-pointer"
        onClick={action(async () => {
          await builderRootStore.documentStore.changeDocumentTemplateType(
            option.value,
          );
        })}
      >
        <h3 className="text-base font-medium text-center">{option.name}</h3>
        <div className="relative">
          {isSelected && (
            <span className="bg-primary text-primary-foreground dark:bg-background dark:text-foreground top-1/2 left-1/2 absolute flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full">
              <CheckIcon />
            </span>
          )}
          <Image
            src={option.image}
            width={300}
            height={400}
            alt={`Template ${option.name}`}
            className={cn(
              'ring-2 ring-transparent group-hover:ring-blue-500 object-cover transition-all duration-300 rounded-md',
              isSelected && 'ring-2 ring-blue-500',
            )}
          />
        </div>
      </article>
    );
  },
);

export default ResumeTemplateOptionItem;
