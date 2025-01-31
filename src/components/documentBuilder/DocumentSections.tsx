'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import DocumentSection from '@/components/documentBuilder/DocumentSection';
import SectionsDndContext from '@/components/documentBuilder/SectionsDndContext';

const DocumentSections = observer(() => {
  const sections = documentBuilderStore.sections
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <SectionsDndContext sections={sections}>
      {sections.map((section) => (
        <DocumentSection sectionId={section.id} key={section.id} />
      ))}
    </SectionsDndContext>
  );
});

export default DocumentSections;
