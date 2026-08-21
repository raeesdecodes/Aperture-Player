import * as FileSystem from 'expo-file-system/legacy';

const SUBTITLE_EXTENSIONS = ['.srt', '.ass', '.vtt', '.sub', '.SRT', '.ASS', '.VTT'];

export async function detectLocalSubtitle(mediaUri: string): Promise<string | null> {
  try {
    if (!mediaUri || !mediaUri.includes('/')) {
      return null;
    }

    const lastSlashIndex = mediaUri.lastIndexOf('/');
    const dir = mediaUri.substring(0, lastSlashIndex + 1);
    const filenameWithExt = mediaUri.substring(lastSlashIndex + 1);
    const lastDotIndex = filenameWithExt.lastIndexOf('.');

    const basename =
      lastDotIndex > 0 ? filenameWithExt.substring(0, lastDotIndex) : filenameWithExt;

    for (const ext of SUBTITLE_EXTENSIONS) {
      const candidateUri = `${dir}${basename}${ext}`;
      try {
        const info = await FileSystem.getInfoAsync(candidateUri);
        if (info.exists) {
          return candidateUri;
        }
      } catch {
        // Continue checking candidates
      }
    }
  } catch (err) {
    console.warn('Failed local subtitle detection:', err);
  }
  return null;
}
