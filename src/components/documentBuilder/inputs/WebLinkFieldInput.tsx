import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { getFieldHtmlId } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { normalizeWebUrl } from '@/lib/utils/urlUtils';

export const WebLinkFieldInput = observer(
  ({ fieldId }: { fieldId: DEX_Field['id'] }) => {
    const [touched, setTouched] = useState(false);
    const field = builderRootStore.fieldStore.getFieldById(fieldId);

    const setFieldRef = useCallback(
      (ref: HTMLInputElement | null) => {
        if (ref) {
          builderRootStore.UIStore.setFieldRef(fieldId.toString(), ref);
        }
      },
      [fieldId]
    );

    if (!field) {
      return null;
    }

    const htmlInputId = getFieldHtmlId(field);
    const errorId = `${htmlInputId}-error`;
    const hasError =
      touched && !!field.value.trim() && !normalizeWebUrl(field.value);

    const handleChange = action(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        void builderRootStore.fieldStore.setFieldValue(
          fieldId,
          event.target.value,
          false
        );
      }
    );

    const handleBlur = action(async () => {
      setTouched(true);
      const currentField = builderRootStore.fieldStore.getFieldById(fieldId);
      if (!currentField) {
        return;
      }

      const normalizedUrl = normalizeWebUrl(currentField.value);
      await builderRootStore.fieldStore.setFieldValue(
        fieldId,
        normalizedUrl ?? currentField.value
      );
    });

    return (
      <>
        <Label htmlFor={htmlInputId}>{field.name}</Label>
        <Input
          id={htmlInputId}
          ref={setFieldRef}
          type='url'
          inputMode='url'
          value={field.value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='https://example.com'
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          data-1p-ignore='true'
          data-lpignore='true'
          data-protonpass-ignore='true'
          data-bwignore='true'
        />
        {hasError ? (
          <p id={errorId} className='text-destructive text-sm' role='alert'>
            Enter a valid HTTP or HTTPS URL.
          </p>
        ) : null}
      </>
    );
  }
);
