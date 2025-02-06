import { makeAutoObservable, runInAction } from 'mobx';
import { liveQuery } from 'dexie';
import { clientDb } from '@/lib/client-db/clientDb';
import { EditorPreferences } from '../client-db/clientDbSchema';

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
          const editorPreferences = settings.find(
            (s) => s.key === 'editorPreferences',
          );

          const language = settings.find((s) => s.key === 'language')?.value;

          if (language) {
            this.generalSettings.language = language;
          }

          this.editorPreferences =
            editorPreferences?.value as unknown as EditorPreferences;
        });
      },
      error: (err) => console.error('Dexie liveQuery error:', err),
    });
  }
}

const userSettingsStore = new UserSettingsStore();

export default userSettingsStore;
