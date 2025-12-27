'use client';
import { observer } from 'mobx-react-lite';
import type { PropsWithChildren } from 'react';
import { AddNewItemButton } from '@/components/documentBuilder/AddNewItemButton';
import { DraggableSectionContainer } from '@/components/documentBuilder/DraggableSectionContainer';
import { EditableSectionTitle } from '@/components/documentBuilder/EditableSectionTitle';
import { ItemsDndContext } from '@/components/documentBuilder/ItemsDndContext';
import { SectionDescription } from '@/components/documentBuilder/SectionDescription';
import { SectionItem } from '@/components/documentBuilder/SectionItem';
import { SectionMetadataOptions } from '@/components/documentBuilder/SectionMetadataOptions';
import {
  CONTAINER_TYPES,
  type DEX_Section,
} from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { FIXED_SECTIONS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { getSectionContainerId } from '@/lib/utils/stringUtils';

export const DocumentSection = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const items = builderRootStore.itemStore.getItemsBySectionId(sectionId);

    return (
      <ContainerElement sectionId={sectionId}>
        <div className='flex flex-col gap-1'>
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
          (item) => item.containerType === CONTAINER_TYPES.COLLAPSIBLE
        ) && <AddNewItemButton sectionId={sectionId} />}
      </ContainerElement>
    );
  }
);

const ContainerElement = observer(
  ({
    children,
    sectionId,
  }: PropsWithChildren & { sectionId: DEX_Section['id'] }) => {
    if (
      FIXED_SECTIONS.includes(
        builderRootStore.sectionStore.getSectionById(sectionId)
          ?.type as (typeof FIXED_SECTIONS)[number]
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
  }
);
