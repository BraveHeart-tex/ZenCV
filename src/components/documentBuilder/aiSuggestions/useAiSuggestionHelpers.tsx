import { showErrorToast } from '@/components/ui/sonner';
import { useBuilderAiSuggestions } from '@/hooks/useBuilderAiSuggestions';
import { genericErrorMessage } from '@/lib/constants';
import {
  getOrCreateWorkExperienceItem,
  getSummaryField,
  getWorkExperienceSectionId,
  isWorkExperienceIncomplete,
  prepareWorkExperienceEntries,
} from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import {
  INTERNAL_SECTION_TYPES,
  START_WORK_EXPERIENCE_TOUR_DELAY_MS,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';
import type { GenerateSummarySchema } from '@/lib/validation/generateSummary.schema';
import type { JobPostingSchema } from '@/lib/validation/jobPosting.schema';
import { startWorkExperienceTour } from './aiSuggestions.utils';

export const SUMMARY_GENERATION_EVENT_NAME = 'summaryGeneration';

export const useAiSuggestionHelpers = () => {
  const { completeSummary, improveSummary, isLoading, analyzeJob } =
    useBuilderAiSuggestions();

  const handleProfileSummaryUpdate = (
    summaryValue: string,
    refinementPrompt?: string
  ) => {
    const body: GenerateSummarySchema = {
      workExperiences: prepareWorkExperienceEntries(),
      customPrompt: userSettingsStore.modelSettings.customGenerateSummaryPrompt,
    };

    const jobPosting = builderRootStore.jobPostingStore.jobPosting || undefined;

    if (summaryValue) {
      improveSummary('', {
        body: {
          ...body,
          summary: summaryValue,
          jobPosting,
          refinementPrompt: refinementPrompt || '',
        },
      });
    } else {
      completeSummary('', { body: { ...body, jobPosting } });
    }
  };

  const dispatchSummaryGenerationEvent = () => {
    const event = new CustomEvent(SUMMARY_GENERATION_EVENT_NAME);
    document.dispatchEvent(event);
  };

  const handleWriteProfileSummary = async (refinementPrompt?: string) => {
    const workExperienceSectionId = getWorkExperienceSectionId();
    if (!workExperienceSectionId) return;

    const itemId = await getOrCreateWorkExperienceItem(workExperienceSectionId);
    if (!itemId) {
      showErrorToast(genericErrorMessage);
      return;
    }

    if (
      isWorkExperienceIncomplete(
        builderRootStore.sectionStore.getSectionItemsBySectionType(
          INTERNAL_SECTION_TYPES.WORK_EXPERIENCE
        )
      )
    ) {
      setTimeout(
        () => startWorkExperienceTour(itemId),
        START_WORK_EXPERIENCE_TOUR_DELAY_MS
      );
      return;
    }

    const summaryField = getSummaryField();

    handleProfileSummaryUpdate(
      summaryField?.value || '',
      refinementPrompt || ''
    );
    dispatchSummaryGenerationEvent();
  };

  const handleJobAnalysis = async (values: JobPostingSchema) => {
    await analyzeJob(values);
  };

  return {
    handleJobAnalysis,
    handleWriteProfileSummary,
    isLoading,
  };
};
