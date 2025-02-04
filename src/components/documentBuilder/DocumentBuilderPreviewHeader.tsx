import { useDocumentBuilderSearchParams } from '@/hooks/useDocumentBuilderSearchParams';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils/stringUtils';
import { observer } from 'mobx-react-lite';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
// import { action } from 'mobx';

const DocumentBuilderPreviewHeader = observer(() => {
  const { view, setView } = useDocumentBuilderSearchParams();
  const documentTitle =
    builderRootStore.documentStore.document?.title || 'Untitled';
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
      className={
        'flex items-center justify-between xl:justify-end mb-2 mx-auto w-full'
      }
      style={{
        width: pdfViewerStore.pdfDimensions?.width,
      }}
    >
      <Button
        className={cn('xl:hidden', view === 'preview' && 'flex xl:hidden')}
        variant="outline"
        onClick={() => {
          setView('builder');
        }}
      >
        <ArrowLeftIcon />
      </Button>
      {/* <Button
        onClick={action(async () => {
          const newTemplate =
            builderRootStore.documentStore.document?.templateType === 'london'
              ? 'manhattan'
              : 'london';

          if (!builderRootStore.documentStore.document) return;

          builderRootStore.documentStore.document.templateType = newTemplate;
        })}
      >
        Change Template
      </Button> */}
      <Button
        className="self-end"
        disabled={!previousRenderValue}
        onClick={downloadPDF}
      >
        Download PDF
      </Button>
    </div>
  );
});

export default DocumentBuilderPreviewHeader;
