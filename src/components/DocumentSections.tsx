'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import DocumentSection from '@/components/DocumentSection';

const DocumentSections = observer(() => {
  const sections = documentBuilderStore.sections
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <>
      {sections.map((section) => (
        <DocumentSection sectionId={section.id} key={section.id} />
      ))}
    </>
  );
});

export default DocumentSections;
