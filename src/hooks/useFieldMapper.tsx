import { DateFieldInput } from '@/components/documentBuilder/inputs/DateFieldInput';
import { SectionField } from '@/components/documentBuilder/SectionField';
import type { SemanticField } from '@/lib/builderDocument/builderDocument';

export const useFieldMapper = () => {
  const renderFields = (fields: readonly SemanticField[]) => {
    return fields.map((field, index) => {
      const isDateField = field.definition.control === 'month';
      const nextFieldIsDate = fields[index + 1]?.definition.control === 'month';

      if (isDateField && nextFieldIsDate) {
        return (
          <div key={field.id} className='w-full'>
            <div className='lg:flex lg:items-center grid gap-4'>
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
    });
  };

  return { renderFields };
};
