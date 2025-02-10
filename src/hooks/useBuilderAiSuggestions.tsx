import { showErrorToast } from '@/components/ui/sonner';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { useCompletion } from '@ai-sdk/react';
import { createContext, useContext, useEffect } from 'react';

type UseCompletion = ReturnType<typeof useCompletion>;

const BuilderAiSuggestionsContext = createContext<{
  completeSummary: UseCompletion['complete'];
  isCompletingSummary: UseCompletion['isLoading'];
  generatedSummary: UseCompletion['completion'];
} | null>(null);

export const BuilderAiSuggestionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    complete: completeSummary,
    isLoading: isCompletingSummary,
    completion: generatedSummary,
  } = useCompletion({
    api: '/api/process/generate-summary',
    onError(error) {
      showErrorToast(error.message);
    },
  });

  useEffect(() => {
    if (!generatedSummary) return;
    builderRootStore.builderAiSuggestionsStore.setSummarySuggestion(
      generatedSummary,
    );
  }, [generatedSummary]);

  return (
    <BuilderAiSuggestionsContext.Provider
      value={{ completeSummary, isCompletingSummary, generatedSummary }}
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
