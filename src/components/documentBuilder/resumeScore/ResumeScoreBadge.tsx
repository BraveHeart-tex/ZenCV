import { observer } from 'mobx-react-lite';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';

const ResumeScoreBadge = observer(() => {
  return (
    <div className="flex items-center gap-2">
      <span className="w-max h-max bg-primary text-primary-foreground tabular-nums p-1 text-xs font-medium rounded-md">
        {documentBuilderStore.resumeStats.score}%
      </span>
      <span className="text-muted-foreground text-sm font-medium">
        Your Resume Score
      </span>
    </div>
  );
});

export default ResumeScoreBadge;
