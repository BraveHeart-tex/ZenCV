import { observer } from 'mobx-react-lite';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import { cn } from '@/lib/utils/stringUtils';
import { DocumentBuilderPreviewContent } from './DocumentBuilderPreviewContent';
import { DocumentBuilderPreviewHeader } from './DocumentBuilderPreviewHeader';
import { PdfViewerPageControls } from './PdfViewerPageControls';

export const DocumentBuilderPreview = observer(() => {
  const view = builderRootStore.UIStore.currentView;

  return (
    <div
      className={cn(
        'bg-secondary min-h-screen fixed top-0 right-0 w-1/2',
        view === BUILDER_CURRENT_VIEWS.PREVIEW && 'w-full xl:w-1/2',
        view === BUILDER_CURRENT_VIEWS.BUILDER && 'hidden xl:block'
      )}
    >
      <div className='h-[90vh] mx-auto pt-4'>
        <DocumentBuilderPreviewHeader />
        <DocumentBuilderPreviewContent />
        <PdfViewerPageControls />
      </div>
    </div>
  );
});
