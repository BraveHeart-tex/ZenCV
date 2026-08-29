import { observer } from 'mobx-react-lite';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentBuilderViewToggle } from '@/components/documentBuilder/builderViewOptions/DocumentBuilderViewToggle';
import { DocumentBuilderClient } from '@/components/documentBuilder/DocumentBuilderClient';
import { PreviewSkeleton } from '@/components/documentBuilder/PreviewSkeleton';
import { ResumeOverview } from '@/components/documentBuilder/resumeOverview/ResumeOverview';
import { TemplateGallery } from '@/components/documentBuilder/templateGallery/TemplateGallery';
import { LazyMotionWrapper } from '@/components/ui/LazyMotionWrapper';
import { showErrorToast } from '@/components/ui/sonner';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';

const DESKTOP_PREVIEW_MEDIA_QUERY = '(min-width: 1280px)';

const DocumentBuilderPreview = lazy(() =>
  import('@/components/documentBuilder/DocumentBuilderPreview').then(
    (module) => ({ default: module.DocumentBuilderPreview })
  )
);

export const BuilderPage = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const documentId = id ? +id : null;
  const view = builderRootStore.UIStore.currentView;
  const [hasMountedPreview, setHasMountedPreview] = useState(false);

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
        navigate('/documents');
      }
    };

    init();
  }, [documentId, navigate]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_PREVIEW_MEDIA_QUERY);

    const mountPreviewForDesktop = () => {
      if (mediaQuery.matches) {
        setHasMountedPreview(true);
      }
    };

    mountPreviewForDesktop();
    mediaQuery.addEventListener('change', mountPreviewForDesktop);

    return () => {
      mediaQuery.removeEventListener('change', mountPreviewForDesktop);
    };
  }, []);

  useEffect(() => {
    if (view === BUILDER_CURRENT_VIEWS.PREVIEW) {
      setHasMountedPreview(true);
    }
  }, [view]);

  if (view === BUILDER_CURRENT_VIEWS.TEMPLATES) {
    return (
      <LazyMotionWrapper>
        <TemplateGallery />
      </LazyMotionWrapper>
    );
  }

  const shouldMountPreview =
    hasMountedPreview || view === BUILDER_CURRENT_VIEWS.PREVIEW;

  return (
    <LazyMotionWrapper>
      <div>
        <ResumeOverview />
        <DocumentBuilderClient />
        {shouldMountPreview ? (
          <Suspense fallback={<PreviewSkeleton />}>
            <DocumentBuilderPreview />
          </Suspense>
        ) : null}
      </div>
      <DocumentBuilderViewToggle />
    </LazyMotionWrapper>
  );
});
