'use client';
import { observer } from 'mobx-react-lite';
import { useFieldMapper } from '@/hooks/useFieldMapper';
import { CONTAINER_TYPES, type DEX_Item } from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import {
  INTERNAL_SECTION_TYPES,
  MAX_VISIBLE_FIELDS,
} from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { cn } from '@/lib/utils/stringUtils';
import { CollapsibleSectionItemContainer } from './collapsibleItemContainer/CollapsibleItemContainer';
import { HidableFieldContainer } from './HidableFieldContainer';

export const SectionItem = observer(
  ({ itemId }: { itemId: DEX_Item['id'] }) => {
    const item = builderRootStore.itemStore.getItemById(itemId);

    if (!item) return null;

    return <ContainerElement item={item} />;
  }
);

const ContainerElement = ({ item }: { item: DEX_Item }) => {
  const { renderFields } = useFieldMapper();

  const fields = builderRootStore.fieldStore.getFieldsByItemId(item.id);

  if (fields.length > MAX_VISIBLE_FIELDS) {
    return <HidableFieldContainer fields={fields} />;
  }

  if (item.containerType === CONTAINER_TYPES.COLLAPSIBLE) {
    return (
      <CollapsibleSectionItemContainer itemId={item.id}>
        {renderFields(fields)}
      </CollapsibleSectionItemContainer>
    );
  }

  return (
    <div
      className={cn(
        'p-4 pt-0 px-0 grid grid-cols-2 gap-4',
        builderRootStore.sectionStore.getSectionById(item.sectionId)?.type ===
          INTERNAL_SECTION_TYPES.PERSONAL_DETAILS &&
          'grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6',
        fields.length === 2 && 'grid grid-cols-2 gap-4'
      )}
    >
      {renderFields(fields)}
    </div>
  );
};
