import { create } from 'zustand';
import { PRESET_LIST, EqualizerPreset } from '../domain/types/equalizerPreset';
import { vlcPlayerService } from '../data/services/vlcPlayerService';

export interface EqualizerStore {
  isEnabled: boolean;
  bands: number[];
  selectedPresetId: string;

  toggleEnabled: () => void;
  setBandGain: (index: number, gain: number) => void;
  applyPreset: (presetId: string) => void;
  resetEqualizer: () => void;
}

const DEFAULT_BANDS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const useEqualizerStore = create<EqualizerStore>((set, get) => ({
  isEnabled: true,
  bands: [...DEFAULT_BANDS],
  selectedPresetId: 'flat',

  toggleEnabled: () => {
    const newEnabled = !get().isEnabled;
    set({ isEnabled: newEnabled });
    vlcPlayerService.setEqualizerEnabled(newEnabled);
  },

  setBandGain: (index: number, gain: number) => {
    const clampedGain = Math.max(-12, Math.min(12, gain));
    const newBands = [...get().bands];
    newBands[index] = clampedGain;
    set({ bands: newBands, selectedPresetId: 'custom' });

    if (get().isEnabled) {
      vlcPlayerService.setEqualizerBands(newBands);
    }
  },

  applyPreset: (presetId: string) => {
    const preset = PRESET_LIST.find((p) => p.id === presetId);
    if (preset) {
      const newBands = [...preset.bands];
      set({ bands: newBands, selectedPresetId: presetId });
      if (get().isEnabled) {
        vlcPlayerService.setEqualizerBands(newBands);
      }
    }
  },

  resetEqualizer: () => {
    set({ bands: [...DEFAULT_BANDS], selectedPresetId: 'flat' });
    if (get().isEnabled) {
      vlcPlayerService.setEqualizerBands(DEFAULT_BANDS);
    }
  },
}));
