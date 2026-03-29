import { useCompletion } from '@ai-sdk/react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '@/components/ui/sonner';
import { endpoints } from '@/lib/endpoints';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import type { AiSuggestionsContext } from '@/lib/types/documentBuilder.types';
import {
  type BulletSuggestionsResult,
  bulletSuggestionsResultSchema,
  type GenerateBulletsSchema,
} from '@/lib/validation/generateBullets.schema';
import { useJobAnalysis } from './useJobAnalysis';

const BuilderAiSuggestionsContext = createContext<AiSuggestionsContext | null>(
  null
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
  const [isGeneratingBullets, setIsGeneratingBullets] = useState(false);
  const toastId = useRef<string | number | undefined>(undefined);

  const {
    complete: completeSummary,
    isLoading: isCompletingSummary,
    completion: generatedSummary,
    error: summaryCompletionError,
  } = useCompletion({
    api: endpoints.process.generateSummary,
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
    api: endpoints.process.improveSummary,
    onError(error) {
      showErrorToast(getErrorMessage(error), {
        id: toastId.current,
      });
      toastId.current = undefined;
    },
  });

  const isLoadingSummary = isCompletingSummary || isImprovingSummary;
  const isLoading =
    isLoadingSummary || isLoadingJobAnalysis || isGeneratingBullets;

  const generateWorkExperienceBullets = async (
    values: GenerateBulletsSchema
  ): Promise<BulletSuggestionsResult | undefined> => {
    setIsGeneratingBullets(true);
    toastId.current = showLoadingToast('Generating bullet suggestions...', {
      id: toastId.current,
    });

    try {
      const response = await fetch(endpoints.process.generateBullets, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message || 'Request failed.');
      }

      const validationResult = bulletSuggestionsResultSchema.safeParse(
        body.data
      );

      if (!validationResult.success) {
        throw new Error('Received invalid bullet suggestions.');
      }

      showSuccessToast('Bullet suggestions generated successfully.', {
        id: toastId.current,
      });
      toastId.current = undefined;
      return validationResult.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while generating bullet suggestions.';

      showErrorToast(message, {
        id: toastId.current,
      });
      toastId.current = undefined;
      return;
    } finally {
      setIsGeneratingBullets(false);
    }
  };

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
    if (!generatedSummary && !improvedSummary) {
      return;
    }
    builderRootStore.aiSuggestionsStore.setSummarySuggestion(
      generatedSummary || improvedSummary
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
        generateWorkExperienceBullets,
        isGeneratingBullets,
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
      'useBuilderAiSuggestions must be used within a BuilderAiSuggestionsProvider'
    );
  }
  return context;
};
