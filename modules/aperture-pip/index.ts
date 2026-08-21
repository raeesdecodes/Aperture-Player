import { requireNativeModule } from 'expo-modules-core';

const AperturePipNative = requireNativeModule('AperturePip');

export async function isPipSupported(): Promise<boolean> {
  try {
    return await AperturePipNative.isPipSupported();
  } catch {
    return false;
  }
}

export async function enterPipMode(): Promise<boolean> {
  try {
    return await AperturePipNative.enterPipMode();
  } catch {
    return false;
  }
}
