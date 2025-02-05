'use client';
import { observer } from 'mobx-react-lite';
import DocumentBuilderPdfViewer from '@/components/documentBuilder/DocumentBuilderPdfViewer';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { getPdfTemplateByType } from './pdfViewer/pdfViewer.helpers';

const DocumentBuilderPreviewContent = observer(() => {
  const pdfTemplateData = builderRootStore.templateStore.debouncedTemplateData;
  const templateType = builderRootStore.documentStore.document?.templateType;

  if (!pdfTemplateData || !templateType) return null;

  return (
    <div className="hide-scrollbar w-full h-full overflow-auto rounded-md">
      <DocumentBuilderPdfViewer>
        {getPdfTemplateByType(templateType, pdfTemplateData)}
      </DocumentBuilderPdfViewer>
    </div>
  );
});

export default DocumentBuilderPreviewContent;
