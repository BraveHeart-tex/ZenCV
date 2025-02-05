'use client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { useEffect, useTransition } from 'react';
import { observer } from 'mobx-react-lite';
import { showErrorToast } from '@/components/ui/sonner';
import DocumentBuilderHeader from '@/components/documentBuilder/DocumentBuilderHeader';
import DocumentSections from '@/components/documentBuilder/DocumentSections';
import AddSectionWidget from '@/components/documentBuilder/AddSectionWidget';
import { DEX_Document } from '@/lib/client-db/clientDbSchema';
import { useDocumentBuilderSearchParams } from '@/hooks/useDocumentBuilderSearchParams';
import { cn } from '@/lib/utils/stringUtils';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import ImproveResumeWidget from './resumeScore/ImproveResumeWidget';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

const DocumentBuilderClient = observer(
  ({ documentId }: { documentId: DEX_Document['id'] }) => {
    const navigate = useNavigate();
    const { view } = useDocumentBuilderSearchParams();

    const [, startTransition] = useTransition();

    useEffect(() => {
      return () => {
        builderRootStore.resetState();
        pdfViewerStore.resetState();
      };
    }, []);

    useEffect(() => {
      if (
        !documentId ||
        builderRootStore.documentStore.document?.id === documentId
      ) {
        return;
      }

      startTransition(async () => {
        const result =
          await builderRootStore.documentStore.initializeStore(documentId);
        if (result?.error) {
          showErrorToast(result.error);
          navigate('/documents');
        }
      });
    }, [documentId, navigate]);

    return (
      <TooltipProvider>
        <div
          className={cn(
            'bg-background min-h-screen px-6 md:p-12 py-14 relative w-1/2 hide-scrollbar',
            view === 'builder' && 'w-full xl:w-1/2',
            view === 'preview' && 'hidden xl:block',
          )}
        >
          <Button
            onClick={() => {
              navigate('/documents');
              builderRootStore.resetState();
            }}
            variant="outline"
            className="top-2 left-2 absolute"
          >
            Documents
          </Button>

          <div className="max-w-screen-2xl mx-auto">
            <DocumentBuilderHeader />
          </div>
          <div
            className={
              'max-w-screen-2xl bg-popover sticky top-0 z-50 flex items-center justify-between mx-auto'
            }
          >
            <ImproveResumeWidget />
          </div>

          <div className="max-w-screen-2xl grid gap-6 pb-8 mx-auto mt-4">
            <DocumentSections />
            <AddSectionWidget />
          </div>
        </div>
      </TooltipProvider>
    );
  },
);

export default DocumentBuilderClient;
