# Daily Integration Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir a recomposicao do JWT interno, o envio de QA Items ao Daily e a integracao Calendar/Daily sobre `daily_meetings`.

**Architecture:** A sessao Supabase restaura automaticamente a sessao interna da API. Reunioes passam a ser lidas e gravadas pela API; um sincronizador idempotente migra uma vez apenas reunioes locais futuras, sem apagar o legado.

**Tech Stack:** Next.js 15, React 19, TanStack Query, Zustand, Supabase Auth, Axios, NestJS/Prisma, node:test via tsx.

---

### Task 1: Recomposition of the internal API session

**Files:**
- Modify: `apps/core/src/lib/auth-service.ts`
- Create: `apps/core/src/lib/auth-session.test.ts`

- [ ] Write a failing test proving a restored Supabase token exchanges internal tokens, persists them and confirms `/auth/me`.
- [ ] Run `npx tsx --test apps/core/src/lib/auth-session.test.ts` and confirm the expected failure.
- [ ] Add a small dependency-injected session restoration helper and call it from `getCurrentUser` when the internal token is absent or rejected.
- [ ] Re-run the test and confirm it passes.

### Task 2: Honest QA to Daily feedback

**Files:**
- Modify: `apps/core/src/components/qa-importer/qa-client.tsx`
- Modify: `apps/core/src/components/daily/add-item-modal.tsx`
- Modify: `apps/core/src/components/qa-importer/qa-card.tsx`

- [ ] Make card actions expose pending state and disable duplicate submits.
- [ ] Move success feedback to mutation success and display API errors with `react-hot-toast` plus inline error in the Daily modal.
- [ ] Preserve list-prefix invalidation from `useQAItems` and verify both unfiltered and Daily-filtered keys are invalidated.

### Task 3: Calendar meetings use the Daily API

**Files:**
- Create: `apps/core/src/lib/calendar-meeting-sync.ts`
- Create: `apps/core/src/lib/calendar-meeting-sync.test.ts`
- Modify: `apps/core/src/components/calendar/add-event-modal.tsx`
- Modify: `apps/core/src/components/calendar/calendar-client.tsx`
- Modify: `apps/core/src/hooks/useDaily.ts`

- [ ] Write failing tests for normalized identity, future-only selection and duplicate avoidance by title/date/time.
- [ ] Run `npx tsx --test apps/core/src/lib/calendar-meeting-sync.test.ts` and confirm failures.
- [ ] Implement the pure selection/mapping helpers.
- [ ] Make meeting creation use `useCreateDailyMeeting`; keep non-meeting events in Zustand.
- [ ] Merge API meetings with local non-meeting events in Calendar and route meeting deletion through `useDeleteDailyMeeting`.
- [ ] Add the one-time per-user migration. Mark complete only after all eligible events succeed; keep pending and toast/log errors otherwise.
- [ ] Re-run tests and confirm they pass.

### Task 4: Verification and production smoke

**Files:**
- Verify all changed files above.

- [ ] Run focused tests with `npx tsx --test apps/core/src/lib/auth-session.test.ts apps/core/src/lib/calendar-meeting-sync.test.ts`.
- [ ] Run `npm run type-check --workspace @sentinel-core/core`.
- [ ] Run `npm run build --workspace @sentinel-core/core`.
- [ ] Validate restored Supabase session, QA to Daily and Calendar meeting persistence using the required RECOVERY test names.
- [ ] Delete temporary QA/meeting records and confirm zero matches remain.
- [ ] Commit only the scoped changes and push the current branch.
