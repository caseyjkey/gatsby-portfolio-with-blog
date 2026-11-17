import { describe, expect, test } from 'bun:test';
import {
  distanceMiles,
  getRegionalProfileById,
  selectRegionalProfile,
  type RegionalProfileId,
} from './regionalProfiles';

describe('regional portfolio profiles', () => {
  test.each<[RegionalProfileId, number, number]>([
    ['nyc', 40.7128, -74.006],
    ['dc', 38.9072, -77.0369],
    ['miami', 25.7617, -80.1918],
    ['la', 34.0522, -118.2437],
    ['sf', 37.7749, -122.4194],
    ['colorado', 40.015, -105.12],
  ])('selects %s at its market center', (id, latitude, longitude) => {
    expect(selectRegionalProfile(latitude, longitude).id).toBe(id);
  });

  test('keeps visitors outside the specialized markets on generic content', () => {
    expect(selectRegionalProfile(39.7392, -104.9903).id).toBe('colorado');
    expect(selectRegionalProfile(41.14, -104.82).id).toBe('generic');
    expect(selectRegionalProfile(undefined, undefined).id).toBe('generic');
  });

  test('matches Wyoming by state instead of a circle that would spill into Colorado', () => {
    expect(selectRegionalProfile(41.14, -104.82, 'WY').id).toBe('wyoming');
    expect(selectRegionalProfile(44.29, -105.5, 'wy').id).toBe('wyoming');
  });

  test('uses the nearest market when coverage areas overlap', () => {
    expect(selectRegionalProfile(39.9526, -75.1652).id).toBe('nyc');
  });

  test('supports explicit preview and generic override ids', () => {
    expect(getRegionalProfileById('sf').id).toBe('sf');
    expect(getRegionalProfileById('generic').id).toBe('generic');
    expect(getRegionalProfileById('wyoming').id).toBe('wyoming');
    expect(getRegionalProfileById('colorado').id).toBe('colorado');
    expect(getRegionalProfileById('unknown').id).toBe('generic');
  });

  test('computes realistic great-circle distance', () => {
    const distance = distanceMiles(40.7128, -74.006, 38.9072, -77.0369);
    expect(distance).toBeGreaterThan(200);
    expect(distance).toBeLessThan(210);
  });
});
