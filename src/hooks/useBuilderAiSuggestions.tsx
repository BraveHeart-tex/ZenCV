import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '@/components/ui/sonner';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import type { AiSuggestionsContext } from '@/lib/types/documentBuilder.types';
import { useCompletion } from '@ai-sdk/react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import {
  JobAnalysisResult,
  jobAnalysisResultSchema,
} from '@/lib/validation/jobAnalysisResult.schema';

const BASE_API_ROUTE = '/api/process';

const BuilderAiSuggestionsContext = createContext<AiSuggestionsContext | null>(
  null,
);

export const BuilderAiSuggestionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const toastId = useRef<string | number | undefined>(undefined);

  const {
    complete: completeSummary,
    isLoading: isCompletingSummary,
    completion: generatedSummary,
    error: summaryCompletionError,
  } = useCompletion({
    api: `${BASE_API_ROUTE}/generate-summary`,
    onError(error) {
      showErrorToast(error.message, {
        id: toastId.current,
      });
    },
  });

  const {
    complete: improveSummary,
    isLoading: isImprovingSummary,
    completion: improvedSummary,
    error: summaryImprovementError,
  } = useCompletion({
    api: `${BASE_API_ROUTE}/improve-summary`,
    onError(error) {
      showErrorToast(error.message, {
        id: toastId.current,
      });
    },
  });

  const {
    submit: analyzeJob,
    object: jobAnalysis,
    error: jobAnalysisError,
    isLoading: isAnalyzingJob,
  } = useObject({
    api: `${BASE_API_ROUTE}/job-analysis`,
    schema: jobAnalysisResultSchema,
    onError(error) {
      showErrorToast(error.message, {
        id: toastId.current,
      });
    },
  });

  const isLoadingSummary = isCompletingSummary || isImprovingSummary;
  const isLoading = isLoadingSummary || isAnalyzingJob;

  useEffect(() => {
    if (isAnalyzingJob && !toastId.current) {
      toastId.current = showLoadingToast('Analyzing job posting...');
    }

    if (!isAnalyzingJob && toastId.current && !jobAnalysisError) {
      showSuccessToast('Job posting analyzed successfully', {
        id: toastId.current,
      });
    }
  }, [isAnalyzingJob, jobAnalysisError]);

  useEffect(() => {
    if (isLoadingSummary && !toastId.current) {
      toastId.current = showLoadingToast('Generating summary...');
    }

    if (
      !isLoadingSummary &&
      toastId.current &&
      !summaryCompletionError &&
      !summaryImprovementError
    ) {
      showSuccessToast('Summary generated successfully', {
        id: toastId.current,
      });
      toastId.current = undefined;
    }
  }, [isLoadingSummary, summaryCompletionError, summaryImprovementError]);

  useEffect(() => {
    if (!generatedSummary && !improvedSummary) return;
    builderRootStore.builderAiSuggestionsStore.setSummarySuggestion(
      generatedSummary || improvedSummary,
    );
  }, [generatedSummary, improvedSummary]);

  useEffect(() => {
    if (!jobAnalysis) return;

    builderRootStore.builderAiSuggestionsStore.setJobAnalysisResults(
      jobAnalysis as Partial<JobAnalysisResult>,
    );
  }, [jobAnalysis]);

  return (
    <BuilderAiSuggestionsContext.Provider
      value={{
        completeSummary,
        isCompletingSummary,
        generatedSummary,
        isLoading,
        improveSummary,
        isImprovingSummary,
        improvedSummary,
        analyzeJob,
        jobAnalysis,
      }}
    >
      {children}
    </BuilderAiSuggestionsContext.Provider>
  );
};

export const useBuilderAiSuggestions = () => {
  const context = useContext(BuilderAiSuggestionsContext);
  if (!context) {
    throw new Error(
      'useBuilderAiSuggestions must be used within a BuilderAiSuggestionsProvider',
    );
  }
  return context;
};
