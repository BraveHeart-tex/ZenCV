import { observer } from 'mobx-react-lite';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

export const ResumeScoreBadge = observer(
  ({ showLabel = true }: { showLabel?: boolean }) => {
    const checks = builderSession.templateStore.debouncedATSCompatibility;
    return (
      <span className='text-muted-foreground text-xs tabular-nums'>
        {checks.passedCount} of {checks.totalCount}
        {showLabel ? ' checks passed' : ' passed'}
      </span>
    );
  }
);
