# Regional portfolio personalization

This branch keeps the deployed portfolio generic by default, then selects a
market-specific positioning profile in the browser when a visitor is close to
one of seven professional regions.

## Product boundary

- The portfolio repository owns all positioning copy and project ordering.
- Location lookup is read-only. It does not create a profile or persist a
  visitor's selected market beyond a private five-minute HTTP cache.
- A failed lookup, an international visitor, or a visitor outside a configured
  radius receives the existing general portfolio.
- The first slice personalizes the hero role, three supporting messages, the
  featured-work heading, and the order of three existing public projects.
- It does not personalize the resume, experience timeline, skills section,
  navigation, SEO metadata, or gated Konami projects.

## Market coverage

| Profile | Center | Radius | Positioning |
| --- | --- | ---: | --- |
| `nyc` | New York City | 175 mi | Financial data and platforms |
| `dc` | Washington, DC | 100 mi | Secure cloud and DevOps |
| `miami` | Miami | 125 mi | AI products and Web3 |
| `la` | Los Angeles | 120 mi | Commerce and consumer platforms |
| `sf` | San Francisco | 120 mi | AI products and platforms |
| `wyoming` | Wyoming state boundary | State | Rural technology, IoT, and traceable systems |
| `colorado` | Boulder / Front Range | 65 mi | Community and startup technology |

The original 300-mile idea was reduced because it would make New York and
Washington overlap heavily and would label distant markets as local. When two
configured circles overlap, the nearest market center wins.

Wyoming uses the state code from the same browser-side location response rather
than a radius. A state-shaped region avoids either missing distant Wyoming
communities or spilling a large circle into the Colorado Front Range. Colorado
uses a 65-mile circle centered near Boulder to cover Denver, Boulder, Fort
Collins, and Loveland without treating the entire state as one job market.

## Copy guardrails

Regional copy may reframe demonstrated work, but it must not invent experience.
In particular, this version does not claim fraud detection, recommendation
engines, national-security delivery, model benchmarking, or model-serving cost
optimization. The Wyoming copy also does not claim completed crop prediction,
livestock tracking, satellite analysis, or oil-and-gas monitoring projects. It
positions demonstrated IoT, telemetry, data, blockchain, and web-product skills
for those industries without inventing domain delivery. Those stronger claims
can be added only when a project or experience item supports them.

## Preview and correction

Use `?region=<id>` to preview a profile without changing physical location:

- `?region=generic`
- `?region=nyc`
- `?region=dc`
- `?region=miami`
- `?region=la`
- `?region=sf`
- `?region=wyoming`
- `?region=colorado`

Removing the query parameter restores automatic selection. The explicit
`generic` value is the correction/opt-out path for a shared preview URL.
Automatic selection never adds a query parameter, redirects the visitor, or
labels the page as personalized. The override is only present when a tester
manually enters or shares one of the preview URLs.

## Refinement checklist

Before release, review each profile against the target job descriptions and
decide whether any currently gated projects should become public. Later work
can add regional skills or experience emphasis, but should preserve one source
of truth and avoid creating separate regional resumes that drift.

## Performance

Against commit `d38594a`, the regional system adds about 2.9 KB gzip to the
home-page HTML and 3.8 KB gzip to the JavaScript requested by the page: roughly
6.7 KB gzip total. It reuses one shared location promise across the hero,
featured work, and Ops Pulse, so personalization does not create an additional
lookup. The page serializes only projects that at least one regional profile can
feature rather than the entire portfolio.

The public `ipapi.co` fallback returned HTTP 429 during the 2026-11-16 benchmark
and is not reliable enough for the primary path. The included Cloudflare Worker
returns Cloudflare's coarse edge geolocation without storing or returning an IP
address. Deploy it with `bun run deploy:geo`, set the resulting URL as the
repository variable `PUBLIC_GEO_API`, and rebuild the portfolio. The fallback
remains available for resilience, but is skipped when the edge response works.

Generic HTML still renders immediately. On a first visit, specialized content
appears after hydration and the edge lookup; exact live latency must be measured
after the Worker has been deployed. Delivering specialized HTML in the initial
response would require moving the static portfolio behind an edge-rendering
layer and is intentionally deferred from this draft.
