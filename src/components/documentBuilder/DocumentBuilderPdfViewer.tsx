import { type DocumentProps, pdf } from '@react-pdf/renderer';
import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { reaction, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useAsync } from 'react-use';
import { PreviewSkeleton } from '@/components/documentBuilder/PreviewSkeleton';
import { Button } from '@/components/ui/button';
import { showErrorToast } from '@/components/ui/sonner';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentBuilderPdfViewerProps {
  children: ReactElement;
  renderTextLayer?: boolean;
  renderAnnotationLayer?: boolean;
}

export const DocumentBuilderPdfViewer = observer(
  ({
    children,
    renderTextLayer = false,
    renderAnnotationLayer = false,
  }: DocumentBuilderPdfViewerProps) => {
    const currentPage = pdfViewerStore.currentPage;
    const previousRenderValue = pdfViewerStore.previousRenderValue;
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerDimensions, setContainerDimensions] = useState({
      width: 0,
      height: 0,
    });
    const [renderVersion, setRenderVersion] = useState(0);
    const [renderError, setRenderError] = useState(false);

    useEffect(() => {
      if (!containerRef.current) {
        return;
      }

      const element = containerRef.current;

      const updateDimensions = () => {
        const { width, height } = element.getBoundingClientRect();
        setContainerDimensions({ width, height });
      };

      const observer = new ResizeObserver(updateDimensions);
      observer.observe(element);

      updateDimensions();

      return () => observer.disconnect();
    }, []);

    const pdfDimensions = useMemo(() => {
      const aspectRatio = Math.SQRT2; // A4 Page Aspect Ratio
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
    }, [pdfDimensions.pdfHeight, pdfDimensions.pdfWidth]);

    useEffect(() => {
      const dispose = reaction(
        () => builderRootStore.templateStore.debouncedTemplateData,
        () => {
          setRenderVersion((prev) => prev + 1);
        },
        {
          fireImmediately: true,
        }
      );

      return () => {
        dispose();
      };
    }, []);

    const render = useAsync(async () => {
      try {
        if (!children) {
          return null;
        }

        setRenderError(false);
        const blob = await pdf(
          children as ReactElement<DocumentProps>
        ).toBlob();
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error('DocumentBuilderPdfViewer rendering error', error);
        setRenderError(true);
        showErrorToast('Preview could not refresh.', {
          description: 'Your edits are still saved locally. Try again shortly.',
        });
        return null;
      }
    }, [renderVersion, children]);

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
        {renderError && !render.loading ? (
          <div className='absolute inset-0 z-10 flex items-center justify-center p-6'>
            <div className='bg-background max-w-sm rounded-lg border p-4 text-center shadow-lg'>
              <p className='font-medium'>Preview could not refresh</p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Your edits are still saved locally. Try regenerating the
                preview.
              </p>
              <Button
                className='mt-4'
                onClick={() => setRenderVersion((prev) => prev + 1)}
                size='sm'
                variant='outline'
              >
                Try again
              </Button>
            </div>
          </div>
        ) : null}
        {previousRenderValue && shouldShowPreviousDocument ? (
          <Document
            key={previousRenderValue}
            className='previous-document absolute inset-0 flex h-full items-center justify-center opacity-50 transition-opacity duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none'
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
              className='border shadow-sm'
            />
          </Document>
        ) : null}

        {render.value && !render.loading && (
          <Document
            key={render.value}
            className={
              'absolute inset-0 flex h-full items-center justify-center transition-opacity duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none'
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
              className='border shadow-sm'
              onRenderSuccess={() => {
                pdfViewerStore.setPreviousRenderValue(render.value as string);
              }}
            />
          </Document>
        )}
      </div>
    );
  }
);
