import { observer } from 'mobx-react-lite';
import { useFieldMapper } from '@/hooks/useFieldMapper';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { MAX_VISIBLE_FIELDS } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { cn } from '@/lib/utils/stringUtils';
import { CollapsibleSectionItemContainer } from './collapsibleItemContainer/CollapsibleItemContainer';
import { HidableFieldContainer } from './HidableFieldContainer';

export const SectionItem = observer(({ itemId }: { itemId: number }) => {
  const item = builderRootStore.getItem(itemId);

  if (!item) {
    return null;
  }

  return <ContainerElement item={item} />;
});

const ContainerElement = ({
  item,
}: {
  item: NonNullable<ReturnType<typeof builderRootStore.getItem>>;
}) => {
  const { renderFields } = useFieldMapper();

  const fields = item.editableFields;
  const section = builderRootStore.getSection(item.sectionId);

  if (fields.length > MAX_VISIBLE_FIELDS) {
    return <HidableFieldContainer fields={fields} />;
  }

  if (item.containerType === 'collapsible') {
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
        section?.sectionKey === 'personalDetails' &&
          'grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6',
        fields.length === 2 && 'grid grid-cols-2 gap-4'
      )}
    >
      {renderFields(fields)}
    </div>
  );
};
