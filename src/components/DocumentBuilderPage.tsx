'use client';
import DocumentBuilderClient from '@/components/DocumentBuilderClient';
import { LazyMotion, domAnimation } from 'motion/react';
import { useParams } from 'react-router';

const DocumentBuilderPage = () => {
  const params = useParams<{ id: string }>();
  if (!params.id) return null;
  return (
    <LazyMotion features={domAnimation} strict>
      <DocumentBuilderClient documentId={+params.id} />
    </LazyMotion>
  );
};

export default DocumentBuilderPage;
