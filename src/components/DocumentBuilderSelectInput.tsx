'use client';

import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { getFieldHtmlId } from '@/lib/helpers';
import { Label } from '@/components/ui/label';
import { DEX_Field, SelectField } from '@/lib/schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { action } from 'mobx';

const DocumentBuilderSelectInput = observer(
  ({ fieldId }: { fieldId: DEX_Field['id'] }) => {
    const field = documentBuilderStore.getFieldById(fieldId)! as SelectField;
    const htmlInputId = getFieldHtmlId(field);

    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={htmlInputId}>{field.name}</Label>
        <Select
          value={field.value}
          onValueChange={action(async (newValue) => {
            await documentBuilderStore.setFieldValue(field.id, newValue);
          })}
        >
          <SelectTrigger className="w-full" id={htmlInputId}>
            <SelectValue placeholder={field.name} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem value={option} key={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);

export default DocumentBuilderSelectInput;
