export type AppTheme = 'dark' | 'amoled' | 'light' | 'system';

export interface AppSettings {
  theme: AppTheme;
  gestureSensitivity: number; // 0.5 to 2.0
  defaultSubtitleLanguage: string; // e.g. 'en', 'es'
  autoAdvanceFolder: boolean;
}
