import { observer } from 'mobx-react-lite';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { cn } from '@/lib/utils/stringUtils';

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
      <output
        aria-live='polite'
        className={cn(
          'text-muted-foreground',
          document.saveState === 'failed' && 'text-destructive'
        )}
      >
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
          className='min-h-11 rounded-sm px-1 text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 lg:min-h-8'
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
