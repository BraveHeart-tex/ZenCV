import { observer } from 'mobx-react-lite';
import { Progress } from '@/components/ui/progress';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';

const ResumeScoreProgressBar = observer(() => {
  return <Progress value={documentBuilderStore.resumeStats.score} />;
});

export default ResumeScoreProgressBar;
