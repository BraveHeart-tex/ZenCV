import { pdf } from '@react-pdf/renderer';

import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAsync } from 'react-use';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { cn } from '@/lib/utils/stringUtils';
import { PreviewSkeleton } from '../PreviewSkeleton';
import { getPdfTemplateByType } from '../pdfViewer/pdfViewer.helpers';
import { usePdfViewerHelpers } from '../pdfViewer/pdfViewer.hooks';

const aspectRatio = Math.SQRT2;
const width = 800;
const height = width / aspectRatio;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const GalleryPdfViewer = observer(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderVersion, setRenderVersion] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dispose = reaction(
      () => builderRootStore.templateStore.debouncedTemplateData,
      (data) => {
        if (!data) {
          return;
        }
        setIsVisible(false); // hide before new render starts
        setRenderVersion((prev) => prev + 1);
      },
      { fireImmediately: true }
    );
    return () => dispose();
  }, []);

  const render = useAsync(async () => {
    const templateData = builderRootStore.templateStore.debouncedTemplateData;
    if (!templateData) {
      return null;
    }
    const element = getPdfTemplateByType(templateData);
    if (element) {
      const blob = await pdf(element).toBlob();
      return URL.createObjectURL(blob);
    }
  }, [renderVersion]);

  const {
    currentPage,
    onDocumentLoad,
    previousRenderValue,
    shouldShowPreviousDocument,
    shouldShowLoader,
  } = usePdfViewerHelpers(render);

  return (
    <div ref={containerRef} className='relative w-full h-full overflow-y-auto'>
      {shouldShowLoader ? (
        <div className='absolute inset-0 flex items-center justify-center'>
          <PreviewSkeleton />
        </div>
      ) : null}
      {/* Previous render stays fully visible while new one loads */}
      {previousRenderValue && shouldShowPreviousDocument ? (
        <Document
          key={previousRenderValue}
          className='previous-document'
          file={previousRenderValue}
          loading={null}
        >
          <Page
            key={currentPage}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={width}
            height={height}
            pageNumber={currentPage}
            loading={null}
            className='border shadow-sm'
          />
        </Document>
      ) : null}
      {/* New render fades in on mount */}
      {render.value && !render.loading && (
        <Document
          key={render.value}
          file={render.value}
          loading={null}
          onLoadSuccess={onDocumentLoad}
          className={cn(
            'transition-opacity duration-500 ease-in-out relative z-20',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Page
            key={currentPage}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={width}
            height={height}
            pageNumber={currentPage}
            loading={null}
            className='border shadow-sm'
            onRenderSuccess={() => {
              pdfViewerStore.setPreviousRenderValue(render.value as string);
              requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsVisible(true));
              });
            }}
          />
        </Document>
      )}
    </div>
  );
});
