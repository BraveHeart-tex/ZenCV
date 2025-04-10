'use client';
import { observer } from 'mobx-react-lite';
import EditableSectionTitle from '@/components/documentBuilder/EditableSectionTitle';
import SectionItem from '@/components/documentBuilder/SectionItem';
import SectionDescription from '@/components/documentBuilder/SectionDescription';
import { CONTAINER_TYPES, DEX_Section } from '@/lib/client-db/clientDbSchema';
import AddNewItemButton from '@/components/documentBuilder/AddNewItemButton';
import ItemsDndContext from '@/components/documentBuilder/ItemsDndContext';
import DraggableSectionContainer from '@/components/documentBuilder/DraggableSectionContainer';
import { ReactNode } from 'react';
import SectionMetadataOptions from '@/components/documentBuilder/SectionMetadataOptions';
import { getSectionContainerId } from '@/lib/utils/stringUtils';
import { FIXED_SECTIONS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

const DocumentSection = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const items = builderRootStore.itemStore.getItemsBySectionId(sectionId);

    const ContainerElement = ({ children }: { children: ReactNode }) => {
      if (
        FIXED_SECTIONS.includes(
          builderRootStore.sectionStore.getSectionById(sectionId)
            ?.type as (typeof FIXED_SECTIONS)[number],
        )
      ) {
        return (
          <section id={getSectionContainerId(sectionId)}>{children}</section>
        );
      }

      return (
        <DraggableSectionContainer sectionId={sectionId}>
          {children}
        </DraggableSectionContainer>
      );
    };

    return (
      <ContainerElement>
        <div className="flex flex-col gap-1">
          <EditableSectionTitle sectionId={sectionId} />
          <SectionDescription sectionId={sectionId} />
          <SectionMetadataOptions sectionId={sectionId} />
        </div>
        <ItemsDndContext items={items}>
          {items
            .slice()
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((item) => (
              <SectionItem itemId={item.id} key={item.id} />
            ))}
        </ItemsDndContext>
        {items.every(
          (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE,
        ) && <AddNewItemButton sectionId={sectionId} />}
      </ContainerElement>
    );
  },
);

export default DocumentSection;
