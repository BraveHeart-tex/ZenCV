import { ChevronDownIcon, LightbulbIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { ResumeScoreBadge } from '@/components/documentBuilder/resumeScore/ResumeScoreBadge';
import { ResumeScoreProgressBar } from '@/components/documentBuilder/resumeScore/ResumeScoreProgressBar';
import { ResumeScoreSuggestionContent } from '@/components/documentBuilder/resumeScore/ResumeScoreSuggestionContent';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils/stringUtils';

export const ImproveResumeWidget = observer(() => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className='border-border/70 bg-muted/20 w-full rounded-lg border shadow-xs'
    >
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className='hover:bg-muted/60 h-11 w-full justify-start px-3'
        >
          <LightbulbIcon aria-hidden='true' className='text-muted-foreground' />
          <span className='font-medium'>Resume guidance</span>
          <span className='ml-auto'>
            <ResumeScoreBadge showLabel={false} />
          </span>
          <ChevronDownIcon
            aria-hidden='true'
            className={cn(
              'text-muted-foreground transition-transform',
              open && 'rotate-180'
            )}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className='space-y-4 px-3 pb-4 pt-1'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between gap-3'>
              <ResumeScoreBadge />
            </div>
            <ResumeScoreProgressBar />
          </div>
          <ResumeScoreSuggestionContent setOpen={setOpen} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});
