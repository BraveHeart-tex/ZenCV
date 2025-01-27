import { cn } from '@/lib/utils/stringUtils';
import {
  DOCUMENT_BUILDER_SEARCH_PARAM_VALUES,
  useDocumentBuilderSearchParams,
} from '@/hooks/useDocumentBuilderSearchParams';
import { Skeleton } from '@/components/ui/skeleton';

const PreviewSkeleton = () => {
  const { view } = useDocumentBuilderSearchParams();
  return (
    <div
      className={cn(
        'bg-secondary min-h-screen fixed top-0 right-0 w-1/2 z-[999]',
        view === DOCUMENT_BUILDER_SEARCH_PARAM_VALUES.VIEW.PREVIEW &&
          'w-full xl:w-1/2',
        view === DOCUMENT_BUILDER_SEARCH_PARAM_VALUES.VIEW.BUILDER &&
          'hidden xl:block',
      )}
    >
      <div className="h-[90vh] max-w-2xl mx-auto pt-4">
        <div className="flex justify-end mb-2">
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="w-full h-[calc(90vh-6rem)]" />
        <div className="flex items-center justify-center gap-2 mt-2">
          <Skeleton className="h-[1.875rem] w-[1.875rem] rounded-full" />
          <Skeleton className="w-16 h-4" />
          <Skeleton className="h-[1.875rem] w-[1.875rem] rounded-full" />
        </div>
      </div>
    </div>
  );
};
export default PreviewSkeleton;
