import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '@/components/ui/sonner';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import type { AiSuggestionsContext } from '@/lib/types/documentBuilder.types';
import { useCompletion } from '@ai-sdk/react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { useJobAnalysis } from './useJobAnalysis';

export const PROCESS_BASE_API_ROUTE = '/api/process';

const BuilderAiSuggestionsContext = createContext<AiSuggestionsContext | null>(
  null,
);

// For some reason, AI SDK returns the error object as a string
// so we have to parse it here
const getErrorMessage = (error: Error): string => {
  try {
    return JSON.parse(error.message)?.message;
  } catch {
    return 'Something went wrong while generating your summary.';
  }
};

export const BuilderAiSuggestionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { analyzeJob, isLoading: isLoadingJobAnalysis } = useJobAnalysis();
  const toastId = useRef<string | number | undefined>(undefined);

  const {
    complete: completeSummary,
    isLoading: isCompletingSummary,
    completion: generatedSummary,
    error: summaryCompletionError,
  } = useCompletion({
    api: `${PROCESS_BASE_API_ROUTE}/generate-summary`,
    onError(error) {
      showErrorToast(getErrorMessage(error), {
        id: toastId.current,
      });
      toastId.current = undefined;
    },
  });

  const {
    complete: improveSummary,
    isLoading: isImprovingSummary,
    completion: improvedSummary,
    error: summaryImprovementError,
  } = useCompletion({
    api: `${PROCESS_BASE_API_ROUTE}/improve-summary`,
    onError(error) {
      showErrorToast(getErrorMessage(error), {
        id: toastId.current,
      });
      toastId.current = undefined;
    },
  });

  const isLoadingSummary = isCompletingSummary || isImprovingSummary;
  const isLoading = isLoadingSummary || isLoadingJobAnalysis;

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
    builderRootStore.aiSuggestionsStore.setSummarySuggestion(
      generatedSummary || improvedSummary,
    );
  }, [generatedSummary, improvedSummary]);

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
