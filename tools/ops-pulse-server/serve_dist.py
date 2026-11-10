"""Serve the built Astro site and proxy the Ops Pulse telemetry API.

This mirrors the production shape (static assets + /api/ops-pulse) so the
built artifact can be reviewed locally without the Vite dev server.

Run:  python3 tools/ops-pulse-server/serve_dist.py --port 9005 --dist dist
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

API_PREFIX = "/api/ops-pulse"
UPSTREAM = os.environ.get("OPS_PULSE_API", "http://127.0.0.1:8788")
DIST = "dist"


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *_args) -> None:
        pass

    def _proxy(self, method: str) -> None:
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else None
        request = urllib.request.Request(
            UPSTREAM + self.path,
            data=body,
            method=method,
            headers={
                key: value
                for key, value in self.headers.items()
                if key.lower() in {"content-type", "accept", "cf-ipcountry", "x-forwarded-for"}
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                payload = response.read()
                content_type = response.headers.get("Content-Type", "application/octet-stream")
                status = response.status
        except urllib.error.HTTPError as error:
            payload = error.read()
            content_type = error.headers.get("Content-Type", "application/json")
            status = error.code
        except Exception as error:  # upstream unavailable
            payload = json.dumps({"error": str(error)}).encode()
            content_type = "application/json"
            status = 502

        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path.startswith(API_PREFIX):
            self._proxy("GET")
            return
        self._serve_static()

    def do_POST(self) -> None:  # noqa: N802
        if self.path.startswith(API_PREFIX):
            self._proxy("POST")
            return
        self.send_error(405)

    def _serve_static(self) -> None:
        route = urlparse(self.path).path
        relative = route.lstrip("/") or "index.html"
        target = os.path.join(DIST, relative)
        if os.path.isdir(target):
            target = os.path.join(target, "index.html")
        if not os.path.isfile(target):
            target = os.path.join(DIST, "index.html")
        try:
            with open(target, "rb") as handle:
                payload = handle.read()
        except OSError:
            self.send_error(404)
            return
        content_type = mimetypes.guess_type(target)[0] or "application/octet-stream"
        if content_type.startswith("text/") or "javascript" in content_type:
            content_type += "; charset=utf-8"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)


def main() -> None:
    global DIST

    parser = argparse.ArgumentParser(description="Serve the built Astro site")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=9005)
    parser.add_argument("--dist", default="dist")
    args = parser.parse_args()

    DIST = args.dist
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    server.daemon_threads = True
    print(f"serving {DIST} on http://{args.host}:{args.port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
