import DocumentBuilderClient from '@/components/DocumentBuilderClient';

const DocumentBuilderPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const pageParams = await params;

  return <DocumentBuilderClient documentId={+pageParams.id} />;
};

export default DocumentBuilderPage;
