'use client';
import DocumentBuilderClient from '@/components/documentBuilder/DocumentBuilderClient';
import { LazyMotion, domAnimation } from 'motion/react';
import { useParams } from 'react-router';
import ClientOnly from '../misc/ClientOnly';
import DocumentBuilderPreview from './DocumentBuilderPreview';

const DocumentBuilderPage = () => {
  const params = useParams<{ id: string }>();
  if (!params.id) return null;
  return (
    <LazyMotion features={domAnimation} strict>
      <div>
        <DocumentBuilderClient documentId={+params.id} />
        <ClientOnly>
          <DocumentBuilderPreview />
        </ClientOnly>
      </div>
    </LazyMotion>
  );
};

export default DocumentBuilderPage;
