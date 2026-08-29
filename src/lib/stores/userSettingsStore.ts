import { liveQuery } from 'dexie';
import { makeAutoObservable, runInAction } from 'mobx';
import { clientDb } from '@/lib/client-db/clientDb';
import type { EditorPreferences } from '../client-db/clientDbSchema';

type Language = 'en-US' | 'tr-TR';

interface GeneralSettings {
  language: Language;
}

interface UserSettingsState {
  generalSettings: GeneralSettings;
  editorPreferences: EditorPreferences;
}

const defaultSettings: UserSettingsState = {
  generalSettings: {
    language: 'en-US',
  },
  editorPreferences: {
    askBeforeDeletingItem: true,
    askBeforeDeletingSection: true,
  },
};

class UserSettingsStore {
  generalSettings: GeneralSettings = { ...defaultSettings.generalSettings };
  editorPreferences: EditorPreferences = {
    ...defaultSettings.editorPreferences,
  };

  constructor() {
    makeAutoObservable(this);
    this.startListening();
  }

  private startListening() {
    liveQuery(() => clientDb.settings.toArray()).subscribe({
      next: (settings) => {
        runInAction(() => {
          const settingsMap = Object.fromEntries(
            settings.map((s) => [s.key, s.value])
          ) as Partial<Record<keyof UserSettingsState | string, unknown>>;

          this.applySettingsFromDb(settingsMap);
        });
      },
      error: (err) =>
        console.error('UserSettingsStore startListening error:', err),
    });
  }

  private applySettingsFromDb(
    partialSettings: Partial<Record<string, unknown>>
  ) {
    this.generalSettings.language =
      (partialSettings.language as Language) ??
      defaultSettings.generalSettings.language;

    const storedEditorPreferences = partialSettings.editorPreferences as
      | Partial<EditorPreferences>
      | undefined;
    this.editorPreferences = {
      askBeforeDeletingItem:
        storedEditorPreferences?.askBeforeDeletingItem ??
        defaultSettings.editorPreferences.askBeforeDeletingItem,
      askBeforeDeletingSection:
        storedEditorPreferences?.askBeforeDeletingSection ??
        defaultSettings.editorPreferences.askBeforeDeletingSection,
    };
  }
}

export const userSettingsStore = new UserSettingsStore();
