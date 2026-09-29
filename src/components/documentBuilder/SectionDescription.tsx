import { observer } from 'mobx-react-lite';
import type { SectionId } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { SECTION_DESCRIPTIONS_BY_KEY } from '@/lib/stores/documentBuilder/documentBuilder.constants';

export const SectionDescription = observer(
  ({ sectionId }: { sectionId: SectionId }) => {
    const sectionKey = builderSession.getSection(sectionId)?.sectionKey;
    const description =
      SECTION_DESCRIPTIONS_BY_KEY[
        sectionKey as keyof typeof SECTION_DESCRIPTIONS_BY_KEY
      ];

    if (!description) {
      return null;
    }

    return <p className='text-muted-foreground text-sm'>{description}</p>;
  }
);
