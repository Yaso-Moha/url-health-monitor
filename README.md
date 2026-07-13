# 🔗 URL Health Monitor

<div align="center">

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-000?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker)](https://docs.docker.com/compose/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

**A Dockerized full-stack application** that continuously monitors website availability, uptime, and response times — with incident tracking, webhook alerts, and a modern dashboard.

</div>

---

## ✨ Features

| Category | Feature |
|----------|---------|
| 🔍 **Monitoring** | Automatic cron-based health checks with configurable intervals per website |
| 📊 **Dashboard** | Real-time statistics, uptime percentages, response time charts, and status overview |
| ⚡ **Manual Checks** | Trigger on-demand health checks for any monitored website |
| ⏸️ **Pause & Resume** | Temporarily pause monitoring for individual websites without deleting them |
| 🚨 **Incident Tracking** | Automatic detection and logging of downtime events with duration and recovery timestamps |
| 🔔 **Webhook Alerts** | Optional webhook notifications via `ALERT_WEBHOOK_URL` for downtime alerts |
| 📄 **Public Status Page** | Shareable status page for selected public websites |
| 📋 **CSV Export** | Export check history data to CSV for external analysis |
| 🔎 **Search & Filter** | Search, filter by tag, sort, and paginate through monitored websites |
| 🌓 **Dark & Light Mode** | Toggle between dark and light themes |
| 🗂️ **Tagging** | Organize websites with custom tags (e.g., "Production", "Staging") |
| 🐳 **Dockerized** | One-command startup with Docker Compose — frontend, backend, and PostgreSQL |
| 🔄 **CI/CD** | GitHub Actions pipeline for linting, building, and Docker Compose validation |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Docker Compose                       │
│                                                      │
│  ┌──────────────────┐   ┌─────────────────────────┐  │
│  │    Frontend       │   │        Backend           │  │
│  │  React + Vite     │◄──│    Express API           │  │
│  │  :5173            │   │    :3000                 │  │
│  │                   │   │                         │  │
│  │  • Dashboard      │   │  • REST API             │  │
│  │  • Status Page    │   │  • Cron Scheduler       │  │
│  │  • Charts         │   │  • Health Checker       │  │
│  │  • Dark/Light UI  │   │  • Incident Logger      │  │
│  └──────────────────┘   │  • Webhook Alerts        │  │
│                          │  • Rate Limiter          │  │
│                          └───────────┬─────────────┘  │
│                                      │                │
│                          ┌───────────▼─────────────┐  │
│                          │      PostgreSQL 16       │  │
│                          │      :5432               │  │
│                          │                          │  │
│                          │  • websites table        │  │
│                          │  • history table         │  │
│                          │  • incidents table       │  │
│                          └──────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Docker)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone & start

```bash
git clone https://github.com/Yaso-Moha/url-health-monitor.git
cd url-health-monitor
docker compose up --build
```

### 2. Open the app

| Service | URL |
|---------|-----|
| **Dashboard** | http://localhost:5173 |
| **API** | http://localhost:3000/api |
| **Health Check** | http://localhost:3000/api/health |

### 3. Configure (optional)

Copy the environment template and set your webhook URL for alerts:

```bash
cp .env.example .env
# Edit .env to set:
#   ALERT_WEBHOOK_URL=https://your-webhook-url
```

---

## 💻 Local Development (Without Docker)

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** 16 running locally

### 1. Start PostgreSQL, then:

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev
```

```bash
# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/websites` | List all monitored websites |
| `POST` | `/api/websites` | Add a new website to monitor |
| `GET` | `/api/websites/:id` | Get website details |
| `PATCH` | `/api/websites/:id` | Update website config |
| `POST` | `/api/websites/:id/check` | Trigger a manual health check |
| `DELETE` | `/api/websites/:id` | Remove a website |
| `GET` | `/api/websites/public/status` | Public status page data |
| `GET` | `/api/history/:id` | Check history for a website |
| `GET` | `/api/history/:id/incidents` | Incident log for a website |
| `GET` | `/api/health` | API health check |

### Example: Add a website

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

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────┐
│                  url_monitor                      │
├─────────────────┬───────────────┬────────────────┤
│    websites      │   history      │   incidents   │
├─────────────────┼───────────────┼────────────────┤
│ id              │ id            │ id            │
│ name            │ website_id    │ website_id    │
│ url             │ status        │ type          │
│ tag             │ status_code   │ started_at    │
│ check_interval  │ response_time │ ended_at      │
│ is_active       │ checked_at    │ duration_ms   │
│ is_public       │ error_message │ created_at    │
│ created_at      │ created_at    │               │
│ updated_at      │               │               │
└─────────────────┴───────────────┴────────────────┘
```

---

## 📁 Project Structure

```
url-health-monitor/
├── docker-compose.yml           # Multi-service Docker orchestration
├── .env.example                 # Environment variable template
├── frontend/                    # React + Vite dashboard
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page views (dashboard, details, status)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API client & data fetching
│   │   └── styles/              # Tailwind CSS
│   ├── Dockerfile
│   └── package.json
├── backend/                     # Express API server
│   ├── server.js                # Entry point
│   ├── config/db.js             # PostgreSQL connection pool
│   ├── controllers/             # Request handlers (url, history, website)
│   ├── middleware/               # Error handling, rate limiting, logging
│   ├── models/                  # Database query modules
│   ├── routes/                  # Express route definitions
│   ├── services/                # Core logic
│   │   ├── cronService.js       # Cron job scheduler
│   │   ├── healthService.js     # URL health check engine
│   │   ├── monitorService.js    # Monitoring orchestration
│   │   ├── alertService.js      # Webhook alert dispatch
│   │   └── schemaService.js     # Database migration/initialization
│   ├── init.sql                 # Database schema bootstrap
│   ├── Dockerfile
│   └── package.json
├── database/                    # (reserved for persistent data)
└── package.json                 # Root workspace config
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Recharts, React Router |
| **Backend** | Node.js, Express 4.x |
| **Database** | PostgreSQL 16 (via Docker volume) |
| **Scheduler** | node-cron |
| **Containerization** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |
| **Linting** | oxlint (frontend) |

---

## 🔑 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `postgres` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `url_monitor` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `password` | Database password |
| `ALERT_WEBHOOK_URL` | _(empty)_ | Webhook URL for downtime alerts |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window in ms |
| `RATE_LIMIT_MAX_REQUESTS` | `300` | Max requests per window |

---

## 🗺️ Roadmap

- [ ] Multi-user authentication
- [ ] Email notification provider
- [ ] Multi-region monitoring workers
- [ ] Production-optimized deployment compose file

---

## 📜 License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Yaso-Moha">Yaso-Moha</a>
</div>