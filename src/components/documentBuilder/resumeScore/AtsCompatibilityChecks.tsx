import { CheckCircle2Icon, CircleAlertIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { SuggestionGroupHeading } from './SuggestionGroupHeading';

export const AtsCompatibilityChecks = observer(() => {
  const atsCompatibility =
    builderRootStore.templateStore.debouncedATSCompatibility;
  const hasJobKeywordContext =
    builderRootStore.aiSuggestionsStore.keywordSuggestions.length > 0;

  if (atsCompatibility.checks.length === 0) {
    return null;
  }

  return (
    <div className='space-y-4 py-4'>
      <div className='space-y-1'>
        <SuggestionGroupHeading>ATS Compatibility</SuggestionGroupHeading>
        <p className='text-muted-foreground text-sm'>
          {atsCompatibility.passedCount} of {atsCompatibility.totalCount} checks
          passed
          {hasJobKeywordContext
            ? ` · ${Math.round(atsCompatibility.keywordCoverage * 100)}% keyword coverage`
            : ''}
        </p>
      </div>

      <div className='grid gap-2'>
        {atsCompatibility.checks.map((check) => (
          <div
            key={check.id}
            className='bg-muted/40 flex items-center gap-3 rounded-md border p-3'
          >
            {check.pass ? (
              <CheckCircle2Icon
                className='text-emerald-600 shrink-0'
                size={18}
              />
            ) : (
              <CircleAlertIcon className='text-amber-600 shrink-0' size={18} />
            )}
            <div className='flex-1'>
              <p className='text-sm font-medium'>{check.label}</p>
              {check.id === 'keyword_coverage' && !hasJobKeywordContext ? (
                <p className='text-muted-foreground text-xs'>
                  Add a job posting to measure keyword coverage.
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
