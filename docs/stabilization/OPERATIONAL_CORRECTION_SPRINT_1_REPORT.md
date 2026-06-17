# Sentinel Core — Operational Correction Sprint 1 Report

Date: 2026-06-17
Branch: `stabilization/operational-corrections-sprint-1`

## Result

Sprint 1 corrected the main consistency gap: clients now have a backend/API source of truth, and the core operational flow validates through real API calls.

## Fixed

- Added backend `Client` model, migration, controller, service, module, DTOs, and React Query hooks.
- Replaced local client source in Clients, Projects, Team, QA Importer, Daily task creation, and Quick Create.
- Clients created in Clients now persist through `/clients` and invalidate shared client queries.
- Projects create through backend using real client options.
- Sprints now accept validated initial `status` and normalize HTML date inputs before Prisma writes.
- Daily task creation now creates a real `QAItem` with:
  - `sentToDaily = true`
  - `dailyDate = selectedDate`
  - `dailyStatus = todo/doing/blocked/done`
  - `workflowState = planned/in_testing/blocked/done`
- Board continues to consume real QAItems by `workflowState`.
- Bugs list endpoint now parses pagination values safely and loads an empty list without breaking.
- Team renders all active clients with one consistent pill component and safe sigla/color fallback.
- Dashboard default layout is less noisy and prioritizes operational widgets.
- Quick Create no longer performs fake creation. It now supports only real QA task and project creation.

## API Validation Evidence

Executed against local API on `http://localhost:3001/api/v1` using direct database connection.

```json
{
  "clientAppearsInActiveList": true,
  "projectAppearsInList": true,
  "sprintAppearsInProjectList": true,
  "dailyAppears": true,
  "boardPlannedAppears": true,
  "doingWorkflowState": "in_testing",
  "blockedWorkflowState": "blocked",
  "doneWorkflowState": "done",
  "reloginDailyStatus": "done",
  "reloginWorkflowState": "done",
  "bugsEndpointLoaded": true,
  "bugsTotal": 0
}
```

## Modules Validated

- Clients: create and active list.
- Projects: create and list.
- Sprints: create and project-scoped list.
- Daily: task created as QAItem.
- Board: planned item visible through workflow state.
- Daily/Board sync: Doing, Blocked, Done mapping persisted.
- Bugs: endpoint loads empty data.
- Auth persistence: relogin preserved final QAItem status.

## Pending / Risks

- Full browser/manual UI validation should still be run end to end after the app is deployed or started locally.
- Existing localStorage stores for older Daily/Team secondary data still exist, but clients are no longer sourced from localStorage for operational module linking.
- Production database migration needs the `20260617020000_add_clients` SQL applied in the target environment.
- Reports and Calendar were intentionally not touched.

## Tests

Required checks for this sprint:

- `npm.cmd run type-check:api` — passed.
- `npm.cmd run type-check:core` — passed.
- `npm.cmd run build:api` — passed.
- `npm.cmd run build:core` — passed with existing lint/build warnings in unrelated modules.
- `git diff --check` — passed.

## Next Steps

- Run manual browser validation for the 26-step checklist.
- Decide whether to migrate existing localStorage clients into backend clients for existing users.
- Add focused UI/E2E coverage for Clients -> Projects -> Sprints -> Daily -> Board once local auth throttling is stable.
