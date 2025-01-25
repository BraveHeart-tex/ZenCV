import { pdfViewerStore } from '@/lib/pdfViewerStore';
import { Button } from './ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';

const DocumentBuilderPreviewFooter = observer(() => {
  const currentPage = pdfViewerStore.currentPage;

  const numberOfPages = pdfViewerStore.numberOfPages;

  return (
    <div className="flex items-center justify-center gap-2 mt-2">
      <Button
        disabled={currentPage === 1}
        onClick={() => pdfViewerStore.setCurrentPage(currentPage - 1)}
        size="icon"
        variant="ghost"
        className="hover:bg-secondary text-muted rounded-full size-[30px] dark:bg-muted-foreground"
      >
        <ChevronLeftIcon size={24} />
      </Button>
      <span className="text-muted dark:text-muted-foreground tabular-nums text-xs">
        {currentPage} of {numberOfPages}
      </span>
      <Button
        disabled={currentPage === numberOfPages}
        onClick={() => pdfViewerStore.setCurrentPage(currentPage + 1)}
        size="icon"
        variant="ghost"
        className="hover:bg-secondary text-muted rounded-full size-[30px] dark:bg-muted-foreground"
      >
        <ChevronRightIcon size={24} />
      </Button>
    </div>
  );
});

export default DocumentBuilderPreviewFooter;
