import { observer } from 'mobx-react-lite';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import { cn } from '@/lib/utils/stringUtils';
import { DocumentBuilderPreviewContent } from './DocumentBuilderPreviewContent';
import { DocumentBuilderPreviewHeader } from './DocumentBuilderPreviewHeader';
import { DocumentSaveStatus } from './DocumentSaveStatus';
import { PdfViewerPageControls } from './PdfViewerPageControls';
import { PdfViewerZoomControls } from './PdfViewerZoomControls';

export const DocumentBuilderPreview = observer(() => {
  const view = builderSession.UIStore.currentView;

  return (
    <div
      className={cn(
        'bg-secondary/70 fixed inset-y-0 right-0 w-1/2',
        view === BUILDER_CURRENT_VIEWS.PREVIEW && 'w-full xl:w-1/2',
        view === BUILDER_CURRENT_VIEWS.BUILDER && 'hidden xl:block'
      )}
    >
      <div className='mx-auto flex h-dvh flex-col gap-2 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-5'>
        <div className='shrink-0'>
          <DocumentBuilderPreviewHeader />
          <div className='xl:hidden'>
            <DocumentSaveStatus />
          </div>
        </div>
        <div className='min-h-0 flex-1'>
          <DocumentBuilderPreviewContent />
        </div>
        <div className='flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-0 border-t border-border/40 pt-1'>
          <PdfViewerPageControls />
          <PdfViewerZoomControls />
        </div>
      </div>
    </div>
  );
});
