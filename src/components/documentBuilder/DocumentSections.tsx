'use client';
import DocumentSection from '@/components/documentBuilder/DocumentSection';
import PersonalDetailSectionSkeleton from '@/components/documentBuilder/PersonalDetailSectionSkeleton';
import ProfessionalSummarySkeleton from '@/components/documentBuilder/ProfessionalSummarySkeleton';
import SectionsDndContext from '@/components/documentBuilder/SectionsDndContext';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { observer } from 'mobx-react-lite';

const DocumentSections = observer(() => {
  const sections = builderRootStore.sectionStore.orderedSections;

  if (sections.length === 0) {
    return (
      <>
        <PersonalDetailSectionSkeleton />
        <ProfessionalSummarySkeleton />
      </>
    );
  }

  return (
    <SectionsDndContext sections={sections}>
      {sections.map((section) => (
        <DocumentSection sectionId={section.id} key={section.id} />
      ))}
    </SectionsDndContext>
  );
});

export default DocumentSections;
