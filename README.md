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
- Dashboard statistics
- Search, filter, sorting, and pagination
- Website details page
- Response time chart
- Uptime percentage
- CSV export
- Dark and light mode

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
- `DELETE /api/websites/:id`
- `GET /api/history/:id`
