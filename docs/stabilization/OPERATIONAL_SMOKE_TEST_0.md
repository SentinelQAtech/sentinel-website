# Sentinel Core — Operational Smoke Test 0

Date: 2026-06-17
Branch: `stabilization/operational-corrections-sprint-1`
Starting commit: `9b4f487 Add operational corrections sprint real data flow`

## Purpose

Validate whether Sentinel Core can support a short real QA work cycle:

```text
Client -> Project -> Sprint -> QA Items -> Daily -> Board -> Bug -> Re-auth persistence
```

This smoke test does not change Reports, Calendar, or Learning.

## Test Path Audit

Available endpoints used by the test:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/clients`
- `GET /api/v1/clients?activeOnly=true`
- `POST /api/v1/projects`
- `GET /api/v1/projects`
- `POST /api/v1/sprints`
- `GET /api/v1/sprints?projectId=...`
- `POST /api/v1/qa-items`
- `POST /api/v1/qa-items/:id/send-to-daily`
- `PATCH /api/v1/qa-items/:id/daily-status`
- `GET /api/v1/qa-items`
- `GET /api/v1/qa-items/:id`
- `POST /api/v1/bugs`
- `GET /api/v1/bugs`

Relevant frontend hooks:

- `useClients`, `useActiveClients`, `useClientOptions`
- `useProjects`, `useCreateProject`
- `useSprints`, `useCreateSprint`
- `useQAItems`, `useCreateQAItem`, `useSendQAItemToDaily`, `useUpdateQAItemDailyStatus`
- `useBugs`, `useCreateBug`

## Authentication

The API supports local auth through:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
Authorization: Bearer <accessToken>
```

The smoke script creates an isolated user per run, which allows fixed S0 entity names without cross-run unique conflicts.

## Playwright Decision

Playwright exists in `apps/core/tests/e2e`, but local UI auth has recently been unstable and susceptible to throttling. For this sprint, the automated proof is API-based.

UI validation is still required manually through the checklist because the API baseline proves persistence and state sync, while the browser checklist proves navigation and rendering.

## Cleanup

The script prints all created IDs. Cleanup can be done later by prefix `S0` or by IDs:

- delete/archive QA Items via `DELETE /api/v1/qa-items/:id`
- delete bug via `DELETE /api/v1/bugs/:id`
- delete project via `DELETE /api/v1/projects/:id`
- delete client via `DELETE /api/v1/clients/:id`

## Command

Requires the API running at `http://localhost:3001/api/v1` by default.

```powershell
npm.cmd run smoke:operational:s0
```

Alternative API URL:

```powershell
$env:SENTINEL_API_URL='http://localhost:3001/api/v1'; npm.cmd run smoke:operational:s0
```
