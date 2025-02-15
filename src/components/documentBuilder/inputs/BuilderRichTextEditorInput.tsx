'use client';
import RichTextEditor, {
  EditorRef,
} from '@/components/richTextEditor/RichTextEditor';
import { observer } from 'mobx-react-lite';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { action } from 'mobx';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { getFieldHtmlId } from '@/lib/helpers/documentBuilderHelpers';
import AiSuggestionsWidget from '../aiSuggestions/AiSuggestionsWidget';
import { Button } from '@/components/ui/button';
import { SparklesIcon } from 'lucide-react';
import { cn } from '@/lib/utils/stringUtils';

interface BuilderRichTextEditorInputProps {
  fieldId: DEX_Field['id'];
  shouldRenderAiWidget?: boolean;
}

const BuilderRichTextEditorInput = observer(
  ({ fieldId, shouldRenderAiWidget }: BuilderRichTextEditorInputProps) => {
    const field = builderRootStore.fieldStore.getFieldById(fieldId);
    if (!field) return null;

    const id = getFieldHtmlId(field);

    const renderEditorFooter = () => {
      if (!shouldRenderAiWidget) return null;

      return (
        <AiSuggestionsWidget
          fieldId={fieldId}
          onAcceptSuggestion={(suggestionValue) => {
            const editorRef = builderRootStore.UIStore.fieldRefs.get(
              fieldId.toString(),
            );
            if (editorRef) {
              (editorRef as EditorRef)?.setContent(suggestionValue);
            }
          }}
          renderTrigger={() => {
            return (
              <div
                className={cn(
                  'absolute bottom-0 left-0 xl:left-auto xl:right-0',
                )}
              >
                <Button
                  variant="outline"
                  className="border-br-0 items-center gap-2 border-b-0 border-r-0 rounded-tr-none rounded-bl-none"
                >
                  <SparklesIcon />
                  Get AI Suggestion
                </Button>
              </div>
            );
          }}
        />
      );
    };

    const handleRichTextChange = action(async (html: string) => {
      await builderRootStore.fieldStore.setFieldValue(fieldId, html);
    });

    return (
      <div>
        <RichTextEditor
          ref={(ref) => {
            builderRootStore.UIStore.setFieldRef(fieldId.toString(), ref);
          }}
          id={id}
          initialValue={field.value}
          placeholder={field?.placeholder || ''}
          onChange={handleRichTextChange}
          renderEditorFooter={renderEditorFooter}
        />
      </div>
    );
  },
);

export default BuilderRichTextEditorInput;
