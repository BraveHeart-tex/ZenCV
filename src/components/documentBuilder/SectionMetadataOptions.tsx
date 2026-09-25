import { observer } from 'mobx-react-lite';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { SectionMetadataOption } from './SectionMetadataOption';

const MetadataOptionsList = observer(({ sectionId }: { sectionId: number }) => {
  const sectionMetadataOptions = builderSession.getSection(sectionId)?.metadata;

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
});

export const SectionMetadataOptions = ({
  sectionId,
}: {
  sectionId: number;
}) => {
  return (
    <div className='space-y-2'>
      <MetadataOptionsList sectionId={sectionId} />
    </div>
  );
};
