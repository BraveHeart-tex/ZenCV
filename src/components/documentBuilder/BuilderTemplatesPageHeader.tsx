import { observer } from 'mobx-react-lite';
import { Button } from '../ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { pdfViewerStore } from '@/lib/stores/pdfViewerStore';
import { downloadPDF } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { action } from 'mobx';
import { BUILDER_CURRENT_VIEWS } from '@/lib/stores/documentBuilder/builderUIStore';

const BuilderTemplatesPageHeader = observer(() => {
  const documentTitle =
    builderRootStore.documentStore.document?.title || 'Untitled';

  return (
    <div className="flex items-center justify-between w-full p-4">
      <Button
        variant="ghost"
        className="items-center gap-2"
        onClick={action(() => {
          builderRootStore.UIStore.currentView = BUILDER_CURRENT_VIEWS.BUILDER;
        })}
      >
        <ChevronLeftIcon />
        Back to editor
      </Button>
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
  );
});

export default BuilderTemplatesPageHeader;
