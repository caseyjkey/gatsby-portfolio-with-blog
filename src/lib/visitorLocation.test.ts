import { beforeEach, describe, expect, test } from 'bun:test';
import { __test__, resolveVisitorLocation } from './visitorLocation';

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
});

describe('visitor location resolution', () => {
  beforeEach(() => __test__.resetCache());

  test('prefers the edge endpoint and shares one request across consumers', async () => {
    const urls: string[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      urls.push(String(input));
      return jsonResponse({
        country_code: 'US',
        city: 'Cheyenne',
        region: 'Wyoming',
        region_code: 'WY',
        latitude: 41.14,
        longitude: -104.82,
      });
    }) as typeof fetch;

    const [heroLocation, projectsLocation] = await Promise.all([
      resolveVisitorLocation(fetcher, 'https://geo.example.test/'),
      resolveVisitorLocation(fetcher, 'https://geo.example.test/'),
    ]);

    expect(urls).toEqual(['https://geo.example.test/']);
    expect(heroLocation).toEqual(projectsLocation);
    expect(heroLocation?.regionCode).toBe('WY');
  });

  test('falls back safely when edge and public lookups are unavailable', async () => {
    const urls: string[] = [];
    const fetcher = (async (input: string | URL | Request) => {
      const url = String(input);
      urls.push(url);
      if (url === 'https://geo.example.test/') return jsonResponse({}, 503);
      if (url === 'https://ipapi.co/json/') return jsonResponse({}, 429);
      return jsonResponse({ country: 'US' });
    }) as typeof fetch;

    expect(await resolveVisitorLocation(fetcher, 'https://geo.example.test/')).toEqual({
      code: 'US',
    });
    expect(urls).toEqual([
      'https://geo.example.test/',
      'https://ipapi.co/json/',
      '/analytics/you',
    ]);
  });
});
