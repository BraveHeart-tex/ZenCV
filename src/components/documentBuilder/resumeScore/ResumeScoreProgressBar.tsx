import { observer } from 'mobx-react-lite';
import { Progress } from '@/components/ui/progress';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { getScoreColor } from '@/lib/helpers/documentBuilderHelpers';

const ResumeScoreProgressBar = observer(() => {
  return (
    <Progress
      value={documentBuilderStore.debouncedResumeStats.score}
      indicatorStyles={{
        backgroundColor: getScoreColor(
          documentBuilderStore.debouncedResumeStats.score,
        ),
      }}
    />
  );
});

export default ResumeScoreProgressBar;
