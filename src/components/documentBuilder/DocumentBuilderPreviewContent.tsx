'use client';
import { observer } from 'mobx-react-lite';
import { useNetworkState } from 'react-use';
import DocumentBuilderPdfViewer from '@/components/documentBuilder/DocumentBuilderPdfViewer';
import LondonTemplate from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';

const DocumentBuilderPreviewContent = observer(() => {
  const { online, previous } = useNetworkState();
  const userLostConnection = (!online && previous) || !online;
  const pdfTemplateData = documentBuilderStore.debouncedTemplateData;

  if (!pdfTemplateData) return null;

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
        <DocumentBuilderPdfViewer>
          <LondonTemplate templateData={pdfTemplateData} />
        </DocumentBuilderPdfViewer>
      )}
    </div>
  );
});

export default DocumentBuilderPreviewContent;
