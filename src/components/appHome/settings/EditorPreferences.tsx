import { observer } from 'mobx-react-lite';
import {
  SettingsRow,
  SettingsSectionHeader,
} from '@/components/appHome/settings/SettingsShared';
import { Switch } from '@/components/ui/switch';
import { handleEditorPreferenceChange } from '@/lib/client-db/userSettingsService';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';

export const EditorPreferences = observer(() => {
  return (
    <div className='space-y-6'>
      <SettingsSectionHeader
        title='Editor'
        description='Customize how the document builder behaves.'
      />
      <div className='space-y-1'>
        <SettingsRow
          label='Ask before deleting an item'
          htmlFor='askBeforeDeletingItem'
        >
          <Switch
            id='askBeforeDeletingItem'
            checked={userSettingsStore.editorPreferences.askBeforeDeletingItem}
            onCheckedChange={(checked) =>
              handleEditorPreferenceChange('askBeforeDeletingItem', checked)
            }
          />
        </SettingsRow>

        <SettingsRow
          label='Ask before deleting a section'
          htmlFor='askBeforeDeletingSection'
        >
          <Switch
            id='askBeforeDeletingSection'
            checked={
              userSettingsStore.editorPreferences.askBeforeDeletingSection
            }
            onCheckedChange={(checked) =>
              handleEditorPreferenceChange('askBeforeDeletingSection', checked)
            }
          />
        </SettingsRow>
      </div>
    </div>
  );
});
