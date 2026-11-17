const ALLOWED_ORIGINS = new Set([
  'https://keycasey.com',
  'https://www.keycasey.com',
  'http://localhost:8001',
]);

type CloudflareRequest = Request & {
  cf?: {
    country?: string;
    city?: string;
    region?: string;
    regionCode?: string;
    latitude?: string | number;
    longitude?: string | number;
  };
};

const roundCoordinate = (value: string | number | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : undefined;
};

const responseHeaders = (origin: string | null) => {
  const headers = new Headers({
    'Cache-Control': 'private, max-age=300',
    'Content-Type': 'application/json; charset=utf-8',
    Vary: 'Origin',
    'X-Content-Type-Options': 'nosniff',
  });
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  }
  return headers;
};

export default {
  async fetch(request: CloudflareRequest): Promise<Response> {
    const origin = request.headers.get('Origin');
    const headers = responseHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== 'GET') {
      return Response.json({ error: 'method_not_allowed' }, { status: 405, headers });
    }

    const country = request.cf?.country?.trim().toUpperCase();
    if (!country || country === 'XX') {
      return Response.json({ error: 'location_unavailable' }, { status: 503, headers });
    }

    return Response.json(
      {
        country_code: country,
        city: request.cf?.city || undefined,
        region: request.cf?.region || undefined,
        region_code: request.cf?.regionCode?.trim().toUpperCase() || undefined,
        latitude: roundCoordinate(request.cf?.latitude),
        longitude: roundCoordinate(request.cf?.longitude),
      },
      { headers },
    );
  },
};
