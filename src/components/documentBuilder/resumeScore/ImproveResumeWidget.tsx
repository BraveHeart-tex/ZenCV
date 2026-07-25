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
import { DocumentJobPostingIndicator } from '../DocumentJobPostingIndicator';
import { TailorForJobPostingBanner } from './TailorForJobPostingBanner';

export const ImproveResumeWidget = observer(() => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className='border-border/70 w-full border-b'
    >
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className='hover:bg-muted/60 h-11 w-full justify-start px-1'
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
        <div className='space-y-4 pb-5 pt-2'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between gap-3'>
              <ResumeScoreBadge />
              <DocumentJobPostingIndicator />
            </div>
            <ResumeScoreProgressBar />
          </div>
          <TailorForJobPostingBanner />
          <ResumeScoreSuggestionContent setOpen={setOpen} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});
