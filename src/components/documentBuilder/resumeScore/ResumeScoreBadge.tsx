import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { getScoreColor } from '@/lib/helpers/documentBuilderHelpers';

const ResumeScoreBadge = observer(() => {
  const colors = getScoreColor(documentBuilderStore.debouncedResumeStats.score);
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-max h-max tabular-nums p-1 text-xs font-medium rounded-md"
        style={{
          backgroundColor: colors.backgroundColor,
          color: colors.color,
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
