'use client';
import RichTextEditor, {
  EditorRef,
} from '@/components/richTextEditor/RichTextEditor';
import { observer } from 'mobx-react-lite';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { action, runInAction } from 'mobx';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { useFloating } from '@floating-ui/react';
import { useEffect, useRef } from 'react';
import {
  getFieldHtmlId,
  setSummaryFieldValue,
} from '@/lib/helpers/documentBuilderHelpers';
import { Button } from '@/components/ui/button';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';

const BuilderRichTextEditorInput = observer(
  ({ fieldId }: { fieldId: DEX_Field['id'] }) => {
    const field = builderRootStore.fieldStore.getFieldById(fieldId);
    if (!field) return null;

    const id = getFieldHtmlId(field);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { refs, floatingStyles, update } = useFloating({
      placement: 'right-end',
    });

    const suggestion =
      builderRootStore.builderAiSuggestionsStore.fieldSuggestions.get(fieldId);

    const shouldRenderSuggestion = !!suggestion;

    useEffect(() => {
      if (containerRef.current && shouldRenderSuggestion) {
        refs.setReference(containerRef.current);
        update();
      } else {
        refs.setReference(null);
      }

      return () => {
        refs.setReference(null);
      };
    }, [shouldRenderSuggestion, containerRef, refs, update]);

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
                    const editorRef = builderRootStore.UIStore.fieldRefs.get(
                      fieldId.toString(),
                    );
                    if (editorRef) {
                      (editorRef as EditorRef)?.setContent(suggestion.value);
                    }
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

    return (
      <>
        <style jsx global>{`
          .tiptap.ProseMirror {
            min-height: 200px;
            padding: 10px;
            background: hsl(var(--background));
          }

          .editor-input-container {
            border: 1px solid hsl(var(--input));
          }

          .editor-input-menubar {
            border-bottom: 1px solid hsl(var(--input));
          }
        `}</style>
        <div ref={containerRef}>
          <RichTextEditor
            ref={(ref) => {
              builderRootStore.UIStore.setFieldRef(fieldId.toString(), ref);
            }}
            id={id}
            initialValue={field.value}
            placeholder={field?.placeholder || ''}
            onChange={action(async (html) => {
              await builderRootStore.fieldStore.setFieldValue(fieldId, html);
            })}
          />
        </div>

        {shouldRenderSuggestion && renderSuggestionWidget()}
      </>
    );
  },
);

export default BuilderRichTextEditorInput;
