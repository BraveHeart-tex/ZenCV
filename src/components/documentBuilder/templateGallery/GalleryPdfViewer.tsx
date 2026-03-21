import { pdf } from '@react-pdf/renderer';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
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
  const [renderVersion, setRenderVersion] = useState(0);

  useEffect(() => {
    const dispose = reaction(
      () => builderRootStore.templateStore.debouncedTemplateData,
      (data) => {
        if (!data) {
          return;
        }
        setRenderVersion((prev) => prev + 1);
      },
      { fireImmediately: true }
    );
    return () => dispose();
  }, []);

  const render = useAsync(async () => {
    const templateData = builderRootStore.templateStore.debouncedTemplateData;
    if (!templateData || isMobile) {
      return null;
    }

    const element = getPdfTemplateByType(templateData);
    if (element) {
      const blob = await pdf(element).toBlob();
      return URL.createObjectURL(blob);
    }
  }, [renderVersion, isMobile]);

  const { currentPage, onDocumentLoad } = usePdfViewerHelpers(render);

  return (
    <div ref={containerRef} className='w-full h-full'>
      {render.value && !render.loading && (
        <Document
          key={render.value}
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
