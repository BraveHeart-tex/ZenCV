'use client';

import DocumentBuilderClient from '@/components/documentBuilder/DocumentBuilderClient';

import ResumeOverview from '@/components/documentBuilder/resumeOverview/ResumeOverview';
import DocumentBuilderViewToggle from '@/components/documentBuilder/builderViewOptions/DocumentBuilderViewToggle';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { observer } from 'mobx-react-lite';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import TemplateGallery from '@/components/documentBuilder/templateGallery/TemplateGallery';
import { startTransition, useEffect } from 'react';
import { showErrorToast } from '@/components/ui/sonner';
import LazyMotionWrapper from '@/components/ui/LazyMotionWrapper';
import { BuilderAiSuggestionsProvider } from '@/hooks/useBuilderAiSuggestions';
import ProtectedServiceDialog from '@/components/auth/ProtectedServiceDialog';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/stringUtils';
import { Skeleton } from '@/components/ui/skeleton';
import DocumentBuilderPreview from '@/components/documentBuilder/DocumentBuilderPreview';
import ClientOnly from '@/components/misc/ClientOnly';

const DocumentBuilderPage = observer(() => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const documentId = params?.id ? +params?.id : null;

  useEffect(() => {
    if (
      !documentId ||
      builderRootStore.documentStore.document?.id === documentId
    ) {
      return;
    }

    startTransition(async () => {
      const result =
        await builderRootStore.documentStore.initializeStore(documentId);
      if (result?.error) {
        showErrorToast(result.error);
        router.push('/documents');
      }
    });
  }, [documentId, router]);

  if (
    builderRootStore.UIStore.currentView === BUILDER_CURRENT_VIEWS.TEMPLATES
  ) {
    return (
      <LazyMotionWrapper>
        <TemplateGallery />
      </LazyMotionWrapper>
    );
  }

  return (
    <BuilderAiSuggestionsProvider>
      <LazyMotionWrapper>
        <div>
          <ResumeOverview />
          <DocumentBuilderClient />
          <ClientOnly
            fallback={
              <div
                className={cn(
                  'bg-secondary min-h-screen fixed top-0 right-0 w-1/2 z-[999] hidden xl:block',
                )}
              >
                <div className="h-[90vh] max-w-2xl mx-auto pt-4">
                  <div className="flex justify-end mb-2">
                    <Skeleton className="h-9 w-28" />
                  </div>
                  <Skeleton className="w-full h-[calc(90vh-6rem)]" />
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Skeleton className="h-[1.875rem] w-[1.875rem] rounded-full" />
                    <Skeleton className="w-16 h-4" />
                    <Skeleton className="h-[1.875rem] w-[1.875rem] rounded-full" />
                  </div>
                </div>
              </div>
            }
          >
            <DocumentBuilderPreview />
          </ClientOnly>
        </div>
        <DocumentBuilderViewToggle />
      </LazyMotionWrapper>
      <ProtectedServiceDialog />
    </BuilderAiSuggestionsProvider>
  );
});

export default DocumentBuilderPage;
