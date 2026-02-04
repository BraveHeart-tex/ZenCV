import { Skeleton } from '@/components/ui/skeleton';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import { cn } from '@/lib/utils/stringUtils';

export const PreviewSkeleton = () => {
  const view = builderRootStore.UIStore.currentView;

  return (
    <div
      className={cn(
        'bg-secondary min-h-screen fixed top-0 right-0 w-1/2 z-999',
        view === BUILDER_CURRENT_VIEWS.PREVIEW && 'w-full xl:w-1/2',
        view === BUILDER_CURRENT_VIEWS.BUILDER && 'hidden xl:block'
      )}
    >
      <div className='h-[90vh] max-w-2xl mx-auto pt-4'>
        <div className='flex justify-end mb-2'>
          <Skeleton className='h-9 w-28' />
        </div>
        <Skeleton className='w-full h-[calc(90vh-6rem)]' />
        <div className='flex items-center justify-center gap-2 mt-2'>
          <Skeleton className='h-7.5 w-7.5 rounded-full' />
          <Skeleton className='w-16 h-4' />
          <Skeleton className='h-7.5 w-7.5 rounded-full' />
        </div>
      </div>
    </div>
  );
};
