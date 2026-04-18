# Open Data App Portal

App-Store-artiges Portal für Open-Data-Anwendungen. Zwei unabhängige Services:

- **[frontend/](frontend/)** — Next.js 15 Public-Site im Flat-Modern-Look (Poppins + Open Sans, Blue/Amber).
- **[cms/](cms/)** — Payload CMS v3 (Next.js-basiert) mit MongoDB für Apps, Kategorien, Tags, Medien und Globals.

Frontend liest Inhalte ausschließlich per REST-API vom CMS. Änderungen im CMS triggern per Webhook (`/api/revalidate`) eine Tag-basierte Cache-Invalidierung im Frontend.

---

## Lokale Entwicklung

### Voraussetzungen

- Docker Desktop oder Docker Engine + Compose
- Node.js 20+ (nur falls ohne Docker entwickelt wird)

### Erststart (mit Docker)

```bash
cp .env.example .env
# PAYLOAD_SECRET und REVALIDATE_SECRET auf zufällige Strings setzen
docker compose up -d
docker compose run --rm cms npm run seed
```

Nach dem Start:

- Frontend: http://localhost:3000
- Payload-Admin: http://localhost:3001/admin
- Payload-REST-API: http://localhost:3001/api

Der Seed-Call legt den Admin-User (Credentials aus `.env`) an, migriert die Dresdner Apps aus `cms/src/scripts/source-data/` und füllt die Globals (Hero, Kontakt, Site-Settings).

### Entwicklung ohne Docker

Frontend:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

CMS:

```bash
cd cms
cp .env.example .env
# Lokalen Mongo starten (oder docker compose up mongo -d)
npm install
npm run dev
npm run seed   # einmalig
```

---

## Architektur

```
OpenDataAppPortal/
├── frontend/                # Next.js 15 (App Router, RSC)
│   ├── app/                 # öffentliche Routes (/, /apps, /apps/[slug], /kontakt)
│   ├── components/          # Flat-Modern-Komponenten
│   ├── lib/payload.ts       # typisierter REST-Fetcher mit Tag-Revalidation
│   └── Dockerfile
├── cms/                     # Payload CMS v3 (eigener Next-Server)
│   ├── src/collections/     # Users, Media, Categories, Tags, Apps
│   ├── src/globals/         # HeroFeature, ContactInfo, SiteSettings
│   ├── src/hooks/           # revalidate-frontend (afterChange-Webhook)
│   ├── src/scripts/seed.ts
│   └── Dockerfile
├── docker-compose.yml       # mongo + cms + frontend
├── docker-compose.prod.yml  # Caddy-Reverse-Proxy + Prod-Overrides
└── .env.example
```

### Revalidation-Flow

1. Redakteur:in ändert im Payload-Admin eine App → `afterChange`-Hook feuert.
2. Hook POSTet an `FRONTEND_URL/api/revalidate` mit Header `x-revalidate-secret` und Tags (`apps`, `app:<slug>`).
3. Frontend ruft `revalidateTag(tag)` → Next.js-Cache wird gezielt invalidiert.

---

## Deployment auf Hetzner

### Server (einmalig)

1. Hetzner-Cloud-Server: **CPX11 oder CX22** (4 GB RAM empfohlen für den Next-Build), Ubuntu 24.04.
2. DNS-A-Records setzen: `portal.<domain>` und `cms.<domain>` → Server-IP.
3. Docker Engine + Compose installieren:

   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```

4. Repo clonen, Umgebungsvariablen setzen:

   ```bash
   git clone <repo> /opt/opendataappportal
   cd /opt/opendataappportal
   cp .env.example .env
   # PAYLOAD_SECRET, REVALIDATE_SECRET, SEED_ADMIN_* auf starke Werte setzen
   # FRONTEND_DOMAIN=portal.<domain>
   # CMS_DOMAIN=cms.<domain>
   ```

### Start

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose run --rm cms npm run seed
```

Caddy erzeugt Let's-Encrypt-Zertifikate automatisch. Nach ein paar Sekunden sind beide Domains per HTTPS erreichbar.

### Backups

- **Mongo** — täglicher Dump per Cron:

  ```bash
  0 3 * * * docker exec odap_mongo mongodump --archive --gzip > /backups/mongo-$(date +\%F).gz
  ```

- **Media** — Volume `cms_media` per `docker run --rm -v cms_media:/src -v /backups:/dst alpine tar czf /dst/media-$(date +%F).tgz -C /src .` sichern.
- **Hetzner Volume-Snapshot** — wöchentlich, falls Daten auf einem extra Volume liegen.

### Updates (manuell)

```bash
git pull
./scripts/deploy.sh
```

`scripts/deploy.sh` baut beide Images neu, startet den Compose-Stack (`docker-compose.yml` + `docker-compose.prod.yml`), wartet auf `running`-Status und räumt dangling Images auf.

---

## CI/CD

### Pipelines

- **[.github/workflows/ci.yml](.github/workflows/ci.yml)** — läuft auf jedem Push/PR, Matrix über `frontend` und `cms`: `npm ci` → `typecheck` → `test` (Vitest) → `next build`. Zusätzlich ein Docker-Build-Job, der die beiden Images probeweise baut (ohne Push), um Dockerfile-Regressionen früh zu fangen.
- **[.github/workflows/deploy.yml](.github/workflows/deploy.yml)** — triggert per `workflow_run`, sobald CI auf `main` grün ist (oder manuell per `workflow_dispatch`). SSH auf den Hetzner-Host → `git reset --hard origin/main` → [`scripts/deploy.sh`](scripts/deploy.sh) → Smoke-Test via HTTPS-Request gegen `FRONTEND_DOMAIN`.

### Benötigte GitHub Secrets & Variables

Repo-Settings → *Settings → Secrets and variables → Actions*:

| Typ       | Name                  | Zweck                                                            |
| --------- | --------------------- | ---------------------------------------------------------------- |
| Secret    | `HETZNER_SSH_HOST`    | Server-IP oder DNS-Name.                                         |
| Secret    | `HETZNER_SSH_USER`    | z. B. `deploy` oder `root`.                                      |
| Secret    | `HETZNER_SSH_KEY`     | **Private** SSH-Key (PEM). Öffentlicher Key landet in `~/.ssh/authorized_keys` auf dem Server. |
| Secret    | `HETZNER_SSH_PORT`    | Optional. Default `22`.                                          |
| Secret    | `HETZNER_DEPLOY_PATH` | Absoluter Pfad auf dem Server, z. B. `/opt/opendataappportal`.   |
| Variable  | `FRONTEND_DOMAIN`     | z. B. `portal.example.com` — wird vom Smoke-Test verwendet.      |

### Einmalige Server-Vorbereitung

Auf dem Hetzner-Host (einmalig):

```bash
# Deploy-User anlegen (optional, aber empfohlen)
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy

# Public-Key des CI-Keys hinterlegen
sudo -u deploy mkdir -p /home/deploy/.ssh && sudo -u deploy chmod 700 /home/deploy/.ssh
echo "<ci-public-key>" | sudo -u deploy tee -a /home/deploy/.ssh/authorized_keys
sudo -u deploy chmod 600 /home/deploy/.ssh/authorized_keys

# Repo klonen und .env befüllen
sudo install -d -o deploy -g deploy /opt/opendataappportal
sudo -u deploy git clone <repo-url> /opt/opendataappportal
sudo -u deploy cp /opt/opendataappportal/.env.example /opt/opendataappportal/.env
sudo -u deploy "$EDITOR" /opt/opendataappportal/.env   # Secrets setzen
```

Ab jetzt deployt jeder Merge nach `main` automatisch.

### Tests lokal ausführen

```bash
cd frontend && npm test          # Vitest, deckt lib/* und die Revalidate-API-Route ab
cd cms      && npm test          # Vitest, deckt utils/slugify und hooks/revalidate-frontend ab
```

---

## Nützliche Befehle

```bash
# Logs verfolgen
docker compose logs -f cms frontend

# Mongo-Shell
docker compose exec mongo mongosh opendata

# Payload-Types regenerieren
cd cms && npm run generate:types

# Seed erneut laufen lassen (idempotent)
docker compose run --rm cms npm run seed
```
