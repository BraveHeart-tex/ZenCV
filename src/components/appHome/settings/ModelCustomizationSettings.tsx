'use client';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { clientDb } from '@/lib/client-db/clientDb';
import userSettingsStore from '@/lib/stores/userSettingsStore';
import { useUser } from '@clerk/nextjs';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';

const ModelCustomizationSettings = observer(() => {
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
    },
  );

  function handleSavePrompt(value: string) {
    clientDb.settings.put({
      key: 'customGenerateSummaryPrompt',
      value,
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">AI Model Settings</h2>
        <p className="text-muted-foreground text-sm">
          Provide custom instructions to tailor your CV summary.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="customPrompt">Custom Prompt for Generate Summary</Label>
        <Textarea
          rows={10}
          id="customPrompt"
          value={userSettingsStore.modelSettings.customGenerateSummaryPrompt}
          onChange={handlePromptChange}
          placeholder='E.g. "Emphasize my full-stack development experience", "Use a professional yet friendly tone", or "Focus on achievements in team leadership and Agile delivery".'
        />
      </div>
    </div>
  );
});

export default ModelCustomizationSettings;
