import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BriefcaseBusinessIcon, Edit2Icon, TrashIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '../ui/button';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { showErrorToast, showSuccessToast } from '../ui/sonner';
import { runInAction } from 'mobx';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

const DocumentJobPostingIndicator = observer(() => {
  if (!builderRootStore.documentStore.document?.jobPosting) return null;

  const handleDeleteJobPosting = () => {
    confirmDialogStore.showDialog({
      title: 'Are you sure you want to remove this job posting?',
      message: 'This will also remove its link to the document.',
      confirmText: 'Yes',
      onConfirm: async () => {
        const result = await builderRootStore.documentStore.removeJobPosting();

        if (!result.success) {
          showErrorToast(result.message);
          return;
        }

        showSuccessToast(result.message);
        runInAction(() => confirmDialogStore.hideDialog());
      },
    });
  };

  return (
    <div className="group flex items-center w-full gap-2">
      <Tooltip>
        <TooltipTrigger className="cursor-default">
          <div className="max-w-36 md:max-w-72 bg-muted whitespace-nowrap flex items-center px-1 overflow-hidden text-xs truncate rounded-md">
            <div className="bg-background p-1 rounded-md">
              <BriefcaseBusinessIcon className="w-3 h-3" />
            </div>
            <span>
              {builderRootStore.documentStore.document.jobPosting.jobTitle} at{' '}
              {builderRootStore.documentStore.document.jobPosting.companyName}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span>
            {builderRootStore.documentStore.document.jobPosting.jobTitle} at{' '}
            {builderRootStore.documentStore.document.jobPosting.companyName}
          </span>
        </TooltipContent>
      </Tooltip>
      <Button
        className="group-hover:opacity-100 group-hover:pointer-events-auto opacity-0 pointer-events-none"
        variant="ghost"
        size="icon"
      >
        <Edit2Icon />
      </Button>
      <Button
        className="group-hover:opacity-100 group-hover:pointer-events-auto opacity-0 pointer-events-none"
        variant="ghost"
        size="icon"
        onClick={handleDeleteJobPosting}
      >
        <TrashIcon />
      </Button>
    </div>
  );
});

export default DocumentJobPostingIndicator;
