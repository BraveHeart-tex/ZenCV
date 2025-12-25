'use client';
import { observer } from 'mobx-react-lite';
import type { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { SECTION_DESCRIPTIONS_BY_TYPE } from '@/lib/stores/documentBuilder/documentBuilder.constants';

export const SectionDescription = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const sectionType =
      builderRootStore.sectionStore.getSectionById(sectionId)?.type;
    const description =
      SECTION_DESCRIPTIONS_BY_TYPE[
        sectionType as keyof typeof SECTION_DESCRIPTIONS_BY_TYPE
      ];

    if (!description) return null;

    return <p className='text-muted-foreground text-sm'>{description}</p>;
  }
);
