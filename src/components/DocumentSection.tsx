'use client';
import { observer } from 'mobx-react-lite';
import EditableSectionTitle from '@/components/EditableSectionTitle';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import SectionItem from '@/components/SectionItem';
import SectionDescription from '@/components/SectionDescription';
import { CONTAINER_TYPES } from '@/lib/schema';
import AddNewItemButton from '@/components/AddNewItemButton';
import ItemsDndContext from '@/components/ItemsDndContext';

const DocumentSection = observer(({ sectionId }: { sectionId: number }) => {
  const items = documentBuilderStore.getItemsBySectionId(sectionId);

  return (
    <section>
      <div className="flex flex-col gap-1">
        <EditableSectionTitle sectionId={sectionId} />
        <SectionDescription sectionId={sectionId} />
      </div>
      <ItemsDndContext items={items}>
        {items
          .toSorted((a, b) => a.displayOrder - b.displayOrder)
          .map((item) => (
            <SectionItem itemId={item.id} key={item.id} />
          ))}
      </ItemsDndContext>
      {items.every(
        (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE,
      ) && <AddNewItemButton sectionId={sectionId} />}
    </section>
  );
});

export default DocumentSection;
