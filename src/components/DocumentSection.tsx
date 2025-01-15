'use client';
import { observer } from 'mobx-react-lite';
import EditableSectionTitle from '@/components/EditableSectionTitle';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import SectionItem from '@/components/SectionItem';
import SectionDescription from '@/components/SectionDescription';

const DocumentSection = observer(({ sectionId }: { sectionId: number }) => {
  const items = documentBuilderStore.getItemsBySectionId(sectionId);

  return (
    <section>
      <div className="flex flex-col gap-1">
        <EditableSectionTitle sectionId={sectionId} />
        <SectionDescription sectionId={sectionId} />
      </div>
      {items.map((item) => (
        <SectionItem itemId={item.id} key={item.id} />
      ))}
    </section>
  );
});

export default DocumentSection;
