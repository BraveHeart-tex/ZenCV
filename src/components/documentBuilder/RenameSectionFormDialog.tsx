'use client';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import ResponsiveDialog from '@/components/ui/ResponsiveDialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PencilIcon } from 'lucide-react';
import { cn } from '@/lib/utils/stringUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dialogFooterClassNames } from '@/lib/constants';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';

interface RenameSectionFormDialogProps {
  sectionId: DEX_Section['id'];
}

const RenameSectionFormDialog = observer(
  ({ sectionId }: RenameSectionFormDialogProps) => {
    const [open, setOpen] = useState(false);
    const section = builderRootStore.sectionStore.getSectionById(sectionId)!;

    const [enteredTitle, setEnteredTitle] = useState(section.title || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleRenameSectionSubmit = action(async () => {
      if (!enteredTitle.replaceAll(' ', '').trim()) {
        showErrorToast('New section title cannot be empty.');
        inputRef?.current?.focus();
        return;
      }

      await builderRootStore.sectionStore.renameSection(
        sectionId,
        enteredTitle,
      );
      showSuccessToast('Section renamed successfully');
      setOpen(false);
    });

    return (
      <ResponsiveDialog
        title={`Rename "${section.title}"`}
        description="Use the form below to rename the selected section"
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setEnteredTitle(section.title);
                  setOpen(true);
                }}
              >
                <PencilIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rename {`"${section.title}"`}</TooltipContent>
          </Tooltip>
        }
        footer={
          <div className={dialogFooterClassNames}>
            <Button
              type="button"
              aria-label="Close rename section dialog"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              aria-label="Rename section"
              disabled={!enteredTitle}
              onClick={handleRenameSectionSubmit}
            >
              Rename
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="newSectionTitle">New Section Title</Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id="newSectionTitle"
                type="text"
                minLength={1}
                required
                aria-invalid={enteredTitle ? 'false' : 'true'}
                value={enteredTitle}
                onChange={(event) => setEnteredTitle(event.target.value)}
                className={cn(
                  !enteredTitle &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
            </div>
            {!enteredTitle && (
              <p className="text-destructive text-sm font-medium">
                New section title cannot be empty
              </p>
            )}
          </div>
        </div>
      </ResponsiveDialog>
    );
  },
);

export default RenameSectionFormDialog;
