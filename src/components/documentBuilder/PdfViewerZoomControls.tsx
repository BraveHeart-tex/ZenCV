import { MinusIcon, PlusIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';

export const PdfViewerZoomControls = observer(() => (
  <fieldset
    aria-label='Preview zoom'
    className='flex items-center justify-center gap-1'
  >
    <Button
      variant='ghost'
      size='icon'
      className='size-11'
      aria-label='Zoom out'
      disabled={pdfViewerStore.zoom <= 1}
      onClick={() => pdfViewerStore.setZoom(pdfViewerStore.zoom - 0.5)}
    >
      <MinusIcon aria-hidden='true' />
    </Button>
    <Button
      variant='ghost'
      className='h-11 min-w-16 px-2 text-xs tabular-nums'
      aria-label='Fit PDF page to preview'
      onClick={() => pdfViewerStore.setZoom(1)}
    >
      {pdfViewerStore.zoom === 1
        ? 'Fit page'
        : `${Math.round(pdfViewerStore.zoom * 100)}%`}
    </Button>
    <Button
      variant='ghost'
      size='icon'
      className='size-11'
      aria-label='Zoom in'
      disabled={pdfViewerStore.zoom >= 3}
      onClick={() => pdfViewerStore.setZoom(pdfViewerStore.zoom + 0.5)}
    >
      <PlusIcon aria-hidden='true' />
    </Button>
  </fieldset>
));
