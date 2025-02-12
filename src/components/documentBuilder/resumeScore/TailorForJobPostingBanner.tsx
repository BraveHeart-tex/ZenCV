'use client';
import { Button } from '@/components/ui/button';
import { BrainCircuitIcon, ChevronRightIcon } from 'lucide-react';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { observer } from 'mobx-react-lite';
import JobPostingFormDialog from './JobPostingFormDialog';

const TailorForJobPostingBanner = observer(() => {
  if (builderRootStore.documentStore.document?.jobPostingId) return null;

  return (
    <JobPostingFormDialog
      trigger={
        <Button
          variant="ghost"
          className="bg-background md:h-16 flex items-center w-full gap-2 p-4 border rounded-md"
        >
          <BrainCircuitIcon />
          <div className="flex-1 text-[0.875rem] text-left">
            Optimize your resume for the job and land more interviews
          </div>
          <div className="md:flex items-center hidden gap-2">
            Try it <ChevronRightIcon />
          </div>
        </Button>
      }
    />
  );
});

export default TailorForJobPostingBanner;
