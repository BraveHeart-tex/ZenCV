'use client';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { observer } from 'mobx-react-lite';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import userSettingsStore from '@/lib/stores/userSettingsStore';
import { clientDb } from '@/lib/client-db/clientDb';
import SettingsDangerZone from './SettingsDangerZone';
import { Switch } from '@/components/ui/switch';

const SettingsPage = observer(() => {
  const handleLanguageChange = async (value: string) => {
    await clientDb.settings.put({ key: 'language', value });
  };

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
    <SidebarInset>
      <header className="shrink-0 flex items-center h-16 gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4 mr-2" />
          <span>Settings</span>
        </div>
      </header>
      <div className="flex flex-col flex-1 w-full max-w-2xl gap-8 p-6 mx-auto">
        {/* General Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">General Settings</h2>
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              defaultValue={userSettingsStore.generalSettings.language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="tr-TR">Türkçe (TR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Editor Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Ask before deleting an item</Label>
              <Switch
                checked={
                  userSettingsStore.editorPreferences.askBeforeDeletingItem
                }
                onCheckedChange={(checked) =>
                  handleEditorPreferenceChange('askBeforeDeletingItem', checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Ask before deleting a section</Label>
              <Switch
                checked={
                  userSettingsStore.editorPreferences.askBeforeDeletingSection
                }
                onCheckedChange={(checked) =>
                  handleEditorPreferenceChange(
                    'askBeforeDeletingSection',
                    checked,
                  )
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Enable spell check</Label>
              <Switch
                checked={userSettingsStore.editorPreferences.spellcheckEnabled}
                onCheckedChange={(checked) =>
                  handleEditorPreferenceChange('spellcheckEnabled', checked)
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        <SettingsDangerZone />
      </div>
    </SidebarInset>
  );
});

export default SettingsPage;
