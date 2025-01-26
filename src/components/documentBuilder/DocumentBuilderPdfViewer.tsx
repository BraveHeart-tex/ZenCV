'use client';

import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { type DocumentProps, pdf } from '@react-pdf/renderer';
import { ReactElement, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAsync } from 'react-use';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { useViewportSize } from '@/hooks/useViewportSize';
import * as motion from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils/stringUtils';
import { observer } from 'mobx-react-lite';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DocumentBuilderPdfViewer = observer(
  ({
    children,
    renderData,
  }: {
    children: ReactElement;
    renderData: string;
  }) => {
    const currentPage = pdfViewerStore.currentPage;
    const previousRenderValue = pdfViewerStore.previousRenderValue;
    const { width, height } = useViewportSize();

    // TODO: This makes zero sense, should target for a more focused aspect ratio on all devices
    const pdfDimensions = useMemo(() => {
      const pdfWidth = width < 768 ? 0.7 * width : 0.4 * width;
      const pdfHeight = width < 768 ? 0.7 * height : 0.4 * height;

      return { pdfWidth, pdfHeight };
    }, [width, height]);

    const render = useAsync(async () => {
      try {
        if (!children || !renderData) return null;

        const blob = await pdf(
          children as ReactElement<DocumentProps>,
        ).toBlob();
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('DocumentBuilderPdfViewer rendering error', error);
      }
    }, [renderData]);

    const onDocumentLoad = (d: { numPages: number }) => {
      pdfViewerStore.setNumberOfPages(d.numPages);
      pdfViewerStore.setCurrentPage(Math.min(currentPage, d.numPages));
    };

    const isFirstRendering = !previousRenderValue;
    const isLatestValueRendered = previousRenderValue === render.value;
    const isBusy = render.loading || !isLatestValueRendered;

    const shouldShowPreviousDocument = !isFirstRendering && isBusy;

    return (
      <div className="relative z-10 h-full overflow-hidden transition-all">
        <AnimatePresence>
          {previousRenderValue && shouldShowPreviousDocument ? (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{ opacity: 1 }}
            >
              <Document
                key={previousRenderValue}
                className={'h-full w-full'}
                file={previousRenderValue}
                loading={null}
              >
                <Page
                  key={currentPage}
                  pageNumber={currentPage}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={pdfDimensions.pdfWidth}
                  height={pdfDimensions.pdfHeight}
                  loading={null}
                />
              </Document>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {render.value && (
            <motion.div>
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
                  width={pdfDimensions.pdfWidth}
                  height={pdfDimensions.pdfHeight}
                  loading={null}
                  onRenderSuccess={() => {
                    if (render.value !== undefined) {
                      pdfViewerStore.setPreviousRenderValue(render.value);
                    }
                  }}
                />
              </Document>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

export default DocumentBuilderPdfViewer;
