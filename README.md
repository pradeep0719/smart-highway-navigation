# Smart Highway Navigation

AI-powered smart highway navigation web application with live maps, intelligent route analysis, service road highlighting, joining road detection, alternate legal access routes, voice navigation, JWT authentication, and an admin dashboard.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, TypeScript, Tailwind CSS |
| Backend    | Node.js, Express.js, MongoDB/Mongoose |
| Maps       | Google Maps API, OpenStreetMap/OSRM/Overpass |
| Auth       | JWT (access + refresh tokens)       |

## Project Structure

```
smart-highway-navigation/
├── frontend/                 # React + Vite SPA
├── backend/                  # Express REST API
│   └── src/
│       ├── config/           # env, database
│       ├── controllers/      # Route handlers
│       ├── middleware/       # auth, errors
│       ├── models/           # User, NavigationRoute, SavedRoute
│       ├── routes/           # API routers
│       ├── services/         # OSM, Google Maps, routing, analyzer
│       └── utils/            # JWT, seed, formatters
├── deploy/                   # Docker (Phase 6)
├── .env.example
└── README.md
```

## Quick Start (Full Stack)

### Prerequisites

- Node.js 18+
- MongoDB running locally or Atlas URI

### 1. Configure environment

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

### 2. Start MongoDB

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or Docker
docker run -d -p 27017:27017 --name mongo mongo:7
```

### 3. Backend

```bash
cd backend
npm install
npm run dev
```

API: `http://localhost:5000/api`  
Health: `http://localhost:5000/api/health`

**Default admin** (auto-seeded on first start):

| Field    | Value                      |
|----------|----------------------------|
| Email    | `admin@smarthighway.local` |
| Password | `Admin@12345`              |

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user (auth required) |
| POST | `/api/auth/refresh` | Refresh access token |

### Routes (auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/routes/generate` | Generate highway route |
| POST | `/api/routes/:id/analyze` | Smart route analysis |
| GET | `/api/routes/:id/joining-roads` | Nearby joining roads |
| GET | `/api/routes/:id/alternates` | Alternate legal routes |
| GET | `/api/routes/service-roads` | Service roads in bounds |
| GET | `/api/routes/saved` | List saved routes |
| POST | `/api/routes/saved` | Save a route |

### Admin (admin role required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/role` | Update user role |
| DELETE | `/api/admin/users/:id` | Delete user |

## Backend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with file watch |
| `npm start` | Production start |
| `npm run seed` | Seed admin user only |

## Environment Variables

See [`.env.example`](.env.example), [`backend/.env.example`](backend/.env.example), and [`frontend/.env.example`](frontend/.env.example).

## Docker Deployment (Production)

One-command deploy with Docker Compose (MongoDB + API + nginx):

```bash
cd deploy
cp .env.example .env
# Edit .env — set JWT_SECRET, JWT_REFRESH_SECRET, ADMIN_PASSWORD

make deploy
# or: ./scripts/deploy.sh
```

| URL | Description |
|-----|-------------|
| http://localhost | Web app (nginx) |
| http://localhost/api/health | API health check |

**Dev overlay** (exposes API on :5000, web on :8080):

```bash
make deploy-dev
```

Full guide: [`deploy/README.md`](deploy/README.md)

### Architecture

```
Browser → nginx (web) → /api/* → Express (api) → MongoDB (mongo)
                      → /*     → React static build
```

## CI/CD

GitHub Actions workflows:

- **CI** (`.github/workflows/ci.yml`) — frontend build/lint, backend syntax check
- **Docker** (`.github/workflows/docker.yml`) — build and push images to GHCR on `main`

## Roadmap

1. ✅ Frontend
2. ✅ Backend + MongoDB models
3. ✅ API integrations (OSRM, Overpass, Google Maps)
4. ✅ Deployment (Docker Compose, nginx, CI/CD)

## License

MIT
