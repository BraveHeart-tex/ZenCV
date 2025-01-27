'use client';

import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { type DocumentProps, pdf } from '@react-pdf/renderer';
import { ReactElement, useMemo, useRef, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAsync } from 'react-use';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
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
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerDimensions, setContainerDimensions] = useState({
      width: 0,
      height: 0,
    });

    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const { width, height } =
            containerRef.current.getBoundingClientRect();
          setContainerDimensions({ width, height });
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const pdfDimensions = useMemo(() => {
      const aspectRatio = 1.414;
      const maxWidth = containerDimensions.width;
      const maxHeight = containerDimensions.height;

      let width = maxWidth;
      let height = width * aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height / aspectRatio;
      }

      return { pdfWidth: width, pdfHeight: height };
    }, [containerDimensions]);

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
      <div
        ref={containerRef}
        className="relative z-10 w-full h-full overflow-hidden transition-all"
      >
        <AnimatePresence>
          {previousRenderValue && shouldShowPreviousDocument ? (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center w-full h-full"
            >
              <Document
                key={previousRenderValue}
                className="flex items-center justify-center w-full h-full"
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
            <motion.div className="flex items-center justify-center w-full h-full">
              <Document
                file={render.value}
                loading={null}
                className={cn(
                  'z-10 h-full w-full flex items-center justify-center',
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
