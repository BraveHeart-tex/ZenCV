import { ListTreeIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import type { RefObject } from 'react';
import { Button } from '@/components/ui/button';

interface ResumeOverviewTriggerProps {
  visible: boolean;
  onToggle: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export const ResumeOverviewTrigger = observer(
  ({ visible, onToggle, triggerRef }: ResumeOverviewTriggerProps) => {
    return (
      <Button
        ref={triggerRef}
        aria-label={visible ? 'Close resume overview' : 'Open resume overview'}
        aria-expanded={visible}
        aria-controls={visible ? 'resume-overview-panel' : undefined}
        className='mt-1 size-9 shrink-0'
        size='icon'
        variant='outline'
        onClick={onToggle}
      >
        <ListTreeIcon aria-hidden='true' />
      </Button>
    );
  }
);
