import type { LucideIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import type { DEX_Item, DEX_Section } from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import {
  builderSectionTitleClassNames,
  INTERNAL_SECTION_TYPES,
  OTHER_SECTION_OPTIONS,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import type { TemplatedSectionType } from '@/lib/types/documentBuilder.types';
import { cn } from '@/lib/utils/stringUtils';

export interface OtherSectionOption
  extends Omit<
    DEX_Section,
    'id' | 'documentId' | 'displayOrder' | 'defaultName'
  > {
  type: TemplatedSectionType;
  icon: LucideIcon;
  containerType: DEX_Item['containerType'];
}

export const AddSectionWidget = observer(() => {
  const handleAddSection = action(async (option: OtherSectionOption) => {
    const result = await builderRootStore.sectionStore.addNewSection(option);
    if (result?.itemId) {
      builderRootStore.UIStore.focusFirstFieldInItem(result.itemId);
    }
  });

  return (
    <article className='border-border/70 space-y-3 border-t pt-6'>
      <div className='space-y-1'>
        <h3 className={cn(builderSectionTitleClassNames, 'text-xl')}>
          Add section
        </h3>
        <p className='text-muted-foreground text-sm'>
          Add only the sections that strengthen this version of your CV.
        </p>
      </div>
      <div className='grid gap-2 md:grid-cols-2'>
        {OTHER_SECTION_OPTIONS.map((option) => {
          const isAlreadyAdded =
            option.type !== INTERNAL_SECTION_TYPES.CUSTOM &&
            builderRootStore.sectionStore.sections.some(
              (section) => section.type === option.type
            );

          return (
            <Button
              variant='ghost'
              disabled={isAlreadyAdded}
              title={isAlreadyAdded ? `${option.title} is already added` : ''}
              onClick={() => handleAddSection(option)}
              key={option.type}
              className='min-h-11 justify-between gap-3 px-3 text-base'
            >
              <span className='flex min-w-0 items-center gap-2 text-left'>
                <option.icon aria-hidden='true' className='shrink-0' />
                <span className='truncate'>{option.title}</span>
              </span>
              {isAlreadyAdded ? (
                <span className='text-muted-foreground shrink-0 text-xs font-medium'>
                  Already added
                </span>
              ) : null}
            </Button>
          );
        })}
      </div>
    </article>
  );
});
