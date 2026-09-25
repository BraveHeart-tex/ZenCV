import { useSortable } from '@dnd-kit/sortable';
import { GripVertical, TrashIcon } from 'lucide-react';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { handleEditorPreferenceChange } from '@/lib/client-db/userSettingsService';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';
import { RenameSectionFormDialog } from './RenameSectionFormDialog';

const getSectionTitleId = (sectionId: number) => `section-title-${sectionId}`;

export const EditableSectionTitle = observer(
  ({ sectionId }: { sectionId: number }) => {
    const section = builderRootStore.getSection(sectionId);
    const { attributes, listeners } = useSortable({ id: sectionId });

    if (!section) {
      return null;
    }

    const isSectionDeletable =
      section.definition.sectionCardinality !== 'required-one';

    const handleDeleteSection = action(async () => {
      const shouldNotAskConfirmation =
        !userSettingsStore.editorPreferences.askBeforeDeletingSection;

      if (shouldNotAskConfirmation) {
        const removed = await builderRootStore.removeSection(section.id);
        if (removed) {
          showSuccessToast('Section removed successfully.');
        } else {
          showErrorToast('Could not remove section. Please try again.');
        }
        return;
      }

      confirmDialogStore.showDialog({
        title: `Are you sure you want to delete "${section.title}"?`,
        message: 'This action cannot be undone',
        doNotAskAgainEnabled: true,
        onConfirm: async () => {
          const removed = await builderRootStore.removeSection(section.id);
          if (removed) {
            showSuccessToast('Section removed successfully.');
          } else {
            showErrorToast('Could not remove section. Please try again.');
            return;
          }

          runInAction(() => {
            confirmDialogStore.hideDialog();
          });

          await handleEditorPreferenceChange(
            'askBeforeDeletingSection',
            !confirmDialogStore.doNotAskAgainChecked
          );
        },
      });
    });

    return (
      <div className='group flex items-center w-full gap-1'>
        {section.definition.sectionCardinality === 'required-one' ? null : (
          <Button
            variant='outline'
            size='icon'
            aria-label={`Drag ${section.title} section`}
            className='cursor-grab touch-none z-10 w-8 h-8'
            {...attributes}
            {...listeners}
          >
            <GripVertical />
          </Button>
        )}
        <h2
          id={getSectionTitleId(sectionId)}
          className='scroll-m-20 text-xl font-semibold tracking-tight'
        >
          {section.title}
        </h2>
        <div className='flex items-center gap-1'>
          <RenameSectionFormDialog sectionId={sectionId} />
          {isSectionDeletable && (
            <div className='lg:opacity-0 lg:-translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label={`Delete ${section.title} section`}
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
  }
);
