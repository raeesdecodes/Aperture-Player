import { calculateSeekDelta, calculateSensitivityValue } from '../src/core/utils/gestureUtils';

describe('gestureUtils', () => {
  describe('calculateSeekDelta', () => {
    it('returns 0 for zero horizontal movement', () => {
      expect(calculateSeekDelta(0, 360)).toBe(0);
    });

    it('calculates positive seek delta for rightward swipe', () => {
      const delta = calculateSeekDelta(180, 360); // half screen width
      expect(delta).toBe(45000); // 45 seconds
    });

    it('calculates negative seek delta for leftward swipe', () => {
      const delta = calculateSeekDelta(-180, 360);
      expect(delta).toBe(-45000); // -45 seconds
    });
  });

  describe('calculateSensitivityValue', () => {
    it('returns positive delta for upward swipe', () => {
      const value = calculateSensitivityValue(-360, 720, 1.0);
      expect(value).toBe(0.5); // +50%
    });

    it('returns negative delta for downward swipe', () => {
      const value = calculateSensitivityValue(360, 720, 1.0);
      expect(value).toBe(-0.5); // -50%
    });

    it('applies sensitivity multiplier correctly', () => {
      const valueNormal = calculateSensitivityValue(-360, 720, 1.0);
      const valueDouble = calculateSensitivityValue(-360, 720, 2.0);
      expect(valueDouble).toBe(valueNormal * 2);
    });
  });
});
