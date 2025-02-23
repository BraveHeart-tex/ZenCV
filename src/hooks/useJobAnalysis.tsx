import { useEffect, useRef, useState } from 'react';
import { PROCESS_BASE_API_ROUTE } from './useBuilderAiSuggestions';
import { jobAnalysisResultSchema } from '@/lib/validation/jobAnalysisResult.schema';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '@/components/ui/sonner';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import AiSuggestionsService from '@/lib/client-db/aiSuggestionsService';
import { JobPostingSchema } from '@/lib/validation/jobPosting.schema';
import { genericErrorMessage } from '@/lib/constants';
import { toast } from 'sonner';

export const useJobAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const toastId = useRef<number | string | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const analyzeJob = async (values: JobPostingSchema) => {
    toastId.current = showLoadingToast('Analyzing job posting...', {
      id: toastId?.current || undefined,
    });

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${PROCESS_BASE_API_ROUTE}/job-analysis`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current?.signal,
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Request failed.');
      }

      showSuccessToast('Job analysis completed successfully.', {
        id: toastId?.current || undefined,
      });

      const body = await response.json();

      const validationResult = jobAnalysisResultSchema.safeParse(body?.data);
      if (!validationResult?.success) {
        throw new Error(genericErrorMessage);
      }

      const data = validationResult.data;

      if (builderRootStore.documentStore.document) {
        if (
          builderRootStore.aiSuggestionsStore.keywordSuggestions.length ||
          builderRootStore.aiSuggestionsStore.suggestedJobTitle
        ) {
          AiSuggestionsService.deleteAiSuggestions(
            builderRootStore.documentStore.document.id,
          );
        }

        AiSuggestionsService.addAiSuggestions({
          keywordSuggestions: data.keywordSuggestions,
          suggestedJobTitle: data.suggestedJobTitle,
          documentId: builderRootStore.documentStore.document.id,
        });
      }

      builderRootStore.aiSuggestionsStore.setJobAnalysisResults(data);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast.dismiss(toastId?.current || undefined);
          console.warn('Job analysis fetch aborted.');
          return;
        }
        showErrorToast(error.message, {
          id: toastId?.current || undefined,
        });

        console.error('Job analysis error:', error.message);
      }
    } finally {
      toastId.current = undefined;
      setIsLoading(false);
    }
  };

  return {
    analyzeJob,
    isLoading,
  };
};
