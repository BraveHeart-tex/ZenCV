const DocumentBuilderPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const searchParams = await params;

  return <div>Document builder page, document id: {searchParams.id}</div>;
};

export default DocumentBuilderPage;
