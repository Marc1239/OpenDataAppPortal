#!/usr/bin/env bash
#
# Server-side deployment: rebuild & restart the production stack.
# Invoked via SSH by .github/workflows/deploy.yml after `git reset --hard origin/main`.
# Safe to run manually on the Hetzner host from the repo root.

set -euo pipefail

REPO_DIR="${REPO_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
cd "$REPO_DIR"

if [[ ! -f .env ]]; then
  echo "error: $REPO_DIR/.env is missing. Copy .env.example and set secrets." >&2
  exit 1
fi

# Use the Caddy/TLS overlay only when a domain is configured. For IP-only
# deployments (no FRONTEND_DOMAIN in .env) we expose 3000/3001 directly and
# skip docker-compose.prod.yml so Caddy isn't needed.
COMPOSE=(docker compose -f docker-compose.yml)
if grep -qE '^FRONTEND_DOMAIN=[^[:space:]]+' .env; then
  COMPOSE+=(-f docker-compose.prod.yml)
  echo "[deploy] domain mode (Caddy overlay)"
else
  echo "[deploy] IP-only mode (no Caddy, ports 3000/3001 exposed)"
fi

echo "[deploy] building images"
"${COMPOSE[@]}" build --pull

echo "[deploy] starting/refreshing stack"
"${COMPOSE[@]}" up -d --remove-orphans

echo "[deploy] waiting for cms and frontend to report healthy"
for svc in cms frontend; do
  for i in $(seq 1 30); do
    state=$("${COMPOSE[@]}" ps --format '{{.Service}} {{.State}}' | awk -v s="$svc" '$1==s{print $2}')
    if [[ "$state" == "running" ]]; then
      echo "  - $svc: running"
      break
    fi
    if [[ $i -eq 30 ]]; then
      echo "error: $svc did not reach 'running' within 60s" >&2
      "${COMPOSE[@]}" logs --tail=80 "$svc" >&2 || true
      exit 1
    fi
    sleep 2
  done
done

echo "[deploy] syncing seeded catalog entries into CMS"
"${COMPOSE[@]}" run --rm cms npm run seed:catalog

echo "[deploy] pruning dangling images"
docker image prune -f >/dev/null

echo "[deploy] done"
