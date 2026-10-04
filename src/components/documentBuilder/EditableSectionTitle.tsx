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
import type { SectionId } from '@/lib/builderDocument/builderDocument';
import { handleEditorPreferenceChange } from '@/lib/client-db/userSettingsService';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';
import { RenameSectionFormDialog } from './RenameSectionFormDialog';

const getSectionTitleId = (sectionId: SectionId) =>
  `section-title-${sectionId}`;

export const EditableSectionTitle = observer(
  ({ sectionId }: { sectionId: SectionId }) => {
    const section = builderSession.getSection(sectionId);
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
        const removed = await builderSession.removeSection(section.id);
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
          const removed = await builderSession.removeSection(section.id);
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
            variant='ghost'
            size='icon'
            aria-label={`Drag ${section.title} section`}
            className='text-muted-foreground hover:text-foreground z-10 size-11 cursor-grab touch-none md:size-9'
            {...attributes}
            {...listeners}
          >
            <GripVertical />
          </Button>
        )}
        <h2
          id={getSectionTitleId(sectionId)}
          tabIndex={-1}
          className='scroll-m-20 text-lg font-semibold tracking-tight'
        >
          {section.title}
        </h2>
        <div className='flex items-center gap-1'>
          <RenameSectionFormDialog sectionId={sectionId} />
          {isSectionDeletable && (
            <div className='transition-opacity duration-150 motion-reduce:transition-none lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100'>
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
