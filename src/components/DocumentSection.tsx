'use client';
import { observer } from 'mobx-react-lite';
import { Section } from '@/lib/schema';
import EditableSectionTitle from '@/components/EditableSectionTitle';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import SectionItem from '@/components/SectionItem';
import SectionDescription from '@/components/SectionDescription';

const DocumentSection = observer(({ section }: { section: Section }) => {
  const items = documentBuilderStore.getItemsBySectionId(section.id);

  return (
    <section>
      <div className="flex flex-col gap-1">
        <EditableSectionTitle sectionId={section.id} />
        <SectionDescription sectionId={section.id} />
      </div>
      {items.map((item) => (
        <SectionItem itemId={item.id} key={item.id} />
      ))}
    </section>
  );
});

export default DocumentSection;
