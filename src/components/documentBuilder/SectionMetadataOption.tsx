import { observer } from 'mobx-react-lite';
import { Switch } from '../ui/switch';
import {
  CHECKED_METADATA_VALUE,
  UNCHECKED_METADATA_VALUE,
} from '@/lib/constants';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { action } from 'mobx';
import { Label } from '../ui/label';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { ParsedSectionMetadata } from '@/lib/types';

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
        await documentBuilderStore.updateSectionMetadata(sectionId, {
          key: option.key,
          value: checked ? CHECKED_METADATA_VALUE : UNCHECKED_METADATA_VALUE,
        });
      })}
    />
  ),
);

const SectionMetadataOption = ({
  sectionId,
  option,
}: {
  sectionId: DEX_Section['id'];
  option: ParsedSectionMetadata;
}) => {
  return (
    <div className="flex items-center gap-2">
      <MetadataSwitch sectionId={sectionId} option={option} />
      <Label htmlFor={option.key}>{option.label}</Label>
    </div>
  );
};

export default SectionMetadataOption;
