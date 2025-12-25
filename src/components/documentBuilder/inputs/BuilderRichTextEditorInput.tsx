'use client';
import { SparklesIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { RichTextCharacterCounter } from '@/components/documentBuilder/RichTextCharacterCounter';
import {
  type EditorRef,
  RichTextEditor,
} from '@/components/richTextEditor/RichTextEditor';
import { Button } from '@/components/ui/button';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { getFieldHtmlId } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { AiSuggestionsWidget } from '../aiSuggestions/AiSuggestionsWidget';

interface BuilderRichTextEditorInputProps {
  fieldId: DEX_Field['id'];
  shouldRenderAiWidget?: boolean;
}

export const BuilderRichTextEditorInput = observer(
  ({ fieldId, shouldRenderAiWidget }: BuilderRichTextEditorInputProps) => {
    const field = builderRootStore.fieldStore.getFieldById(fieldId);
    if (!field) return null;

    const id = getFieldHtmlId(field);

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
          footer={
            shouldRenderAiWidget ? (
              <AiSuggestionsWidget
                fieldId={fieldId}
                onAcceptSuggestion={(suggestionValue) => {
                  const editorRef = builderRootStore.UIStore.fieldRefs.get(
                    fieldId.toString()
                  );
                  if (editorRef) {
                    (editorRef as EditorRef)?.setContent(suggestionValue);
                  }
                }}
                trigger={
                  <div className='xl:left-auto xl:right-0 absolute bottom-0 left-0'>
                    <Button
                      variant='outline'
                      className='xl:border-br-0 xl:border-r-0 xl:rounded-tr-none xl:rounded-bl-none xl:border-l xl:rounded-tl xl:rounded-br border-b-0 border-l-0 rounded-tl-none rounded-br-none'
                    >
                      <SparklesIcon />
                      Get AI Suggestion
                    </Button>
                  </div>
                }
              />
            ) : null
          }
        />
        <RichTextCharacterCounter
          fieldValue={field.value}
          itemId={field.itemId}
        />
      </div>
    );
  }
);
