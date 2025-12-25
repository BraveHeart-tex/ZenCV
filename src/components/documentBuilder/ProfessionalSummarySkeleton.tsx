import { Skeleton } from '@/components/ui/skeleton';

export const ProfessionalSummarySkeleton = () => {
  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <Skeleton className='w-32 h-8' />
        <Skeleton className='w-5 h-5' />
      </div>

      {/* Helper text */}
      <Skeleton className='w-full h-4 max-w-2xl' />

      {/* Text editor content area */}
      <div className='border-border bg-card p-4 space-y-3 border rounded-lg'>
        {/* Toolbar */}
        <div className='border-border flex flex-wrap items-center gap-2 pb-2 border-b'>
          <Skeleton className='w-16 h-10' />
          {Array.from({ length: 7 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: using index as the key is okay here
            <Skeleton key={index} className='w-10 h-10' />
          ))}
        </div>

        <Skeleton className='w-full h-4' />
        <Skeleton className='w-full h-4' />
        <Skeleton className='h-4 w-[95%]' />
        <Skeleton className='w-full h-4' />
        <Skeleton className='h-4 w-[90%]' />
        <Skeleton className='w-full h-4' />
        <Skeleton className='h-4 w-[85%]' />
      </div>

      {/* Character count */}
      <div className='flex justify-end'>
        <Skeleton className='w-24 h-4' />
      </div>
    </div>
  );
};
