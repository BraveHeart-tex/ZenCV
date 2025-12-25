import { showErrorToast, showInfoToast } from '@/components/ui/sonner';
import type { DEX_Item } from '@/lib/client-db/clientDbSchema';
import { genericErrorMessage } from '@/lib/constants';
import { scrollToCenterAndFocus } from '@/lib/helpers/domHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { shepherdStore } from '@/lib/stores/documentBuilder/shepherdStore';
import { getItemContainerId } from '@/lib/utils/stringUtils';

const shouldAddJobEntryErrorMessage =
  'Add at least one work experience entry (job title, description, dates). To use this feature';

export const startWorkExperienceTour = (itemId: DEX_Item['id']) => {
  const Shepherd = shepherdStore.Shepherd;

  const isMobile = window.matchMedia('(max-width: 1024px)').matches;
  if (builderRootStore.UIStore.collapsedItemId !== itemId) {
    builderRootStore.UIStore.toggleItem(itemId);
  }

  const element = builderRootStore.UIStore.itemRefs.get(
    getItemContainerId(itemId)
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
