import { DateFieldInput } from '@/components/documentBuilder/inputs/DateFieldInput';
import { SectionField } from '@/components/documentBuilder/SectionField';
import type { GenericRenderUnit } from '@/lib/builderDocument/createGenericRenderPlan';

export const useFieldMapper = () => {
  const renderFields = (units: readonly GenericRenderUnit[]) => {
    return units.map((unit) => {
      if (unit.kind === 'dateRange') {
        return (
          <div
            key={unit.start.id}
            className='col-span-full grid grid-cols-1 gap-4 lg:grid-cols-2'
          >
            <DateFieldInput fieldId={unit.start.id} />
            <DateFieldInput fieldId={unit.end.id} />
          </div>
        );
      }
      return <SectionField fieldId={unit.field.id} key={unit.field.id} />;
    });
  };

  return { renderFields };
};
