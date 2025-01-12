'use client';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import CreateDocumentDialog from './CreateDocumentDialog';
import DocumentCard from './document-card';

const DocumentsPageClient = () => {
  const documentsObservable = useLiveQuery(() => db.documents.toArray());

  if (documentsObservable && documentsObservable.length === 0) {
    return (
      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min flex flex-col justify-center items-center gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="scroll-m-20 first:mt-0 text-3xl font-semibold tracking-tight text-center">
            You don’t have any documents yet!
          </h2>
          <p className="text-muted-foreground">
            Ready to get started? Click below to create your first document.
          </p>
        </div>
        <CreateDocumentDialog />
      </div>
    );
  }

  return (
    <div className="md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-4">
      {documentsObservable?.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
};
export default DocumentsPageClient;
