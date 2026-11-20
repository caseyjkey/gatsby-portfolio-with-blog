import { describe, expect, test } from 'bun:test';
import {
  buildMobileMorphLinks,
  stepMobileNeighborMorph,
  type MorphMote,
} from './mobileAsciiMorph';

describe('mobile ASCII neighbor morph', () => {
  test('passes displacement through glyph neighbors instead of stopping at the touch zone', () => {
    // Four glyph islands with whitespace between them model separate letters.
    const points = [0, 4, 8, 28, 32, 36, 56, 60, 64, 84, 88, 92].map((x) => ({ x, y: 0 }));
    const links = buildMobileMorphLinks(points, 4);
    let motes: MorphMote[] = [{ pointIndex: 0, x: 14, y: 0, vx: 2, vy: 0 }];
    let farDisplacement = 0;

    for (let frame = 0; frame < 40; frame += 1) {
      motes = stepMobileNeighborMorph(points, links, motes, points.length);
      for (const mote of motes) {
        if (mote.pointIndex < 9) continue;
        farDisplacement = Math.max(
          farDisplacement,
          Math.hypot(mote.x - points[mote.pointIndex].x, mote.y - points[mote.pointIndex].y),
        );
      }
    }

    expect(farDisplacement).toBeGreaterThan(0.03);
  });

  test('decays the coupled word back to its resting shape', () => {
    const points = Array.from({ length: 12 }, (_, index) => ({ x: index * 4, y: 0 }));
    const links = buildMobileMorphLinks(points, 4);
    let motes: MorphMote[] = [{ pointIndex: 0, x: 12, y: 0, vx: 1, vy: 0 }];

    for (let frame = 0; frame < 240; frame += 1) {
      motes = stepMobileNeighborMorph(points, links, motes, points.length);
    }

    expect(motes).toHaveLength(0);
  });
});
