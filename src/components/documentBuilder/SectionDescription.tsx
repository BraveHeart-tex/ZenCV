import { observer } from 'mobx-react-lite';
import type { SectionId } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { SECTION_DESCRIPTIONS_BY_TYPE } from '@/lib/stores/documentBuilder/documentBuilder.constants';

export const SectionDescription = observer(
  ({ sectionId }: { sectionId: SectionId }) => {
    const sectionType =
      builderSession.getSection(sectionId)?.definition.persistedType;
    const description =
      SECTION_DESCRIPTIONS_BY_TYPE[
        sectionType as keyof typeof SECTION_DESCRIPTIONS_BY_TYPE
      ];

    if (!description) {
      return null;
    }

    return <p className='text-muted-foreground text-sm'>{description}</p>;
  }
);
