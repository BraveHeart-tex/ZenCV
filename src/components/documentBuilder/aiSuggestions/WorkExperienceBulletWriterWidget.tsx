import { useAuth } from '@clerk/react';
import { Loader2Icon, SparklesIcon } from 'lucide-react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import type { EditorRef } from '@/components/richTextEditor/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { showErrorToast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { useBuilderAiSuggestions } from '@/hooks/useBuilderAiSuggestions';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CUSTOM_PROMPT_MAX_LENGTH } from '@/lib/constants';
import {
  getWorkExperienceDescriptionField,
  prepareWorkExperienceEntry,
} from '@/lib/helpers/documentBuilderHelpers';
import { builderRootStore } from '@/lib/stores/documentBuilder/builderRootStore';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';
import { removeHTMLTags } from '@/lib/utils/stringUtils';

const appendBulletsToHtml = (existingHtml: string, bullets: string[]) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(
    `<div id="root">${existingHtml}</div>`,
    'text/html'
  );
  const root = document.getElementById('root');

  if (!root) {
    return existingHtml;
  }

  const bulletList =
    root.querySelector('ul:last-of-type') ?? document.createElement('ul');

  if (!bulletList.parentElement) {
    root.appendChild(bulletList);
  }

  for (const bullet of bullets) {
    const listItem = document.createElement('li');
    listItem.textContent = bullet;
    bulletList.appendChild(listItem);
  }

  return root.innerHTML;
};

export const WorkExperienceBulletWriterWidget = observer(
  ({ itemId }: { itemId: number }) => {
    const [open, setOpen] = useState(false);
    const [roughNotes, setRoughNotes] = useState('');
    const [selectedBullets, setSelectedBullets] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const isMobile = useMediaQuery('(max-width: 1280px)', false);
    const { isSignedIn } = useAuth();
    const { generateWorkExperienceBullets, isGeneratingBullets } =
      useBuilderAiSuggestions();

    const workExperience = prepareWorkExperienceEntry(itemId);
    const descriptionField = getWorkExperienceDescriptionField(itemId);
    const jobPosting = builderRootStore.jobPostingStore.jobPosting || undefined;

    const currentDescriptionText = useMemo(() => {
      return descriptionField
        ? removeHTMLTags(descriptionField.value).trim()
        : '';
    }, [descriptionField]);

    if (
      !userSettingsStore.editorPreferences.showAiSuggestions ||
      !isSignedIn ||
      !workExperience ||
      !descriptionField
    ) {
      return null;
    }

    const toggleSelection = (bullet: string) => {
      setSelectedBullets((current) => {
        if (current.includes(bullet)) {
          return current.filter((value) => value !== bullet);
        }

        return [...current, bullet];
      });
    };

    const handleGenerate = async () => {
      const result = await generateWorkExperienceBullets({
        workExperience,
        jobPosting,
        roughNotes: roughNotes.trim() || undefined,
      });

      if (!result) {
        return;
      }

      setSuggestions(result.bulletSuggestions);
      setSelectedBullets(result.bulletSuggestions);
    };

    const handleApply = action(async () => {
      if (selectedBullets.length === 0) {
        showErrorToast('Choose at least one bullet point to insert.');
        return;
      }

      const nextValue = appendBulletsToHtml(
        descriptionField.value,
        selectedBullets
      );

      await builderRootStore.fieldStore.setFieldValue(
        descriptionField.id,
        nextValue
      );

      const editorRef = builderRootStore.UIStore.fieldRefs.get(
        descriptionField.id.toString()
      );

      (editorRef as EditorRef | undefined)?.setContent(nextValue);
      setOpen(false);
    });

    return (
      <div className='col-span-2 flex justify-start'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' size='sm' className='gap-2'>
              <SparklesIcon className='size-4' />
              Generate bullets
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side={isMobile ? 'top' : 'top'}
            align='start'
            className='w-[min(28rem,85vw)] space-y-4'
          >
            <div className='space-y-1'>
              <h3 className='scroll-m-20 text-xl font-semibold tracking-tight'>
                Bullet Point Writer
              </h3>
              <p className='text-muted-foreground text-sm'>
                Generate tailored bullet points for this role
                {jobPosting ? ` against ${jobPosting.jobTitle}.` : '.'}
              </p>
            </div>

            <div className='space-y-1'>
              <Label htmlFor={`rough-notes-${itemId}`}>Rough Notes</Label>
              <Textarea
                id={`rough-notes-${itemId}`}
                rows={4}
                value={roughNotes}
                onChange={(event) => setRoughNotes(event.target.value)}
                maxLength={CUSTOM_PROMPT_MAX_LENGTH}
                placeholder='Add quick context like wins, scope, tools, or results you want the bullets to emphasize.'
              />
              <p className='text-muted-foreground text-xs text-right'>
                {roughNotes.length} / {CUSTOM_PROMPT_MAX_LENGTH}
              </p>
            </div>

            {currentDescriptionText ? (
              <p className='text-muted-foreground text-xs'>
                Selected bullets will be appended to your current description.
              </p>
            ) : null}

            {suggestions.length > 0 ? (
              <div className='space-y-2'>
                <Label>Suggestions</Label>
                <div className='max-h-64 space-y-2 overflow-auto pr-1'>
                  {suggestions.map((bullet) => {
                    const selected = selectedBullets.includes(bullet);

                    return (
                      <button
                        type='button'
                        key={bullet}
                        className={`w-full rounded-md border p-3 text-left text-sm transition-colors ${
                          selected
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => toggleSelection(bullet)}
                      >
                        {bullet}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className='flex items-center justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => {
                  setOpen(false);
                }}
              >
                Close
              </Button>
              {suggestions.length > 0 ? (
                <Button
                  onClick={handleApply}
                  disabled={selectedBullets.length === 0}
                >
                  Insert selected
                </Button>
              ) : (
                <Button onClick={handleGenerate} disabled={isGeneratingBullets}>
                  {isGeneratingBullets ? (
                    <>
                      <Loader2Icon className='animate-spin' />
                      Generating
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
