export type VisitorLocation = {
  code: string;
  city?: string;
  region?: string;
  regionCode?: string;
  latitude?: number;
  longitude?: number;
};

const API = (import.meta.env.PUBLIC_OPS_PULSE_API?.trim() || '/analytics').replace(/\/$/, '');
const GEO_API = import.meta.env.PUBLIC_GEO_API?.trim();
let locationPromise: Promise<VisitorLocation | null> | null = null;

function finiteNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

async function fetchLocation(
  fetcher: typeof fetch,
  endpoint: string,
): Promise<VisitorLocation | null> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetcher(endpoint, {
      headers: { Accept: 'application/json' },
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    });
    const data = response.ok ? await response.json() : null;
    if (!data?.country_code) return null;
    return {
      code: String(data.country_code).toUpperCase(),
      city: data.city || undefined,
      region: data.region || undefined,
      regionCode: data.region_code ? String(data.region_code).toUpperCase() : undefined,
      latitude: finiteNumber(data.latitude),
      longitude: finiteNumber(data.longitude),
    };
  } catch {
    return null;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

async function fetchCountryFallback(fetcher: typeof fetch): Promise<VisitorLocation | null> {
  try {
    const response = await fetcher(`${API}/you`, { headers: { Accept: 'application/json' } });
    const data = response.ok ? await response.json() : null;
    return data?.country ? { code: String(data.country).toUpperCase() } : null;
  } catch {
    return null;
  }
}

export function resolveVisitorLocation(
  fetcher: typeof fetch = window.fetch.bind(window),
  geoApi = GEO_API,
) {
  if (!locationPromise) {
    locationPromise = (async () => {
      if (geoApi) {
        const edgeLocation = await fetchLocation(fetcher, geoApi);
        if (edgeLocation) return edgeLocation;
      }
      return await fetchLocation(fetcher, 'https://ipapi.co/json/')
        ?? await fetchCountryFallback(fetcher);
    })();
  }
  return locationPromise;
}

export const __test__ = {
  finiteNumber,
  resetCache() {
    locationPromise = null;
  },
};
