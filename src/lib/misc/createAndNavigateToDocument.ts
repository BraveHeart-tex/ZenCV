import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import type { DEX_Document } from '../client-db/clientDbSchema';
import { createDocument } from '../client-db/documentService';
import { builderRootStore } from '../stores/documentBuilder/builderRootStore';
import type { PrefilledResumeStyle } from '../templates/prefilledTemplates';
import type { ResumeTemplate } from '../types/documentBuilder.types';

interface CreateAndNavigateToDocumentParams {
  title: string;
  templateType: ResumeTemplate;
  onSuccess?: (documentId: DEX_Document['id']) => void;
  onError?: () => void;
  selectedPrefillStyle?: PrefilledResumeStyle | null;
}

export const createAndNavigateToDocument = async ({
  title,
  templateType,
  onSuccess,
  onError,
  selectedPrefillStyle = null,
}: CreateAndNavigateToDocumentParams) => {
  try {
    const documentId = await createDocument({
      title,
      templateType,
      selectedPrefillStyle,
    });

    if (!documentId) {
      showErrorToast(
        'An error occurred while creating the document. Please try again.'
      );
      if (onError) onError();
      return;
    }

    await builderRootStore.documentStore.initializeStore(documentId);
    showSuccessToast('Document created successfully.');

    if (onSuccess) onSuccess(documentId);
  } catch (error) {
    showErrorToast('An error occurred while creating the document.');
    console.error(error);
    if (onError) onError();
  }
};
