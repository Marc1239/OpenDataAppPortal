# Open Data App Portal

Kuratiertes, redaktionell gepflegtes Verzeichnis von Open-Data-Anwendungen. Bürgerinnen und Bürger finden hier konkrete Apps auf Basis offener Daten, Entwicklerinnen und Entwickler sehen zu jeder App Datenquelle, API, Lizenz und Repository.

Das Projekt besteht aus zwei Services plus Datenbank:

- **[frontend/](frontend/)**: öffentliche Website, Next.js 15 (App Router), Port 3000
- **[cms/](cms/)**: Payload CMS v3 für Apps, Kategorien, Tags, Medien und globale Inhalte, Port 3001
- **MongoDB 7** als Datenbank des CMS

Das Frontend liest alle Inhalte über die REST-API des CMS. Speichert eine Redakteurin im CMS eine Änderung, ruft ein `afterChange`-Hook den Endpoint `/api/revalidate` des Frontends auf (abgesichert über den Header `x-revalidate-secret`). Next.js invalidiert daraufhin gezielt die betroffenen Cache-Tags, etwa `apps` oder `app:<slug>`.

## Voraussetzungen

- Docker Engine mit Compose-Plugin (lokal reicht Docker Desktop)
- 4 GB RAM auf der Maschine, die die Images baut. Der Next.js-Build bricht auf kleineren Servern ab.
- Node.js 20 nur für die Entwicklung ohne Docker

## Schnellstart (lokal)

```bash
git clone https://github.com/Marc1239/OpenDataAppPortal.git
cd OpenDataAppPortal
cp .env.example .env
# PAYLOAD_SECRET und REVALIDATE_SECRET setzen, Werte erzeugt z. B.:
#   openssl rand -hex 32
docker compose up -d --build
docker compose run --rm cms npm run seed
```

Danach läuft alles:

- Frontend: http://localhost:3000
- CMS-Admin: http://localhost:3001/admin (Login: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` aus der `.env`)
- REST-API: http://localhost:3001/api

Der Seed legt den Admin-Benutzer an, importiert die Beispiel-Apps aus `cms/src/scripts/source-data/` (Dresdner Open-Data-Anwendungen) und füllt die Globals für Hero, Kontaktseite und Site-Settings. Der Seed ist idempotent, ein zweiter Lauf richtet keinen Schaden an.

## Betrieb auf dem eigenen Server

Zielbild: ein Linux-Server (getestet mit Ubuntu 24.04), auf dem der komplette Stack per Docker Compose läuft. Zwei Betriebsarten stehen zur Wahl. Variante A kommt ohne Domain aus und liefert HTTP über die Server-IP. Variante B nutzt eigene Domains und bekommt automatisch HTTPS über den mitgelieferten Caddy-Proxy.

### Server vorbereiten (beide Varianten)

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# neu einloggen, damit die Gruppenmitgliedschaft greift

git clone https://github.com/Marc1239/OpenDataAppPortal.git /opt/opendataappportal
cd /opt/opendataappportal
cp .env.example .env
```

In der `.env` immer setzen: `PAYLOAD_SECRET`, `REVALIDATE_SECRET` (jeweils `openssl rand -hex 32`) sowie `SEED_ADMIN_EMAIL` und ein starkes `SEED_ADMIN_PASSWORD`.

### Variante A: Zugriff über die Server-IP (HTTP)

`FRONTEND_DOMAIN` und `CMS_DOMAIN` in der `.env` leer lassen oder die Zeilen löschen. Daran erkennt `scripts/deploy.sh` den IP-Modus und startet ohne Caddy. Zusätzlich die öffentlichen URLs auf die Server-IP stellen:

```bash
SITE_URL=http://203.0.113.10:3000
NEXT_PUBLIC_PAYLOAD_URL=http://203.0.113.10:3001
PAYLOAD_PUBLIC_SERVER_URL=http://203.0.113.10:3001
FRONTEND_URL=
```

`FRONTEND_URL` bleibt leer. Docker Compose fällt dann auf die containerinterne Adresse `http://frontend:3000` zurück, über die der Revalidate-Webhook das Frontend direkt erreicht.

Ports 3000 und 3001 in der Firewall freigeben, dann starten:

```bash
docker compose up -d --build
docker compose run --rm cms npm run seed
```

Frontend und CMS-Admin sind anschließend unter `http://<server-ip>:3000` bzw. `http://<server-ip>:3001/admin` erreichbar. Browser markieren die Seite als "nicht sicher", weil kein TLS im Spiel ist. Für einen öffentlichen Auftritt ist Variante B die bessere Wahl.

### Variante B: eigene Domain mit HTTPS

1. Zwei DNS-A-Records auf die Server-IP zeigen lassen, z. B. `portal.example.com` und `cms.example.com`.
2. In der `.env` die Domains eintragen:

   ```bash
   FRONTEND_DOMAIN=portal.example.com
   CMS_DOMAIN=cms.example.com
   SITE_URL=https://portal.example.com
   ```

   Die übrigen URL-Variablen setzt das Prod-Overlay (`docker-compose.prod.yml`) aus den Domains selbst.
3. Ports 80 und 443 freigeben, dann starten:

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   docker compose run --rm cms npm run seed
   ```

Der Caddy-Container holt die Let's-Encrypt-Zertifikate beim ersten Request selbst. Nach wenigen Sekunden antworten beide Domains per HTTPS; die Ports 3000/3001 bleiben in dieser Variante nach außen geschlossen.

### Eigene Inhalte statt Beispieldaten

Wer mit leerem Katalog starten will, lässt den Seed weg. Payload fragt beim ersten Aufruf von `/admin` nach dem ersten Benutzer. Apps, Kategorien und Tags entstehen danach komplett im Admin-Panel. Die Beispieldaten in `cms/src/scripts/source-data/` lassen sich auch durch eigene JSON-Dateien ersetzen, der Seed importiert dann diese.

### Updates einspielen

```bash
cd /opt/opendataappportal
git pull
./scripts/deploy.sh
```

Das Skript erkennt anhand der `.env`, ob IP- oder Domain-Modus läuft, baut beide Images neu, startet den Stack, wartet bis CMS und Frontend `running` melden, spielt die Kategorie-Migration ein, synchronisiert den Katalog-Seed und räumt alte Images weg.

### Backups

Zwei Dinge sind sicherungswürdig: die Mongo-Datenbank und die hochgeladenen Medien.

```bash
# Datenbank, täglich per Cron um 3 Uhr
0 3 * * * docker exec odap_mongo mongodump --archive --gzip > /backups/mongo-$(date +\%F).gz

# Medien-Volume
docker run --rm -v cms_media:/src -v /backups:/dst alpine \
  tar czf /dst/media-$(date +%F).tgz -C /src .
```

Wiederherstellung:

```bash
docker exec -i odap_mongo mongorestore --archive --gzip --drop < /backups/mongo-2026-07-07.gz
docker run --rm -v cms_media:/dst -v /backups:/src alpine \
  tar xzf /src/media-2026-07-07.tgz -C /dst
```

## Umgebungsvariablen

Alle Variablen stehen kommentiert in [.env.example](.env.example). Die wichtigsten:

| Variable | Pflicht | Zweck |
| --- | --- | --- |
| `PAYLOAD_SECRET` | ja | Signiert Payload-Sessions. Langer Zufallswert. |
| `REVALIDATE_SECRET` | ja | Gemeinsames Secret für den Revalidate-Webhook zwischen CMS und Frontend. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | für Seed | Zugangsdaten des ersten Admin-Benutzers. |
| `SITE_URL` | empfohlen | Öffentliche Basis-URL des Frontends für kanonische Links, Open Graph und Teilen-URLs. Leer: wird aus dem Request-Host abgeleitet. |
| `NEXT_PUBLIC_PAYLOAD_URL` | Variante A | Öffentliche CMS-URL, unter der der Browser Bilder lädt. |
| `PAYLOAD_PUBLIC_SERVER_URL` | Variante A | Öffentliche URL des CMS für Admin-UI und CORS. |
| `FRONTEND_URL` | nein | Ziel des Revalidate-Webhooks. Leer lassen, dann nutzt das CMS die containerinterne Adresse. |
| `PAYLOAD_REVALIDATE` | nein | Cache-Fenster in Sekunden für Fetches ohne Tag-Treffer. Default 60. |
| `FRONTEND_DOMAIN` / `CMS_DOMAIN` | Variante B | Domains für den Caddy-Proxy. Ihr Vorhandensein schaltet `deploy.sh` in den Domain-Modus. |

## Entwicklung ohne Docker

Frontend:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000
```

CMS (setzt eine laufende MongoDB voraus, z. B. `docker compose up -d mongo`):

```bash
cd cms
cp .env.example .env
npm install
npm run dev        # http://localhost:3001/admin
npm run seed       # einmalig
```

## Tests

```bash
cd frontend && npm test   # Vitest: lib/* und die Revalidate-API-Route
cd cms && npm test        # Vitest: utils/slugify und den Revalidate-Hook
```

Die CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) führt bei jedem Push für beide Services `npm ci`, `typecheck`, `test` und `next build` aus und baut zusätzlich beide Docker-Images zur Probe.

## Automatisches Deployment (optional)

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) deployt per SSH auf den eigenen Server, sobald die CI auf `main` grün ist. Wer das in einem Fork nutzen will, hinterlegt unter *Settings → Secrets and variables → Actions*:

| Typ | Name | Zweck |
| --- | --- | --- |
| Secret | `HETZNER_SSH_HOST` | IP oder Hostname des Servers |
| Secret | `HETZNER_SSH_USER` | SSH-Benutzer, z. B. `deploy` |
| Secret | `HETZNER_SSH_KEY` | Privater SSH-Key (PEM); der Public Key gehört in `authorized_keys` auf dem Server |
| Secret | `HETZNER_SSH_PORT` | Optional, Default 22 |
| Secret | `HETZNER_DEPLOY_PATH` | Repo-Pfad auf dem Server, z. B. `/opt/opendataappportal` |
| Variable | `FRONTEND_DOMAIN` | Domain für den Smoke-Test nach dem Deploy |

Der Workflow verbindet sich per SSH, setzt das Repo auf `origin/main` und führt `scripts/deploy.sh` aus. Ohne diese Secrets bleibt der Workflow wirkungslos, manuelles Deployen per `deploy.sh` funktioniert unabhängig davon.

## Projektstruktur

```
OpenDataAppPortal/
├── frontend/                # Next.js 15 (App Router, RSC)
│   ├── app/                 # Routes: /, /apps, /apps/[slug], /ueber, /kontakt, /einreichen
│   ├── components/          # UI-Komponenten (Top-Bar, App-Karten, Filter, Footer)
│   ├── lib/payload.ts       # typisierter REST-Client mit Tag-Revalidation
│   └── Dockerfile
├── cms/                     # Payload CMS v3
│   ├── src/collections/     # Users, Media, Categories, Tags, Apps
│   ├── src/globals/         # HeroFeature, ContactInfo, SiteSettings
│   ├── src/hooks/           # revalidate-frontend (afterChange-Webhook)
│   ├── src/scripts/         # seed.ts, Migrationen, Beispieldaten
│   └── Dockerfile
├── scripts/deploy.sh        # Build + Restart auf dem Server, erkennt IP-/Domain-Modus
├── docker-compose.yml       # mongo + cms + frontend
├── docker-compose.prod.yml  # Overlay: Caddy-Proxy, HTTPS, geschlossene Ports
└── .env.example
```

## Nützliche Befehle

```bash
docker compose logs -f cms frontend        # Logs beider Services verfolgen
docker compose exec mongo mongosh opendata # Mongo-Shell öffnen
docker compose run --rm cms npm run seed   # Seed erneut ausführen (idempotent)
cd cms && npm run generate:types           # Payload-Typen nach Schema-Änderung regenerieren
```
