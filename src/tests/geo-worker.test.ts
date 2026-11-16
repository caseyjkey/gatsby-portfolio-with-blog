import { describe, expect, test } from 'bun:test';
import worker from '../../cloudflare/geo-worker/src/index';

const requestWithLocation = (origin = 'https://keycasey.com') => {
  const request = new Request('https://geo.example.test/', { headers: { Origin: origin } });
  Object.defineProperty(request, 'cf', {
    value: {
      country: 'us',
      city: 'Belmont',
      region: 'California',
      latitude: '37.52037',
      longitude: '-122.27580',
    },
  });
  return request;
};

describe('Cloudflare geo Worker', () => {
  test('returns only coarse location fields to the portfolio origin', async () => {
    const response = await worker.fetch(requestWithLocation());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://keycasey.com');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(body).toEqual({
      country_code: 'US',
      city: 'Belmont',
      region: 'California',
      latitude: 37.52,
      longitude: -122.28,
    });
    expect(JSON.stringify(body)).not.toContain('ip');
  });

  test('does not grant browser access to unrelated origins', async () => {
    const response = await worker.fetch(requestWithLocation('https://example.com'));
    expect(response.headers.has('Access-Control-Allow-Origin')).toBe(false);
  });

  test('fails harmlessly when Cloudflare has no location', async () => {
    const request = new Request('https://geo.example.test/');
    const response = await worker.fetch(request);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'location_unavailable' });
  });
});
