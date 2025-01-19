import DocumentBuilderClient from '@/components/DocumentBuilderClient';
import { LazyMotion, domAnimation } from 'motion/react';

const DocumentBuilderPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const pageParams = await params;

  return (
    <LazyMotion features={domAnimation} strict>
      <DocumentBuilderClient documentId={+pageParams.id} />
    </LazyMotion>
  );
};

export default DocumentBuilderPage;
