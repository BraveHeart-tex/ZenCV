'use client';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { GripVertical, TrashIcon } from 'lucide-react';
import { showSuccessToast } from '@/components/ui/sonner';
import { action, runInAction } from 'mobx';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import RenameSectionFormDialog from './RenameSectionFormDialog';
import {
  DELETABLE_INTERNAL_SECTION_TYPES,
  FIXED_SECTIONS,
  SECTIONS_WITH_KEYWORD_SUGGESTION_WIDGET,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import userSettingsStore from '@/lib/stores/userSettingsStore';
import UserSettingsService from '@/lib/client-db/userSettingsService';
import KeywordSuggestionsWidget from '@/components/documentBuilder/aiSuggestions/KeywordSuggestionsWidget';
import { useSortable } from '@dnd-kit/sortable';
import { FixedSection } from '@/lib/types/documentBuilder.types';

const EditableSectionTitle = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const section = builderRootStore.sectionStore.getSectionById(sectionId)!;
    const { listeners } = useSortable({ id: sectionId });
    const isSectionDeletable = DELETABLE_INTERNAL_SECTION_TYPES.has(
      section.type,
    );

    const handleDeleteSection = action(async () => {
      const shouldNotAskConfirmation =
        !userSettingsStore.editorPreferences.askBeforeDeletingSection;

      if (shouldNotAskConfirmation) {
        await builderRootStore.sectionStore.removeSection(sectionId);
        showSuccessToast('Section removed successfully.');
        return;
      }

      confirmDialogStore.showDialog({
        title: `Are you sure you want to delete "${section.title}"?`,
        message: 'This action cannot be undone',
        doNotAskAgainEnabled: true,
        onConfirm: async () => {
          await builderRootStore.sectionStore.removeSection(sectionId);
          showSuccessToast('Section removed successfully.');

          runInAction(() => {
            confirmDialogStore.hideDialog();
          });

          await UserSettingsService.handleEditorPreferenceChange(
            'askBeforeDeletingSection',
            !confirmDialogStore.doNotAskAgainChecked,
          );
        },
      });
    });

    return (
      <div className="group flex items-center w-full gap-1">
        {FIXED_SECTIONS.includes(section.type as FixedSection) ? null : (
          <Button
            variant="outline"
            size="icon"
            className="cursor-grab touch-none z-10 w-8 h-8"
            {...listeners}
          >
            <GripVertical />
          </Button>
        )}
        <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {section.title}
        </h2>
        <div className="flex items-center gap-1">
          <RenameSectionFormDialog sectionId={sectionId} />
          {SECTIONS_WITH_KEYWORD_SUGGESTION_WIDGET.has(section.type) ? (
            <KeywordSuggestionsWidget
              sectionId={section.id}
              sectionType={section.type}
            />
          ) : null}

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
