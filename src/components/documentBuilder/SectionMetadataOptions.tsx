import { observer } from 'mobx-react-lite';
import type { SectionId } from '@/lib/builderDocument/builderDocument';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { SectionMetadataOption } from './SectionMetadataOption';

const MetadataOptionsList = observer(
  ({ sectionId }: { sectionId: SectionId }) => {
    const sectionMetadataOptions =
      builderSession.getSection(sectionId)?.metadata;

    if (!sectionMetadataOptions?.length) {
      return null;
    }

    return sectionMetadataOptions.map((option) => (
      <SectionMetadataOption
        key={option.key}
        sectionId={sectionId}
        option={option}
      />
    ));
  }
);

export const SectionMetadataOptions = ({
  sectionId,
}: {
  sectionId: SectionId;
}) => {
  return (
    <div className='space-y-2'>
      <MetadataOptionsList sectionId={sectionId} />
    </div>
  );
};
