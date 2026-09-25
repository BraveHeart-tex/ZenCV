import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { showErrorToast } from '@/components/ui/sonner';
import type { BuilderSectionModel } from '@/lib/builderDocument/builderDocument';
import {
  CHECKED_METADATA_VALUE,
  UNCHECKED_METADATA_VALUE,
} from '@/lib/constants';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

const MetadataSwitch = observer(
  ({
    sectionId,
    option,
  }: {
    sectionId: number;
    option: BuilderSectionModel['metadata'][number];
  }) => (
    <Switch
      id={option.key}
      value={option.value}
      checked={option.value === CHECKED_METADATA_VALUE}
      onCheckedChange={action(async (checked) => {
        const result = await builderSession.document?.updateSectionMetadata(
          sectionId as import('@/lib/builderDocument/builderDocument').SectionId,
          option.key,
          checked ? CHECKED_METADATA_VALUE : UNCHECKED_METADATA_VALUE
        );
        if (result && !result.success) {
          showErrorToast(
            'Could not update section settings. Please try again.'
          );
        }
      })}
    />
  )
);

export const SectionMetadataOption = ({
  sectionId,
  option,
}: {
  sectionId: number;
  option: BuilderSectionModel['metadata'][number];
}) => {
  return (
    <div className='first:mt-2 flex items-center gap-2'>
      <MetadataSwitch sectionId={sectionId} option={option} />
      <Label htmlFor={option.key}>{option.label}</Label>
    </div>
  );
};
