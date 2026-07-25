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
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

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
    if (!documents) {
      return null;
    }
    if (!normalizedSearchQuery) {
      return documents;
    }
    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(normalizedSearchQuery)
    );
  }, [documents, normalizedSearchQuery]);

  const noDocumentsCreated =
    documents !== null && documents.length === 0 && !normalizedSearchQuery;
  const documentCount = filteredDocuments?.length ?? 0;
  const documentCountLabel = `${documentCount} ${
    documentCount === 1 ? 'resume' : 'resumes'
  }`;

  if (noDocumentsCreated) {
    return (
      <div className='flex min-w-0 flex-1 flex-col items-center justify-center gap-6 h-full min-h-[60vh] px-2'>
        <div className='flex w-full max-w-sm flex-col items-center gap-4 text-center'>
          <div className='rounded-2xl border border-border bg-muted/30 p-5'>
            <FileText className='w-8 h-8 text-muted-foreground/60' />
          </div>
          <div className='min-w-0 space-y-1.5'>
            <h2 className='text-xl font-semibold tracking-tight'>
              No resumes yet
            </h2>
            <p className='max-w-xs text-wrap text-sm text-muted-foreground'>
              Create your first resume and keep it ready for the next
              application.
            </p>
          </div>
          <CreateDocumentDialog />
        </div>
      </div>
    );
  }

  if (!documents) {
    return (
      <div className='flex min-w-0 flex-col gap-5'>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4'>
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
    <div className='flex min-w-0 flex-col gap-6'>
      <div className='flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CreateDocumentDialog />
      </div>

      {filteredDocuments?.length === 0 && normalizedSearchQuery ? (
        <div className='flex min-w-0 flex-col items-center justify-center gap-3 py-16 text-center'>
          <Search className='w-6 h-6 text-muted-foreground/40' />
          <div className='min-w-0 max-w-sm space-y-1'>
            <p className='wrap-break-word text-sm font-medium'>
              No results for "{searchQuery.trim()}"
            </p>
            <p className='text-xs text-muted-foreground'>
              Try searching with a different term.
            </p>
          </div>
        </div>
      ) : (
        <div className='flex min-w-0 flex-col gap-4'>
          <div className='flex min-w-0 items-end justify-between gap-4'>
            <div className='min-w-0 space-y-1'>
              <h2 className='text-base font-semibold tracking-tight'>
                Resume library
              </h2>
              <p className='text-sm text-muted-foreground'>
                {documentCountLabel} stored locally in this browser.
              </p>
            </div>
          </div>

          <div className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4'>
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
    <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60' />
    <Input
      type='search'
      aria-label='Search resumes'
      placeholder='Search resumes...'
      className='h-11 border-border/60 bg-muted/30 pl-9 transition-colors focus:border-border lg:h-9'
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
