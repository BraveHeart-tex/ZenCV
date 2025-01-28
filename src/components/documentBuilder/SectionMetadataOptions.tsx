import { observer } from 'mobx-react-lite';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import SectionMetadataOption from './SectionMetadataOption';

const MetadataOptionsList = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const sectionMetadataOptions =
      documentBuilderStore.getSectionMetadataOptions(sectionId);

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
    <div className="my-2 space-y-2">
      <MetadataOptionsList sectionId={sectionId} />
    </div>
  );
};

export default SectionMetadataOptions;
