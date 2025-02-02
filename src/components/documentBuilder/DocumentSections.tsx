'use client';
import { observer } from 'mobx-react-lite';
import DocumentSection from '@/components/documentBuilder/DocumentSection';
import SectionsDndContext from '@/components/documentBuilder/SectionsDndContext';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

const DocumentSections = observer(() => {
  const sections = builderRootStore.sectionStore.sections
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
