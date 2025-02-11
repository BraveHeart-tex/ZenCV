'use client';
import RichTextEditor, {
  EditorRef,
} from '@/components/richTextEditor/RichTextEditor';
import { observer } from 'mobx-react-lite';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { action } from 'mobx';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { useRef } from 'react';
import { getFieldHtmlId } from '@/lib/helpers/documentBuilderHelpers';
import AiSuggestionsWidget from '../aiSuggestions/AiSuggestionsWidget';

const BuilderRichTextEditorInput = observer(
  ({ fieldId }: { fieldId: DEX_Field['id'] }) => {
    const field = builderRootStore.fieldStore.getFieldById(fieldId);
    if (!field) return null;

    const id = getFieldHtmlId(field);
    const containerRef = useRef<HTMLDivElement | null>(null);

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

        <AiSuggestionsWidget
          fieldId={fieldId}
          containerRef={containerRef}
          onAcceptSuggestion={(suggestionValue) => {
            const editorRef = builderRootStore.UIStore.fieldRefs.get(
              fieldId.toString(),
            );
            if (editorRef) {
              (editorRef as EditorRef)?.setContent(suggestionValue);
            }
          }}
        />
      </>
    );
  },
);

export default BuilderRichTextEditorInput;
