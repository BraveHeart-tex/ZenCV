import { runInAction } from 'mobx';
import { userSettingsStore } from '../stores/userSettingsStore';
import { clientDb } from './clientDb';
import type { EditorPreferences } from './clientDbSchema';

export async function handleEditorPreferenceChange(
  key: keyof EditorPreferences,
  value: boolean
) {
  const newPreferences = await clientDb.transaction(
    'rw',
    clientDb.settings,
    async () => {
      const stored = await clientDb.settings.get('editorPreferences');
      const existing = stored?.value;
      const preferences = {
        ...userSettingsStore.editorPreferences,
        ...(typeof existing === 'object' && existing !== null ? existing : {}),
        [key]: value,
      };
      await clientDb.settings.put({
        key: 'editorPreferences',
        value: preferences as unknown as string,
      });
      return preferences;
    }
  );
  runInAction(() => {
    userSettingsStore.editorPreferences = newPreferences;
  });
}
