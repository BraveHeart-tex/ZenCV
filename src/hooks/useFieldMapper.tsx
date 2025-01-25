import DateFieldInput from '@/components/documentBuilder/DateFieldInput';
import SectionField from '@/components/documentBuilder/SectionField';
import { DEX_Field, FIELD_TYPES } from '@/lib/client-db/clientDbSchema';

export const useFieldMapper = () => {
  const renderFields = (fields: DEX_Field[]) => {
    return fields.map((field, index) => {
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
    });
  };

  return { renderFields };
};
