import { observer } from 'mobx-react-lite';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { action } from 'mobx';
import {
  CHECKED_METADATA_VALUE,
  UNCHECKED_METADATA_VALUE,
} from '@/lib/constants';

const SectionMetadataOptions = observer(
  ({ sectionId }: { sectionId: DEX_Section['id'] }) => {
    const sectionMetadataOptions =
      documentBuilderStore.getSectionMetadataOptions(sectionId);

    if (sectionMetadataOptions?.length === 0) return null;

    return (
      <div className="my-2">
        {sectionMetadataOptions.map((option) => (
          <div key={option.key} className="flex items-center gap-2">
            <Switch
              id={option.key}
              value={option.value}
              checked={option.value === CHECKED_METADATA_VALUE}
              onCheckedChange={action(async (checked) => {
                await documentBuilderStore.updateSectionMetadata(sectionId, {
                  key: option.key,
                  value: checked
                    ? CHECKED_METADATA_VALUE
                    : UNCHECKED_METADATA_VALUE,
                });
              })}
            />
            <Label htmlFor={option.key}>{option.label}</Label>
          </div>
        ))}
      </div>
    );
  },
);

export default SectionMetadataOptions;
