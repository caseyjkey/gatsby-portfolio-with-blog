#!/bin/bash
# Check Gatsby dev server status and recent output

echo "=== Gatsby Dev Server Status ==="
if pgrep -f "gatsby develop" > /dev/null; then
    echo "✓ Dev server is RUNNING"
    echo ""
    echo "=== Dev Server Processes ==="
    ps aux | grep "gatsby develop" | grep -v grep
    echo ""
    echo "=== Port 8001 Status ==="
    if command -v lsof &> /dev/null; then
        lsof -i :8001 | grep LISTEN || echo "Port 8001 not listening"
    elif command -v netstat &> /dev/null; then
        netstat -tlnp 2>/dev/null | grep :8001 || echo "Port 8001 status unknown"
    fi
    echo ""
    if [ -f /tmp/gatsby-dev.log ]; then
        echo "=== Logging is ENABLED ==="
        echo "View logs: bun run dev:logs"
    else
        echo "=== Logging is NOT enabled ==="
        echo "To enable logging next time, restart the dev server"
    fi
else
    echo "✗ Dev server is NOT running"
    echo ""
    echo "=== Start dev server: ==="
    echo "  bun run dev"
fi
