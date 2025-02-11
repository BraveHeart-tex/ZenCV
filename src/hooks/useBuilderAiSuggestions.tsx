import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '@/components/ui/sonner';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { useCompletion } from '@ai-sdk/react';
import { createContext, useContext, useEffect, useRef } from 'react';

const BASE_API_ROUTE = '/api/process';

type UseCompletion = ReturnType<typeof useCompletion>;

const BuilderAiSuggestionsContext = createContext<{
  completeSummary: UseCompletion['complete'];
  isCompletingSummary: UseCompletion['isLoading'];
  generatedSummary: UseCompletion['completion'];

  isLoading: boolean;

  improveSummary: UseCompletion['complete'];
  isImprovingSummary: UseCompletion['isLoading'];
  improvedSummary: UseCompletion['completion'];
} | null>(null);

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

  const isLoading = isCompletingSummary || isImprovingSummary;

  useEffect(() => {
    if (isLoading && !toastId.current) {
      toastId.current = showLoadingToast('Generating summary...');
    }

    if (
      !isLoading &&
      toastId.current &&
      !summaryCompletionError &&
      !summaryImprovementError
    ) {
      showSuccessToast('Summary generated successfully', {
        id: toastId.current,
      });
      toastId.current = undefined;
    }
  }, [isLoading, summaryCompletionError, summaryImprovementError]);

  useEffect(() => {
    if (!generatedSummary && !improvedSummary) return;
    builderRootStore.builderAiSuggestionsStore.setSummarySuggestion(
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
