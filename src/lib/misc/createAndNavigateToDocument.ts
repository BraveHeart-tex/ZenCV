import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import type { DEX_Document } from '../client-db/clientDbSchema';
import { createDocument } from '../client-db/documentService';
import { serializeTemplateSettings } from '../constants/accentColors';
import { builderSession } from '../stores/documentBuilder/builderSession';
import type { PrefilledResumeStyle } from '../templates/prefilledTemplates';
import type { ResumeTemplate } from '../types/documentBuilder.types';

interface CreateAndNavigateToDocumentParams {
  title: string;
  templateType: ResumeTemplate;
  onSuccess?: (documentId: DEX_Document['id']) => void;
  onError?: (message: string) => void;
  selectedPrefillStyle?: PrefilledResumeStyle | null;
}

export const createAndNavigateToDocument = async ({
  title,
  templateType,
  onSuccess,
  onError,
  selectedPrefillStyle = null,
}: CreateAndNavigateToDocumentParams) => {
  let documentId: DEX_Document['id'] | undefined;
  try {
    documentId = await createDocument({
      title,
      templateType,
      selectedPrefillStyle,
      templateSettings: serializeTemplateSettings({}),
    });

    if (!documentId) {
      const message =
        'Could not create your resume. Your entries are still here. Select Create resume to try again.';
      if (onError) {
        onError(message);
      } else {
        showErrorToast(message);
      }
      return;
    }

    await builderSession.initializeStore(documentId);
    showSuccessToast('Resume created.');

    if (onSuccess) {
      onSuccess(documentId);
    }
  } catch (error) {
    console.error(error);
    const message = documentId
      ? 'Your resume was saved, but could not be opened. Open it from the resume library.'
      : 'Could not create your resume. Your entries are still here. Select Create resume to try again.';
    if (onError) {
      onError(message);
    } else {
      showErrorToast(message);
    }
  }
};
