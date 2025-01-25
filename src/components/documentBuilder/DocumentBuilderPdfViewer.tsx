'use client';

import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { type DocumentProps, pdf } from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAsync } from 'react-use';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { useViewportSize } from '@/hooks/useViewportSize';
import * as motion from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils/stringUtils';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DocumentBuilderPdfViewer = ({ children }: { children: ReactElement }) => {
  const currentPage = pdfViewerStore.currentPage;
  const setCurrentPage = pdfViewerStore.setCurrentPage;
  const previousRenderValue = pdfViewerStore.previousRenderValue;
  const setPreviousRenderValue = pdfViewerStore.setPreviousRenderValue;
  const setNumberOfPages = pdfViewerStore.setNumberOfPages;
  const { width, height } = useViewportSize();

  const render = useAsync(async () => {
    if (!children) return null;

    const blob = await pdf(children as ReactElement<DocumentProps>).toBlob();
    return URL.createObjectURL(blob);
  }, []);

  const onDocumentLoad = (d: { numPages: number }) => {
    setNumberOfPages(d.numPages);
    setCurrentPage(Math.min(currentPage, d.numPages));
  };

  const isFirstRendering = !previousRenderValue;
  const isLatestValueRendered = previousRenderValue === render.value;
  const isBusy = render.loading || !isLatestValueRendered;

  const shouldShowPreviousDocument = !isFirstRendering && isBusy;

  return (
    <div className="relative z-10 h-full overflow-hidden transition-all">
      <AnimatePresence>
        {shouldShowPreviousDocument && previousRenderValue ? (
          <motion.div
            key={previousRenderValue}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Document
              key={previousRenderValue}
              className={'previous-document h-full w-full'}
              file={previousRenderValue}
              loading={null}
            >
              <Page
                key={currentPage}
                pageNumber={currentPage}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                width={width < 768 ? 0.7 * width : 0.4 * width}
                height={width < 768 ? 0.7 * height : 0.4 * height}
                loading={null}
              />
            </Document>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {render.value && (
        <Document
          file={render.value}
          loading={null}
          className={cn(
            'z-10',
            shouldShowPreviousDocument && 'rendering-document hidden z-0',
          )}
          onLoadSuccess={onDocumentLoad}
        >
          <Page
            key={currentPage + 1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            pageNumber={currentPage}
            width={width < 768 ? 0.7 * width : 0.4 * width}
            height={width < 768 ? 0.7 * height : 0.4 * height}
            loading={null}
            onRenderSuccess={() => {
              if (render.value !== undefined) {
                setPreviousRenderValue(render.value);
              }
            }}
          />
        </Document>
      )}
    </div>
  );
};
export default DocumentBuilderPdfViewer;
