import { pdf } from '@react-pdf/renderer';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAsync } from 'react-use';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { getPdfTemplateByType } from '../pdfViewer/pdfViewer.helpers';
import { usePdfViewerHelpers } from '../pdfViewer/pdfViewer.hooks';

const aspectRatio = Math.SQRT2;
const width = 800;
const height = width / aspectRatio;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const GalleryPdfViewer = observer(() => {
  const isMobile = useMediaQuery('(max-width: 768px)', false);
  const containerRef = useRef<HTMLDivElement>(null);

  const templateType = builderRootStore.documentStore.document?.templateType;

  const renderData = JSON.stringify(
    builderRootStore.templateStore.debouncedTemplateData
  );

  const render = useAsync(async () => {
    try {
      if (
        !renderData ||
        !templateType ||
        !builderRootStore.templateStore.debouncedTemplateData
      ) {
        return null;
      }

      const element = getPdfTemplateByType(
        templateType,
        builderRootStore.templateStore.debouncedTemplateData
      );

      if (element) {
        const blob = await pdf(element).toBlob();
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('DocumentBuilderPdfViewer rendering error', error);
    }
  }, [renderData, isMobile, templateType]);

  const { currentPage, onDocumentLoad } = usePdfViewerHelpers(render);

  return (
    <div ref={containerRef} className='w-full h-full'>
      {render.value && !render.loading && (
        <Document
          key={`${templateType}-${render.value}`}
          file={render.value}
          className='w-full h-full'
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
