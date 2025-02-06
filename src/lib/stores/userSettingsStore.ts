import { makeAutoObservable, runInAction } from 'mobx';
import { liveQuery } from 'dexie';
import { clientDb } from '@/lib/client-db/clientDb';
import { EditorPreferences } from '../client-db/clientDbSchema';

const defaultSettings = {
  generalSettings: {
    language: 'en-US',
  },
  editorPreferences: {
    askBeforeDeletingItem: true,
    askBeforeDeletingSection: true,
    spellcheckEnabled: true,
  },
};

class UserSettingsStore {
  generalSettings = {
    language: 'en-US',
  };
  editorPreferences: EditorPreferences = {
    askBeforeDeletingItem: true,
    askBeforeDeletingSection: true,
    spellcheckEnabled: true,
  };
  constructor() {
    makeAutoObservable(this);
    this.startListening();
  }

  startListening() {
    liveQuery(() => clientDb.settings.toArray()).subscribe({
      next: (settings) => {
        runInAction(() => {
          const settingsMap = Object.fromEntries(
            settings.map((s) => [s.key, s.value]),
          );

          this.generalSettings.language =
            settingsMap.language ?? defaultSettings.generalSettings.language;

          this.editorPreferences =
            (settingsMap.editorPreferences as unknown as EditorPreferences) ??
            defaultSettings.editorPreferences;
        });
      },
      error: (err) => console.error('UserSettings.startListening error:', err),
    });
  }
}

const userSettingsStore = new UserSettingsStore();

export default userSettingsStore;
