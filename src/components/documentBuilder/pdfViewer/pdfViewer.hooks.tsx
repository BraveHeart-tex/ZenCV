import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import type { AsyncState } from 'react-use/lib/useAsyncFn';

const usePdfViewerHelpers = (render: AsyncState<string | null | undefined>) => {
  const currentPage = pdfViewerStore.currentPage;
  const previousRenderValue = pdfViewerStore.previousRenderValue;

  const onDocumentLoad = (d: { numPages: number }) => {
    pdfViewerStore.setNumberOfPages(d.numPages);
    pdfViewerStore.setCurrentPage(Math.min(currentPage, d.numPages));
  };

  const isFirstRendering = !previousRenderValue;

  const isLatestValueRendered = previousRenderValue === render.value;
  const isBusy = render.loading || !isLatestValueRendered;

  const shouldShowLoader = isFirstRendering && isBusy;
  const shouldShowPreviousDocument = !isFirstRendering && isBusy;

  return {
    currentPage,
    onDocumentLoad,
    previousRenderValue,
    shouldShowLoader,
    shouldShowPreviousDocument,
  };
};

export default usePdfViewerHelpers;
