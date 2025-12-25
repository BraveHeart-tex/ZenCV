import { ArrowLeftIcon, DownloadIcon, LayoutGridIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { downloadPDF } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { cn } from '@/lib/utils/stringUtils';
import { Button } from '../ui/button';

export const DocumentBuilderPreviewHeader = observer(() => {
  const view = builderRootStore.UIStore.currentView;
  const documentTitle =
    builderRootStore.documentStore.document?.title || 'Untitled';
  const previousRenderValue = pdfViewerStore.previousRenderValue;

  return (
    <div
      className={
        'flex items-center justify-between xl:justify-end mb-2 mx-auto w-full'
      }
      style={{
        width: pdfViewerStore.pdfDimensions?.width ?? '75%',
      }}
    >
      <Button
        className={cn('xl:hidden', view === 'preview' && 'flex xl:hidden')}
        variant='outline'
        onClick={action(() => {
          builderRootStore.UIStore.currentView = BUILDER_CURRENT_VIEWS.BUILDER;
        })}
      >
        <ArrowLeftIcon />
      </Button>
      <Button
        onClick={action(async () => {
          builderRootStore.UIStore.currentView =
            BUILDER_CURRENT_VIEWS.TEMPLATES;
        })}
        className='hover:bg-primary/5 dark:hover:bg-primary/10 sm:mx-0 lg:mr-auto items-center gap-2 px-1 mx-auto'
        variant='ghost'
      >
        <LayoutGridIcon />
        View in Template Gallery
      </Button>
      <Button
        className='self-end'
        disabled={!previousRenderValue || pdfViewerStore.rendering}
        onClick={() =>
          downloadPDF({
            file: previousRenderValue as string,
            title: documentTitle,
          })
        }
      >
        <DownloadIcon className='md:hidden' />
        <span className='md:inline hidden'>Download PDF</span>
      </Button>
    </div>
  );
});
