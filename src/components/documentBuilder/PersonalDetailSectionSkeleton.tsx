import { Skeleton } from '@/components/ui/skeleton';

const PersonalDetailSectionSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-5 h-5" />
      </div>

      {/* Form Fields Grid */}
      <div className="md:grid-cols-2 grid gap-6">
        {/* Wanted Job Title */}
        <div className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-full h-12" />
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-full h-12" />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-full h-12" />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-full h-12" />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-full h-12" />
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-full h-12" />
        </div>
      </div>

      {/* Show additional details button */}
      <Skeleton className="h-11 w-56" />
    </div>
  );
};
export default PersonalDetailSectionSkeleton;
