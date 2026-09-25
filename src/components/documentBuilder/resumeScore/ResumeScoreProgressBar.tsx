import { observer } from 'mobx-react-lite';
import { Progress } from '@/components/ui/progress';
import { getScoreColor } from '@/lib/helpers/documentBuilderHelpers';
import { builderSession } from '@/lib/stores/documentBuilder/builderSession';

export const ResumeScoreProgressBar = observer(() => {
  const score = builderSession.templateStore.debouncedResumeStats.score;
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
