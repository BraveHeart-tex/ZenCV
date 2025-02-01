import { observer } from 'mobx-react-lite';
import { Progress } from '@/components/ui/progress';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { getScoreColor } from '@/lib/helpers/documentBuilderHelpers';

const ResumeScoreProgressBar = observer(() => {
  const colors = getScoreColor(documentBuilderStore.debouncedResumeStats.score);

  return (
    <Progress
      className="h-1"
      value={documentBuilderStore.debouncedResumeStats.score}
      indicatorStyles={{
        backgroundColor: colors.backgroundColor,
      }}
    />
  );
});

export default ResumeScoreProgressBar;
