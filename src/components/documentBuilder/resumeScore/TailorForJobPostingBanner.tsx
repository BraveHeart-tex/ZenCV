'use client';
import { Button } from '@/components/ui/button';
import { BrainCircuitIcon, ChevronRightIcon } from 'lucide-react';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { observer } from 'mobx-react-lite';
import JobPostingFormDialog from './JobPostingFormDialog';
import {
  getSummaryValue,
  isWorkExperienceIncomplete,
} from '@/lib/helpers/documentBuilderHelpers';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import AutoTailorGuidanceDialog from './AutoTailorGuidanceDialog';
import { useState } from 'react';

const TailorForJobPostingBanner = observer(() => {
  const [open, setOpen] = useState(false);

  if (builderRootStore.documentStore.document?.jobPostingId) return null;

  const handleJobPostingDialogClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const summaryValue = getSummaryValue();
    const shouldFillWorkExperience = isWorkExperienceIncomplete(
      builderRootStore.sectionStore.getSectionItemsBySectionType(
        INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
      ),
    );

    if (!summaryValue && shouldFillWorkExperience) {
      event.preventDefault();
      setOpen(true);
      return;
    }
  };

  return (
    <>
      <AutoTailorGuidanceDialog open={open} onOpenChange={setOpen} />
      <JobPostingFormDialog
        trigger={
          <Button
            variant="ghost"
            className="bg-background md:h-16 flex items-center w-full gap-2 p-4 border rounded-md"
            onClick={handleJobPostingDialogClick}
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
    </>
  );
});

export default TailorForJobPostingBanner;
