'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  BriefcaseBusinessIcon,
  CheckIcon,
  CircleHelp,
  ClipboardCheckIcon,
  ClipboardIcon,
  DiamondPlus,
} from 'lucide-react';
import { PopoverClose } from '@radix-ui/react-popover';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { observer } from 'mobx-react-lite';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/stringUtils';
import { aiButtonBaseClassnames } from '@/components/documentBuilder/aiSuggestions/AiSuggestionsContent';
import { getKeywordSuggestionScrollEventName } from '@/lib/helpers/documentBuilderHelpers';

interface KeywordSuggestionsWidgetProps {
  sectionId: DEX_Section['id'];
  sectionType: DEX_Section['type'];
}

const KeywordSuggestionsWidget = observer(
  ({ sectionType }: KeywordSuggestionsWidgetProps) => {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      const controller = new AbortController();

      document.addEventListener(
        getKeywordSuggestionScrollEventName(sectionType),
        () => {
          setOpen(true);
          if (popoverRef.current) {
            const rect = popoverRef.current.getBoundingClientRect();
            const absoluteY = window.scrollY + rect.top;
            const centerY =
              absoluteY - window.innerHeight / 2 + rect.height / 2;

            window.scrollTo({ top: centerY, behavior: 'smooth' });
          }
        },
        {
          signal: controller.signal,
        },
      );

      return () => {
        controller.abort();
      };
    }, [sectionType]);

    if (builderRootStore.aiSuggestionsStore.keywordSuggestions.length === 0) {
      return null;
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild ref={popoverRef}>
          <Button size="xsIcon" className={cn(aiButtonBaseClassnames)}>
            <DiamondPlus className="w-4 h-4 text-white" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="space-y-4" side="top">
          <div className="flex items-center justify-between w-full gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-foreground p-1 rounded-md">
                <BriefcaseBusinessIcon className="text-background w-3 h-3" />
              </div>
              <span className="text-[1rem] whitespace-nowrap overflow-hidden truncate">
                {builderRootStore.jobPostingStore.jobPosting?.jobTitle}
              </span>
            </div>
            <PopoverClose asChild>
              <Button size="xsIcon" variant="ghost">
                <CloseIcon />
              </Button>
            </PopoverClose>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">
              {builderRootStore.aiSuggestionsStore.usedKeywords.size} /{' '}
              {builderRootStore.aiSuggestionsStore.keywordSuggestions.length}
            </span>
            <span>Keywords</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="xsIcon" variant="ghost">
                    <CircleHelp />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[11rem] text-pretty">
                    Use the keywords below in your resume to increase its score.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1 max-h-[200px] overflow-auto space-y-1">
            {builderRootStore.aiSuggestionsStore.keywordSuggestions.map(
              (keyword) => (
                <KeywordSuggestionButton
                  keyword={keyword}
                  key={keyword}
                  isUsed={builderRootStore.aiSuggestionsStore.usedKeywords.has(
                    keyword,
                  )}
                />
              ),
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

interface KeywordSuggestionButtonProps {
  keyword: string;
  isUsed: boolean;
}

const KeywordSuggestionButton = ({
  keyword,
  isUsed,
}: KeywordSuggestionButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleKeywordClick = async () => {
    await navigator.clipboard.writeText(keyword);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <Button
      className="items-center justify-between w-full gap-8 px-1"
      variant="outline"
      onClick={handleKeywordClick}
      disabled={isUsed}
    >
      <span className="flex-1 w-full overflow-hidden text-left truncate">
        {keyword}
      </span>
      <div className="flex items-center gap-1">
        {isUsed ? (
          <CheckIcon />
        ) : (
          <>
            {copied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
            {copied && <span>Copied</span>}
          </>
        )}
      </div>
    </Button>
  );
};

export default KeywordSuggestionsWidget;
