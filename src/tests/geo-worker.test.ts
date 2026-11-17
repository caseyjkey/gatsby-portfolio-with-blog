import { describe, expect, test } from 'bun:test';
import worker from '../../cloudflare/geo-worker/src/index';

const requestWithLocation = (origin = 'https://keycasey.com') => {
  const request = new Request('https://geo.example.test/', { headers: { Origin: origin } });
  Object.defineProperty(request, 'cf', {
    value: {
      country: 'us',
      city: 'Cheyenne',
      region: 'Wyoming',
      regionCode: 'wy',
      latitude: '41.14000',
      longitude: '-104.82020',
    },
  });
  return request;
};

describe('Cloudflare geo Worker', () => {
  test('returns coarse location fields without exposing an IP address', async () => {
    const response = await worker.fetch(requestWithLocation());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://keycasey.com');
    expect(response.headers.get('Cache-Control')).toBe('private, max-age=300');
    expect(body).toEqual({
      country_code: 'US',
      city: 'Cheyenne',
      region: 'Wyoming',
      region_code: 'WY',
      latitude: 41.14,
      longitude: -104.82,
    });
    expect(JSON.stringify(body)).not.toContain('ip');
  });

  test('does not grant browser access to unrelated origins', async () => {
    const response = await worker.fetch(requestWithLocation('https://example.com'));
    expect(response.headers.has('Access-Control-Allow-Origin')).toBe(false);
  });

  test('fails harmlessly when Cloudflare has no location', async () => {
    const response = await worker.fetch(new Request('https://geo.example.test/'));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'location_unavailable' });
  });
});
