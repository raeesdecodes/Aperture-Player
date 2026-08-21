import { enterPipMode as nativeEnterPipMode, isPipSupported as nativeIsPipSupported } from '../../../modules/aperture-pip';

export async function isPipSupported(): Promise<boolean> {
  return await nativeIsPipSupported();
}

export async function enterPipMode(): Promise<boolean> {
  const supported = await isPipSupported();
  if (!supported) return false;
  return await nativeEnterPipMode();
}
