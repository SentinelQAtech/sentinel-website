# Sentinel Core - Operational Smoke Test Sprint 0 - Report

## Execution Metadata

- Date/time: 2026-06-17 14:18:49 -03:00
- Branch: `stabilization/operational-corrections-sprint-1`
- Commit before this report: `9b4f487`
- Test mode used: API baseline with manual UI checklist pending
- Command used: `npm.cmd run smoke:operational:s0`
- API base URL: `http://localhost:3001/api/v1`

## Created Test Data

All created records use the `S0` prefix for future cleanup.

- User: `s0-smoke-20260617171809@sentinel.local`
- Client: `S0 Client — Operational Smoke`
- Project: `S0 Project — QA Flow`
- Sprint: `S0 Sprint — Daily Board Validation`
- QA Item 1: `S0 QA Item — Login validation`
- QA Item 2: `S0 QA Item — Dashboard smoke`
- QA Item 3: `S0 QA Item — Board sync validation`
- Bug: `S0 Bug — Blocked validation evidence`

## Created IDs

```json
{
  "userEmail": "s0-smoke-20260617171809@sentinel.local",
  "clientId": "cmqic461l0002jdf8n818thn2",
  "projectId": "cmqic46dy0004jdf8p47fobzd",
  "sprintId": "cmqic47mz0006jdf8m06e1cai",
  "qaItemIds": [
    "1cf52838-2c7a-465c-a378-557d8ff0dcc9",
    "ebd746b6-740a-453f-8363-5e99e198938c",
    "2e4347ac-d7ec-41ae-8056-ef848d69f50d"
  ],
  "bugId": "cmqic4lnl0008jdf80ra8ueze"
}
```

## Result

```json
{
  "clientCreated": true,
  "projectCreated": true,
  "sprintCreated": true,
  "qaItemsCreated": 3,
  "dailyItemsVisible": 3,
  "boardItemsVisible": 3,
  "doingWorkflowState": "in_testing",
  "blockedWorkflowState": "blocked",
  "doneWorkflowState": "done",
  "persistenceAfterRefreshEquivalent": true,
  "bugsEndpointLoaded": true,
  "manualUiValidationRequired": true
}
```

## What Was Proven

- Client creation persisted after a new authenticated query.
- Project creation persisted and remained linked to the client.
- Sprint creation persisted and remained linked to the project/client.
- Three QA Items were created and persisted.
- Sending QA Items to Daily made all three visible through the Daily API.
- Board-equivalent QA Item queries reflected all three workflow states.
- Daily status changes synchronized with workflow state:
  - `doing` mapped to `in_testing`
  - `blocked` mapped to `blocked`
  - `done` mapped to `done`
- A new login with the same test user could still read the created QA Items.
- Bug creation and bug listing endpoint loaded successfully.

## Failures Found

- No product flow failure was found in the API baseline smoke test.
- The first API readiness attempt was affected by stale local `.tmp-api-out.log` data, not by Sentinel behavior. The API was restarted and readiness was validated again before the smoke test ran.

## Risks

- Manual UI validation is still required because this run intentionally used the API as the stable baseline.
- The current proof validates the operational data contract, persistence, and status synchronization, but it does not prove that every Core screen renders the same state without visual or cache issues.
- Cleanup is manual for now. The S0 prefix and created IDs are documented so data can be removed safely later.

## Manual Points Still Pending

- Open Core locally and confirm Dashboard has no critical error.
- Confirm the test Client, Project, Sprint, QA Inbox, Daily, and Board through the UI.
- Change one item manually in the UI.
- Refresh and confirm the state remains correct.
- Logout/login and confirm the state remains correct.

## Recommendation For Next Sprint

Next sprint should turn this API baseline into a hybrid validation:

1. Keep `scripts/operational-smoke-test-0.ts` as the data contract guard.
2. Add a smaller Playwright UI smoke test only for login, navigation, and visual confirmation of the same S0 records.
3. Add a cleanup script or endpoint-safe cleanup mode for records with the `S0` prefix.
4. Only after the UI smoke is stable, use this flow as the daily confidence check before operational changes.

Current answer to the operational question:

> I would trust the backend data flow for QA work tomorrow, with manual UI validation still required before trusting the full browser workflow as the single source of daily operation.
