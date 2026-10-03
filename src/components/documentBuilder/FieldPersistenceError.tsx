import { observer } from 'mobx-react-lite';
import type { SemanticField } from '@/lib/builderDocument/builderDocument';

export const FieldPersistenceError = observer(
  ({ field }: { field: SemanticField }) => {
    if (!field.saveError) {
      return null;
    }

    return (
      <p
        id={`field-${field.id}-save-error`}
        className='text-destructive text-sm'
        role='alert'
      >
        {field.saveError}{' '}
        <button
          type='button'
          className='min-h-9 rounded-sm px-1 underline underline-offset-4 focus-visible:outline-2 disabled:opacity-50'
          disabled={field.isSaving}
          onClick={() => void field.flush()}
        >
          Retry saving
        </button>
      </p>
    );
  }
);
