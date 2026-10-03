import { observer } from 'mobx-react-lite';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

export const DocumentSaveStatus = observer(() => {
  const document = builderSession.document;
  if (!document) {
    return null;
  }
  const failedFields = [...document.fieldsById.values()].filter(
    (field) => field.saveError
  );
  return (
    <div className='flex max-w-full flex-wrap items-center justify-center gap-x-2 text-xs leading-5'>
      <output aria-live='polite' className='text-muted-foreground'>
        {document.saveState === 'saving'
          ? 'Saving in this browser...'
          : document.saveState === 'failed'
            ? failedFields.length > 0
              ? 'Some edits are not saved'
              : document.commandSaveError
            : 'Saved in this browser'}
      </output>
      {failedFields.length > 0 && (
        <button
          type='button'
          className='text-foreground min-h-8 rounded-sm px-1 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50'
          disabled={document.saveState === 'saving'}
          onClick={() => {
            void Promise.all(failedFields.map((field) => field.flush()));
          }}
        >
          Retry saving
        </button>
      )}
    </div>
  );
});
