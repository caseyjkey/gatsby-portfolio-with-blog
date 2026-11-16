import { describe, expect, test } from 'bun:test';
import { sampleAsciiRippleField } from './asciiRipple';

describe('ASCII full-word ripple field', () => {
  test('carries meaningful force from the input point to far glyphs across the word', () => {
    const source = [{ x: 0, y: 0, bornAt: 0 }];
    const near = sampleAsciiRippleField(32, 0, source, 60);
    const middle = sampleAsciiRippleField(260, 35, source, 500);
    const far = sampleAsciiRippleField(500, 0, source, 870);

    expect(near.strength).toBeGreaterThan(0.05);
    expect(middle.strength).toBeGreaterThan(0.05);
    expect(far.strength).toBeGreaterThan(0.035);
  });

  test('travels outward over time and keeps tangential motion', () => {
    const source = [{ x: 0, y: 0, bornAt: 100 }];
    const point = { x: 300, y: 0 };
    const beforeWave = sampleAsciiRippleField(point.x, point.y, source, 120);
    const atWave = sampleAsciiRippleField(point.x, point.y, source, 625);
    const afterWave = sampleAsciiRippleField(point.x, point.y, source, 900);

    expect(atWave.strength).toBeGreaterThan(beforeWave.strength);
    expect(atWave.strength).toBeGreaterThan(afterWave.strength);
    expect(Math.abs(atWave.y)).toBeGreaterThan(0.01);
  });

  test('overlapping trail sources blend into one bounded field', () => {
    const single = sampleAsciiRippleField(240, 40, [{ x: 0, y: 0, bornAt: 100 }], 520);
    const overlapping = sampleAsciiRippleField(240, 40, [
      { x: 0, y: 0, bornAt: 100 },
      { x: 40, y: 0, bornAt: 180 },
      { x: 80, y: 0, bornAt: 260 },
    ], 520);

    expect(overlapping.strength).toBeGreaterThan(0.02);
    expect(overlapping.strength).toBeLessThan(1.2);
    expect(single.strength).toBeGreaterThan(0);
  });
});
