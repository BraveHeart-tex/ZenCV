import { observer } from 'mobx-react-lite';
import type { WorkExperienceEntry } from '@/lib/builderDocument/builderDocument';
import { DateFieldInput } from './inputs/DateFieldInput';
import { SectionField } from './SectionField';

interface WorkExperienceFormProps {
  entry: WorkExperienceEntry;
}

export const WorkExperienceForm = observer(
  ({ entry }: WorkExperienceFormProps) => {
    return (
      <div className='grid grid-cols-2 gap-4'>
        <SectionField fieldId={entry.role.id} />
        <SectionField fieldId={entry.employer.id} />
        <fieldset className='col-span-2 grid grid-cols-1 gap-4 border-0 p-0 lg:grid-cols-2'>
          <legend className='mb-2 text-sm font-medium'>Employment dates</legend>
          <DateFieldInput fieldId={entry.startDate.id} />
          <DateFieldInput fieldId={entry.endDate.id} />
        </fieldset>
        <SectionField fieldId={entry.city.id} />
        <SectionField fieldId={entry.description.id} />
      </div>
    );
  }
);
