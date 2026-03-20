import { useUser } from '@clerk/react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { SettingsSectionHeader } from '@/components/appHome/settings/SettingsShared';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { clientDb } from '@/lib/client-db/clientDb';
import { CUSTOM_PROMPT_MAX_LENGTH } from '@/lib/constants';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';

export const ModelCustomizationSettings = observer(() => {
  const { isSignedIn } = useUser();
  const debouncedSavePrompt = useDebouncedCallback(handleSavePrompt);

  if (!isSignedIn || !userSettingsStore.editorPreferences.showAiSuggestions) {
    return null;
  }

  const handlePromptChange = action(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      userSettingsStore.modelSettings.customGenerateSummaryPrompt =
        event.target.value;
      debouncedSavePrompt(event.target.value);
    }
  );

  function handleSavePrompt(value: string) {
    clientDb.settings.put({ key: 'customGenerateSummaryPrompt', value });
  }

  const charCount =
    userSettingsStore.modelSettings.customGenerateSummaryPrompt.length;
  const isNearLimit = charCount > CUSTOM_PROMPT_MAX_LENGTH * 0.85;

  return (
    <div className='space-y-6'>
      <SettingsSectionHeader
        title='AI Model'
        description='Provide custom instructions to tailor how your CV summary is generated.'
      />
      <div className='space-y-2'>
        <Label htmlFor='customPrompt'>
          Custom prompt for summary generation
        </Label>
        <Textarea
          rows={8}
          id='customPrompt'
          value={userSettingsStore.modelSettings.customGenerateSummaryPrompt}
          onChange={handlePromptChange}
          maxLength={CUSTOM_PROMPT_MAX_LENGTH}
          placeholder='e.g. "Emphasize my full-stack experience", "Use a professional yet friendly tone", or "Focus on team leadership achievements."'
          className='resize-none bg-muted/30 border-border/60 focus:border-border transition-colors'
        />
        <p
          className={`text-xs text-right tabular-nums ${isNearLimit ? 'text-amber-500' : 'text-muted-foreground'}`}
        >
          {charCount} / {CUSTOM_PROMPT_MAX_LENGTH}
        </p>
      </div>
    </div>
  );
});
