'use client';
import { clientDb } from '@/lib/client-db/clientDb';
import { useLiveQuery } from 'dexie-react-hooks';
import CreateDocumentDialog from './CreateDocumentDialog';
import DocumentCard from './DocumentCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { DEX_JobPosting } from '@/lib/client-db/clientDbSchema';

const DocumentsPageClient = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const documents = useLiveQuery(
    async () => {
      const documents = await clientDb.documents.toArray();

      const jobPostingIds = [
        ...new Set(documents.map((doc) => doc.jobPostingId).filter(Boolean)),
      ];

      const jobPostingsMap = new Map<DEX_JobPosting['id'], DEX_JobPosting>();
      if (jobPostingIds.length) {
        const jobPostings = await clientDb.jobPostings
          .where('id')
          .anyOf(jobPostingIds)
          .toArray();
        jobPostings.forEach((jp) => jobPostingsMap.set(jp.id, jp));
      }

      return documents.map((doc) => ({
        ...doc,
        jobPosting: doc.jobPostingId
          ? jobPostingsMap.get(doc.jobPostingId) || null
          : null,
      }));
    },
    [],
    null,
  );

  const filteredDocuments = useMemo(() => {
    if (!documents) return null;
    if (!searchQuery) return documents;

    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [documents, searchQuery]);

  if (!documents) {
    return (
      <div className="flex flex-col gap-6">
        <div className="md:max-w-lg relative w-full">
          <Search className="text-muted-foreground left-2 top-2 absolute w-5 h-5" />
          <Input
            placeholder="Search documents..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-muted-foreground text-center">Loading...</div>
      </div>
    );
  }

  const noDocumentsCreated = filteredDocuments?.length === 0 && !searchQuery;
  if (noDocumentsCreated) {
    return (
      <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min flex flex-col justify-center items-center gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="scroll-m-20 first:mt-0 text-3xl font-semibold tracking-tight text-center">
            You don’t have any documents yet!
          </h2>
          <p className="text-muted-foreground text-center">
            Ready to get started? Click below to create your first document in
            just a few clicks.
          </p>
        </div>
        <CreateDocumentDialog />
      </div>
    );
  }

  const renderDocuments = () => {
    if (filteredDocuments?.length === 0 && searchQuery) {
      return (
        <div className="text-muted-foreground text-center">
          No documents found matching your search.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <div className=" flex items-center gap-2">
          <CreateDocumentDialog triggerVariant="icon" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Documents
          </h2>
        </div>
        <div className="md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid w-full grid-cols-1 gap-4">
          {filteredDocuments?.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="md:max-w-lg relative w-full">
        <Search className="text-muted-foreground left-2 top-2 absolute w-5 h-5" />
        <Input
          placeholder="Search documents..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {renderDocuments()}
    </div>
  );
};

export default DocumentsPageClient;
