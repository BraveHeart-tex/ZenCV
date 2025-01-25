import { observer } from 'mobx-react-lite';
import { useNetworkState } from 'react-use';

const DocumentBuilderPreviewContent = observer(() => {
  const { online, previous } = useNetworkState();
  const userLostConnection = (!online && previous) || !online;

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

  return (
    <div className="hide-scrollbar w-full h-full overflow-auto rounded-md">
      {userLostConnection ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-center text-muted-foreground mx-auto max-w-[75%]">
            Document preview is not available in offline mode. Don&apos;t worry!
            You can still edit your resume.
          </p>
        </div>
      ) : // <DocumentBuilderPdfViewer></DocumentBuilderPdfViewer>
      null}
    </div>
  );
});

export default DocumentBuilderPreviewContent;
