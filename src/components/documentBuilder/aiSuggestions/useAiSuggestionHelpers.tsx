import { showErrorToast, showInfoToast } from '@/components/ui/sonner';
import { useBuilderAiSuggestions } from '@/hooks/useBuilderAiSuggestions';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DEX_Item } from '@/lib/client-db/clientDbSchema';
import { genericErrorMessage } from '@/lib/constants';
import {
  getOrCreateWorkExperienceItem,
  getSummaryField,
  getWorkExperienceSectionId,
  prepareWorkExperienceEntries,
  shouldFillWorkExperience,
} from '@/lib/helpers/documentBuilderHelpers';
import { scrollToCenterAndFocus } from '@/lib/helpers/domHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { INTERNAL_SECTION_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import shepherdStore from '@/lib/stores/documentBuilder/shepherdStore';
import { getItemContainerId } from '@/lib/utils/stringUtils';

const shouldAddJobEntryErrorMessage =
  'Please add a job title and description to your work experience to generate a profile summary';

export const SUMMARY_GENERATION_EVENT_NAME = 'summaryGeneration';

export const useAiSuggestionHelpers = () => {
  const Shepherd = shepherdStore.Shepherd;
  const isMobile = useMediaQuery('(max-width: 1024px)', true);
  const { completeSummary, improveSummary, isLoading } =
    useBuilderAiSuggestions();

  const startWorkExperienceTour = (itemId: DEX_Item['id']) => {
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

    scrollToCenterAndFocus(element);

    if (isMobile) {
      showInfoToast(shouldAddJobEntryErrorMessage);
      return;
    }

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
      text: shouldAddJobEntryErrorMessage,
      attachTo: {
        element: `#${getItemContainerId(itemId)}`,
        on: 'top',
      },
      buttons: [{ text: 'Got it', action: tour.complete }],
      modalOverlayOpeningPadding: 16,
    });

    tour.start();
  };

  const handleProfileSummaryUpdate = (summaryValue: string) => {
    const body = {
      workExperiences: prepareWorkExperienceEntries(),
    };

    if (summaryValue) {
      improveSummary('', { body: { ...body, summary: summaryValue } });
    } else {
      completeSummary('', { body });
    }
  };

  const dispatchSummaryGenerationEvent = () => {
    const event = new CustomEvent(SUMMARY_GENERATION_EVENT_NAME);
    document.dispatchEvent(event);
  };

  const handleWriteProfileSummary = async () => {
    const workExperienceSectionId = getWorkExperienceSectionId();
    if (!workExperienceSectionId) return;

    const itemId = await getOrCreateWorkExperienceItem(workExperienceSectionId);
    if (!itemId) {
      showErrorToast(genericErrorMessage);
      return;
    }

    if (
      shouldFillWorkExperience(
        builderRootStore.sectionStore.getSectionItemsBySectionType(
          INTERNAL_SECTION_TYPES.WORK_EXPERIENCE,
        ),
      )
    ) {
      setTimeout(() => startWorkExperienceTour(itemId), 300);
      return;
    }

    const summaryField = getSummaryField();

    handleProfileSummaryUpdate(summaryField?.value || '');
    dispatchSummaryGenerationEvent();
  };

  return {
    handleWriteProfileSummary,
    isLoading,
  };
};
