import { type LucideIcon, PlusIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showErrorToast } from '@/components/ui/sonner';
import type { SemanticSectionKey } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import {
  builderSectionTitleClassNames,
  OTHER_SECTION_OPTIONS,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { cn } from '@/lib/utils/stringUtils';
import { builderInputClassNames } from './inputs/builderInput.constants';

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
    <article className='space-y-3 border-t border-border/60 pt-5'>
      <h3 className={cn(builderSectionTitleClassNames, 'text-base')}>
        Add section
      </h3>
      <div>
        <Label className='sr-only' htmlFor='additional-resume-section'>
          Choose a section
        </Label>
        <div className='flex gap-2'>
          <Select
            value={selectedOption?.sectionKey ?? ''}
            disabled={adding}
            onValueChange={setSelectedKey}
          >
            <SelectTrigger
              id='additional-resume-section'
              className={`${builderInputClassNames} h-10 min-w-0 flex-1`}
            >
              <SelectValue placeholder='Choose a section' />
            </SelectTrigger>
            <SelectContent>
              {availableOptions.map((option) => (
                <SelectItem key={option.sectionKey} value={option.sectionKey}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant='outline'
            className='h-10 shrink-0'
            disabled={adding || !selectedOption}
            onClick={() => {
              if (selectedOption) {
                void handleAddSection(selectedOption);
              }
            }}
          >
            <PlusIcon aria-hidden='true' />
            {adding ? 'Adding…' : 'Add'}
          </Button>
        </div>
      </div>
    </article>
  );
});
