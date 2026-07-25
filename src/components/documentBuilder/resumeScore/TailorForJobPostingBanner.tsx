import { useAuth } from '@clerk/react';
import { BrainCircuitIcon, ChevronRightIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  getSummaryValue,
  isWorkExperienceIncomplete,
} from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { protectedServiceDialogStore } from '@/lib/stores/protectedServiceDialogStore';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';
import { AutoTailorGuidanceDialog } from './AutoTailorGuidanceDialog';
import { JobPostingFormDialog } from './JobPostingFormDialog';

export const TailorForJobPostingBanner = observer(() => {
  const [showGuidanceDialog, setShowGuidanceDialog] = useState(false);
  const { isSignedIn } = useAuth();

  if (
    builderRootStore.documentStore.document?.jobPostingId ||
    !userSettingsStore.editorPreferences.showAiSuggestions
  ) {
    return null;
  }

  const handleJobPostingDialogClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!isSignedIn) {
      event.preventDefault();
      protectedServiceDialogStore.open();
      return;
    }

    const summaryValue = getSummaryValue();
    const shouldFillWorkExperience = isWorkExperienceIncomplete(
      builderRootStore.sectionStore.getSectionItemsBySectionType(
        INTERNAL_SECTION_TYPES.WORK_EXPERIENCE
      )
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
            variant='ghost'
            className='bg-background flex min-h-16 w-full items-center gap-3 rounded-md border p-3 text-left md:p-4'
            onClick={handleJobPostingDialogClick}
          >
            <BrainCircuitIcon
              aria-hidden='true'
              className='text-muted-foreground shrink-0'
            />
            <div className='min-w-0 flex-1 space-y-1 text-sm'>
              <span className='block font-medium md:hidden'>
                Tailor for a job
              </span>
              <span className='hidden font-medium md:block'>
                Tailor this CV to a job description
              </span>
              <span className='text-muted-foreground block text-xs leading-5'>
                AI only uses the job details you submit.
              </span>
            </div>
            <div className='hidden items-center gap-2 md:flex'>
              Add job <ChevronRightIcon aria-hidden='true' />
            </div>
          </Button>
        }
      />
    </>
  );
});
