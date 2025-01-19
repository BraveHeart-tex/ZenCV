'use client';
import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/documentBuilderStore';
import SectionField from '@/components/SectionField';
import { cn } from '@/lib/utils';
import { INTERNAL_SECTION_TYPES } from '@/lib/constants';
import { CONTAINER_TYPES, FIELD_TYPES } from '@/lib/schema';
import DateFieldInput from '@/components/DateFieldInput';
import CollapsibleItemContainer from '@/components/CollapsibleItemContainer';
import type { ReactNode } from 'react';

const SectionItem = observer(({ itemId }: { itemId: number }) => {
  const item = documentBuilderStore.getItemById(itemId)!;
  const fields = documentBuilderStore.getFieldsByItemId(itemId);

  const ContainerElement = ({ children }: { children: ReactNode }) => {
    if (item.containerType === CONTAINER_TYPES.COLLAPSIBLE) {
      return (
        <CollapsibleItemContainer
          triggerTitle={'Testing'}
          triggerDescription={'testing description'}
          itemId={item.id}
        >
          {children}
        </CollapsibleItemContainer>
      );
    }

    return (
      <div
        className={cn(
          'p-4 px-0 grid grid-cols-2 gap-4',
          documentBuilderStore.getSectionById(item.sectionId)?.type ===
            INTERNAL_SECTION_TYPES.PERSONAL_DETAILS &&
            'grid md:grid-cols-2 gap-x-4 gap-y-6',
          fields.length === 2 && 'grid grid-cols-2 gap-4',
        )}
      >
        {children}
      </div>
    );
  };

  return (
    <ContainerElement>
      {fields.map((field, index) => {
        const isDateField = field.type === FIELD_TYPES.DATE_MONTH;
        const nextFieldIsDate =
          fields[index + 1]?.type === FIELD_TYPES.DATE_MONTH;

        if (isDateField && nextFieldIsDate) {
          return (
            <div key={field.id} className="w-full">
              <div className="flex items-center gap-4">
                <DateFieldInput fieldId={field.id} />
                <DateFieldInput fieldId={fields[index + 1].id} />
              </div>
            </div>
          );
        }

        if (isDateField) {
          return null;
        }

        return <SectionField fieldId={field.id} key={field.id} />;
      })}
    </ContainerElement>
  );
});

export default SectionItem;
