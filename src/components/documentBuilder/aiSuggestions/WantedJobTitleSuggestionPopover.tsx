'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BriefcaseBusinessIcon, DiamondPlus, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { observer } from 'mobx-react-lite';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { aiButtonBaseClassnames } from '@/lib/stores/documentBuilder/documentBuilder.constants';
import { PopoverClose } from '@radix-ui/react-popover';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import { DEX_Field } from '@/lib/client-db/clientDbSchema';
import { cn } from '@/lib/utils/stringUtils';

interface WantedJobTitleSuggestionPopoverProps {
  fieldId: DEX_Field['id'];
}

const WantedJobTitleSuggestionPopover = observer(
  ({ fieldId }: WantedJobTitleSuggestionPopoverProps) => {
    const jobTitle = builderRootStore.jobPostingStore.jobPosting?.jobTitle;
    const suggestedJobTitle =
      builderRootStore.aiSuggestionsStore.suggestedJobTitle;

    if (
      !suggestedJobTitle ||
      !builderRootStore.documentStore.document?.jobPostingId
    ) {
      return null;
    }

    const handleSuggestedTitleClick = async () => {
      await builderRootStore.aiSuggestionsStore.applySuggestedJobTitle(fieldId);
    };

    return (
      <Popover>
        <PopoverTrigger className={cn(aiButtonBaseClassnames)} asChild>
          <Button size="xsIcon">
            <DiamondPlus className="w-4 h-4 text-white" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex items-center justify-between w-full gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-foreground p-1 rounded-md">
                <BriefcaseBusinessIcon className="text-background w-3 h-3" />
              </div>
              <span className="text-[1rem] whitespace-nowrap overflow-hidden truncate">
                {jobTitle}
              </span>
            </div>
            <PopoverClose asChild>
              <Button size="xsIcon" variant="ghost">
                <CloseIcon />
              </Button>
            </PopoverClose>
          </div>
          <Button
            variant="outline"
            className="justify-between w-full px-1 mt-4"
            onClick={handleSuggestedTitleClick}
          >
            {suggestedJobTitle}
            <PlusIcon />
          </Button>
        </PopoverContent>
      </Popover>
    );
  },
);

export default WantedJobTitleSuggestionPopover;
