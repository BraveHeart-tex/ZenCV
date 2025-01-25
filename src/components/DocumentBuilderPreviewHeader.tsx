import { useDocumentBuilderSearchParams } from '@/hooks/useDocumentBuilderSearchParams';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { pdfViewerStore } from '@/lib/pdfViewerStore';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from './ui/button';

const DocumentBuilderPreviewHeader = () => {
  const { view, setView } = useDocumentBuilderSearchParams();
  const documentTitle = documentBuilderStore.document?.title || 'Untitled';
  const previousRenderValue = pdfViewerStore.previousRenderValue;

  const downloadPDF = () => {
    const fileName = `${documentTitle}.pdf`;
    if (!previousRenderValue) return;

    const link = document.createElement('a');
    link.href = previousRenderValue;
    link.download = fileName;
    link.click();
  };

  return (
    <div
      className={cn(
        'w-full flex items-center justify-between xl:justify-end mb-2',
      )}
    >
      <Button
        className={cn(
          'xl:hidden text-muted dark:text-secondary-foreground',
          view === 'preview' && 'flex xl:hidden',
        )}
        variant="ghost"
        onClick={() => {
          setView('builder');
        }}
      >
        <ArrowLeftIcon />
      </Button>
      <Button
        className="self-end"
        disabled={!previousRenderValue}
        onClick={downloadPDF}
      >
        Download PDF
      </Button>
    </div>
  );
};
export default DocumentBuilderPreviewHeader;
