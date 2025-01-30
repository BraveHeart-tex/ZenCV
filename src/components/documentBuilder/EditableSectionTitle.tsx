'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TrashIcon } from 'lucide-react';
import { showSuccessToast } from '@/components/ui/sonner';
import { action } from 'mobx';
import { DELETABLE_INTERNAL_SECTION_TYPES } from '@/lib/constants';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import {
  getSectionDeleteConfirmationPreference,
  setSectionDeleteConfirmationPreference,
} from '@/lib/helpers/userSettingsHelpers';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import RenameSectionFormDialog from './RenameSectionFormDialog';

const EditableSectionTitle = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const section = documentBuilderStore.getSectionById(sectionId)!;

    const isSectionDeletable = DELETABLE_INTERNAL_SECTION_TYPES.includes(
      section.type as (typeof DELETABLE_INTERNAL_SECTION_TYPES)[number],
    );

    const handleDeleteSection = action(async () => {
      const shouldNotAskConfirmation =
        await getSectionDeleteConfirmationPreference();

      if (shouldNotAskConfirmation) {
        await documentBuilderStore.removeSection(sectionId);
        showSuccessToast('Section removed successfully.');
        return;
      }

      confirmDialogStore.showDialog({
        title: `Are you sure you want to delete "${section.title}"?`,
        message: 'This action cannot be undone',
        doNotAskAgainEnabled: true,
        onConfirm: async () => {
          const doNotAskAgain = confirmDialogStore.doNotAskAgainChecked;

          await documentBuilderStore.removeSection(sectionId);
          showSuccessToast('Section removed successfully.');

          if (doNotAskAgain) {
            await setSectionDeleteConfirmationPreference(doNotAskAgain);
          }

          confirmDialogStore.hideDialog();
        },
      });
    });

    return (
      <div className="group flex items-center w-full gap-2">
        <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {section.title}
        </h2>
        <div className="flex items-center">
          <RenameSectionFormDialog sectionId={sectionId} />
          {isSectionDeletable && (
            <div className="lg:opacity-0 lg:-translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDeleteSection}
                  >
                    <TrashIcon size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete {`"${section.title}"`}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default EditableSectionTitle;
