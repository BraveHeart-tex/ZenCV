import { observer } from 'mobx-react-lite';
import { DocumentSection } from '@/components/documentBuilder/DocumentSection';
import { PersonalDetailSectionSkeleton } from '@/components/documentBuilder/PersonalDetailSectionSkeleton';
import { ProfessionalSummarySkeleton } from '@/components/documentBuilder/ProfessionalSummarySkeleton';
import { SectionsDndContext } from '@/components/documentBuilder/SectionsDndContext';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

export const DocumentSections = observer(() => {
  const sectionIds = (builderSession.document?.sections ?? [])
    .filter((section) => section.sectionKey !== 'websitesSocialLinks')
    .map((section) => section.id);

  if (sectionIds.length === 0) {
    return (
      <>
        <PersonalDetailSectionSkeleton />
        <ProfessionalSummarySkeleton />
      </>
    );
  }

  return (
    <SectionsDndContext sectionIds={sectionIds}>
      {sectionIds.map((id) => (
        <DocumentSection sectionId={id} key={id} />
      ))}
    </SectionsDndContext>
  );
});
