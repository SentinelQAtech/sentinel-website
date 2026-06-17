# Sentinel Core — Operational Smoke Test 0 Manual Checklist

Use this checklist after running `npm.cmd run smoke:operational:s0`.

Expected test data:

- Client: `S0 Client — Operational Smoke`
- Project: `S0 Project — QA Flow`
- Sprint: `S0 Sprint — Daily Board Validation`
- QA Items:
  - `S0 QA Item — Login validation`
  - `S0 QA Item — Dashboard smoke`
  - `S0 QA Item — Board sync validation`
- Bug: `S0 Bug — Blocked validation evidence`

## Checklist

1. Open Core local.
2. Log in.
3. Confirm Dashboard has no critical error.
4. Open Clients.
5. Confirm test client exists.
6. Open Projects.
7. Confirm test project exists.
8. Open Sprints.
9. Confirm test sprint exists.
10. Open QA Inbox.
11. Confirm 3 QA Items exist.
12. Open Daily.
13. Confirm daily items for today exist.
14. Open Board.
15. Confirm items are in the expected columns.
16. Manually change one item status.
17. Refresh.
18. Confirm persistence.
19. Logout/login.
20. Confirm persistence again.

## Manual Pass Criteria

- No module shows fake success.
- Created data is visible after refresh.
- Daily and Board agree on the same item states.
- The flow does not require localStorage-only operational data.
