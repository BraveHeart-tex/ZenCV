import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { DEX_Section } from '@/lib/client-db/clientDbSchema';
import {
  CHECKED_METADATA_VALUE,
  UNCHECKED_METADATA_VALUE,
} from '@/lib/constants';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import type { ParsedSectionMetadata } from '@/lib/types/documentBuilder.types';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

const MetadataSwitch = observer(
  ({
    sectionId,
    option,
  }: {
    sectionId: DEX_Section['id'];
    option: ParsedSectionMetadata;
  }) => (
    <Switch
      id={option.key}
      value={option.value}
      checked={option.value === CHECKED_METADATA_VALUE}
      onCheckedChange={action(async (checked) => {
        await builderRootStore.sectionStore.updateSectionMetadata(sectionId, {
          key: option.key,
          value: checked ? CHECKED_METADATA_VALUE : UNCHECKED_METADATA_VALUE,
        });
      })}
    />
  )
);

export const SectionMetadataOption = ({
  sectionId,
  option,
}: {
  sectionId: DEX_Section['id'];
  option: ParsedSectionMetadata;
}) => {
  return (
    <div className='first:mt-2 flex items-center gap-2'>
      <MetadataSwitch sectionId={sectionId} option={option} />
      <Label htmlFor={option.key}>{option.label}</Label>
    </div>
  );
};
