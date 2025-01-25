'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { action } from 'mobx';
import {
  CONTAINER_TYPES,
  DEX_Field,
  FIELD_TYPES,
} from '@/lib/client-db/clientDbSchema';
import DateFieldInput from '@/components/documentBuilder/inputs/DateFieldInput';
import { getFieldHtmlId } from '@/lib/helpers/documentBuilderHelpers';
import DocumentBuilderSelectInput from '@/components/documentBuilder/DocumentBuilderSelectInput';
import { SELECT_TYPES } from '@/lib/constants';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/stringUtils';
import BuilderRichTextEditorInput from '@/components/documentBuilder/inputs/BuilderRichTextEditorInput';

interface SectionFieldProps {
  fieldId: DEX_Field['id'];
}

const SectionField = observer(({ fieldId }: SectionFieldProps) => {
  const field = documentBuilderStore.getFieldById(fieldId);

  if (!field) return null;

  const htmlInputId = getFieldHtmlId(field);

  const renderInput = () => {
    if (field.type === FIELD_TYPES.STRING) {
      return (
        <>
          <Label htmlFor={htmlInputId}>{field.name}</Label>
          <Input
            id={htmlInputId}
            type="text"
            value={field.value}
            onChange={action(async (e) => {
              await documentBuilderStore.setFieldValue(
                field.id,
                e.target.value,
              );
            })}
            placeholder={field?.placeholder}
          />
        </>
      );
    }

    if (field.type === FIELD_TYPES.DATE_MONTH) {
      return <DateFieldInput fieldId={fieldId} />;
    }

    if (field.type === FIELD_TYPES.SELECT) {
      if (field.selectType === SELECT_TYPES.BASIC) {
        return <DocumentBuilderSelectInput fieldId={fieldId} />;
      }
    }

    if (field.type === FIELD_TYPES.RICH_TEXT) {
      return (
        <>
          {documentBuilderStore.getItemById(field.itemId)?.containerType ===
          CONTAINER_TYPES.COLLAPSIBLE ? (
            <Label htmlFor={htmlInputId}>{field.name}</Label>
          ) : null}
          <BuilderRichTextEditorInput fieldId={fieldId} />
        </>
      );
    }

    if (field.type === FIELD_TYPES.TEXTAREA) {
      return (
        <>
          <Label htmlFor={htmlInputId}>{field.name}</Label>
          <Textarea
            id={htmlInputId}
            value={field.value}
            onChange={action(async (e) => {
              await documentBuilderStore.setFieldValue(
                field.id,
                e.target.value,
              );
            })}
            placeholder={field?.placeholder}
          />
        </>
      );
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        (field.type === FIELD_TYPES.RICH_TEXT ||
          field.type === FIELD_TYPES.TEXTAREA) &&
          'col-span-2',
      )}
    >
      {renderInput()}
    </div>
  );
});

export default SectionField;
