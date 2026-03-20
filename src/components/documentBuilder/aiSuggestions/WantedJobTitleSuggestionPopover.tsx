import { useAuth } from '@clerk/react';
import { PopoverClose } from '@radix-ui/react-popover';
import {
  BriefcaseBusinessIcon,
  DiamondPlus,
  PlusIcon,
  XIcon,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { aiButtonBaseClassnames } from '@/components/documentBuilder/aiSuggestions/AiSuggestionsContent';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';
import { cn } from '@/lib/utils/stringUtils';

interface WantedJobTitleSuggestionPopoverProps {
  fieldId: DEX_Field['id'];
  value: string;
}

export const WantedJobTitleSuggestionPopover = observer(
  ({ fieldId, value }: WantedJobTitleSuggestionPopoverProps) => {
    const { isSignedIn } = useAuth();
    const jobTitle = builderRootStore.jobPostingStore.jobPosting?.jobTitle;
    const suggestedJobTitle =
      builderRootStore.aiSuggestionsStore.suggestedJobTitle;

    if (
      !userSettingsStore.editorPreferences.showAiSuggestions ||
      !suggestedJobTitle ||
      !builderRootStore.documentStore.document?.jobPostingId ||
      value === suggestedJobTitle ||
      !isSignedIn
    ) {
      return null;
    }

    const handleSuggestedTitleClick = async () => {
      await builderRootStore.aiSuggestionsStore.applySuggestedJobTitle(fieldId);
    };

    return (
      <Popover>
        <PopoverTrigger className={cn(aiButtonBaseClassnames)} asChild>
          <Button size='xsIcon'>
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
                {jobTitle}
              </span>
            </div>
            <PopoverClose asChild>
              <Button size='xsIcon' variant='ghost' className='shrink-0'>
                <XIcon className='w-3.5 h-3.5' />
              </Button>
            </PopoverClose>
          </div>

          {/* Suggestion */}
          <div className='p-3'>
            <p className='text-xs text-muted-foreground mb-2'>
              Suggested title for this role
            </p>
            <Button
              variant='outline'
              className='justify-between w-full px-2 h-9 text-sm font-medium'
              onClick={handleSuggestedTitleClick}
            >
              <span className='truncate min-w-0 text-left'>
                {suggestedJobTitle}
              </span>
              <PlusIcon className='w-3.5 h-3.5 shrink-0 ml-2' />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
