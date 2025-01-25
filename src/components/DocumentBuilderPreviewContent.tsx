import useNetworkState from '@/hooks/useNetworkState';

const DocumentBuilderPreviewContent = () => {
  const { online, previous } = useNetworkState();
  const userLostConnection = !online && previous;

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
      {/* <PDFViewer key={reRender}>
        <LondonTemplate
          data={preparePdfData({
            document: useDocumentBuilderStore.getState().document,
            sections: useDocumentBuilderStore.getState().sections,
            fields: useDocumentBuilderStore.getState().fields,
          })}
        />
      </PDFViewer> */}
      {userLostConnection ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-center text-muted-foreground mx-auto max-w-[75%]">
            Document preview is not available in offline mode. Don&apos;t worry!
            You can still edit your resume. We&apos;ll automatically save your
            changes when you&apos;re back online.
          </p>
        </div>
      ) : null}
    </div>
  );
};
export default DocumentBuilderPreviewContent;
