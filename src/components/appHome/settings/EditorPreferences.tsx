'use client';
import { observer } from 'mobx-react-lite';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import userSettingsStore from '@/lib/stores/userSettingsStore';
import { clientDb } from '@/lib/client-db/clientDb';

const EditorPreferences = observer(() => {
  const handleEditorPreferenceChange = async (
    key: keyof typeof userSettingsStore.editorPreferences,
    value: boolean,
  ) => {
    const newPreferences = {
      ...userSettingsStore.editorPreferences,
      [key]: value,
    };
    await clientDb.settings.put({
      key: 'editorPreferences',
      value: newPreferences as unknown as string,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Editor Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="askBeforeDeletingItem">
            Ask before deleting an item
          </Label>
          <Switch
            id="askBeforeDeletingItem"
            checked={userSettingsStore.editorPreferences.askBeforeDeletingItem}
            onCheckedChange={(checked) =>
              handleEditorPreferenceChange('askBeforeDeletingItem', checked)
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="askBeforeDeletingSection">
            Ask before deleting a section
          </Label>
          <Switch
            id="askBeforeDeletingSection"
            checked={
              userSettingsStore.editorPreferences.askBeforeDeletingSection
            }
            onCheckedChange={(checked) =>
              handleEditorPreferenceChange('askBeforeDeletingSection', checked)
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="enableSpellCheck">Enable spell check</Label>
          <Switch
            id="enableSpellCheck"
            checked={userSettingsStore.editorPreferences.spellcheckEnabled}
            onCheckedChange={(checked) =>
              handleEditorPreferenceChange('spellcheckEnabled', checked)
            }
          />
        </div>
      </div>
    </div>
  );
});

export default EditorPreferences;
