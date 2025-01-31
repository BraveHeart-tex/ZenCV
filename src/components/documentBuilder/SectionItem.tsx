'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilderStore';
import { INTERNAL_SECTION_TYPES, MAX_VISIBLE_FIELDS } from '@/lib/constants';
import { CONTAINER_TYPES, DEX_Item } from '@/lib/client-db/clientDbSchema';
import type { ReactNode } from 'react';
import HidableFieldContainer from './HidableFieldContainer';
import { useFieldMapper } from '@/hooks/useFieldMapper';
import { cn } from '@/lib/utils/stringUtils';
import CollapsibleSectionItemContainer from './collapsibleItemContainer/CollapsibleItemContainer';

const SectionItem = observer(({ itemId }: { itemId: DEX_Item['id'] }) => {
  const { renderFields } = useFieldMapper();
  const item = documentBuilderStore.getItemById(itemId)!;
  const fields = documentBuilderStore.getFieldsByItemId(itemId);

  if (!item) return null;

  const ContainerElement = ({ children }: { children: ReactNode }) => {
    if (item.containerType === CONTAINER_TYPES.COLLAPSIBLE) {
      return (
        <CollapsibleSectionItemContainer itemId={item.id}>
          {children}
        </CollapsibleSectionItemContainer>
      );
    }

    return (
      <div
        className={cn(
          'p-4 pt-0 px-0 grid grid-cols-2 gap-4',
          documentBuilderStore.getSectionById(item.sectionId)?.type ===
            INTERNAL_SECTION_TYPES.PERSONAL_DETAILS &&
            'grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6',
          fields.length === 2 && 'grid grid-cols-2 gap-4',
        )}
      >
        {children}
      </div>
    );
  };

  if (fields.length > MAX_VISIBLE_FIELDS) {
    return <HidableFieldContainer fields={fields} />;
  }

  return <ContainerElement>{renderFields(fields)}</ContainerElement>;
});

export default SectionItem;
