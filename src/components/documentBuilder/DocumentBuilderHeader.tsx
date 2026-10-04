import { observer } from 'mobx-react-lite';
import { DocumentSaveStatus } from '@/components/documentBuilder/DocumentSaveStatus';
import { EditableDocumentTitle } from '@/components/documentBuilder/EditableDocumentTitle';
import { Skeleton } from '@/components/ui/skeleton';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

export const DocumentBuilderHeader = observer(() => {
  return (
    <header className='flex min-w-0 flex-1 flex-col items-center justify-center overflow-hidden px-1'>
      {builderSession.document?.title ? (
        <EditableDocumentTitle />
      ) : (
        <div className='flex max-w-[95%] items-center gap-2'>
          <Skeleton className='h-6 w-48 md:h-7 md:w-56' />
          <Skeleton className='size-8 rounded-md' />
        </div>
      )}
      <DocumentSaveStatus />
    </header>
  );
});
