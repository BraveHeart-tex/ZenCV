import { observer } from 'mobx-react-lite';
import type { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { SectionMetadataOption } from './SectionMetadataOption';

const MetadataOptionsList = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const sectionMetadataOptions =
      builderRootStore.sectionStore.getSectionMetadataOptions(sectionId);

    if (!sectionMetadataOptions?.length) return null;

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
  sectionId: DEX_Section['id'];
}) => {
  return (
    <div className='space-y-2'>
      <MetadataOptionsList sectionId={sectionId} />
    </div>
  );
};
