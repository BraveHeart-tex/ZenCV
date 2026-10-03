import type { LucideIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  const [selectedKey, setSelectedKey] = useState('');
  const [adding, setAdding] = useState(false);
  const availableOptions = OTHER_SECTION_OPTIONS.filter(
    (option) =>
      option.sectionKey === 'custom' ||
      !builderSession.document?.sections.some(
        (section) => section.sectionKey === option.sectionKey
      )
  );
  const selectedOption =
    availableOptions.find((option) => option.sectionKey === selectedKey) ??
    availableOptions[0];
  const handleAddSection = action(async (option: OtherSectionOption) => {
    if (adding) {
      return;
    }
    setAdding(true);
    try {
      const result = await builderSession.document?.addSection(option);
      if (result?.success && result.data) {
        builderSession.UIStore.toggleItem(result.data.itemId);
        builderSession.UIStore.focusFirstFieldInItem(result.data.itemId);
      } else {
        showErrorToast('Could not add section. Please try again.');
      }
    } catch {
      showErrorToast('Could not add section. Please try again.');
    } finally {
      setAdding(false);
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
      <div className='space-y-2'>
        <Label htmlFor='additional-resume-section'>Choose a section</Label>
        <div className='flex flex-wrap gap-2'>
          <select
            id='additional-resume-section'
            value={selectedOption?.sectionKey ?? ''}
            disabled={adding}
            onChange={(event) => setSelectedKey(event.target.value)}
            className='border-input bg-background h-11 min-w-0 flex-1 rounded-md border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2'
          >
            {availableOptions.map((option) => (
              <option key={option.sectionKey} value={option.sectionKey}>
                {option.title}
              </option>
            ))}
          </select>
          <Button
            variant='outline'
            className='h-11'
            disabled={adding || !selectedOption}
            onClick={() => {
              if (selectedOption) {
                void handleAddSection(selectedOption);
              }
            }}
          >
            {adding ? 'Adding...' : 'Add section'}
          </Button>
        </div>
      </div>
    </article>
  );
});
