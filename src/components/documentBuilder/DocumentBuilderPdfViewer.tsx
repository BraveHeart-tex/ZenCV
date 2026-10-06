import { type DocumentProps, pdf } from '@react-pdf/renderer';
import {
  type ReactElement,
  type TransitionEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

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
    const zoom = pdfViewerStore.zoom;
    const containerRef = useRef<HTMLElement>(null);
    const [containerDimensions, setContainerDimensions] = useState({
      width: 0,
      height: 0,
    });
    const [renderVersion, setRenderVersion] = useState(0);
    const [renderError, setRenderError] = useState(false);
    const [renderedValue, setRenderedValue] = useState<string | null>(null);

    useEffect(() => {
      if (!containerRef.current) {
        return;
      }

      const element = containerRef.current;

      const updateDimensions = () => {
        setContainerDimensions({
          width: element.clientWidth,
          height: element.clientHeight,
        });
      };

      const observer = new ResizeObserver(updateDimensions);
      observer.observe(element);

      updateDimensions();

      return () => observer.disconnect();
    }, []);

    const pdfDimensions = useMemo(() => {
      const aspectRatio = Math.SQRT2; // A4 Page Aspect Ratio
      const maxWidth = containerDimensions.width * 0.98; // 98 % of the container width
      const maxHeight = Math.max(0, containerDimensions.height - 4);

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
        () => builderSession.templateStore.debouncedTemplateData,
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
          description:
            'Your edits remain in the editor. Try refreshing the preview.',
        });
        return null;
      }
    }, [renderVersion, children]);

    const latestRenderRef = useRef(render);
    latestRenderRef.current = render;

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

    const shouldShowLoader =
      isFirstRendering && isBusy && renderedValue !== render.value;

    const renderValues = Array.from(
      new Set(
        [previousRenderValue, renderedValue, render.value].filter(
          (value): value is string => value !== null && value !== undefined
        )
      )
    );

    const handlePageRenderSuccess = (value: string) => {
      // A superseded PDF can finish painting after a newer preview is ready.
      if (
        latestRenderRef.current.loading ||
        latestRenderRef.current.value !== value
      ) {
        return;
      }

      setRenderedValue(value);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        pdfViewerStore.setPreviousRenderValue(value);
      }
    };

    const handleRenderTransitionEnd = (
      event: TransitionEvent<HTMLDivElement>,
      value: string
    ) => {
      if (
        event.target !== event.currentTarget ||
        event.propertyName !== 'opacity' ||
        latestRenderRef.current.loading ||
        latestRenderRef.current.value !== value ||
        renderedValue !== value ||
        previousRenderValue === value
      ) {
        return;
      }

      pdfViewerStore.setPreviousRenderValue(value);
    };

    return (
      <section
        ref={containerRef}
        className='relative h-full w-full overflow-auto overscroll-contain'
        // biome-ignore lint/a11y/noNoninteractiveTabindex: This scroll region needs keyboard scrolling when zoomed.
        tabIndex={0}
        aria-label='PDF preview. Use the zoom controls to enlarge the page and scroll to read it.'
      >
        {shouldShowLoader ? <PreviewSkeleton /> : null}
        {renderError && !render.loading ? (
          <div className='absolute inset-0 z-10 flex items-center justify-center p-6'>
            <div className='bg-background max-w-sm rounded-lg border p-4 text-center shadow-lg'>
              <p className='font-medium'>Preview could not refresh</p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Your edits remain in the editor. Try regenerating the preview.
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
        {renderValues.map((value) => {
          const isActiveRender = value === previousRenderValue;
          const isRenderedCandidate =
            !isActiveRender && renderedValue === value;

          return (
            <div
              key={value}
              className={`absolute top-0 left-0 ${
                isActiveRender
                  ? `previous-document ${isBusy ? 'opacity-50' : 'opacity-100'} transition-opacity duration-(--duration-standard) ease-(--ease-out-quart) motion-reduce:transition-none`
                  : 'rendering-document'
              }${isRenderedCandidate ? ' rendered' : ''}`}
              onTransitionEnd={(event) =>
                handleRenderTransitionEnd(event, value)
              }
              style={{
                width:
                  zoom === 1
                    ? '100%'
                    : Math.max(
                        containerDimensions.width,
                        pdfDimensions.pdfWidth * zoom
                      ),
                height:
                  zoom === 1
                    ? '100%'
                    : Math.max(
                        containerDimensions.height,
                        pdfDimensions.pdfHeight * zoom
                      ),
              }}
            >
              <Document
                className='flex h-full w-full items-center justify-center'
                file={value}
                loading={null}
                onLoadSuccess={onDocumentLoad}
              >
                <Page
                  key={currentPage}
                  pageNumber={currentPage}
                  renderAnnotationLayer={renderAnnotationLayer}
                  renderTextLayer={renderTextLayer}
                  width={pdfDimensions.pdfWidth * zoom}
                  loading={null}
                  className='border border-border/50 shadow-sm'
                  onRenderSuccess={
                    isActiveRender
                      ? undefined
                      : () => handlePageRenderSuccess(value)
                  }
                />
              </Document>
            </div>
          );
        })}
      </section>
    );
  }
);
