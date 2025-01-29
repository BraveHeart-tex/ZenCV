'use client';
import DocumentBuilderClient from '@/components/documentBuilder/DocumentBuilderClient';
import { LazyMotion, domAnimation } from 'motion/react';
import { useParams } from 'react-router';
import ClientOnly from '../misc/ClientOnly';
import DocumentBuilderPreview from './DocumentBuilderPreview';
import { memo } from 'react';
import ResumeOverview from './resumeOverview/ResumeOverview';
import DocumentBuilderViewToggle from './builderViewOptions/DocumentBuilderViewToggle';

const DocumentBuilderPage = memo(() => {
  const params = useParams<{ id: string }>();
  if (!params.id) return null;
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

DocumentBuilderPage.displayName = 'DocumentBuilderPage';

export default DocumentBuilderPage;
