import { ArrowLeftIcon, DownloadIcon, LayoutGridIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { downloadPDF } from '@/lib/helpers/documentBuilderHelpers';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { cn } from '@/lib/utils/stringUtils';
import { Button } from '../ui/button';

export const DocumentBuilderPreviewHeader = observer(() => {
  const view = builderSession.UIStore.currentView;
  const documentTitle = builderSession.document?.title || 'Untitled';
  const previousRenderValue = pdfViewerStore.previousRenderValue;

  return (
    <div className='mx-auto flex w-full items-center justify-between gap-2'>
      <Button
        className={cn('xl:hidden', view === 'preview' && 'flex xl:hidden')}
        variant='outline'
        aria-label='Back to editor'
        onClick={action(() => {
          builderSession.UIStore.currentView = BUILDER_CURRENT_VIEWS.BUILDER;
        })}
      >
        <ArrowLeftIcon aria-hidden='true' />
        <span>Edit</span>
      </Button>
      <Button
        onClick={action(async () => {
          builderSession.UIStore.currentView = BUILDER_CURRENT_VIEWS.TEMPLATES;
        })}
        className='text-muted-foreground min-w-0 gap-2 px-2 xl:mr-auto'
        variant='ghost'
      >
        <LayoutGridIcon aria-hidden='true' />
        Templates
      </Button>
      <Button
        className='self-end'
        aria-label='Download PDF'
        disabled={!previousRenderValue || pdfViewerStore.rendering}
        onClick={() =>
          downloadPDF({
            file: previousRenderValue as string,
            title: documentTitle,
          })
        }
      >
        <DownloadIcon aria-hidden='true' />
        <span>
          Download<span className='hidden md:inline'> PDF</span>
        </span>
      </Button>
    </div>
  );
});
