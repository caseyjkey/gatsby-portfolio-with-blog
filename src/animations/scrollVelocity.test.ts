import { describe, expect, test } from 'bun:test';
import { getTimingScaleForSpeed } from './scrollVelocity';

describe('scroll-aware animation timing', () => {
  test('keeps the full animation timing for stationary and slow entry', () => {
    expect(getTimingScaleForSpeed(0)).toBe(1);
    expect(getTimingScaleForSpeed(240)).toBeCloseTo(0.935, 3);
  });

  test('accelerates animations as scroll speed increases', () => {
    expect(getTimingScaleForSpeed(1200)).toBeCloseTo(0.675, 3);
    expect(getTimingScaleForSpeed(2400)).toBe(0.35);
  });

  test('clamps extreme and invalid negative speeds', () => {
    expect(getTimingScaleForSpeed(10000)).toBe(0.35);
    expect(getTimingScaleForSpeed(-100)).toBe(1);
  });
});
