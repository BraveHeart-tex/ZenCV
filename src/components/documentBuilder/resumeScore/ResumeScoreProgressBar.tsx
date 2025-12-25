import { observer } from 'mobx-react-lite';
import { Progress } from '@/components/ui/progress';
import { getScoreColor } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

export const ResumeScoreProgressBar = observer(() => {
  const score = builderRootStore.templateStore.debouncedResumeStats.score;
  const colors = getScoreColor(score);

  return (
    <Progress
      className='h-1'
      value={score}
      indicatorStyles={{
        backgroundColor: colors.backgroundColor,
      }}
    />
  );
});
