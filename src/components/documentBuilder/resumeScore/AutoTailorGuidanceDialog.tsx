'use client';
import { Button } from '@/components/ui/button';
import ResponsiveDialog from '@/components/ui/ResponsiveDialog';
import { showErrorToast } from '@/components/ui/sonner';
import { dialogFooterClassNames, genericErrorMessage } from '@/lib/constants';
import {
  getOrCreateWorkExperienceItem,
  getWorkExperienceSectionId,
} from '@/lib/helpers/documentBuilderHelpers';
import { CheckIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { startWorkExperienceTour } from '../aiSuggestions/aiSuggestions.utils';
import { START_WORK_EXPERIENCE_TOUR_DELAY_MS } from '@/lib/stores/documentBuilder/documentBuilder.constants';

type AutoTailorGuidanceDialogProps = Omit<
  React.ComponentPropsWithoutRef<typeof ResponsiveDialog>,
  'children' | 'title' | 'description'
>;

const AutoTailorGuidanceDialog = observer(
  (props: AutoTailorGuidanceDialogProps) => {
    const handleContinue = async () => {
      props.onOpenChange?.(false);
      const workExperienceSectionId = getWorkExperienceSectionId();
      if (!workExperienceSectionId) return;

      const itemId = await getOrCreateWorkExperienceItem(
        workExperienceSectionId,
      );
      if (!itemId) {
        showErrorToast(genericErrorMessage);
        return;
      }

      setTimeout(
        () => startWorkExperienceTour(itemId),
        START_WORK_EXPERIENCE_TOUR_DELAY_MS,
      );
    };

    return (
      <ResponsiveDialog
        {...props}
        title="More information is required"
        description="In order to use the auto tailor feature, please do at least on of the following"
        footer={
          <div className={dialogFooterClassNames}>
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleContinue}>Continue</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <ul>
            <li className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-500" />
              Complete your profile summary
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-500" />
              Add at least one work experience entry
            </li>
          </ul>
        </div>
      </ResponsiveDialog>
    );
  },
);

export default AutoTailorGuidanceDialog;
