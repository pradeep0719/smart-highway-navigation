# Deployment Guide

Production deployment uses **Docker Compose** with three services:

| Service | Image | Role |
|---------|-------|------|
| `mongo` | mongo:7 | MongoDB database |
| `api` | Custom (backend Dockerfile) | Express REST API on port 5000 (internal) |
| `web` | Custom (frontend Dockerfile) | nginx serves React build + proxies `/api` → `api` |

```
Browser → nginx (web:80) → /api/* → Express (api:5000) → MongoDB (mongo:27017)
                        → /*     → React static files
```

## Quick deploy

```bash
cd deploy
cp .env.example .env
# Edit .env — set JWT_SECRET, JWT_REFRESH_SECRET, ADMIN_PASSWORD

chmod +x scripts/*.sh
./scripts/deploy.sh
```

Open **http://localhost** (or your configured `HTTP_PORT`).

## Manual commands

```bash
cd deploy

# Production
docker compose up -d --build

# With dev ports exposed (API :5000, web :8080, Mongo :27017)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Logs
docker compose logs -f api
docker compose logs -f web

# Stop
docker compose down
```

## Environment variables

See [`.env.example`](.env.example). Critical production settings:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Access token signing key |
| `JWT_REFRESH_SECRET` | Refresh token signing key |
| `ADMIN_PASSWORD` | Initial admin password |
| `CLIENT_URL` | Public app URL for CORS (e.g. `https://nav.example.com`) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps (optional, build-time) |
| `HTTP_PORT` | Host port mapped to nginx (default `80`) |

## Custom domain / HTTPS

For production HTTPS, place a reverse proxy (Caddy, Traefik, or cloud load balancer) in front of the `web` service:

1. Set `CLIENT_URL=https://your-domain.com`
2. Point DNS to your server
3. Terminate TLS at the reverse proxy → forward to `web:80`

Example Caddyfile:

```
your-domain.com {
    reverse_proxy localhost:80
}
```

## Health checks

- API: `GET http://api:5000/api/health` (internal)
- Web: `GET http://web/` (internal)
- Public: `GET http://localhost/api/health`

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

- `ci.yml` — lint and build on push/PR
- `docker.yml` — build Docker images on main branch

## Troubleshooting

| Issue | Fix |
|-------|-----|
| API can't connect to Mongo | Wait for mongo healthcheck; check `docker compose logs mongo` |
| CORS errors | Set `CLIENT_URL` to exact browser URL (scheme + host + port) |
| Blank map / routing fails | OSRM/Nominatim are external; ensure server has outbound internet |
| 401 on all routes | Register a user or log in as seeded admin |
