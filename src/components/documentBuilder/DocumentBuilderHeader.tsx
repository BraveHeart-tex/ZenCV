import { observer } from 'mobx-react-lite';
import { EditableDocumentTitle } from '@/components/documentBuilder/EditableDocumentTitle';
import { Skeleton } from '@/components/ui/skeleton';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

export const DocumentBuilderHeader = observer(() => {
  return (
    <header className='flex w-full min-w-0 flex-col items-center justify-center overflow-hidden'>
      {builderRootStore.documentStore.document?.title ? (
        <EditableDocumentTitle />
      ) : (
        <div className='flex items-center gap-2 max-w-[95%]'>
          <Skeleton className='md:h-9 w-64 h-8' />
          <Skeleton className='w-9 h-9 rounded-md' />
        </div>
      )}
    </header>
  );
});
