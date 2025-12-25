import { ChevronLeftIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { downloadPDF } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { Button } from '../../ui/button';
import { MobileTemplatePickerTrigger } from './MobileTemplatePickerTrigger';

export const TemplateGalleryHeader = observer(() => {
  const documentTitle =
    builderRootStore.documentStore.document?.title || 'Untitled';

  return (
    <div className='flex items-center justify-between w-full p-4'>
      <Button
        variant='ghost'
        className='items-center gap-2 px-1'
        onClick={action(() => {
          builderRootStore.UIStore.currentView = BUILDER_CURRENT_VIEWS.BUILDER;
        })}
      >
        <ChevronLeftIcon />
        <span className='lg:inline hidden'>Back to editor</span>
      </Button>
      <div className='flex items-center gap-2'>
        <MobileTemplatePickerTrigger />
        <Button
          disabled={
            !pdfViewerStore.previousRenderValue || pdfViewerStore.rendering
          }
          onClick={() => {
            downloadPDF({
              file: pdfViewerStore.previousRenderValue as string,
              title: documentTitle,
            });
          }}
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
});
