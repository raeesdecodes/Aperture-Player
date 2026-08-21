export const EQUALIZER_FREQUENCIES = [
  '31Hz',
  '63Hz',
  '125Hz',
  '250Hz',
  '500Hz',
  '1kHz',
  '2kHz',
  '4kHz',
  '8kHz',
  '16kHz',
];

export interface EqualizerPreset {
  id: string;
  name: string;
  bands: number[]; // 10 values from -12 to +12 (dB)
}

export const PRESET_LIST: EqualizerPreset[] = [
  { id: 'flat', name: 'Flat', bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { id: 'bass_boost', name: 'Bass Boost', bands: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0] },
  { id: 'vocal', name: 'Vocal', bands: [-2, -1, 1, 3, 4, 4, 3, 1, 0, -1] },
  { id: 'rock', name: 'Rock', bands: [4, 3, 2, 0, -1, 0, 1, 3, 4, 5] },
  { id: 'jazz', name: 'Jazz', bands: [3, 2, 1, 2, -1, -1, 0, 1, 2, 3] },
  { id: 'classical', name: 'Classical', bands: [4, 3, 2, 2, -1, -1, 0, 2, 3, 4] },
  { id: 'pop', name: 'Pop', bands: [-1, 1, 3, 4, 4, 3, 1, 0, -1, -2] },
  { id: 'electronic', name: 'Electronic', bands: [5, 4, 2, 0, -1, 2, 1, 3, 4, 4] },
];
