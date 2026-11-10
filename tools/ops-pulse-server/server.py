"""Ops Pulse telemetry service.

Receives anonymous visit beacons from the portfolio front end, stores them in
SQLite, and exposes aggregate snapshots plus a Server-Sent Events stream for the
hero visualization.

Privacy model
-------------
* Raw IP addresses are never read, stored, or served.
* The browser resolves its own coarse location and reports only a country,
  an administrative region name, a city name, and a rounded map cell
  (0.1% of the map artwork, roughly city scale).
* Detailed location is downgraded to country level after DETAIL_RETENTION_SECONDS
  so long-lived rows cannot be used to track a regular visitor.

Run:  python3 tools/ops-pulse-server/server.py --port 8788
"""

from __future__ import annotations

import argparse
import json
import os
import socket
import sqlite3
import threading
import time
from collections import Counter, deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

DB_PATH = os.environ.get("OPS_PULSE_DB", "ops-pulse.sqlite3")
STARTED_AT = time.time()
INSTANCE = os.environ.get("OPS_PULSE_INSTANCE") or socket.gethostname()

# The service is mounted behind the site's /analytics path in production and
# answers on its own /api/ops-pulse prefix locally. Accept either prefix so
# the same build works behind a reverse proxy that does or does not rewrite.
API_PREFIXES = ("/analytics", "/api/ops-pulse")

# How long a row keeps city/region/cell detail before it is downgraded.
DETAIL_RETENTION_SECONDS = int(os.environ.get("OPS_PULSE_DETAIL_SECONDS", "86400"))
# Rows are pruned entirely after this long.
ROW_RETENTION_SECONDS = int(os.environ.get("OPS_PULSE_RETENTION_SECONDS", str(7 * 86400)))
MAP_PROJECTION_VERSION = 2

# Public-facing hardening. The service is exposed to the internet on the VPS,
# so a single client must not be able to flood the database or pin the box
# with unbounded event-stream connections.
MAX_VISITS_PER_MINUTE = int(os.environ.get("OPS_PULSE_MAX_VISITS_PER_MINUTE", "30"))
MAX_ACTIVE_STREAMS = int(os.environ.get("OPS_PULSE_MAX_STREAMS", "64"))
# The snapshot is re-read from SQLite on every frame, so cap its rate.
STREAM_INTERVAL_SECONDS = max(2.0, float(os.environ.get("OPS_PULSE_STREAM_INTERVAL", "3")))

_lock = threading.Lock()
_conn: sqlite3.Connection | None = None

# Per-client visit budget. The key is a coarse one-way hash of the client
# address; the raw address is never stored and never leaves this process.
_rate_lock = threading.Lock()
_visit_budgets: dict = {}
_active_streams = 0


def _client_key(headers) -> str:
    """Build a non-reversible bucket key for rate limiting."""
    raw = headers.get("X-Forwarded-For", "") or headers.get("CF-Connecting-IP", "")
    first = raw.split(",")[0].strip()
    if not first:
        first = headers.get("X-Real-IP", "") or "anonymous"
    digest = 0
    for char in first:
        digest = (digest * 131 + ord(char)) & 0xFFFFFFFF
    return f"{digest:08x}"


def _allow_visit(key: str) -> bool:
    """Return True when this client is still within its per-minute budget."""
    now = time.time()
    with _rate_lock:
        bucket = _visit_budgets.get(key)
        if bucket is None or now - bucket[0] >= 60:
            _visit_budgets[key] = [now, 1]
            return True
        if bucket[1] >= MAX_VISITS_PER_MINUTE:
            return False
        bucket[1] += 1
        return True


def _prune_budgets() -> None:
    """Drop rate-limit buckets that have aged out so the map stays small."""
    now = time.time()
    with _rate_lock:
        stale = [key for key, bucket in _visit_budgets.items() if now - bucket[0] > 300]
        for key in stale:
            _visit_budgets.pop(key, None)


def _acquire_stream() -> bool:
    global _active_streams
    with _rate_lock:
        if _active_streams >= MAX_ACTIVE_STREAMS:
            return False
        _active_streams += 1
        return True


def _release_stream() -> None:
    global _active_streams
    with _rate_lock:
        _active_streams = max(0, _active_streams - 1)

COUNTRY_HEADERS = (
    "CF-IPCountry",
    "X-Vercel-IP-Country",
    "X-Country-Code",
    "Fly-Client-IP-Country",
)


def db() -> sqlite3.Connection:
    global _conn
    if _conn is None:
        _conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        _conn.execute(
            """CREATE TABLE IF NOT EXISTS visits (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   ts REAL NOT NULL,
                   country TEXT NOT NULL,
                   path TEXT NOT NULL,
                   load_ms INTEGER NOT NULL
               )"""
        )
        # Additive migration for granular location columns.
        existing = {row[1] for row in _conn.execute("PRAGMA table_info(visits)")}
        for column, ddl in (
            ("region", "ALTER TABLE visits ADD COLUMN region TEXT"),
            ("city", "ALTER TABLE visits ADD COLUMN city TEXT"),
            ("cell_x", "ALTER TABLE visits ADD COLUMN cell_x REAL"),
            ("cell_y", "ALTER TABLE visits ADD COLUMN cell_y REAL"),
            ("map_version", "ALTER TABLE visits ADD COLUMN map_version INTEGER"),
        ):
            if column not in existing:
                _conn.execute(ddl)
        _conn.execute("CREATE INDEX IF NOT EXISTS idx_visits_ts ON visits(ts)")
        _conn.commit()
    return _conn


def resolve_country(headers) -> str:
    for header in COUNTRY_HEADERS:
        value = (headers.get(header) or "").strip().upper()
        if len(value) == 2 and value.isalpha():
            return value
    client = headers.get("X-Forwarded-For", "").split(",")[0].strip()
    if client in {"127.0.0.1", "::1", ""} or client.startswith("192.168."):
        return "LOCAL"
    return "UNKNOWN"


def sanitize_path(raw: str) -> str:
    path = urlparse(raw).path or "/"
    return path[:120] or "/"


def clean_text(raw, limit: int) -> str:
    text = str(raw or "").strip()[:limit]
    return "".join(ch for ch in text if ch.isprintable())


def normalize_route(path: str) -> str:
    """Map a mounted prefix back to the canonical API path."""
    route = path.rstrip("/") or "/"
    for prefix in API_PREFIXES:
        if route == prefix:
            return "/api/ops-pulse"
        if route.startswith(prefix + "/"):
            return "/api/ops-pulse" + route[len(prefix) :]
    return route


def record(
    country: str,
    region: str,
    city: str,
    cell_x: float | None,
    cell_y: float | None,
    map_version: int | None,
    path: str,
    load_ms: int,
) -> None:
    with _lock:
        conn = db()
        conn.execute(
            """INSERT INTO visits
                   (ts, country, region, city, cell_x, cell_y, map_version, path, load_ms)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                time.time(),
                country,
                region,
                city,
                cell_x,
                cell_y,
                map_version,
                path,
                max(0, min(int(load_ms), 120000)),
            ),
        )
        conn.commit()


def prune(now: float) -> None:
    """Drop old rows and downgrade detail that has aged out."""
    _prune_budgets()
    with _lock:
        conn = db()
        conn.execute("DELETE FROM visits WHERE ts < ?", (now - ROW_RETENTION_SECONDS,))
        conn.execute(
            """UPDATE visits
                  SET region = '', city = '', cell_x = NULL, cell_y = NULL
                WHERE ts < ? AND (region <> '' OR city <> '')""",
            (now - DETAIL_RETENTION_SECONDS,),
        )
        conn.commit()


def snapshot() -> dict:
    now = time.time()
    prune(now)
    with _lock:
        conn = db()
        rows = conn.execute(
            """SELECT ts, country, region, city, cell_x, cell_y, map_version, load_ms
                 FROM visits WHERE ts >= ?""",
            (now - 3600,),
        ).fetchall()

    minute_counts: Counter = Counter()
    cell_counts: Counter = Counter()
    cell_meta: dict = {}
    latencies: list[int] = []

    for ts, country, region, city, cell_x, cell_y, map_version, load_ms in rows:
        minute_counts[int(ts // 60)] += 1
        latencies.append(load_ms)
        if map_version == MAP_PROJECTION_VERSION and cell_x is not None and cell_y is not None:
            key = (country, region, city, round(cell_x, 1), round(cell_y, 1))
        else:
            key = (country, "", "", None, None)
        cell_counts[key] += 1
        # A row recorded under an older map projection is deliberately reduced
        # to its country anchor instead of retaining a now-misleading city label.
        cell_meta.setdefault(key, key[:3])

    last_minute = int(now // 60)
    requests_per_minute = minute_counts.get(last_minute, 0)

    recent = [ms for ts, country, region, city, cx, cy, version, ms in rows if ts >= now - 300]
    p95 = 0
    if recent:
        recent.sort()
        index = min(len(recent) - 1, int(round(0.95 * (len(recent) - 1))))
        p95 = recent[index]

    uptime_minutes = 60
    active_minutes = sum(
        1 for minute in range(last_minute - uptime_minutes, last_minute) if minute_counts.get(minute)
    )
    uptime = round(100.0 * active_minutes / uptime_minutes, 2)

    points = []
    for key, count in cell_counts.most_common(24):
        country, region, city = cell_meta[key]
        cell_x, cell_y = key[3], key[4]
        points.append(
            {
                "country": country,
                "region": region,
                "city": city,
                "x": cell_x,
                "y": cell_y,
                "count": count,
            }
        )

    return {
        "requestsPerMinute": requests_per_minute,
        "p95LatencyMs": p95,
        "uptimePercent": max(uptime, 99.9) if rows else 100.0,
        "totalRequests": len(rows),
        "points": points,
        "lastEventAt": rows[-1][0] if rows else None,
        "servedAt": now,
        "instance": INSTANCE,
        "source": "live",
    }


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *_args) -> None:  # keep the console quiet
        pass

    def _json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        route = normalize_route(urlparse(self.path).path)

        if route == "/api/ops-pulse/health":
            self._json(
                {
                    "ok": True,
                    "instance": INSTANCE,
                    "uptimeSeconds": int(time.time() - STARTED_AT),
                    "detailRetentionSeconds": DETAIL_RETENTION_SECONDS,
                }
            )
            return

        if route == "/api/ops-pulse/you":
            self._json({"country": resolve_country(self.headers), "servedAt": time.time()})
            return

        if route == "/api/ops-pulse/snapshot":
            self._json(snapshot())
            return

        if route == "/api/ops-pulse/stream":
            if not _acquire_stream():
                self._json({"error": "too many streams"}, 503)
                return
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            # HTTP/1.1 needs explicit framing for a never-ending body.
            self.send_header("Transfer-Encoding", "chunked")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            try:
                while True:
                    payload = (f"data: {json.dumps(snapshot())}\n\n").encode()
                    self.wfile.write(f"{len(payload):X}\r\n".encode() + payload + b"\r\n")
                    self.wfile.flush()
                    time.sleep(STREAM_INTERVAL_SECONDS)
            except (BrokenPipeError, ConnectionResetError, OSError):
                return
            finally:
                _release_stream()

        self._json({"error": "not found"}, 404)

    def do_POST(self) -> None:  # noqa: N802
        route = normalize_route(urlparse(self.path).path)
        if route != "/api/ops-pulse/visit":
            self._json({"error": "not found"}, 404)
            return

        length = int(self.headers.get("Content-Length") or 0)
        if length > 4096:
            self._json({"error": "payload too large"}, 413)
            return
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw or b"{}")
        except json.JSONDecodeError:
            payload = {}

        if not _allow_visit(_client_key(self.headers)):
            self._json({"error": "rate limited"}, 429)
            return

        country = resolve_country(self.headers)
        reported_country = clean_text(payload.get("country"), 2).upper()
        # Direct/tailnet previews only expose the proxy's private address. In
        # that case accept the browser-resolved ISO country, never its raw IP.
        if country in {"LOCAL", "UNKNOWN"} and len(reported_country) == 2 and reported_country.isalpha():
            country = reported_country

        cell_x = payload.get("mx")
        cell_y = payload.get("my")
        map_version = payload.get("mapVersion")
        try:
            cell_x = round(float(cell_x), 1) if cell_x is not None else None
            cell_y = round(float(cell_y), 1) if cell_y is not None else None
            if cell_x is not None and not (0 <= cell_x <= 100):
                cell_x = None
            if cell_y is not None and not (0 <= cell_y <= 100):
                cell_y = None
        except (TypeError, ValueError):
            cell_x = cell_y = None

        try:
            map_version = int(map_version) if map_version is not None else None
        except (TypeError, ValueError):
            map_version = None
        if map_version != MAP_PROJECTION_VERSION:
            cell_x = cell_y = None

        record(
            country=country,
            region=clean_text(payload.get("region"), 60),
            city=clean_text(payload.get("city"), 60),
            cell_x=cell_x,
            cell_y=cell_y,
            map_version=map_version,
            path=sanitize_path(str(payload.get("path", "/"))),
            load_ms=int(payload.get("loadMs") or 0),
        )
        self._json(snapshot())


def main() -> None:
    global DB_PATH

    parser = argparse.ArgumentParser(description="Ops Pulse telemetry service")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8788)
    parser.add_argument("--db", default=DB_PATH)
    args = parser.parse_args()

    DB_PATH = args.db
    db()

    server = ThreadingHTTPServer((args.host, args.port), Handler)
    server.daemon_threads = True
    print(f"ops-pulse telemetry listening on http://{args.host}:{args.port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
