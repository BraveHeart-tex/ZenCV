'use client';
import { Button } from '@/components/ui/button';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { setSummaryFieldValue } from '@/lib/helpers/documentBuilderHelpers';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { useFloating } from '@floating-ui/react';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

interface AISuggestionWidgetProps {
  fieldId: DEX_Field['id'];
  containerRef: React.RefObject<HTMLDivElement | null>;
  onAcceptSuggestion?: (suggestion: string) => void;
}

const AiSuggestionsWidget = observer(
  ({ containerRef, fieldId, onAcceptSuggestion }: AISuggestionWidgetProps) => {
    const suggestion =
      builderRootStore.builderAiSuggestionsStore.fieldSuggestions.get(fieldId);

    const { refs, floatingStyles, update } = useFloating({
      placement: 'right',
    });

    useEffect(() => {
      if (containerRef.current && suggestion) {
        refs.setReference(containerRef.current);
        update();
      } else {
        refs.setReference(null);
      }

      return () => {
        refs.setReference(null);
      };
    }, [containerRef, refs, update, suggestion]);

    const renderSuggestionWidget = () => {
      if (suggestion?.type === 'text') {
        return (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 z-50 max-w-xl p-4 border rounded-lg shadow-md outline-none"
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {suggestion.title}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {suggestion.description}
                </p>
              </div>
              <span className="flex-1 max-h-[300px] overflow-auto">
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
      } else if (suggestion?.type === 'options') {
        return (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 z-50 max-w-xl p-4 overflow-auto border rounded-lg shadow-md outline-none"
          >
            Render a list of suggestions
          </div>
        );
      }
    };

    return renderSuggestionWidget();
  },
);
export default AiSuggestionsWidget;
