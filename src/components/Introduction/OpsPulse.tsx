import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import './ops-pulse.scss';
import COUNTRY_CODES from './country-codes.json';

const MAP_VIEWBOX = { w: 950, h: 620 };
// The overlay SVG shares the map artwork's own coordinate space so markers and
// labels are never stretched by a mismatched viewBox.
const MAP_SCALE = { x: MAP_VIEWBOX.w / 100, y: MAP_VIEWBOX.h / 100 };
const MAP_PROJECTION_VERSION = 2;
const COUNTRY_ANCHORS = COUNTRY_CODES as unknown as Record<string, readonly [number, number]>;
// Direct local/tailnet previews do not pass through a geo-aware edge proxy.
// Keep the current visitor visible in that environment instead of leaving the
// UI stuck on "LOCATING…". Production visitors still use their ISO country.
const PREVIEW_ANCHORS: Record<string, readonly [number, number]> = {
  LOCAL: COUNTRY_ANCHORS.US,
  UNKNOWN: COUNTRY_ANCHORS.US,
};

type TrafficPoint = {
  country: string;
  region: string;
  city: string;
  x: number | null;
  y: number | null;
  count: number;
};

type TrafficCluster = {
  key: string;
  x: number;
  y: number;
  count: number;
  labels: string[];
};

type Snapshot = {
  requestsPerMinute: number;
  p95LatencyMs: number;
  uptimePercent: number;
  totalRequests: number;
  points: TrafficPoint[];
  lastEventAt: number | null;
  instance?: string;
  source: 'live' | 'demo';
};

type VisitorLocation = {
  code: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
};

const FALLBACK_SNAPSHOT: Snapshot = {
  requestsPerMinute: 0,
  p95LatencyMs: 0,
  uptimePercent: 100,
  totalRequests: 0,
  points: [],
  lastEventAt: null,
  source: 'demo',
};

const REGION_NAMES: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', DE: 'Germany', FR: 'France', CA: 'Canada',
  BR: 'Brazil', MX: 'Mexico', AR: 'Argentina', IN: 'India', CN: 'China', JP: 'Japan',
  AU: 'Australia', NL: 'Netherlands', ES: 'Spain', IT: 'Italy', SG: 'Singapore',
  ZA: 'South Africa', NG: 'Nigeria', KE: 'Kenya', RU: 'Russia', SE: 'Sweden',
  PL: 'Poland', UA: 'Ukraine', TR: 'Turkey', IR: 'Iran', AE: 'United Arab Emirates',
  KR: 'South Korea', TH: 'Thailand', VN: 'Vietnam', ID: 'Indonesia', MY: 'Malaysia',
  PT: 'Portugal', IE: 'Ireland', CH: 'Switzerland', AT: 'Austria', BE: 'Belgium',
  NO: 'Norway', DK: 'Denmark', FI: 'Finland', CZ: 'Czechia', GR: 'Greece',
  PH: 'Philippines', NZ: 'New Zealand', IL: 'Israel', SA: 'Saudi Arabia', EG: 'Egypt',
};

const COUNTRY_LABELS: Record<string, string> = {
  LOCAL: 'This device',
  UNKNOWN: 'Unknown region',
  ...REGION_NAMES,
};

// What actually happens to a beacon, in plain language.
const PIPELINE = ['EDGE', 'SANITIZE', 'STORE', 'STREAM'];

// The telemetry API. It is same-origin with the portfolio when the site is
// served next to the service; otherwise the build points at the telemetry
// host, which answers with permissive CORS headers.
const API = (import.meta.env.PUBLIC_OPS_PULSE_API?.trim() || '/analytics').replace(/\/$/, '');

function anchorFor(code: string): { x: number; y: number } | null {
  const raw = COUNTRY_ANCHORS[code] ?? PREVIEW_ANCHORS[code];
  if (!raw) return null;
  return { x: (raw[0] / MAP_VIEWBOX.w) * 100, y: (raw[1] / MAP_VIEWBOX.h) * 100 };
}

// The map artwork is a low-resolution projected world map. These coefficients
// were fitted against the rendered artwork itself: 31 of 33 reference cities
// land directly on their own landmass, so a visitor marker sits on the right
// part of the map instead of the middle of an ocean.
const MAP_PROJECTION = { ax: 2.6, bx: 460, ay: -3.61, by: 316 };

function anchorForCoordinates(latitude?: number, longitude?: number) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const { ax, bx, ay, by } = MAP_PROJECTION;
  const px = ax * (longitude as number) + bx;
  const py = ay * (latitude as number) + by;
  return {
    x: Math.max(1, Math.min(99, (px / MAP_VIEWBOX.w) * 100)),
    y: Math.max(1, Math.min(99, (py / MAP_VIEWBOX.h) * 100)),
  };
}

export default function OpsPulse() {
  const [mode, setMode] = useState<'traffic' | 'pipeline'>('traffic');
  const [snapshot, setSnapshot] = useState<Snapshot>(FALLBACK_SNAPSHOT);
  const [you, setYou] = useState<VisitorLocation | null>(null);
  const [live, setLive] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [trace, setTrace] = useState(0);
  const [pipelineLayout, setPipelineLayout] = useState<{ nodes: { x: number; y: number; w: number; h: number }[]; path: string }>({ nodes: [], path: '' });

  // Anchor the pipeline to the real responsive portrait bounds. The headshot
  // has different assets/sizing on mobile and desktop, so fixed offsets drift
  // into it at common viewport sizes.
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('.ops-pulse');
    const hero = document.querySelector<HTMLElement>('.hero-wrap');
    if (!root || !hero) return undefined;

    const updateLayout = () => {
      const heroRect = hero.getBoundingClientRect();
      const portrait = [...document.querySelectorAll<HTMLElement>(
        '.hero-mobile-headshot-img, .hero-desktop-headshot-img',
      )].find((image) => image.getBoundingClientRect().width > 0);
      if (!portrait) return;

      const rect = portrait.getBoundingClientRect();
      const mobile = window.matchMedia('(max-width: 767.98px)').matches;
      const compactDesktop = !mobile && heroRect.width <= 1100;
      const px = (value: number) => value - heroRect.left;
      const py = (value: number) => value - heroRect.top;
      const nodes: { x: number; y: number; w: number; h: number }[] = [];
      let path = '';

      if (mobile) {
        const leftSpace = px(rect.left);
        const rightSpace = heroRect.width - px(rect.right);
        const railOnRight = rightSpace >= leftSpace;
        const railWidth = Math.max(34, Math.min(60, Math.max(leftSpace, rightSpace) - 8));
        const x = railOnRight ? px(rect.right) + 4 : px(rect.left) - railWidth - 4;
        const h = 34;
        const startY = py(rect.top) + 16;
        const endY = py(rect.bottom) - h - 12;
        const step = (endY - startY) / (PIPELINE.length - 1);
        PIPELINE.forEach((_, index) => nodes.push({ x, y: startY + step * index, w: railWidth, h }));
        const centerX = x + railWidth / 2;
        path = `M ${centerX} ${startY + h / 2} V ${endY + h / 2}`;
        root.style.setProperty('--ops-trace-left', `${px(rect.left)}px`);
        root.style.setProperty('--ops-trace-width', `${rect.width}px`);
        root.style.setProperty('--ops-trace-top', `${py(rect.bottom) + 8}px`);
      } else if (compactDesktop) {
        const size = 40;
        const gap = Math.max(10, Math.min(20, (rect.width - size * PIPELINE.length) / (PIPELINE.length - 1)));
        const x0 = px(rect.left) + (rect.width - (size * PIPELINE.length + gap * (PIPELINE.length - 1))) / 2;
        const y = py(rect.bottom) + 10;
        PIPELINE.forEach((_, index) => nodes.push({ x: x0 + index * (size + gap), y, w: size, h: size }));
        const cy = y + size / 2;
        path = `M ${x0 + size} ${cy} H ${x0 + size + gap + size * 3 + gap * 2}`;
        root.style.setProperty('--ops-trace-left', `${px(rect.left)}px`);
        root.style.setProperty('--ops-trace-width', `${rect.width}px`);
        root.style.setProperty('--ops-trace-top', `${y + size + 8}px`);
      } else {
        const size = Math.max(52, Math.min(64, heroRect.width * 0.045));
        const xLeft = Math.max(8, px(rect.left) - size - 14);
        const xRight = Math.min(heroRect.width - size - 8, px(rect.right) + 14);
        const yTop = Math.max(82, py(rect.top) - size - 14);
        const yBottom = Math.min(heroRect.height - size - 18, py(rect.bottom) + 12);
        nodes.push(
          { x: xLeft, y: yTop, w: size, h: size },
          { x: xRight, y: yTop, w: size, h: size },
          { x: xRight, y: yBottom, w: size, h: size },
          { x: xLeft, y: yBottom, w: size, h: size },
        );
        const a = { x: xLeft + size / 2, y: yTop + size / 2 };
        const b = { x: xRight + size / 2, y: yTop + size / 2 };
        const c = { x: xRight + size / 2, y: yBottom + size / 2 };
        const d = { x: xLeft + size / 2, y: yBottom + size / 2 };
        const radius = Math.min(24, Math.max(12, size * 0.32));
        path = `M ${a.x} ${a.y} H ${b.x - radius} Q ${b.x} ${a.y} ${b.x} ${a.y + radius} V ${c.y - radius} Q ${c.x} ${c.y} ${c.x - radius} ${c.y} H ${d.x}`;
        root.style.setProperty('--ops-trace-left', `${px(rect.left)}px`);
        root.style.setProperty('--ops-trace-width', `${rect.width}px`);
        root.style.setProperty('--ops-trace-top', `${py(rect.bottom) + size + 20}px`);
      }

      setPipelineLayout({ nodes, path });
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(hero);
    const portraitImages = document.querySelectorAll<HTMLElement>(
      '.hero-mobile-headshot-img, .hero-desktop-headshot-img',
    );
    portraitImages.forEach((image) => observer.observe(image));
    const text = document.querySelector<HTMLElement>('.hero-animated-content .hero-text');
    if (text) observer.observe(text);
    window.addEventListener('resize', updateLayout);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLayout);
    };
  }, [mode]);

  // Resolve in the browser so a tailnet/dev proxy cannot accidentally locate
  // the proxy host instead of the actual visitor. The IP itself is never read,
  // stored, or sent to our telemetry service.
  useEffect(() => {
    let cancelled = false;
    const resolveVisitor = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', {
          headers: { Accept: 'application/json' },
          referrerPolicy: 'no-referrer',
        });
        const data = res.ok ? await res.json() : null;
        if (!cancelled && data?.country_code) {
          setYou({
            code: String(data.country_code).toUpperCase(),
            city: data.city || undefined,
            region: data.region || undefined,
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
          });
          return;
        }
      } catch {
        /* fall through to edge-provided country */
      }

      try {
        const res = await fetch(`${API}/you`, { headers: { Accept: 'application/json' } });
        const data = res.ok ? await res.json() : null;
        if (!cancelled && data?.country) setYou({ code: data.country });
      } catch {
        /* location is optional */
      }
    };
    void resolveVisitor();
    return () => {
      cancelled = true;
    };
  }, []);

  // Live snapshot stream.
  useEffect(() => {
    let source: EventSource | null = null;
    let cancelled = false;

    let receivedFirstFrame = false;

    const apply = (data: Snapshot) => {
      if (cancelled) return;
      receivedFirstFrame = true;
      setSnapshot(data);
      setLive(true);
    };

    const poll = async () => {
      try {
        const res = await fetch(`${API}/snapshot`, { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        apply((await res.json()) as Snapshot);
      } catch {
        /* keep the last known snapshot */
      }
    };

    try {
      source = new EventSource(API + '/stream');
      source.onmessage = (event) => {
        try {
          apply(JSON.parse(event.data) as Snapshot);
        } catch {
          /* ignore malformed frames */
        }
      };
      source.onerror = () => {
        source?.close();
        source = null;
        void poll();
      };
      // A stream that never delivers its first frame must not block the UI.
      window.setTimeout(() => {
        if (!receivedFirstFrame) void poll();
      }, 2500);
    } catch {
      void poll();
    }

    // Poll unconditionally as a safety net: the UI must populate even if the
    // event stream is unavailable or blocked by a proxy.
    const interval = window.setInterval(() => {
      void poll();
    }, 3000);

    return () => {
      cancelled = true;
      source?.close();
      window.clearInterval(interval);
    };
  }, []);

  // Beacon this visit so the counters reflect real traffic.
  useEffect(() => {
    if (!you?.code) return;
    const navigation = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming | undefined;
    // Measure this request's time to first byte. Full page-load time is heavily
    // skewed by client rendering and dev-server compilation.
    const loadMs = Math.round(
      navigation
        ? Math.max(0, navigation.responseStart - navigation.requestStart)
        : performance.now(),
    );
    const cell = anchorForCoordinates(you?.latitude, you?.longitude);
    const body = JSON.stringify({
      path: window.location.pathname,
      loadMs,
      country: you?.code,
      region: you?.region,
      city: you?.city,
      // Rounded to 0.1% of the map: city scale, never a precise address.
      mx: cell ? Math.round(cell.x * 10) / 10 : undefined,
      my: cell ? Math.round(cell.y * 10) / 10 : undefined,
      mapVersion: MAP_PROJECTION_VERSION,
      referrer: document.referrer ? new URL(document.referrer).hostname : '',
    });
    try {
      fetch(`${API}/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* beacon is best effort */
    }
  }, [you?.code]);

  // Slow trace animation for the pipeline view.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return undefined;
    const timer = window.setInterval(() => setTrace((value) => (value + 1) % PIPELINE.length), 1600);
    return () => window.clearInterval(timer);
  }, []);

  const points = useMemo(() => {
    const list: { key: string; x: number; y: number; count: number; label: string }[] = [];
    for (const point of snapshot.points) {
      // Prefer the recorded map cell; fall back to the country anchor.
      const anchor =
        point.x !== null && point.y !== null
          ? { x: point.x, y: point.y }
          : anchorFor(point.country);
      if (!anchor) continue;
      const label =
        [point.city, point.region].filter(Boolean).join(', ') ||
        COUNTRY_LABELS[point.country] ||
        point.country;
      list.push({
        key: `${point.country}:${point.region}:${point.city}:${point.x}:${point.y}`,
        x: anchor.x,
        y: anchor.y,
        count: point.count,
        label,
      });
    }
    return list;
  }, [snapshot.points]);

  // Two cities a few kilometres apart (Belmont and Daly City, for example)
  // land on the same handful of pixels. Merge them into one marker so the
  // labels cannot overlap and read as two separate places.
  const clusters = useMemo(() => {
    const groups: TrafficCluster[] = [];
    for (const point of points) {
      const near = groups.find(
        (group) => Math.abs(group.x - point.x) < 1.2 && Math.abs(group.y - point.y) < 1.2,
      );
      if (near) {
        near.count += point.count;
        if (!near.labels.includes(point.label)) near.labels.push(point.label);
        continue;
      }
      groups.push({
        x: point.x,
        y: point.y,
        count: point.count,
        labels: [point.label],
        key: point.key,
      });
    }
    return groups;
  }, [points]);

  const youPoint = useMemo(() => {
    if (!you?.code) return null;
    const anchor = anchorForCoordinates(you.latitude, you.longitude) ?? anchorFor(you.code);
    if (!anchor) return null;
    return { ...anchor, code: you.code };
  }, [you]);

  const youLabel = useMemo(() => {
    if (!you) return 'Locating…';
    return [you.city, you.region].filter(Boolean).join(', ') || COUNTRY_LABELS[you.code] || you.code;
  }, [you]);

  const uptimeLabel = `${snapshot.uptimePercent.toFixed(2)}%`;
  const deployLabel = snapshot.lastEventAt
    ? `${Math.max(0, Math.round((Date.now() - snapshot.lastEventAt * 1000) / 60000))}m ago`
    : 'idle';

  return (
    <section
      className={`ops-pulse${mode === 'pipeline' ? ' is-pipeline' : ''}`}
      aria-label="Live Ops Pulse preview"
    >
      <div className="ops-pulse__glow" aria-hidden="true" />

      <header className="ops-pulse__topbar">
        <div className="ops-pulse__title-group">
          <span className="ops-pulse__live-dot" data-live={live ? 'true' : 'false'} aria-hidden="true" />
          <div>
            <div className="ops-pulse__eyebrow">OPS PULSE</div>
            <div className="ops-pulse__feed-label">
              {live ? 'LIVE FEED' : 'CONNECTING…'}
              {snapshot.instance ? ` · ${snapshot.instance}` : ''}
            </div>
          </div>
        </div>
        <div className="ops-pulse__actions">
          <div className="ops-pulse__mode-switch" aria-label="Telemetry view">
            <button
              type="button"
              className={`ops-pulse__mode-btn${mode === 'traffic' ? ' is-active' : ''}`}
              onClick={() => setMode('traffic')}
            >
              Traffic
            </button>
            <button
              type="button"
              className={`ops-pulse__mode-btn${mode === 'pipeline' ? ' is-active' : ''}`}
              onClick={() => setMode('pipeline')}
            >
              Pipeline
            </button>
          </div>
          <button
            type="button"
            className="ops-pulse__info-btn"
            aria-label="How Ops Pulse works"
            onClick={() => setShowInfo(true)}
          >
            i
          </button>
        </div>
      </header>

      <div className={`ops-pulse__stage${mode === 'pipeline' ? ' is-pipeline' : ''}`}>
        {mode === 'traffic' ? (
          <div className="ops-pulse__map-view">
            <div className="ops-pulse__world-map" aria-hidden="true" />
            <svg
              className="ops-pulse__map-svg"
              viewBox="0 0 950 620"
              role="img"
              aria-label={`Live request activity by region. ${snapshot.totalRequests} requests recorded in the last hour.`}
            >
              {clusters.map((cluster) => {
                const cx = cluster.x * MAP_SCALE.x;
                const cy = cluster.y * MAP_SCALE.y;
                // The visitor marker owns the label for the place the visitor is
                // in, so that cluster must not repeat it. When the visitor is
                // inside a cluster, the pulsing marker replaces the plain dot
                // entirely rather than stacking two markers on one pixel.
                const labels = cluster.labels.filter((label) => label !== youLabel);
                const isVisitorCluster = labels.length !== cluster.labels.length;
                return (
                  <g key={cluster.key} transform={`translate(${cx.toFixed(2)} ${cy.toFixed(2)})`}>
                    {!isVisitorCluster && (
                      <>
                        <circle className="ops-pulse__halo" r={12 + Math.min(cluster.count, 6) * 3} />
                        <circle className="ops-pulse__point" r={cluster.count > 1 ? 6 : 4.2} />
                      </>
                    )}
                    {labels.length > 0 && (
                      <text className="ops-pulse__point-label" y={isVisitorCluster ? 26 : -13}>
                        {labels.join(' · ')}
                      </text>
                    )}
                  </g>
                );
              })}
              {youPoint && (
                <g
                  className="ops-pulse__you"
                  transform={`translate(${(youPoint.x * MAP_SCALE.x).toFixed(2)} ${(youPoint.y * MAP_SCALE.y).toFixed(2)})`}
                  aria-label={`Your location: ${youLabel}`}
                >
                  <circle className="ops-pulse__you-ping" r="8" opacity="0.9">
                    <animate attributeName="r" values="8;34" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle className="ops-pulse__you-ring" r="9" />
                  <circle className="ops-pulse__you-core" r="4" />
                  <text className="ops-pulse__you-label" y={-24}>
                    {youLabel}
                  </text>
                </g>
              )}
            </svg>
          </div>
        ) : (
          <div className="ops-pulse__pipeline-view" aria-label="How a visit is processed">
            <svg className="ops-pulse__pipeline-route" aria-hidden="true">
              <path className="ops-pulse__pipeline-route-base" d={pipelineLayout.path} />
              <path
                className="ops-pulse__pipeline-route-active"
                d={pipelineLayout.path}
                pathLength="1"
                style={{ strokeDashoffset: 1 - Math.max(0, trace) / (PIPELINE.length - 1) }}
              />
            </svg>
            <div className="ops-pulse__pipeline-track" aria-label="Edge event delivery pipeline">
              {PIPELINE.map((step, index) => (
                <React.Fragment key={step}>
                  <div
                    data-pipeline-step={index}
                    className={`ops-pulse__node${index <= trace ? ' is-active' : ''}`}
                    style={pipelineLayout.nodes[index] ? {
                      left: `${pipelineLayout.nodes[index].x}px`,
                      top: `${pipelineLayout.nodes[index].y}px`,
                      width: `${pipelineLayout.nodes[index].w}px`,
                      height: `${pipelineLayout.nodes[index].h}px`,
                    } : undefined}
                  >
                    <small className="ops-pulse__node-index">0{index + 1}</small>
                    <span>{step}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="ops-pulse__trace-panel">
              <div className="ops-pulse__trace-header">
                <span>TRACE {snapshot.totalRequests}</span>
                <span>200 OK</span>
              </div>
              <div className="ops-pulse__trace-bars">
                <i style={{ width: `${Math.min(100, 20 + snapshot.requestsPerMinute * 4)}%` }} />
                <i style={{ width: `${Math.min(100, 30 + snapshot.totalRequests % 60)}%` }} />
                <i style={{ width: `${Math.min(100, 25 + snapshot.points.length * 8)}%` }} />
                <i style={{ width: `${Math.min(100, 15 + snapshot.p95LatencyMs)}%` }} />
              </div>
              <div className="ops-pulse__trace-footer">
                <span>durable</span>
                <span>sanitized</span>
                <span>{snapshot.p95LatencyMs}ms</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="ops-pulse__metrics">
        <div className="ops-pulse__metric">
          <span>REQ / MIN</span>
          <strong>{snapshot.requestsPerMinute}</strong>
        </div>
        <div className="ops-pulse__metric">
          <span>P95 LATENCY</span>
          <strong>
            {snapshot.p95LatencyMs}
            <small>ms</small>
          </strong>
        </div>
        <div className="ops-pulse__metric">
          <span>UPTIME</span>
          <strong>{uptimeLabel}</strong>
        </div>
        <div className="ops-pulse__metric">
          <span>LAST EVENT</span>
          <strong>{deployLabel}</strong>
        </div>
      </div>

      <footer className="ops-pulse__footer-line">
        <a className="ops-pulse__privacy-link" href="/privacy">
          What this map records
        </a>
      </footer>

      {showInfo && (
        <div
          className="ops-pulse__modal-backdrop"
          role="presentation"
          onMouseDown={() => setShowInfo(false)}
        >
          <div
            className="ops-pulse__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ops-pulse-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="ops-pulse__modal-close"
              aria-label="Close"
              onClick={() => setShowInfo(false)}
            >
              ×
            </button>
            <div className="ops-pulse__modal-eyebrow">PROJECT SYSTEM</div>
            <h3 id="ops-pulse-title">How Ops Pulse works</h3>
            <p>
              Every request to this site reports a privacy-safe beacon to a
              telemetry service. The map shows real traffic in the last hour, and
              the ring marks where your current session appears.
            </p>
            <div className="ops-pulse__flow" aria-label="How a visit is processed">
              <span>EDGE</span>
              <b>→</b>
              <span>SANITIZE</span>
              <b>→</b>
              <span>STORE</span>
              <b>→</b>
              <span>STREAM</span>
            </div>
            <div className="ops-pulse__privacy-note">
              <strong>Privacy by design</strong>
              Raw IP addresses are never stored or served. Only a coarse country
              code is retained, query strings are stripped, and the public feed
              only exposes aggregates.
            </div>
            <p className="ops-pulse__footnote">
              Counts reflect real visitors to this deployment. The live feed
              reconnects automatically if the telemetry service restarts.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
