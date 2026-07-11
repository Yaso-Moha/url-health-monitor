# URL Health Monitor

A Dockerized full-stack application that continuously monitors website availability, uptime, and response times.

## Tech Stack

- Docker
- Docker Compose
- Node.js
- Express
- React
- PostgreSQL

## Features

- Add and delete monitored websites
- Automatic health checks with cron
- Manual check-now action
- Configurable check interval per website
- Pause and resume monitoring
- Incident tracking for downtime and recovery
- Optional webhook alerts with `ALERT_WEBHOOK_URL`
- Dashboard statistics
- Search, filter, sorting, and pagination
- Website details page
- Public status page for selected websites
- Response time chart
- Uptime percentage
- CSV export
- Dark and light mode

## Architecture

```text
frontend/          React + Vite dashboard
backend/           Express API using MVC folders
backend/models/    PostgreSQL query modules
backend/services/  Cron, health checks, incidents, alerts, migrations
postgres           Persistent database via Docker Compose volume
```

## Run With Docker

Clone the repository and start the full stack:

```bash
git clone https://github.com/Yaso-Moha/url-health-monitor.git
cd url-health-monitor
docker compose up --build
```

Open the app:

```text
http://localhost:5173
```

API:

```text
http://localhost:3000/api
```

PostgreSQL runs inside Docker and is initialized from `backend/init.sql`.

Copy `.env.example` to `.env` if you want to override defaults:

```bash
cp .env.example .env
```

Optional webhook alerts:

```text
ALERT_WEBHOOK_URL=https://your-webhook-url
```

## Local Development Without Docker

Start PostgreSQL first, then run:

```bash
cd backend
npm install
npm run dev
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /api/websites`
- `POST /api/websites`
- `GET /api/websites/:id`
- `PATCH /api/websites/:id`
- `POST /api/websites/:id/check`
- `DELETE /api/websites/:id`
- `GET /api/websites/public/status`
- `GET /api/history/:id`
- `GET /api/history/:id/incidents`
- `GET /api/health`

Example add website request:

```bash
curl -X POST http://localhost:3000/api/websites \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example",
    "url": "https://example.com",
    "tag": "Production",
    "checkIntervalSeconds": 60,
    "isPublic": true
  }'
```

## CI

GitHub Actions runs frontend lint/build, backend syntax checks, and Docker Compose validation on pushes and pull requests.

## Roadmap

- Multi-user authentication
- Email provider integration
- Multi-region monitoring workers
- Production deployment compose file
