import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { getScoreColor } from '@/lib/helpers/documentBuilderHelpers';

const ResumeScoreBadge = observer(() => {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-max h-max bg-primary text-primary-foreground tabular-nums p-1 text-xs font-medium text-white rounded-md"
        style={{
          backgroundColor: getScoreColor(
            documentBuilderStore.debouncedResumeStats.score,
          ),
        }}
      >
        {documentBuilderStore.debouncedResumeStats.score}%
      </span>
      <span className="text-muted-foreground text-sm font-medium">
        Your Resume Score
      </span>
    </div>
  );
});

export default ResumeScoreBadge;
