import type { SemanticField } from '@/lib/builderDocument/builderDocument';

export const FieldPersistenceError = ({ field }: { field: SemanticField }) => {
  if (!field.saveError) {
    return null;
  }

  return (
    <p className='text-destructive text-sm' role='alert'>
      {field.saveError}
    </p>
  );
};
