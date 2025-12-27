'use client';

import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProtectedServiceDialog } from '@/components/auth/ProtectedServiceDialog';
import { DocumentBuilderViewToggle } from '@/components/documentBuilder/builderViewOptions/DocumentBuilderViewToggle';
import { DocumentBuilderClient } from '@/components/documentBuilder/DocumentBuilderClient';
import { ResumeOverview } from '@/components/documentBuilder/resumeOverview/ResumeOverview';
import { TemplateGallery } from '@/components/documentBuilder/templateGallery/TemplateGallery';
import { LazyMotionWrapper } from '@/components/ui/LazyMotionWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { showErrorToast } from '@/components/ui/sonner';
import { BuilderAiSuggestionsProvider } from '@/hooks/useBuilderAiSuggestions';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';

const DocumentBuilderPreview = dynamic(
  () =>
    import('@/components/documentBuilder/DocumentBuilderPreview').then(
      (module) => module.DocumentBuilderPreview
    ),
  {
    ssr: false,
    loading: () => (
      <div className='bg-secondary min-h-screen fixed top-0 right-0 w-1/2 z-[999] hidden xl:block'>
        <div className='h-[90vh] max-w-2xl mx-auto pt-4'>
          <div className='flex justify-end mb-2'>
            <Skeleton className='h-9 w-28' />
          </div>
          <Skeleton className='w-full h-[calc(90vh-6rem)]' />
          <div className='flex items-center justify-center gap-2 mt-2'>
            <Skeleton className='h-[1.875rem] w-[1.875rem] rounded-full' />
            <Skeleton className='w-16 h-4' />
            <Skeleton className='h-[1.875rem] w-[1.875rem] rounded-full' />
          </div>
        </div>
      </div>
    ),
  }
);

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

    const init = async () => {
      const result =
        await builderRootStore.documentStore.initializeStore(documentId);
      if (!result?.success) {
        showErrorToast(result.error);
        router.push('/documents');
      }
    };

    init();
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
          <DocumentBuilderPreview />
        </div>
        <DocumentBuilderViewToggle />
      </LazyMotionWrapper>
      <ProtectedServiceDialog />
    </BuilderAiSuggestionsProvider>
  );
});

export default DocumentBuilderPage;
