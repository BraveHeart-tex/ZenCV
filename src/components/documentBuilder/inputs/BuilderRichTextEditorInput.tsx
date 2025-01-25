'use client';
import RichTextEditor from '@/components/richTextEditor/RichTextEditor';
import { observer } from 'mobx-react-lite';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { action } from 'mobx';
import { getFieldHtmlId } from '@/lib/helpers/documentBuilderHelpers';

const BuilderRichTextEditorInput = observer(
  ({ fieldId }: { fieldId: DEX_Field['id'] }) => {
    const field = documentBuilderStore.getFieldById(fieldId);
    if (!field) return null;

    const id = getFieldHtmlId(field);

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
        <RichTextEditor
          id={id}
          initialValue={field.value}
          placeholder={field?.placeholder || ''}
          onChange={action(async (html) => {
            await documentBuilderStore.setFieldValue(fieldId, html);
          })}
        />
      </>
    );
  },
);

export default BuilderRichTextEditorInput;
