import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { RichTextCharacterCounter } from '@/components/documentBuilder/RichTextCharacterCounter';
import { RichTextEditor } from '@/components/richTextEditor/RichTextEditor';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { getFieldHtmlId } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface BuilderRichTextEditorInputProps {
  fieldId: DEX_Field['id'];
  ariaLabelledBy?: string;
}

export const BuilderRichTextEditorInput = observer(
  ({ fieldId, ariaLabelledBy }: BuilderRichTextEditorInputProps) => {
    const field = builderRootStore.fieldStore.getFieldById(fieldId);
    if (!field) {
      return null;
    }

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
          ariaLabelledBy={ariaLabelledBy}
          initialValue={field.value}
          placeholder={field?.placeholder || ''}
          onChange={handleRichTextChange}
          footer={null}
        />
        <RichTextCharacterCounter
          fieldValue={field.value}
          itemId={field.itemId}
        />
      </div>
    );
  }
);
