'use client';
import DocumentBuilderClient from '@/components/documentBuilder/DocumentBuilderClient';
import { LazyMotion, domAnimation } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import ClientOnly from '../misc/ClientOnly';
import DocumentBuilderPreview from './DocumentBuilderPreview';
import ResumeOverview from './resumeOverview/ResumeOverview';
import DocumentBuilderViewToggle from './builderViewOptions/DocumentBuilderViewToggle';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { observer } from 'mobx-react-lite';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import TemplateGallery from './templateGallery/TemplateGallery';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { startTransition, useEffect } from 'react';
import { showErrorToast } from '../ui/sonner';

const DocumentBuilderPage = observer(() => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const documentId = params?.id ? +params?.id : null;

  useEffect(() => {
    return () => {
      builderRootStore.resetState();
      pdfViewerStore.resetState();
    };
  }, []);

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
        navigate('/documents');
      }
    });
  }, [documentId, navigate]);

  if (
    builderRootStore.UIStore.currentView === BUILDER_CURRENT_VIEWS.TEMPLATES
  ) {
    return <TemplateGallery />;
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div>
        <ResumeOverview />
        <DocumentBuilderClient />
        <ClientOnly>
          <DocumentBuilderPreview />
        </ClientOnly>
      </div>
      <DocumentBuilderViewToggle />
    </LazyMotion>
  );
});

export default DocumentBuilderPage;
