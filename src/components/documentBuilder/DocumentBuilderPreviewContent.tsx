'use client';
import { observer } from 'mobx-react-lite';
import { useNetworkState } from 'react-use';
import DocumentBuilderPdfViewer from '@/components/documentBuilder/DocumentBuilderPdfViewer';
import LondonTemplate from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { INTERNAL_TEMPLATE_TYPES } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import ManhattanTemplate from '../appHome/resumeTemplates/manhattan/ManhattanTemplate';

const DocumentBuilderPreviewContent = observer(() => {
  const { online, previous } = useNetworkState();
  const userLostConnection = (!online && previous) || !online;
  const pdfTemplateData = builderRootStore.templateStore.debouncedTemplateData;
  const templateType = builderRootStore.documentStore.document?.templateType;

  if (!pdfTemplateData || !templateType) return null;

  const renderTemplate = () => {
    const templateType = builderRootStore.documentStore.document?.templateType;

    if (templateType === INTERNAL_TEMPLATE_TYPES.LONDON) {
      return <LondonTemplate templateData={pdfTemplateData} />;
    }

    if (templateType === INTERNAL_TEMPLATE_TYPES.MANHATTAN) {
      return <ManhattanTemplate templateData={pdfTemplateData} />;
    }

    return <></>;
  };

  return (
    <div className="hide-scrollbar w-full h-full overflow-auto rounded-md">
      {userLostConnection ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-center text-muted-foreground mx-auto max-w-[75%]">
            Document preview is not available in offline mode. Don&apos;t worry!
            You can still edit your resume.
          </p>
        </div>
      ) : (
        <DocumentBuilderPdfViewer>{renderTemplate()}</DocumentBuilderPdfViewer>
      )}
    </div>
  );
});

export default DocumentBuilderPreviewContent;
