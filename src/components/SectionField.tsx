'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { action } from 'mobx';
import { FIELD_TYPES } from '@/lib/schema';
import DateFieldInput from '@/components/DateFieldInput';
import { getFieldHtmlId } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import DocumentBuilderSelectInput from '@/components/DocumentBuilderSelectInput';
import { SELECT_TYPES } from '@/lib/constants';

const SectionField = observer(({ fieldId }: { fieldId: number }) => {
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
      return 'rich-text';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        field.type === FIELD_TYPES.RICH_TEXT && 'col-span-2',
      )}
    >
      {renderInput()}
    </div>
  );
});

export default SectionField;
