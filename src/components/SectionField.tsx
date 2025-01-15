'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const SectionField = observer(({ fieldId }: { fieldId: number }) => {
  const field = documentBuilderStore.getFieldById(fieldId);

  if (!field) return null;

  const renderInput = () => {
    if (field.type === 'string') {
      return (
        <Input
          type="text"
          value={field.value}
          onChange={(e) => {
            documentBuilderStore.setFieldValue(field.id, e.target.value);
          }}
        />
      );
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Label>{field.name}</Label>
      {renderInput()}
    </div>
  );
});

export default SectionField;
