export interface SubtitleTrack {
  id: string;
  name: string;
  language?: string;
  type: 'local' | 'embedded' | 'remote';
  uri?: string;
}
