import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowUpRight, FileText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clientDb } from '@/lib/client-db/clientDb';
import { CreateDocumentDialog } from './CreateDocumentDialog';
import { DocumentCard } from './DocumentCard';

export const DocumentsPageClient = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const documents = useLiveQuery(
    async () => {
      return clientDb.documents.orderBy('updatedAt').reverse().toArray();
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
  const isLoading = documents === null;
  const documentCount = filteredDocuments?.length ?? 0;
  const documentCountLabel = `${documentCount} ${
    documentCount === 1 ? 'resume' : 'resumes'
  }`;

  return (
    <div className='flex min-w-0 flex-1 flex-col'>
      <DocumentsIntroduction />

      {noDocumentsCreated ? (
        <EmptyLibraryState />
      ) : (
        <>
          <div className='mb-8 flex min-w-0 flex-col gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between'>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CreateDocumentDialog triggerClassName='w-full sm:w-auto' />
          </div>

          <section aria-labelledby='resume-library-title' className='min-w-0'>
            <div className='mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
              <div className='min-w-0 space-y-1'>
                <h3
                  id='resume-library-title'
                  className='text-base font-semibold tracking-tight'
                >
                  Resume library
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {isLoading
                    ? 'Loading your resumes…'
                    : `${documentCountLabel} stored locally in this browser.`}
                </p>
              </div>
              <Button
                asChild
                variant='link'
                className='h-11 w-fit shrink-0 justify-start gap-1 px-0 text-sm lg:h-9'
              >
                <Link to='/settings#data'>
                  Back up or import
                  <ArrowUpRight aria-hidden='true' className='size-4' />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <LoadingLibrary />
            ) : filteredDocuments?.length === 0 ? (
              <SearchEmptyState
                query={searchQuery.trim()}
                onClear={() => setSearchQuery('')}
              />
            ) : (
              <div className='grid min-w-0 grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-4'>
                {filteredDocuments?.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

const DocumentsIntroduction = () => (
  <section className='mb-8 border-b border-border/70 pb-6 sm:mb-10 sm:pb-8'>
    <h2 className='text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl'>
      Your resumes
    </h2>
    <p className='mt-2 max-w-xl text-sm leading-6 text-muted-foreground'>
      Resumes in this library are saved locally in this browser.
    </p>
  </section>
);

const EmptyLibraryState = () => (
  <section
    aria-labelledby='empty-library-title'
    className='flex min-h-0 min-w-0 flex-1 items-center justify-center py-12 sm:py-16'
  >
    <div className='flex w-full max-w-md flex-col items-center text-center'>
      <FileText
        aria-hidden='true'
        className='mb-5 size-8 text-editorial-accent'
        strokeWidth={1.5}
      />
      <div className='space-y-2'>
        <h3
          id='empty-library-title'
          className='text-xl font-semibold tracking-tight sm:text-2xl'
        >
          No resumes yet
        </h3>
        <p className='mx-auto max-w-sm text-sm leading-6 text-muted-foreground'>
          Choose a template and make it yours.
        </p>
      </div>
      <div className='mt-6 flex min-w-0 flex-col items-center gap-2'>
        <CreateDocumentDialog />
        <Button asChild variant='link' className='h-11 px-0 text-sm lg:h-9'>
          <Link to='/settings#data'>Already have a backup? Import it</Link>
        </Button>
      </div>
    </div>
  </section>
);

const SearchEmptyState = ({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) => (
  <div
    aria-live='polite'
    aria-atomic='true'
    className='flex min-w-0 flex-col items-start gap-3 border-t border-border/60 py-7 sm:flex-row sm:items-center sm:justify-between sm:py-8'
  >
    <p className='min-w-0 break-words text-sm font-medium [overflow-wrap:anywhere]'>
      No results for “{query}”
    </p>
    <Button
      variant='outline'
      className='h-11 shrink-0 lg:h-9'
      onClick={onClear}
    >
      Clear search
    </Button>
  </div>
);

const LoadingLibrary = () => (
  <section
    aria-label='Loading resumes'
    aria-live='polite'
    aria-busy='true'
    className='grid min-w-0 grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-4'
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        // biome-ignore lint/suspicious/noArrayIndexKey: Index is stable for a fixed skeleton list.
        key={index}
        className='flex min-h-[13rem] min-w-0 flex-col justify-between rounded-md border border-border/70 bg-card/40 p-4 sm:p-5'
      >
        <div className='space-y-4'>
          <div className='h-5 w-3/5 rounded-sm bg-muted/60' />
          <div className='h-4 w-2/5 rounded-sm bg-muted/50' />
        </div>
        <div className='flex items-center justify-between gap-3 border-t border-border/60 pt-3'>
          <div className='h-3 w-2/5 rounded-sm bg-muted/50' />
          <div className='h-10 w-20 rounded-md bg-muted/60 sm:h-9' />
        </div>
      </div>
    ))}
  </section>
);

const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className='relative w-full sm:max-w-md'>
    <Search
      aria-hidden='true'
      className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'
      strokeWidth={1.75}
    />
    <Input
      type='search'
      aria-label='Search resumes'
      placeholder='Search resumes...'
      className='h-11 rounded-md border-input bg-card/50 pl-10 pr-3 shadow-none placeholder:text-muted-foreground'
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);
