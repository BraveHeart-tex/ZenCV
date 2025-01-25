import { observer } from 'mobx-react-lite';
import { useDebounce, useNetworkState } from 'react-use';
import DocumentBuilderPdfViewer from '@/components/documentBuilder/DocumentBuilderPdfViewer';
import LondonTemplate from '@/components/appHome/resumeTemplates/london/LondonTemplate';
import { getFormattedTemplateData } from '@/components/appHome/resumeTemplates/resumeTemplates.helpers';
import { useState } from 'react';
import { PdfTemplateData } from '@/lib/types';

const DocumentBuilderPreviewContent = observer(() => {
  const { online, previous } = useNetworkState();
  const userLostConnection = (!online && previous) || !online;
  const templateData = getFormattedTemplateData();
  const [debouncedData, setDebouncedData] = useState<PdfTemplateData | null>(
    null,
  );
  useDebounce(
    () => {
      setDebouncedData(templateData);
    },
    300,
    [templateData],
  );

  // This was how it was done before, just here for references
  //   useEffect(() => {
  //     const updatePdfProps = () => {
  //       setReRender((prev) => (prev === 0 ? 1 : 0));
  //     };
  //     const debouncedUpdatePdfProps = debounce(
  //       updatePdfProps,
  //       UPDATE_PDF_PROPS_DEBOUNCE_DURATION,
  //     );

  //     useDocumentBuilderStore.setState({
  //       pdfUpdaterCallback: debouncedUpdatePdfProps,
  //     });
  //   }, []);

  if (!debouncedData) return;

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
        <DocumentBuilderPdfViewer key={JSON.stringify(debouncedData)}>
          <LondonTemplate templateData={debouncedData} />
        </DocumentBuilderPdfViewer>
      )}
    </div>
  );
});

export default DocumentBuilderPreviewContent;
