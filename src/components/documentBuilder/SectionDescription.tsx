'use client';
import { observer } from 'mobx-react-lite';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { SECTION_DESCRIPTIONS_BY_TYPE } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

const SectionDescription = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const sectionType =
      builderRootStore.sectionStore.getSectionById(sectionId)?.type;
    const description =
      SECTION_DESCRIPTIONS_BY_TYPE[
        sectionType as keyof typeof SECTION_DESCRIPTIONS_BY_TYPE
      ];

    if (!description) return null;

    return <p className="text-muted-foreground text-sm">{description}</p>;
  },
);

export default SectionDescription;
