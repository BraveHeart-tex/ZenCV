'use client';

import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DEX_Field, SelectField } from '@/lib/client-db/clientDbSchema';
import { getFieldHtmlId } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

export const DocumentBuilderSelectInput = observer(
  ({ fieldId }: { fieldId: DEX_Field['id'] }) => {
    const field = builderRootStore.fieldStore.getFieldById(
      fieldId
    ) as SelectField;

    if (!field) {
      return null;
    }

    const htmlInputId = getFieldHtmlId(field);

    return (
      <div className='flex flex-col gap-2'>
        <Label htmlFor={htmlInputId}>{field.name}</Label>
        <Select
          value={field.value}
          onValueChange={action(async (newValue) => {
            await builderRootStore.fieldStore.setFieldValue(field.id, newValue);
          })}
        >
          <SelectTrigger
            className='w-full'
            id={htmlInputId}
            ref={(ref) =>
              builderRootStore.UIStore.setFieldRef(field.id.toString(), ref)
            }
          >
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
  }
);
