import * as AperturePip from '../../../modules/aperture-pip';

export const pipService = {
  enterPip: () => {
    try {
      AperturePip.enterPipMode();
    } catch (err) {
      console.warn('PiP not available in this environment:', err);
    }
  },
  isSupported: async () => {
    try {
      return await AperturePip.isPipSupported();
    } catch {
      return false;
    }
  },
};
