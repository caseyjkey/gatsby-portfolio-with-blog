import { describe, expect, test } from 'bun:test';
import {
  buildMobileMorphLinks,
  stepMobileNeighborMorph,
  type MorphMote,
} from './mobileAsciiMorph';

describe('mobile ASCII neighbor morph', () => {
  test('passes displacement to nearby glyphs without recruiting the far side', () => {
    // Four glyph islands with whitespace between them model separate letters.
    const points = [0, 4, 8, 28, 32, 36, 56, 60, 64, 84, 88, 92].map((x) => ({ x, y: 0 }));
    const links = buildMobileMorphLinks(points, 4);
    let motes: MorphMote[] = [{ pointIndex: 0, x: 14, y: 0, vx: 2, vy: 0 }];
    let neighborDisplacement = 0;
    let farDisplacement = 0;

    for (let frame = 0; frame < 40; frame += 1) {
      motes = stepMobileNeighborMorph(points, links, motes, points.length, {
        x: 0,
        y: 0,
        radius: 42,
      });
      for (const mote of motes) {
        const displacement = Math.hypot(
          mote.x - points[mote.pointIndex].x,
          mote.y - points[mote.pointIndex].y,
        );
        if (mote.pointIndex >= 3 && mote.pointIndex < 6) {
          neighborDisplacement = Math.max(neighborDisplacement, displacement);
        }
        if (mote.pointIndex >= 9) farDisplacement = Math.max(farDisplacement, displacement);
      }
    }

    expect(neighborDisplacement).toBeGreaterThan(0.03);
    expect(farDisplacement).toBe(0);
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
