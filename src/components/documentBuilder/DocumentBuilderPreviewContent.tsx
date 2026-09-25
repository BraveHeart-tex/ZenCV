import { observer } from 'mobx-react-lite';
import { DocumentBuilderPdfViewer } from '@/components/documentBuilder/DocumentBuilderPdfViewer';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { getPdfTemplateByType } from './pdfViewer/pdfViewer.helpers';

export const DocumentBuilderPreviewContent = observer(() => {
  const pdfTemplateData = builderSession.templateStore.debouncedTemplateData;
  if (!pdfTemplateData) {
    return null;
  }

  return (
    <div className='hide-scrollbar w-full h-full overflow-auto rounded-md'>
      <DocumentBuilderPdfViewer>
        {getPdfTemplateByType(pdfTemplateData)}
      </DocumentBuilderPdfViewer>
    </div>
  );
});
