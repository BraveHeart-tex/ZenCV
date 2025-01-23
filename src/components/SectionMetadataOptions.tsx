import { observer } from 'mobx-react-lite';
import { DEX_Section } from '@/lib/schema';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { action } from 'mobx';

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
              checked={Number.parseInt(option.value) === 1}
              onCheckedChange={action((checked) => {
                documentBuilderStore.updateSectionMetadata(sectionId, {
                  key: option.key,
                  value: (checked ? 1 : 0).toString(),
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
