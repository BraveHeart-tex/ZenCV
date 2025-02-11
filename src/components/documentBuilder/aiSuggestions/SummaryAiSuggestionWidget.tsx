import { Button } from '@/components/ui/button';
import { showErrorToast, showInfoToast } from '@/components/ui/sonner';
import { useBuilderAiSuggestions } from '@/hooks/useBuilderAiSuggestions';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useShepherd } from '@/hooks/useShepherd';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { genericErrorMessage } from '@/lib/constants';
import {
  hasFilledFields,
  prepareWorkExperienceEntries,
} from '@/lib/helpers/documentBuilderHelpers';
import { scrollToCenterAndFocus } from '@/lib/helpers/domHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { cn, getItemContainerId } from '@/lib/utils/stringUtils';
import { observer } from 'mobx-react-lite';

const messageText =
  'Please add a job title and description to your work experience to generate a profile summary';

const SummaryAiSuggestionWidget = observer(
  ({ summaryField }: { summaryField: DEX_Field }) => {
    const Shepherd = useShepherd();
    const isMobile = useMediaQuery('(max-width: 1024px)', true);

    const { completeSummary, improveSummary, isLoading } =
      useBuilderAiSuggestions();

    const handleWriteProfileSummary = async () => {
      const workExperienceSectionId =
        builderRootStore.sectionStore.sections.find(
          (section) => section.type === INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
        )?.id;
      if (!workExperienceSectionId) return;

      const items = builderRootStore.sectionStore.getSectionItemsBySectionType(
        INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
      );

      let itemId: number | undefined = items[0]?.id;

      if (items.length === 0) {
        itemId = await builderRootStore.itemStore.addNewItemEntry(
          workExperienceSectionId,
        );
      }

      if (!itemId) {
        showErrorToast(genericErrorMessage);
        return;
      }

      const shouldFillWorkExperience = !hasFilledFields(items, [
        FIELD_NAMES.WORK_EXPERIENCE.JOB_TITLE,
        FIELD_NAMES.WORK_EXPERIENCE.DESCRIPTION,
      ]);

      if (shouldFillWorkExperience) {
        if (builderRootStore.UIStore.collapsedItemId !== itemId) {
          builderRootStore.UIStore.toggleItem(itemId);
        }
        const element = builderRootStore.UIStore.itemRefs.get(
          getItemContainerId(itemId),
        );

        if (!element) {
          console.warn('Element not found');
          showErrorToast(genericErrorMessage);
          return;
        }

        if (isMobile) {
          scrollToCenterAndFocus(element);
          showInfoToast(messageText);
          return;
        }

        scrollToCenterAndFocus(element);
        const tour = new Shepherd.Tour({
          useModalOverlay: true,
          defaultStepOptions: {
            classes: 'shadow-md bg-background border-primary',
            modalOverlayOpeningPadding: 8,
            modalOverlayOpeningRadius: 4,
          },
        });

        tour.addStep({
          id: 'work-experience-step',
          text: messageText,
          attachTo: {
            element: `#${getItemContainerId(itemId)}`,
            on: 'top',
          },
          buttons: [
            {
              text: 'Got it',
              action: tour.complete,
            },
          ],
          modalOverlayOpeningPadding: 16,
        });

        tour.start();

        return;
      }

      if (summaryField?.value) {
        improveSummary('', {
          body: {
            summary: summaryField.value,
            workExperiences: prepareWorkExperienceEntries(),
          },
        });
      } else {
        completeSummary('', {
          body: {
            workExperiences: prepareWorkExperienceEntries(),
          },
        });
      }
    };

    return (
      <>
        <div className="space-y-1">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Professional Summary
          </h3>
          <p className="text-muted-foreground text-sm">
            Generate a brand-new summary{' '}
            {summaryField?.value ? `or enhance your existing one` : ''}
          </p>
        </div>
        <div className={cn('grid', summaryField?.value && 'grid-cols-2 gap-4')}>
          <Button
            variant="outline"
            onClick={handleWriteProfileSummary}
            disabled={isLoading}
          >
            Generate
          </Button>
          {summaryField?.value ? (
            <Button
              variant="outline"
              onClick={handleWriteProfileSummary}
              disabled={isLoading}
            >
              Improve
            </Button>
          ) : null}
        </div>
      </>
    );
  },
);

export default SummaryAiSuggestionWidget;
