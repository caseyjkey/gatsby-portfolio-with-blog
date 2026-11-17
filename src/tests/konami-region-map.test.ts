import { describe, expect, test } from 'bun:test';
import { REGION_MAP_TARGETS } from '../components/Introduction/OpsPulse';
import { regionalProfiles, type RegionalProfileId } from '../data/regionalProfiles';

describe('Konami region map selector', () => {
  test('exposes one projected target for every specialized market', () => {
    const specializedIds = regionalProfiles
      .map((profile) => profile.id)
      .filter((id): id is Exclude<RegionalProfileId, 'generic'> => id !== 'generic')
      .sort();

    expect(REGION_MAP_TARGETS.map((target) => target.id).sort()).toEqual(specializedIds);
  });

  test('keeps every label in the world-map viewBox', () => {
    for (const target of REGION_MAP_TARGETS) {
      expect(target.labelX).toBeGreaterThan(35);
      expect(target.labelX).toBeLessThan(915);
      expect(target.labelY).toBeGreaterThan(22);
      expect(target.labelY).toBeLessThan(598);
    }
  });
});
