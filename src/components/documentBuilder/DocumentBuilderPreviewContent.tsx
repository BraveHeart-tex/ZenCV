'use client';
import { observer } from 'mobx-react-lite';
import DocumentBuilderPdfViewer from '@/components/documentBuilder/DocumentBuilderPdfViewer';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import ManhattanTemplate from '../appHome/resumeTemplates/manhattan/ManhattanTemplate';

const DocumentBuilderPreviewContent = observer(() => {
  const pdfTemplateData = builderRootStore.templateStore.debouncedTemplateData;
  const templateType = builderRootStore.documentStore.document?.templateType;

  if (!pdfTemplateData || !templateType) return null;

  const renderTemplate = () => {
    if (templateType === INTERNAL_TEMPLATE_TYPES.MANHATTAN) {
      return <ManhattanTemplate templateData={pdfTemplateData} />;
    }

    return <></>;
  };

  return (
    <div className="hide-scrollbar w-full h-full overflow-auto rounded-md">
      <DocumentBuilderPdfViewer>{renderTemplate()}</DocumentBuilderPdfViewer>
    </div>
  );
});

export default DocumentBuilderPreviewContent;
