# URL Health Monitor
## Project Context for Codex

## Implementation Status

Completed in this workspace:

- Priority 1: Add Website Modal
- Priority 2: Delete Website
- Priority 3: Website Details Page
- Priority 4: History Timeline
- Priority 5: Auto Refresh
- Priority 6: Improved Time Formatting
- Priority 7: Loading States
- Priority 8: Search
- Priority 9: Filter
- Priority 10: Sorting

Remaining:

- Additional future enhancements only.

Nice-to-have enhancements completed:

- Response Time Chart
- Uptime Percentage
- Website Favicon
- Animated Statistics
- CSV Export
- Dark/Light Mode
- Pagination

---

This is NOT a tutorial project and NOT a university assignment.

This project is intended to become a polished GitHub portfolio project and be showcased on LinkedIn to demonstrate professional full-stack development skills.

The focus is clean architecture, production-quality code, good UI/UX, Docker usage, PostgreSQL, Express, React, and modern development practices.

Do NOT rewrite the project.

Improve and extend the existing codebase while preserving the current architecture.

---

# Tech Stack

Frontend
- React (Vite)
- TailwindCSS
- Axios
- Lucide React

Backend
- Node.js
- Express
- PostgreSQL
- Docker
- Docker Compose
- Cron Jobs

Architecture
- MVC
- REST API

---

# Current Folder Structure

backend/
    config/
    controllers/
    models/
    routes/
    services/
    server.js

frontend/
    src/
        components/
        pages/
        services/
        App.jsx
        main.jsx

---

# Backend Status

Completed

✔ Express API

✔ PostgreSQL connection

✔ Dockerized backend

✔ MVC architecture

✔ Cron service checks websites every minute

✔ Stores latest status

✔ Stores response time

✔ Stores history

✔ Website model

✔ History model

✔ Website controller

✔ History controller

✔ Website routes

✔ History routes

✔ API connected to frontend

---

# Existing Endpoints

GET /api/websites

POST /api/websites

GET /api/history/:id

---

# Frontend Status

Completed

✔ Dashboard

✔ Navbar

✔ Statistics Cards

✔ Website Cards

✔ Tailwind styling

✔ Axios API service

✔ Reads data from backend

✔ Displays live statistics

✔ Displays monitored websites

---

# Current UI

Dashboard displays

- Total Websites

- Online Websites

- Offline Websites

- Average Response Time

- Website Cards

Everything is functioning correctly.

---

# Coding Rules

Keep components reusable.

Use React Hooks only.

Use async/await.

Keep backend MVC.

Avoid duplicated code.

Write readable code.

Use proper error handling.

Do not introduce unnecessary libraries.

Only install packages if they provide significant value.

---

# Priority Tasks

## Priority 1

Complete Add Website Modal.

Current button already exists.

Requirements

- Open modal

- Form validation

- Website Name

- Website URL

- Cancel button

- Add button

POST to

/api/websites

Close modal after success.

Refresh dashboard automatically.

Display success notification.

Display error notification if request fails.

---

## Priority 2

Delete Website

Backend

Create

DELETE /api/websites/:id

Frontend

Add trash icon to Website Card.

Confirmation dialog before deletion.

Refresh dashboard.

---

## Priority 3

Website Details Page

React Router

/website/:id

Display

Website information

Current status

Latest response time

History timeline

Recent checks

---

## Priority 4

History Timeline

Use

GET /api/history/:id

Display

Timestamp

Status

Response Time

HTTP Code

Newest first.

---

## Priority 5

Auto Refresh

Dashboard refresh every 10 seconds.

Do not refresh the whole page.

Use polling.

---

## Priority 6

Improve Time Formatting

Instead of

2026-07-09T13:20:00.234Z

Display

Just now

2 minutes ago

1 hour ago

Yesterday

---

## Priority 7

Loading States

Skeleton cards while loading.

Better empty state.

---

## Priority 8

Search

Search by

Website name

URL

Realtime filtering.

---

## Priority 9

Filter

All

Online

Offline

---

## Priority 10

Sorting

Newest

Oldest

Fastest Response

Slowest Response

Alphabetical

---

# Nice To Have

Response Time Chart

Uptime Percentage

Website Favicon

Animated Statistics

CSV Export

Dark/Light Mode

Pagination

---

# UI Goal

The UI should resemble a modern SaaS monitoring dashboard.

Characteristics

- Clean

- Spacious

- Premium

- Responsive

- Smooth animations

- Professional color palette

Avoid flashy effects.

Prioritize readability.

---

# Important

Do NOT break existing APIs.

Do NOT rewrite architecture.

Do NOT change folder structure unless absolutely necessary.

Keep commits focused on one feature at a time.

If creating new files, organize them logically.

Always ensure the application remains fully functional after each feature.
