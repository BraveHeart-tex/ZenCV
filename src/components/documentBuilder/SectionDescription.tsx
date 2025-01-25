'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { SECTION_DESCRIPTIONS_BY_TYPE } from '@/lib/constants';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';

const SectionDescription = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const sectionType = documentBuilderStore.getSectionById(sectionId)?.type;
    const description =
      SECTION_DESCRIPTIONS_BY_TYPE[
        sectionType as keyof typeof SECTION_DESCRIPTIONS_BY_TYPE
      ];

    if (!description) return null;

    return <p className="text-muted-foreground text-sm">{description}</p>;
  },
);

export default SectionDescription;
