import { userSettingsStore } from '../stores/userSettingsStore';
import { clientDb } from './clientDb';

export async function handleEditorPreferenceChange(
  key: keyof typeof userSettingsStore.editorPreferences,
  value: boolean
) {
  const newPreferences = {
    ...userSettingsStore.editorPreferences,
    [key]: value,
  };
  await clientDb.settings.put({
    key: 'editorPreferences',
    value: newPreferences as unknown as string,
  });
}
