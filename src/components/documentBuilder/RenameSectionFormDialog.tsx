'use client';
import { DEX_Section } from '@/lib/client-db/clientDbSchema';
import { documentBuilderStore } from '@/lib/stores/documentBuilder/documentBuilderStore';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { FormEvent, useRef, useState } from 'react';
import { showErrorToast, showSuccessToast } from '../ui/sonner';
import ResponsiveDialog from '../ui/ResponsiveDialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PencilIcon } from 'lucide-react';
import { cn } from '@/lib/utils/stringUtils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { dialogFooterClassNames } from '@/lib/constants';

interface RenameSectionFormDialogProps {
  sectionId: DEX_Section['id'];
}

const RenameSectionFormDialog = observer(
  ({ sectionId }: RenameSectionFormDialogProps) => {
    const [open, setOpen] = useState(false);
    const section = documentBuilderStore.getSectionById(sectionId)!;

    const [enteredTitle, setEnteredTitle] = useState(section.title || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleRenameSectionSubmit = action(async (event: FormEvent) => {
      event.preventDefault();
      if (!enteredTitle.replaceAll(' ', '').trim()) {
        showErrorToast('New section title cannot be empty.');
        inputRef?.current?.focus();
        return;
      }

      await documentBuilderStore.renameSection(sectionId, enteredTitle);
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
      >
        <form onSubmit={handleRenameSectionSubmit} className="space-y-4">
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
              type="submit"
              aria-label="Rename section"
              disabled={!enteredTitle}
            >
              Rename
            </Button>
          </div>
        </form>
      </ResponsiveDialog>
    );
  },
);

export default RenameSectionFormDialog;
