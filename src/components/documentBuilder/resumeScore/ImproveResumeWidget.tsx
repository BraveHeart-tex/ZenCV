import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { AnimatePresence } from 'motion/react';
import ResumeScoreBadge from '@/components/documentBuilder/resumeScore/ResumeScoreBadge';
import ResumeScoreProgressBar from '@/components/documentBuilder/resumeScore/ResumeScoreProgressBar';
import ResumeScoreSuggestionContent from '@/components/documentBuilder/resumeScore/ResumeScoreSuggestionContent';

const ImproveResumeWidget = observer(() => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between w-full">
          <ResumeScoreBadge />
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              Improve Resume
            </Button>
          </CollapsibleTrigger>
        </div>
        <ResumeScoreProgressBar />
      </div>
      <AnimatePresence>
        {open && (
          <CollapsibleContent forceMount className="bg-popover py-4 mt-4">
            <ResumeScoreSuggestionContent />
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
});

export default ImproveResumeWidget;
