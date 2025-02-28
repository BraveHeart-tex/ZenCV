'use client';

import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { type DocumentProps, pdf } from '@react-pdf/renderer';
import { ReactElement, useMemo, useRef, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { observer } from 'mobx-react-lite';
import PreviewSkeleton from '@/components/documentBuilder/PreviewSkeleton';
import { useAsync } from 'react-use';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { runInAction } from 'mobx';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentBuilderPdfViewerProps {
  children: ReactElement;
  renderTextLayer?: boolean;
  renderAnnotationLayer?: boolean;
}

const DocumentBuilderPdfViewer = observer(
  ({
    children,
    renderTextLayer = false,
    renderAnnotationLayer = false,
  }: DocumentBuilderPdfViewerProps) => {
    const view = builderRootStore.UIStore.currentView;
    const isMobile = useMediaQuery('(max-width: 768px)', false);
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
    }, [view]);

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
      builderRootStore.templateStore.debouncedTemplateData,
    );

    const render = useAsync(async () => {
      try {
        if (
          !children ||
          !renderData ||
          (isMobile && view !== BUILDER_CURRENT_VIEWS.PREVIEW)
        ) {
          return null;
        }

        const blob = await pdf(
          children as ReactElement<DocumentProps>,
        ).toBlob();
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('DocumentBuilderPdfViewer rendering error', error);
      }
    }, [renderData, isMobile, view, children]);

    useEffect(() => {
      runInAction(() => {
        pdfViewerStore.rendering = render.loading;
      });
    }, [render.loading]);

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
        className={'relative h-full overflow-hidden w-full'}
      >
        {shouldShowLoader ? <PreviewSkeleton /> : null}
        {previousRenderValue && shouldShowPreviousDocument ? (
          <Document
            key={previousRenderValue}
            className="previous-document absolute inset-0 flex items-center justify-center h-full transition-opacity duration-300 ease-in-out opacity-50"
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
            className={
              'absolute inset-0 flex items-center justify-center h-full transition-opacity duration-300 ease-in-out'
            }
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
