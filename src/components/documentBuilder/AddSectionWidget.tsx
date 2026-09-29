import type { LucideIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import { showErrorToast } from '@/components/ui/sonner';
import type { SemanticSectionKey } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import {
  builderSectionTitleClassNames,
  OTHER_SECTION_OPTIONS,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { cn } from '@/lib/utils/stringUtils';

export interface OtherSectionOption {
  sectionKey: SemanticSectionKey;
  title: string;
  defaultTitle: string;
  metadata?: string;
  icon: LucideIcon;
}

export const AddSectionWidget = observer(() => {
  const handleAddSection = action(async (option: OtherSectionOption) => {
    const result = await builderSession.document?.addSection(option);
    if (result?.success && result.data) {
      builderSession.UIStore.toggleItem(result.data.itemId);
      builderSession.UIStore.focusFirstFieldInItem(result.data.itemId);
    } else {
      showErrorToast('Could not add section. Please try again.');
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
            option.sectionKey !== 'custom' &&
            builderSession.document?.sections.some(
              (section) => section.sectionKey === option.sectionKey
            );

          return (
            <Button
              variant='ghost'
              disabled={isAlreadyAdded}
              title={isAlreadyAdded ? `${option.title} is already added` : ''}
              onClick={() => handleAddSection(option)}
              key={option.sectionKey}
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
