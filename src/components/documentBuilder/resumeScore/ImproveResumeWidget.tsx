import { useEffect, useRef, useState } from 'react';
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
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils/stringUtils';
import { useMotionValueEvent, useScroll } from 'motion/react';
import DocumentJobPostingIndicator from '../DocumentJobPostingIndicator';

const ImproveResumeWidget = observer(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    document.addEventListener(
      'click',
      (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      },
      {
        signal: controller.signal,
      },
    );

    return () => {
      controller.abort();
    };
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (containerRef.current) {
      const parentContainer = containerRef.current.parentElement;
      if (!parentContainer) return;
      const { top } = parentContainer.getBoundingClientRect();
      setIsSticky(latest > top);
    }
  });

  return (
    <Collapsible
      ref={containerRef}
      open={open}
      onOpenChange={setOpen}
      className={'w-full py-4 transition-all rounded-md'}
    >
      <div className={'w-full space-y-2'}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <ResumeScoreBadge />
            <DocumentJobPostingIndicator />
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              <span>
                Improve <span className="md:inline-block hidden">Resume</span>
              </span>
              <ChevronDownIcon
                className={cn('transition-all', open && 'rotate-180')}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        <ResumeScoreProgressBar />
      </div>
      <div
        className={cn(
          'transition-all',
          isSticky &&
            'px-4 shadow-md rounded-sm dark:border-t-0 dark:border dark:rounded-t-none',
        )}
      >
        <AnimatePresence>
          {open && (
            <CollapsibleContent forceMount className={'bg-popover'}>
              <ResumeScoreSuggestionContent setOpen={setOpen} />
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </div>
    </Collapsible>
  );
});

export default ImproveResumeWidget;
