import { Document } from '@/lib/schema';

const DocumentBuilderClient = ({
  documentId,
}: {
  documentId: Document['id'];
}) => {
  return <div>DocumentBuilderClient {documentId}</div>;
};

export default DocumentBuilderClient;
