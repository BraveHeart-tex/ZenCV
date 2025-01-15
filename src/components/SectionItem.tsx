'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import SectionField from '@/components/SectionField';
import { cn } from '@/lib/utils';
import { INTERNAL_SECTION_TYPES } from '@/lib/constants';

const SectionItem = observer(({ itemId }: { itemId: number }) => {
  const item = documentBuilderStore.getItemById(itemId)!;
  const fields = documentBuilderStore.getFieldsByItemId(itemId);

  return (
    <div
      className={cn(
        'p-4 px-0',
        item.containerType === 'collapsible' && 'border rounded-md p-2',
        documentBuilderStore.getSectionById(item.sectionId)?.type ===
          INTERNAL_SECTION_TYPES.PERSONAL_DETAILS &&
          'grid grid-cols-2 gap-x-4 gap-y-6',
      )}
    >
      {fields.map((field) => (
        <SectionField fieldId={field.id} key={field.id} />
      ))}
    </div>
  );
});

export default SectionItem;
