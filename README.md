# Sentinel Core

> Internal QA operations platform for Sentinel Tech - QA, focused on quality workflows, delivery visibility, and operational intelligence.

## Repositorio canonico

Este projeto agora usa como origem principal:

`https://github.com/SentinelQAtech/sentinel-website`

Documentacao operacional:

- [Inventario dos projetos](docs/PROJECT_INVENTORY.md)
- [Roadmap do monorepo](docs/MONOREPO_ROADMAP.md)
- [Deploy Vercel](docs/VERCEL_DEPLOY.md)
- [DNS do dominio](docs/DOMAIN_DNS.md)
- [Estrategia de rotas](docs/ROUTING_STRATEGY.md)

---

## Stack

| Layer     | Tech                                                      |
|-----------|-----------------------------------------------------------|
| Frontend  | Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion |
| Backend   | NestJS 10, Node.js 20, TypeScript                        |
| Database  | PostgreSQL 16 + Prisma ORM                               |
| Auth      | JWT + Refresh Tokens (bcrypt)                            |
| Realtime  | Socket.IO                                                |
| Deploy    | Docker, Docker Compose, Vercel (web), Railway (API)      |
| Monorepo  | Turborepo                                                |

---

## Modules

| Module          | Description                                         |
|-----------------|-----------------------------------------------------|
| Auth            | Login, register, JWT, refresh token, roles          |
| Dashboard       | Metrics, charts, activity feed, team presence       |
| Projects        | CRUD, members, progress, tags, filtering            |
| Kanban          | Drag & drop board with 6 columns, dnd-kit           |
| Bug Tracker     | Full bug lifecycle, severities, attachments, logs   |
| Sprints         | Sprint planning, burndown chart, velocity           |
| Reports         | Analytics, team productivity, velocity history      |
| Notifications   | Real-time via Socket.IO + in-app history            |

---

## API Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

GET    /api/v1/users

GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
POST   /api/v1/projects/:id/members/:userId
DELETE /api/v1/projects/:id/members/:userId

GET    /api/v1/tasks?projectId=
POST   /api/v1/tasks
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id/move
DELETE /api/v1/tasks/:id

GET    /api/v1/bugs?projectId=&severity=&status=&search=
POST   /api/v1/bugs
GET    /api/v1/bugs/stats
GET    /api/v1/bugs/:id
PATCH  /api/v1/bugs/:id
DELETE /api/v1/bugs/:id

GET    /api/v1/sprints?projectId=
POST   /api/v1/sprints
GET    /api/v1/sprints/:id
GET    /api/v1/sprints/:id/burndown
PATCH  /api/v1/sprints/:id
DELETE /api/v1/sprints/:id

GET    /api/v1/notifications
GET    /api/v1/notifications/unread-count
PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/read-all

GET    /api/v1/reports/dashboard-stats
GET    /api/v1/reports/bug-trend?days=30
GET    /api/v1/reports/sprint-velocity?projectId=
GET    /api/v1/reports/team-productivity?projectId=
```

---

## User Roles

| Role           | Permissions                                      |
|----------------|--------------------------------------------------|
| ADMIN          | Full access                                      |
| PROJECT_MANAGER| Manage projects, sprints, team                   |
| QA_ANALYST     | Create/manage bugs, write test cases             |
| QA_ENGINEER    | Full QA operations + automation                  |
| DEVELOPER      | Manage tasks, update bugs                        |
| CLIENT_VIEWER  | Read-only access to assigned projects            |

---

## Quick Start

```bash
# Clone and install
git clone <repo>
cd sentinel-core
npm install

# Start database
docker-compose up -d postgres redis

# Setup database
npm run db:migrate
npm run db:generate

# Start dev servers (both simultaneously)
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs

---

## Project Structure

```
sentinel-core/
├── apps/
│   ├── web/              # Next.js 15 frontend
│   │   └── src/
│   │       ├── app/      # App Router pages
│   │       ├── components/
│   │       ├── lib/      # utilities, API client
│   │       ├── hooks/
│   │       ├── store/
│   │       └── types/
│   └── api/              # NestJS backend
│       └── src/
│           ├── modules/  # auth, users, projects, bugs, sprints...
│           ├── prisma/
│           └── common/
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
└── turbo.json
```

---

## Design System

- Dark mode native (surface-950 base)
- Primary: Indigo `#6366f1` with neon glow effects
- Accent: Cyan `#06b6d4`
- Secondary: Violet `#8b5cf6`
- Glass morphism cards (`glass-card`, `glass-card-hover`)
- Gradient text, neon borders, skeleton loading states
- Full responsive (mobile → 4K)

---

## Roadmap

- [ ] AI Assistant (test case generation, bug summarization)
- [ ] Time tracking per task
- [ ] Integrations: GitHub, Jira, Slack webhooks
- [ ] Multi-workspace support
- [ ] Custom workflows & automation rules
- [ ] Mobile app (React Native)
- [ ] Public API & webhooks

---

© 2026 Sentinel Tech · All rights reserved.
