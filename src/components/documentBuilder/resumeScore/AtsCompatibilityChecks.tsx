import { CheckCircle2Icon, CircleAlertIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';
import { SuggestionGroupHeading } from './SuggestionGroupHeading';

export const AtsCompatibilityChecks = observer(() => {
  const atsCompatibility =
    builderSession.templateStore.debouncedATSCompatibility;
  if (atsCompatibility.checks.length === 0) {
    return null;
  }

  return (
    <div className='space-y-3'>
      <div className='space-y-1'>
        <SuggestionGroupHeading>Resume checks</SuggestionGroupHeading>
        <p className='text-muted-foreground text-sm'>
          {atsCompatibility.passedCount} of {atsCompatibility.totalCount} checks
          passed
        </p>
      </div>

      <div className='grid gap-2'>
        {atsCompatibility.checks.map((check) => (
          <div key={check.id} className='flex items-start gap-3 py-1.5'>
            {check.pass ? (
              <CheckCircle2Icon
                aria-hidden='true'
                className='text-muted-foreground mt-0.5 shrink-0'
                size={18}
              />
            ) : (
              <CircleAlertIcon
                aria-hidden='true'
                className='text-muted-foreground mt-0.5 shrink-0'
                size={18}
              />
            )}
            <div className='flex-1'>
              <p className='text-sm'>{check.label}</p>
              <span className='text-muted-foreground text-xs'>
                {check.pass ? 'Passed' : 'Review suggested'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
