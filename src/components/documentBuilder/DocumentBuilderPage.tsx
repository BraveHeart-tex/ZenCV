'use client';
import DocumentBuilderClient from '@/components/documentBuilder/DocumentBuilderClient';
import { LazyMotion, domAnimation } from 'motion/react';
import { useParams } from 'react-router';
import ClientOnly from '../misc/ClientOnly';
import DocumentBuilderPreview from './DocumentBuilderPreview';
import ResumeOverview from './resumeOverview/ResumeOverview';
import DocumentBuilderViewToggle from './builderViewOptions/DocumentBuilderViewToggle';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { observer } from 'mobx-react-lite';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import BuilderTemplatesPageHeader from './BuilderTemplatesPageHeader';

const DocumentBuilderPage = observer(() => {
  const params = useParams<{ id: string }>();
  if (!params.id) return null;

  if (
    builderRootStore.UIStore.currentView === BUILDER_CURRENT_VIEWS.TEMPLATES
  ) {
    return (
      <main className="bg-muted h-screen">
        <div className=" bg-background flex items-center justify-center">
          <BuilderTemplatesPageHeader />
        </div>
      </main>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div>
        <ResumeOverview />
        <DocumentBuilderClient documentId={+params.id} />
        <ClientOnly>
          <DocumentBuilderPreview />
        </ClientOnly>
      </div>
      <DocumentBuilderViewToggle />
    </LazyMotion>
  );
});

export default DocumentBuilderPage;
