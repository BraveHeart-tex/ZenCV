import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '@/components/ui/sonner';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { useCompletion } from '@ai-sdk/react';
import { createContext, useContext, useEffect, useRef } from 'react';

type UseCompletion = ReturnType<typeof useCompletion>;

const BuilderAiSuggestionsContext = createContext<{
  completeSummary: UseCompletion['complete'];
  isCompletingSummary: UseCompletion['isLoading'];
  generatedSummary: UseCompletion['completion'];
  isLoading: boolean;
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
    error,
  } = useCompletion({
    api: '/api/process/generate-summary',
    onError(error) {
      showErrorToast(error.message, {
        id: toastId.current,
      });
    },
  });

  const isLoading = isCompletingSummary;

  useEffect(() => {
    if (isLoading && !toastId.current) {
      toastId.current = showLoadingToast('Generating summary...');
    }

    if (!isLoading && toastId.current && !error) {
      showSuccessToast('Summary generated successfully', {
        id: toastId.current,
      });
      toastId.current = undefined;
    }
  }, [isLoading, error]);

  useEffect(() => {
    if (!generatedSummary) return;
    builderRootStore.builderAiSuggestionsStore.setSummarySuggestion(
      generatedSummary,
    );
  }, [generatedSummary]);

  return (
    <BuilderAiSuggestionsContext.Provider
      value={{
        completeSummary,
        isCompletingSummary,
        generatedSummary,
        // As more options are added, we can derive the overall loading state
        isLoading: isCompletingSummary,
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
