'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { action } from 'mobx';
import { FIELD_TYPES } from '@/lib/schema';
import DateFieldInput from '@/components/DateFieldInput';

const SectionField = observer(({ fieldId }: { fieldId: number }) => {
  const field = documentBuilderStore.getFieldById(fieldId);

  if (!field) return null;

  const htmlInputId = `${field.itemId}-${field.name}`;

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
      return 'select';
    }

    if (field.type === FIELD_TYPES.RICH_TEXT) {
      return 'rich-text';
    }
  };

  return <div className="flex flex-col gap-1">{renderInput()}</div>;
});

export default SectionField;
