import { ChevronDownIcon, LightbulbIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { ResumeScoreBadge } from '@/components/documentBuilder/resumeScore/ResumeScoreBadge';
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
      className='w-full border-y border-border/60'
    >
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className='hover:bg-muted/50 h-11 w-full justify-start px-1'
        >
          <LightbulbIcon aria-hidden='true' className='text-muted-foreground' />
          <span className='font-medium'>Resume checks</span>
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
          <p className='text-muted-foreground text-sm leading-6'>
            Optional checks for this document. They do not measure resume
            quality or predict hiring outcomes. Include only what fits your
            experience.
          </p>
          <ResumeScoreSuggestionContent setOpen={setOpen} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});
