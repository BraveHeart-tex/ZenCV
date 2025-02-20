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
import userSettingsStore from '@/lib/stores/userSettingsStore';
import { useAuth } from '@clerk/nextjs';
import { protectedServiceDialogStore } from '@/lib/stores/protectedServiceDialogStore';

const TailorForJobPostingBanner = observer(() => {
  const [showGuidanceDialog, setShowGuidanceDialog] = useState(false);
  const { isSignedIn } = useAuth();

  if (
    builderRootStore.documentStore.document?.jobPostingId ||
    !userSettingsStore.editorPreferences.showAiSuggestions
  ) {
    return null;
  }

  const handleJobPostingDialogClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!isSignedIn) {
      event.preventDefault();
      protectedServiceDialogStore.open();
      return;
    }

    const summaryValue = getSummaryValue();
    const shouldFillWorkExperience = isWorkExperienceIncomplete(
      builderRootStore.sectionStore.getSectionItemsBySectionType(
        INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
      ),
    );

    if (!summaryValue && shouldFillWorkExperience) {
      event.preventDefault();
      setShowGuidanceDialog(true);
      return;
    }
  };

  return (
    <>
      <AutoTailorGuidanceDialog
        open={showGuidanceDialog}
        onOpenChange={setShowGuidanceDialog}
      />

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
