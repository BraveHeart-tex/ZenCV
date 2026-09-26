import { observer } from 'mobx-react-lite';
import { useFieldMapper } from '@/hooks/useFieldMapper';
import {
  type ItemId,
  WorkExperienceItemModel,
} from '@/lib/builderDocument/builderDocument';
import { createGenericRenderPlan } from '@/lib/builderDocument/createGenericRenderPlan';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { cn } from '@/lib/utils/stringUtils';
import { CollapsibleSectionItemContainer } from './collapsibleItemContainer/CollapsibleItemContainer';
import { HidableFieldContainer } from './HidableFieldContainer';
import { WorkExperienceForm } from './WorkExperienceForm';

export const SectionItem = observer(({ itemId }: { itemId: ItemId }) => {
  const item = builderSession.getItem(itemId);

  if (!item) {
    return null;
  }

  return <ContainerElement item={item} />;
});

const ContainerElement = ({
  item,
}: {
  item: NonNullable<ReturnType<typeof builderSession.getItem>>;
}) => {
  const { renderFields } = useFieldMapper();

  const fields = item.editableFields;
  const section = builderSession.getSection(item.sectionId);

  if (item instanceof WorkExperienceItemModel) {
    return (
      <CollapsibleSectionItemContainer itemId={item.id}>
        <WorkExperienceForm entry={item.entry} />
      </CollapsibleSectionItemContainer>
    );
  }

  const plan = createGenericRenderPlan(fields);
  if (import.meta.env.DEV) {
    for (const diagnostic of plan.diagnostics) {
      console.warn(diagnostic);
    }
  }
  const responsiveLayout =
    section?.editorDefinition.editorLayout?.desktopBreakpoint === 'md';
  const content =
    plan.additional.length > 0 ? (
      <HidableFieldContainer plan={plan} responsiveLayout={responsiveLayout} />
    ) : (
      renderFields(plan.primary)
    );

  if (item.containerType === 'collapsible') {
    return (
      <CollapsibleSectionItemContainer itemId={item.id}>
        {content}
      </CollapsibleSectionItemContainer>
    );
  }

  return (
    <div
      className={cn(
        'p-4 pt-0 px-0 grid grid-cols-2 gap-4',
        responsiveLayout && 'grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6'
      )}
    >
      {content}
    </div>
  );
};
