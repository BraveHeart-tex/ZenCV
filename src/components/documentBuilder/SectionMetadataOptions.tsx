import { observer } from 'mobx-react-lite';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import SectionMetadataOption from './SectionMetadataOption';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

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
  },
);

const SectionMetadataOptions = ({
  sectionId,
}: {
  sectionId: DEX_Section['id'];
}) => {
  return (
    <div className="space-y-2">
      <MetadataOptionsList sectionId={sectionId} />
    </div>
  );
};

export default SectionMetadataOptions;
