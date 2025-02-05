import { useMediaQuery } from '@/hooks/useMediaQuery';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { useAsync } from 'react-use';
import { getPdfTemplateByType } from '../pdfViewer/pdfViewer.helpers';
import usePdfViewerHelpers from '../pdfViewer/pdfViewer.hooks';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';

const aspectRatio = 1.414;
const width = 800;
const height = width / aspectRatio;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const GalleryPdfViewer = observer(() => {
  const isMobile = useMediaQuery('(max-width: 768px)', false);
  const containerRef = useRef<HTMLDivElement>(null);

  const templateType = builderRootStore.documentStore.document?.templateType;

  const renderData = JSON.stringify(
    builderRootStore.templateStore.debouncedTemplateData,
  );

  const render = useAsync(async () => {
    try {
      if (!renderData || !templateType) {
        return null;
      }

      const element = getPdfTemplateByType(
        templateType,
        builderRootStore.templateStore.debouncedTemplateData!,
      );

      const blob = await pdf(element).toBlob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('DocumentBuilderPdfViewer rendering error', error);
    }
  }, [renderData, isMobile, templateType]);

  const {
    previousRenderValue,
    shouldShowPreviousDocument,
    currentPage,
    onDocumentLoad,
  } = usePdfViewerHelpers(render);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {shouldShowPreviousDocument ? (
        <Document
          key={`${templateType}-${previousRenderValue}`}
          className="previous-document absolute inset-0 flex items-center justify-center w-full h-full transition-opacity duration-300 ease-in-out opacity-50"
          file={previousRenderValue}
          loading={null}
        >
          <Page
            key={currentPage}
            pageNumber={currentPage}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={width}
            height={height}
            loading={null}
          />
        </Document>
      ) : null}

      {render.value && !render.loading && (
        <Document
          key={`${templateType}-${render.value}`}
          className={
            'absolute inset-0 flex items-center justify-center w-full h-full transition-opacity duration-300 ease-in-out'
          }
          file={render.value}
          loading={null}
          onLoadSuccess={onDocumentLoad}
        >
          <Page
            key={currentPage}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={width}
            height={height}
            pageNumber={currentPage}
            loading={null}
            onRenderSuccess={() => {
              pdfViewerStore.setPreviousRenderValue(render.value as string);
            }}
          />
        </Document>
      )}
    </div>
  );
});

export default GalleryPdfViewer;
