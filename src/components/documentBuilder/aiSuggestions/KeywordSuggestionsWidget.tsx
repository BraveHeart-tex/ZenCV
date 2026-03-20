import { useAuth } from '@clerk/react';
import { PopoverClose } from '@radix-ui/react-popover';
import {
  BriefcaseBusinessIcon,
  CheckIcon,
  CircleHelp,
  ClipboardCheckIcon,
  ClipboardIcon,
  DiamondPlus,
  XIcon,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { aiButtonBaseClassnames } from '@/components/documentBuilder/aiSuggestions/AiSuggestionsContent';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { getKeywordSuggestionScrollEventName } from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';
import { cn } from '@/lib/utils/stringUtils';

interface KeywordSuggestionsWidgetProps {
  sectionId: DEX_Section['id'];
  sectionType: DEX_Section['type'];
}

export const KeywordSuggestionsWidget = observer(
  ({ sectionType }: KeywordSuggestionsWidgetProps) => {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef<HTMLButtonElement | null>(null);
    const { isSignedIn } = useAuth();

    useEffect(() => {
      const controller = new AbortController();
      if (
        !userSettingsStore.editorPreferences.showAiSuggestions ||
        !isSignedIn
      ) {
        controller.abort();
      }
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
        { signal: controller.signal }
      );
      return () => controller.abort();
    }, [sectionType, isSignedIn]);

    if (
      builderRootStore.aiSuggestionsStore.keywordSuggestions.length === 0 ||
      !userSettingsStore.editorPreferences.showAiSuggestions ||
      !isSignedIn
    ) {
      return null;
    }

    const used = builderRootStore.aiSuggestionsStore.usedKeywords.size;
    const total = builderRootStore.aiSuggestionsStore.keywordSuggestions.length;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild ref={popoverRef}>
          <Button size='xsIcon' className={cn(aiButtonBaseClassnames)}>
            <DiamondPlus className='w-4 h-4 text-white' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-72 p-0 overflow-hidden' side='top'>
          {/* Header */}
          <div className='flex items-center justify-between gap-2 px-3 py-2.5 bg-muted/50 border-b'>
            <div className='flex items-center gap-2 min-w-0'>
              <div className='shrink-0 bg-foreground p-1 rounded-md'>
                <BriefcaseBusinessIcon className='text-background w-3 h-3' />
              </div>
              <span className='text-sm font-medium truncate min-w-0'>
                {builderRootStore.jobPostingStore.jobPosting?.jobTitle}
              </span>
            </div>
            <PopoverClose asChild>
              <Button size='xsIcon' variant='ghost' className='shrink-0'>
                <XIcon className='w-3.5 h-3.5' />
              </Button>
            </PopoverClose>
          </div>

          {/* Keywords count + tooltip */}
          <div className='flex items-center gap-1.5 px-3 pt-3 pb-2'>
            <span className='text-sm'>
              <span className='font-semibold'>{used}</span>
              <span className='text-muted-foreground'> / {total}</span>
            </span>
            <span className='text-sm text-muted-foreground'>keywords used</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size='xsIcon' variant='ghost' className='h-5 w-5'>
                    <CircleHelp className='w-3.5 h-3.5' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className='max-w-44 text-pretty'>
                    Use the keywords below in your resume to increase its score.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Progress bar */}
          <div className='px-3 pb-3'>
            <div className='h-1 w-full rounded-full bg-muted overflow-hidden'>
              <div
                className='h-full rounded-full bg-foreground transition-all duration-300'
                style={{ width: `${total > 0 ? (used / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Keyword list */}
          <div className='flex flex-col max-h-[200px] overflow-y-auto px-2 pb-2 gap-1'>
            {builderRootStore.aiSuggestionsStore.keywordSuggestions.map(
              (keyword) => (
                <KeywordSuggestionButton
                  keyword={keyword}
                  key={keyword}
                  isUsed={builderRootStore.aiSuggestionsStore.usedKeywords.has(
                    keyword
                  )}
                />
              )
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
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
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Button
      className='flex items-center justify-between w-full gap-2 px-2 h-8 text-sm'
      variant={isUsed ? 'secondary' : 'outline'}
      onClick={handleKeywordClick}
      disabled={isUsed}
    >
      <span className='flex-1 min-w-0 text-left truncate'>{keyword}</span>
      <span className='shrink-0 flex items-center gap-1 text-xs text-muted-foreground'>
        {isUsed ? (
          <CheckIcon className='w-3.5 h-3.5 text-green-600' />
        ) : copied ? (
          <>
            <ClipboardCheckIcon className='w-3.5 h-3.5' />
            <span>Copied</span>
          </>
        ) : (
          <ClipboardIcon className='w-3.5 h-3.5' />
        )}
      </span>
    </Button>
  );
};
