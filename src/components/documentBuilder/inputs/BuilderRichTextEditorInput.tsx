import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { FieldPersistenceError } from '@/components/documentBuilder/FieldPersistenceError';
import { RichTextCharacterCounter } from '@/components/documentBuilder/RichTextCharacterCounter';
import { RichTextEditor } from '@/components/richTextEditor/RichTextEditor';
import type { FieldId } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

interface BuilderRichTextEditorInputProps {
  fieldId: FieldId;
  ariaLabelledBy?: string;
}

export const BuilderRichTextEditorInput = observer(
  ({ fieldId, ariaLabelledBy }: BuilderRichTextEditorInputProps) => {
    const field = builderSession.getField(fieldId);
    if (!field) {
      return null;
    }

    const id = `field-${fieldId}`;

    const handleRichTextChange = action(async (html: string) => {
      field.setDebounced(html);
    });

    return (
      <div>
        <RichTextEditor
          ref={(ref) => {
            builderSession.UIStore.setFieldRef(fieldId.toString(), ref);
          }}
          id={id}
          ariaLabelledBy={ariaLabelledBy}
          initialValue={field.value}
          placeholder={field.definition.richText?.guidance || ''}
          onChange={handleRichTextChange}
          footer={null}
        />
        <RichTextCharacterCounter
          fieldValue={field.value}
          itemId={field.itemId}
          enabled={field.definition.richText?.characterCounter ?? false}
        />
        <FieldPersistenceError field={field} />
      </div>
    );
  }
);
