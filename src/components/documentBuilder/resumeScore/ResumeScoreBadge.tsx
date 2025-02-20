import { observer } from 'mobx-react-lite';
import { getScoreColor } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

const ResumeScoreBadge = observer(() => {
  const score = builderRootStore.templateStore.debouncedResumeStats.score;
  const colors = getScoreColor(score);
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-max h-max tabular-nums p-1 text-xs font-medium rounded-md"
        style={{
          backgroundColor: colors.backgroundColor,
          color: colors.color,
        }}
      >
        {score}%
      </span>
      {!builderRootStore.documentStore.document?.jobPostingId ? (
        <span className="text-muted-foreground text-sm font-medium">
          Your Resume Score
        </span>
      ) : null}
    </div>
  );
});

export default ResumeScoreBadge;
