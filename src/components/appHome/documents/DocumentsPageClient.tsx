import { useLiveQuery } from 'dexie-react-hooks';
import { FileText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { clientDb } from '@/lib/client-db/clientDb';
import type { DEX_JobPosting } from '@/lib/client-db/clientDbSchema';
import { CreateDocumentDialog } from './CreateDocumentDialog';
import { DocumentCard } from './DocumentCard';

export const DocumentsPageClient = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const documents = useLiveQuery(
    async () => {
      const documents = await clientDb.documents.toArray();
      const jobPostingIds = [
        ...new Set(
          documents.map((doc) => doc.jobPostingId).filter((id) => id !== null)
        ),
      ];
      const jobPostingsMap = new Map<DEX_JobPosting['id'], DEX_JobPosting>();
      if (jobPostingIds.length) {
        const jobPostings = await clientDb.jobPostings
          .where('id')
          .anyOf(jobPostingIds)
          .toArray();
        jobPostings.forEach((jp) => {
          jobPostingsMap.set(jp.id, jp);
        });
      }
      return documents.map((doc) => ({
        ...doc,
        jobPosting: doc.jobPostingId
          ? jobPostingsMap.get(doc.jobPostingId) || null
          : null,
      }));
    },
    [],
    null
  );

  const filteredDocuments = useMemo(() => {
    if (!documents) return null;
    if (!searchQuery) return documents;
    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  const noDocumentsCreated =
    documents !== null && documents.length === 0 && !searchQuery;

  if (noDocumentsCreated) {
    return (
      <div className='flex flex-col items-center justify-center flex-1 h-full min-h-[60vh] gap-6'>
        <div className='flex flex-col items-center gap-4'>
          <div className='rounded-2xl border border-border bg-muted/30 p-5'>
            <FileText className='w-8 h-8 text-muted-foreground/60' />
          </div>
          <div className='space-y-1.5 text-center'>
            <h2 className='text-xl font-semibold tracking-tight'>
              No documents yet
            </h2>
            <p className='text-sm text-muted-foreground max-w-xs'>
              Create your first document and start building a resume that gets
              you hired.
            </p>
          </div>
          <CreateDocumentDialog />
        </div>
      </div>
    );
  }

  if (!documents) {
    return (
      <div className='flex flex-col gap-6'>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className='md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid grid-cols-1 gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Index is fine here for skeletons
              key={i}
              className='h-32 rounded-xl border border-border bg-muted/30 animate-pulse'
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between gap-4'>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CreateDocumentDialog />
      </div>

      {filteredDocuments?.length === 0 && searchQuery ? (
        <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
          <Search className='w-6 h-6 text-muted-foreground/40' />
          <div className='space-y-1'>
            <p className='text-sm font-medium'>
              No results for "{searchQuery}"
            </p>
            <p className='text-xs text-muted-foreground'>
              Try searching with a different term.
            </p>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <h2 className='text-sm font-semibold tracking-tight'>
                Documents
              </h2>
              <span className='text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md tabular-nums'>
                {filteredDocuments?.length ?? 0}
              </span>
            </div>
          </div>

          <div className='md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid grid-cols-1 gap-4'>
            <CreateDocumentDialog triggerVariant='card' />
            {filteredDocuments?.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className='relative w-full md:max-w-sm'>
    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none' />
    <Input
      placeholder='Search documents...'
      className='pl-9 bg-muted/30 border-border/60 focus:border-border transition-colors'
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
