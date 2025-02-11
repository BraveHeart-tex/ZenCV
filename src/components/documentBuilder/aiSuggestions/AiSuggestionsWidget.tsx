'use client';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import {
  getSummaryField,
  setSummaryFieldValue,
} from '@/lib/helpers/documentBuilderHelpers';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import SummaryAiSuggestionWidget from './SummaryAiSuggestionWidget';

interface AISuggestionWidgetProps {
  fieldId: DEX_Field['id'];
  containerRef: React.RefObject<HTMLDivElement | null>;
  onAcceptSuggestion?: (suggestion: string) => void;
  renderTrigger: () => React.ReactNode;
}

const AiSuggestionsWidget = observer(
  ({ fieldId, onAcceptSuggestion, renderTrigger }: AISuggestionWidgetProps) => {
    const [open, setOpen] = useState(false);
    const suggestion =
      builderRootStore.builderAiSuggestionsStore.fieldSuggestions.get(fieldId);
    const isMobile = useMediaQuery('(max-width: 1280px)', false);
    const summaryField = getSummaryField();
    const isProfessionalSummary = fieldId === summaryField?.id;

    const renderSuggestionWidget = () => {
      if (!suggestion) {
        if (isProfessionalSummary) {
          return (
            <div className="space-y-4">
              <SummaryAiSuggestionWidget summaryField={summaryField} />
            </div>
          );
        }
      }

      if (suggestion?.type === 'text') {
        return (
          <div>
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {suggestion.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {suggestion.description}
                </p>
              </div>
              <span className="flex-1 max-h-[12.5rem] xl:max-h-[19rem] overflow-auto p-2 bg-muted rounded-md">
                {suggestion.value}
              </span>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    confirmDialogStore.showDialog({
                      title: 'Are you sure you want to cancel?',
                      message:
                        'This action cannot be undone. The suggestion will not be applied.',
                      confirmText: 'Yes',
                      cancelText: 'No',
                      onConfirm() {
                        setOpen(false);
                        runInAction(() => {
                          confirmDialogStore.hideDialog();
                          builderRootStore.builderAiSuggestionsStore.fieldSuggestions.delete(
                            fieldId,
                          );
                        });
                      },
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={action(async () => {
                    setOpen(false);
                    builderRootStore.builderAiSuggestionsStore.fieldSuggestions.delete(
                      fieldId,
                    );
                    await setSummaryFieldValue(suggestion.value);
                    onAcceptSuggestion?.(suggestion.value);
                  })}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        );
      }

      return null;
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{renderTrigger()}</PopoverTrigger>
        <PopoverContent
          avoidCollisions={false}
          side={isMobile ? 'top' : 'top'}
          align="start"
          className="max-w-[80vw] w-max lg:max-w-lg"
        >
          {renderSuggestionWidget()}
        </PopoverContent>
      </Popover>
    );
  },
);
export default AiSuggestionsWidget;
