'use client';

import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { type DocumentProps, pdf } from '@react-pdf/renderer';
import { ReactElement, useMemo, useRef, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { cn } from '@/lib/utils/stringUtils';
import { observer } from 'mobx-react-lite';
import PreviewSkeleton from '@/components/documentBuilder/PreviewSkeleton';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { useAsync } from 'react-use';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DocumentBuilderPdfViewer = observer(
  ({
    children,
    renderTextLayer = false,
    renderAnnotationLayer = false,
  }: {
    children: ReactElement;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
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
      const aspectRatio = 1.414; // A4 Page Aspect Ratio
      const maxWidth = containerDimensions.width * 0.98; // 98 % of the container width
      const maxHeight = containerDimensions.height;

      let width = maxWidth;
      let height = width * aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height / aspectRatio;
      }

      return { pdfWidth: width, pdfHeight: height };
    }, [containerDimensions]);

    useEffect(() => {
      pdfViewerStore.setPdfDimensions({
        height: pdfDimensions.pdfHeight,
        width: pdfDimensions.pdfWidth,
      });
    }, [pdfDimensions]);

    const renderData = JSON.stringify(
      documentBuilderStore.debouncedTemplateResult,
    );

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

    const shouldShowLoader = isFirstRendering && isBusy;
    const shouldShowPreviousDocument = !isFirstRendering && isBusy;

    return (
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
      >
        {shouldShowLoader ? <PreviewSkeleton /> : null}
        {previousRenderValue && shouldShowPreviousDocument ? (
          <Document
            key={previousRenderValue}
            className="previous-document flex items-center justify-center w-full h-full"
            file={previousRenderValue}
            loading={null}
          >
            <Page
              key={currentPage}
              pageNumber={currentPage}
              renderAnnotationLayer={renderAnnotationLayer}
              renderTextLayer={renderTextLayer}
              width={pdfDimensions.pdfWidth}
              height={pdfDimensions.pdfHeight}
              loading={null}
            />
          </Document>
        ) : null}

        {render.value && !render.loading && (
          <Document
            key={render.value}
            className={cn(
              'h-full w-full flex items-center justify-center rendered',
            )}
            file={render.value}
            loading={null}
            onLoadSuccess={onDocumentLoad}
          >
            <Page
              key={currentPage}
              renderAnnotationLayer={renderAnnotationLayer}
              renderTextLayer={renderTextLayer}
              pageNumber={currentPage}
              width={pdfDimensions.pdfWidth}
              height={pdfDimensions.pdfHeight}
              loading={null}
              onRenderSuccess={() => {
                pdfViewerStore.setPreviousRenderValue(render.value as string);
              }}
            />
          </Document>
        )}
      </div>
    );
  },
);

export default DocumentBuilderPdfViewer;
