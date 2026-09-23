import { observer } from 'mobx-react-lite';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useBlocker, useNavigate, useParams } from 'react-router-dom';
import { DocumentBuilderViewToggle } from '@/components/documentBuilder/builderViewOptions/DocumentBuilderViewToggle';
import { DocumentBuilderClient } from '@/components/documentBuilder/DocumentBuilderClient';
import { PreviewSkeleton } from '@/components/documentBuilder/PreviewSkeleton';
import { ResumeOverview } from '@/components/documentBuilder/resumeOverview/ResumeOverview';
import { TemplateGallery } from '@/components/documentBuilder/templateGallery/TemplateGallery';
import { Button } from '@/components/ui/button';
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
  const session = builderRootStore.session;
  const view = builderRootStore.UIStore.currentView;
  const [hasMountedPreview, setHasMountedPreview] = useState(false);
  const blocker = useBlocker(session.state.status === 'ready');

  useEffect(() => {
    if (!documentId) {
      navigate('/documents', { replace: true });
      return;
    }
    if (
      session.state.status === 'ready' &&
      session.state.documentId === documentId
    ) {
      return;
    }
    void session.load(documentId);
  }, [documentId, navigate, session]);

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

  useEffect(() => {
    if (blocker.state !== 'blocked') {
      return;
    }

    void (async () => {
      if (await session.prepareNavigation()) {
        blocker.proceed();
        return;
      }
      showErrorToast('Finish saving your changes before leaving.');
      blocker.reset();
    })();
  }, [blocker, session]);

  const returnToDocuments = () => {
    navigate('/documents');
  };

  if (session.state.status === 'loading' || session.state.status === 'idle') {
    return <PreviewSkeleton />;
  }

  if (session.state.status === 'failed') {
    return (
      <main className='bg-background flex min-h-screen items-center justify-center p-6'>
        <section className='border-border bg-card w-full max-w-md rounded-xl border p-6'>
          <h1 className='text-lg font-semibold'>Unable to open this resume</h1>
          <p className='text-muted-foreground mt-2 text-sm leading-6'>
            {session.state.message}
          </p>
          <div className='mt-6 flex flex-wrap gap-3'>
            <Button onClick={() => void session.retry()}>Try again</Button>
            <Button onClick={() => navigate('/documents')} variant='outline'>
              Return to documents
            </Button>
          </div>
        </section>
      </main>
    );
  }

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
        <DocumentBuilderClient onReturnToDocuments={returnToDocuments} />
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
