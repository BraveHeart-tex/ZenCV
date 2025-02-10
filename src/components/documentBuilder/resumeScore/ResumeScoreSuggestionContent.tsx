import { observer } from 'mobx-react-lite';
import * as motion from 'motion/react-m';
import ResumeScoreSuggestionItem from '@/components/documentBuilder/resumeScore/ResumeScoreSuggestionItem';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { SparklesIcon } from 'lucide-react';
import AnimatedSuggestionsContainer from './SuggestionsContainer';
import SuggestionGroupHeading from './SuggestionGroupHeading';
import AnimatedSuggestionButton from './AnimatedSuggestionButton';
import {
  FIELD_NAMES,
  INTERNAL_SECTION_TYPES,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import {
  hasFilledFields,
  prepareWorkExperienceEntries,
} from '@/lib/helpers/documentBuilderHelpers';
import { useShepherd } from '@/hooks/useShepherd';
import { getItemContainerId } from '@/lib/utils/stringUtils';
import { scrollToCenterAndFocus } from '@/lib/helpers/domHelpers';
import { showErrorToast, showInfoToast } from '@/components/ui/sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { genericErrorMessage } from '@/lib/constants';
import { useBuilderAiSuggestions } from '@/hooks/useBuilderAiSuggestions';

interface ResumeScoreSuggestionContentProps {
  setOpen: (open: boolean) => void;
}

const CONTENT_ANIMATION_DURATION_MS = 300;

const messageText =
  'Please add a job title and description to your work experience to generate a profile summary';

const ResumeScoreSuggestionContent = observer(
  ({ setOpen }: ResumeScoreSuggestionContentProps) => {
    const { completeSummary, isCompletingSummary } = useBuilderAiSuggestions();

    const Shepherd = useShepherd();
    const suggestions =
      builderRootStore.templateStore.debouncedResumeStats.suggestions;

    const isMobile = useMediaQuery('(max-width: 1024px)', true);

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
        setOpen(false);

        const startTour = () => {
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
        };

        setTimeout(startTour, CONTENT_ANIMATION_DURATION_MS);
        return;
      }

      setOpen(false);
      completeSummary('', {
        body: {
          workExperiences: prepareWorkExperienceEntries(),
        },
      });
    };

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{
          duration: CONTENT_ANIMATION_DURATION_MS / 1000,
          ease: 'easeInOut',
        }}
        className="overflow-hidden"
      >
        <div className="py-4">
          <SuggestionGroupHeading>AI Assistant</SuggestionGroupHeading>
          <AnimatedSuggestionsContainer>
            <AnimatedSuggestionButton
              label="Write your profile summary"
              icon={<SparklesIcon className="text-white" />}
              iconContainerClassName="dark:bg-purple-900 bg-purple-700 hover:bg-purple-800"
              onClick={handleWriteProfileSummary}
              disabled={isCompletingSummary}
            />
          </AnimatedSuggestionsContainer>

          {suggestions.length > 0 ? (
            <>
              <SuggestionGroupHeading>
                Boost Your Resume Score
              </SuggestionGroupHeading>
              <AnimatedSuggestionsContainer>
                {suggestions.map((suggestion) => (
                  <ResumeScoreSuggestionItem
                    setOpen={setOpen}
                    suggestion={suggestion}
                    key={suggestion.key}
                  />
                ))}
              </AnimatedSuggestionsContainer>
            </>
          ) : null}
        </div>
      </motion.div>
    );
  },
);

export default ResumeScoreSuggestionContent;
