import { liveQuery } from 'dexie';
import { makeAutoObservable, runInAction } from 'mobx';
import { clientDb } from '@/lib/client-db/clientDb';
import type { EditorPreferences } from '../client-db/clientDbSchema';

type Language = 'en-US' | 'tr-TR';

interface GeneralSettings {
  language: Language;
}

interface ModelSettings {
  customGenerateSummaryPrompt: string;
}

interface UserSettingsState {
  generalSettings: GeneralSettings;
  editorPreferences: EditorPreferences;
  modelSettings: ModelSettings;
}

const defaultSettings: UserSettingsState = {
  generalSettings: {
    language: 'en-US',
  },
  editorPreferences: {
    askBeforeDeletingItem: true,
    askBeforeDeletingSection: true,
    showAiSuggestions: true,
  },
  modelSettings: {
    customGenerateSummaryPrompt: '',
  },
};

class UserSettingsStore {
  generalSettings: GeneralSettings = { ...defaultSettings.generalSettings };
  editorPreferences: EditorPreferences = {
    ...defaultSettings.editorPreferences,
  };
  modelSettings: ModelSettings = { ...defaultSettings.modelSettings };

  constructor() {
    makeAutoObservable(this);
    this.startListening();
  }

  private applySettingsFromDb(
    partialSettings: Partial<Record<string, unknown>>
  ) {
    this.generalSettings.language =
      (partialSettings.language as Language) ??
      defaultSettings.generalSettings.language;

    this.editorPreferences = {
      ...defaultSettings.editorPreferences,
      ...(partialSettings.editorPreferences as Partial<EditorPreferences>),
    };

    this.modelSettings.customGenerateSummaryPrompt =
      (partialSettings.customGenerateSummaryPrompt as string) ??
      defaultSettings.modelSettings.customGenerateSummaryPrompt;
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
}

export const userSettingsStore = new UserSettingsStore();
