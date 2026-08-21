/**
  * Pure utility function to calculate seek delta in milliseconds based on pan gesture offset X.
  * @param translationX Horizontal pan translation offset in pixels.
  * @param containerWidth Screen width in pixels.
  * @returns Seek delta in milliseconds.
  */
export function calculateSeekDelta(translationX: number, containerWidth: number = 360): number {
  if (containerWidth <= 0) return 0;
  const normalizedRatio = translationX / containerWidth;
  // Maximum seek preview per gesture is 90 seconds (90,000 ms)
  const deltaMs = Math.round(normalizedRatio * 90000);
  return deltaMs;
}

/**
 * Pure utility function to calculate volume/brightness gain based on vertical pan translation Y.
 * @param translationY Vertical pan translation offset in pixels (negative = upward swipe).
 * @param containerHeight Screen height in pixels.
 * @param sensitivity Multiplier for sensitivity (default 1.0).
 * @returns Delta percentage change (-1.0 to +1.0).
 */
export function calculateSensitivityValue(
  translationY: number,
  containerHeight: number = 720,
  sensitivity: number = 1.0,
): number {
  if (containerHeight <= 0) return 0;
  // Upward swipe (negative Y) increases value, downward swipe (positive Y) decreases value
  const deltaRatio = (-translationY / containerHeight) * sensitivity;
  return Math.max(-1.0, Math.min(1.0, deltaRatio));
}
