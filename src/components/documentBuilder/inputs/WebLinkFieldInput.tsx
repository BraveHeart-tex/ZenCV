import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { FieldPersistenceError } from '@/components/documentBuilder/FieldPersistenceError';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FieldId } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { cn } from '@/lib/utils/stringUtils';
import { normalizeWebUrl } from '@/lib/utils/urlUtils';

export const WebLinkFieldInput = observer(
  ({ fieldId }: { fieldId: FieldId }) => {
    const [touched, setTouched] = useState(false);
    const field = builderSession.getField(fieldId);

    const setFieldRef = useCallback(
      (ref: HTMLInputElement | null) => {
        if (ref) {
          builderSession.UIStore.setFieldRef(fieldId.toString(), ref);
        }
      },
      [fieldId]
    );

    if (!field) {
      return null;
    }

    const htmlInputId = `field-${fieldId}`;
    const errorId = `${htmlInputId}-error`;
    const hasError =
      touched && !!field.value.trim() && !normalizeWebUrl(field.value);

    const handleChange = action(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        field.setDraft(event.target.value);
      }
    );

    const handleBlur = action(async () => {
      setTouched(true);
      const normalizedUrl = normalizeWebUrl(field.value);
      field.setDraft(normalizedUrl ?? field.value);
      await field.commit();
    });

    return (
      <>
        <div
          className={cn(
            'flex items-center justify-between gap-8',
            field.definition.labelRow === 'compact' && 'max-h-3.5'
          )}
        >
          <Label htmlFor={htmlInputId}>{field.label}</Label>
        </div>
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
        <FieldPersistenceError field={field} />
      </>
    );
  }
);
