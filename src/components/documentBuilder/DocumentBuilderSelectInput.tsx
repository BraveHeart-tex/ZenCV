import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { FieldPersistenceError } from '@/components/documentBuilder/FieldPersistenceError';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

export const DocumentBuilderSelectInput = observer(
  ({ fieldId }: { fieldId: number }) => {
    const field = builderRootStore.getField(fieldId);

    if (!field) {
      return null;
    }

    const htmlInputId = `field-${fieldId}`;

    return (
      <div className='flex flex-col gap-2'>
        <Label htmlFor={htmlInputId}>{field.label}</Label>
        <Select
          value={field.value}
          onValueChange={action(async (newValue) => {
            field.setDebounced(newValue);
          })}
        >
          <SelectTrigger
            className='w-full'
            id={htmlInputId}
            ref={(ref) =>
              builderRootStore.UIStore.setFieldRef(field.id.toString(), ref)
            }
          >
            <SelectValue placeholder={field.label} />
          </SelectTrigger>
          <SelectContent>
            {(field.definition.options ?? []).map((option) => (
              <SelectItem value={option} key={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldPersistenceError field={field} />
      </div>
    );
  }
);
