import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import {
  SettingsRow,
  SettingsSectionHeader,
} from '@/components/appHome/settings/SettingsShared';
import { Switch } from '@/components/ui/switch';
import type { EditorPreferences as Preferences } from '@/lib/client-db/clientDbSchema';
import { handleEditorPreferenceChange } from '@/lib/client-db/userSettingsService';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';

export const EditorPreferences = observer(() => {
  const [pending, setPending] = useState<Partial<Preferences>>({});
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const changePreference = async (key: keyof Preferences, checked: boolean) => {
    if (lock.current) {
      return;
    }
    lock.current = true;
    setPending({ [key]: checked });
    setError(null);
    try {
      await handleEditorPreferenceChange(key, checked);
    } catch {
      setError(
        'Your preference could not be saved. Please try the switch again.'
      );
    } finally {
      setPending({});
      lock.current = false;
    }
  };
  const busy = Object.keys(pending).length > 0;
  return (
    <div className='space-y-2'>
      <SettingsSectionHeader
        title='Editing'
        description='Choose when ZenCV asks you to confirm a deletion.'
      />
      <div>
        <SettingsRow
          label='Confirm before deleting an entry'
          htmlFor='askBeforeDeletingItem'
          description='Entries include a job, qualification, or skill.'
        >
          <Switch
            id='askBeforeDeletingItem'
            aria-describedby='askBeforeDeletingItem-description'
            className='before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[" "] relative'
            disabled={busy}
            checked={
              pending.askBeforeDeletingItem ??
              userSettingsStore.editorPreferences.askBeforeDeletingItem
            }
            onCheckedChange={(checked) =>
              void changePreference('askBeforeDeletingItem', checked)
            }
          />
        </SettingsRow>
        <SettingsRow
          label='Confirm before deleting a section'
          htmlFor='askBeforeDeletingSection'
          description='Sections include Work experience or Education, with all their entries.'
        >
          <Switch
            id='askBeforeDeletingSection'
            aria-describedby='askBeforeDeletingSection-description'
            className='before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[" "] relative'
            disabled={busy}
            checked={
              pending.askBeforeDeletingSection ??
              userSettingsStore.editorPreferences.askBeforeDeletingSection
            }
            onCheckedChange={(checked) =>
              void changePreference('askBeforeDeletingSection', checked)
            }
          />
        </SettingsRow>
      </div>
      {error && (
        <p role='alert' className='text-sm text-destructive'>
          {error}
        </p>
      )}
    </div>
  );
});
