import { observer } from 'mobx-react-lite';
import type { PropsWithChildren } from 'react';
import { AddNewItemButton } from '@/components/documentBuilder/AddNewItemButton';
import { DraggableSectionContainer } from '@/components/documentBuilder/DraggableSectionContainer';
import { EditableSectionTitle } from '@/components/documentBuilder/EditableSectionTitle';
import { ItemsDndContext } from '@/components/documentBuilder/ItemsDndContext';
import { PersonalDetailsLinks } from '@/components/documentBuilder/PersonalDetailsLinks';
import { SectionDescription } from '@/components/documentBuilder/SectionDescription';
import { SectionItem } from '@/components/documentBuilder/SectionItem';
import { SectionMetadataOptions } from '@/components/documentBuilder/SectionMetadataOptions';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { getSectionContainerId } from '@/lib/utils/stringUtils';

export const DocumentSection = observer(
  ({ sectionId }: { sectionId: number }) => {
    const section = builderSession.getSection(sectionId);
    const itemIds = section?.itemIds ?? [];

    return (
      <ContainerElement sectionId={sectionId}>
        <div className='flex flex-col gap-1'>
          <EditableSectionTitle sectionId={sectionId} />
          <SectionDescription sectionId={sectionId} />
          <SectionMetadataOptions sectionId={sectionId} />
        </div>
        <ItemsDndContext items={[...itemIds]}>
          {itemIds.map((id) => (
            <SectionItem itemId={id} key={id} />
          ))}
        </ItemsDndContext>
        {section?.definition.expectedContainerType === 'collapsible' && (
          <AddNewItemButton sectionId={sectionId} />
        )}
        {section?.sectionKey === 'personalDetails' ? (
          <PersonalDetailsLinks />
        ) : null}
      </ContainerElement>
    );
  }
);

const ContainerElement = observer(
  ({ children, sectionId }: PropsWithChildren & { sectionId: number }) => {
    if (
      builderSession.getSection(sectionId)?.definition.sectionCardinality ===
      'required-one'
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
