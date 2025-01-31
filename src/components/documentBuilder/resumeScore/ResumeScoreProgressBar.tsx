import { observer } from 'mobx-react-lite';
import { Progress } from '@/components/ui/progress';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { getScoreColor } from '@/lib/helpers/documentBuilderHelpers';

const ResumeScoreProgressBar = observer(() => {
  return (
    <Progress
      value={documentBuilderStore.resumeStats.score}
      indicatorStyles={{
        backgroundColor: getScoreColor(documentBuilderStore.resumeStats.score),
      }}
    />
  );
});

export default ResumeScoreProgressBar;
