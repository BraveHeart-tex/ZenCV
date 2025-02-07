import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { Button } from '../ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { cn } from '@/lib/utils/stringUtils';

interface PdfViewerPageControlsProps {
  variant?: 'primary' | 'secondary';
}

const PdfViewerPageControls = observer(
  ({ variant }: PdfViewerPageControlsProps) => {
    const currentPage = pdfViewerStore.currentPage;
    const numberOfPages = pdfViewerStore.numberOfPages;

    return (
      <div
        className={cn(
          'flex items-center justify-center gap-2 mt-2',
          variant === 'primary' && 'bg-primary dark:bg-background rounded-full',
        )}
      >
        <Button
          disabled={currentPage === 1}
          onClick={() => pdfViewerStore.setCurrentPage(currentPage - 1)}
          size="icon"
          variant={variant === 'primary' ? 'ghost' : 'outline'}
          className={cn(
            'rounded-full size-[1.875rem]',
            variant === 'primary' &&
              'text-primary-foreground dark:text-foreground',
          )}
        >
          <ChevronLeftIcon size={24} />
        </Button>
        <span
          className={cn(
            'text-muted-foreground tabular-nums text-xs',
            variant === 'primary' &&
              'text-primary-foreground dark:text-foreground',
          )}
        >
          {currentPage} of {numberOfPages}
        </span>
        <Button
          disabled={currentPage === numberOfPages}
          onClick={() => pdfViewerStore.setCurrentPage(currentPage + 1)}
          size="icon"
          variant={variant === 'primary' ? 'ghost' : 'outline'}
          className={cn(
            'rounded-full size-[1.875rem]',
            variant === 'primary' &&
              'text-primary-foreground dark:text-foreground',
          )}
        >
          <ChevronRightIcon size={24} />
        </Button>
      </div>
    );
  },
);

export default PdfViewerPageControls;
