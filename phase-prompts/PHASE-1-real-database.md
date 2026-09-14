# PHASE 1 — Real Database

> Paste into Antigravity once Phase 0 is merged and `PHASE_0_REPORT.md` says complete.
> Target: 2 weeks. This is the foundation phase — everything after it depends on this.

---

## CONTEXT

**SprintFlow** — Next.js 16 / React 19 / TypeScript Pomodoro-and-sprint planning app being taken to a sellable SaaS product. Phase 0 (security triage) is done; read `PHASE_0_REPORT.md` and `AUDIT_REPORT.md` before starting.

Today all user data — profile, tasks, sprints, timeline, rewards, settings, payment history — lives in a **single `data JSONB` column** per user (`src/lib/db.ts:409-446`), with a synchronous local `db.json` fallback. Any write rewrites the whole blob, so two concurrent actions silently destroy each other (finding DAT-01). This phase replaces that with a normalized relational schema.

Do this **before** billing. Subscriptions, payment history and webhook state all write to the database; building them on the blob means building them twice.

## STANDING RULES

1. **Scope lock.** Data layer only. Do not add features, do not redesign UI, do not start email/billing/tests work. Out-of-scope problems go in the Deferred list.
2. **Zero data loss.** A real user account exists in `db.json`. It must survive the migration intact and verifiable.
3. **No UI regressions.** Every page must look and behave identically when you're done. The only change is where the data comes from.
4. **Small commits, one concern each**, conventional-commit messages.
5. `npx tsc --noEmit` and `npm run build` must pass at every commit, not just the last.
6. Evidence — `file:line` or command output — for every claim.

## TASKS

### 1.1 — Choose and wire the ORM

- Install **Drizzle ORM** + `drizzle-kit` alongside the existing `postgres` driver.
- Set up `drizzle.config.ts`, a `src/db/schema.ts`, and a single connection module with proper pooling. One connection instance for the whole app — no per-request clients.
- Add `DATABASE_URL` to `.env.example` with a comment.
- Local dev must work: add a Postgres service to `docker-compose.yml` with a named volume so data persists between restarts.

### 1.2 — Design the schema

Derive the real shape from the existing blob (`src/lib/db.ts` types + actual `db.json` contents). Do not guess — read the data.

Minimum tables:

| Table | Notes |
|---|---|
| `users` | id (uuid pk), email (unique, citext or lowercased), password_hash, name, created_at, updated_at, email_verified_at (nullable — Phase 2 fills it) |
| `sessions` | id, user_id fk cascade, token (unique, indexed), expires_at (indexed), user_agent, created_at |
| `tasks` | id, user_id fk cascade, title, notes, status enum, priority enum, estimated_minutes, due_at, position, created_at, updated_at, completed_at |
| `subtasks` | id, task_id fk cascade, title, is_done, position |
| `sprints` | id, user_id fk cascade, task_id fk nullable, title, duration_minutes, priority, scheduled_for, started_at, completed_at, status enum |
| `sprint_events` | id, sprint_id fk cascade, type enum (start/pause/resume/skip/interrupt/complete), occurred_at, metadata jsonb — this is your analytics source of truth |
| `timeline_items` | id, user_id fk cascade, sprint_id fk nullable, date, start_minute, end_minute, kind |
| `reward_events` | id, user_id fk cascade, type, xp_delta, coin_delta, reason, occurred_at — append-only ledger, never a mutable counter |
| `user_settings` | user_id pk fk cascade, then one column per real setting (theme, focus durations, notification prefs, sound theme, volume) |
| `subscriptions` | id, user_id fk, plan, status enum, current_period_start/end, provider, provider_customer_id, provider_subscription_id, cancel_at_period_end — **create the table now, leave it empty; Phase 4 populates it** |
| `payments` | id, user_id fk, subscription_id fk nullable, amount_minor, currency, status, provider_payment_id (unique), occurred_at, raw jsonb — same: table now, logic in Phase 4 |

Rules for the schema:

- **Every table that holds user content has a `user_id` foreign key with `ON DELETE CASCADE.`** Account deletion from Phase 0 must still fully work afterwards — re-verify it.
- Real enums (Postgres enum types or check constraints), not free-text strings.
- `NOT NULL` wherever the data is genuinely required. Do not make everything nullable to avoid migration pain.
- Unique constraint on `users.email`, on `sessions.token`, on `payments.provider_payment_id`.
- Indexes on every column used in a `WHERE` or `ORDER BY`: `tasks(user_id, status)`, `sprints(user_id, scheduled_for)`, `sprint_events(sprint_id, occurred_at)`, `reward_events(user_id, occurred_at)`, `sessions(token)`, `sessions(expires_at)`.
- `created_at` / `updated_at` with database defaults on every table.
- Soft delete only where it has a purpose (`tasks`), hard delete elsewhere. Say which you chose and why.

Before writing a single migration, output the proposed schema as a summary table and a text ER description in your report. **Then implement it.**

### 1.3 — Migrations

- Generate real migration files with `drizzle-kit`. Commit them. Never edit a migration that has already run.
- Add `npm run db:generate`, `db:migrate`, `db:studio` scripts.
- The database must be reproducible from scratch: dropping it and running migrations gives a working empty app. Demonstrate this and paste the output.
- Add a `db:seed` script producing one demo user with realistic tasks, sprints and reward history — you will need it for Phase 3 analytics and for local dev.

### 1.4 — Rewrite the data access layer

- Replace `src/lib/db.ts` with a `src/db/` directory of focused repository modules: `users.ts`, `sessions.ts`, `tasks.ts`, `sprints.ts`, `rewards.ts`, `settings.ts`.
- **Delete the synchronous `fs.readFileSync` / `writeFileSync` fallback entirely** (DAT-02). Postgres is required in all environments. If `DATABASE_URL` is missing, fail loudly at startup with a clear message — do not silently fall back to a file.
- Every query is scoped by `user_id` taken from the **session**, never from the request body or a URL parameter. This is the single most important rule in this phase. A query that takes an ID from user input without also constraining on the session's `user_id` is an IDOR bug.
- Use transactions wherever more than one row changes together (completing a sprint writes a `sprint_event`, updates the `sprint`, and appends a `reward_event` — that is one transaction).
- No N+1 queries. Fetching a task list with subtasks is one query with a join or one batched follow-up, not one query per task.

### 1.5 — Migrate the existing data

- Write `scripts/migrate-from-json.ts` that reads the current `db.json` blob and writes it into the new tables.
- It must be **idempotent** (safe to run twice) and **verifiable** (prints counts before and after: N users, N tasks, N sprints, N reward events).
- Run it. Paste the output. Confirm the real account's tasks and history are all present.
- Archive `db.json` outside the repo afterwards; do not re-commit it.

### 1.6 — Update the API routes

- Point every route under `src/app/api/` at the new repositories.
- Add proper HTTP semantics while you're in there: 400 on validation failure, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict. No more "always 200 with an error field".
- Validate every request body with **Zod** at the route boundary. Server-side validation is the real validation; the client's is a convenience.
- Errors returned to the client must never include SQL text, stack traces, or file paths. Log the detail server-side, return a clean message.

### 1.7 — Backups

- Document a backup and restore procedure in `docs/OPERATIONS.md`: how to `pg_dump`, where backups go, how to restore, and how often. If the host (Neon/Supabase/Railway) provides automated backups, state the retention period.
- Actually perform one dump-and-restore into a scratch database and confirm the app runs against the restored copy. Paste the output.

## OUT OF SCOPE

Email sending and verification · password reset backend · payment gateway logic (create the tables, write no business logic) · replacing hardcoded analytics numbers (Phase 3) · tests · CI · ESLint cleanup · admin panel.

## DEFINITION OF DONE

- [ ] `src/lib/db.ts` monolith is gone; no `fs.readFileSync`/`writeFileSync` remains in `src/`
- [ ] `DATABASE_URL` unset → app fails fast with a clear error, never a silent file fallback
- [ ] Drop database → run migrations → seed → app works. Output pasted.
- [ ] Migration script run against the real `db.json`, with before/after counts matching
- [ ] Every user-content query is session-scoped — you list each one in the report with `file:line`
- [ ] Concurrency proof: two simultaneous writes to different parts of one user's data (e.g. complete a task while a sprint finishes) both persist. Demonstrate with a script that fires both in parallel, then reads back. This is the finding DAT-01 existed for.
- [ ] IDOR proof: create two test users, then attempt to read and mutate user A's task while authenticated as user B. Must 403/404 for every endpoint. List each endpoint tested.
- [ ] Account deletion still cascades fully — verify row counts drop to zero across all tables
- [ ] `npx tsc --noEmit` clean, `npm run build` passes
- [ ] Full manual pass: signup → onboarding → create tasks → generate sprints via AI → run a sprint to completion → check rewards → change settings → logout → login → data all still there

## DELIVERABLE

Write `PHASE_1_REPORT.md` in the repo root:

```
# Phase 1 Report — Real Database
Date · Start commit · End commit

## 1. Schema Delivered
Table list with columns, types, constraints, indexes. ER description in text.
Note anywhere the final schema differs from what you proposed, and why.

## 2. Task Status
| Task | Status | Commits | Evidence |

## 3. Data Migration Result
Before/after row counts. Anything that could not be migrated cleanly and what you did with it.

## 4. Tenancy & Authorization Audit
| Endpoint | Method | Session-scoped? | file:line |
Every route. No exceptions.

## 5. Verification Log
Concurrency test, IDOR test, drop-and-rebuild, backup restore — commands and real output.

## 6. Performance Notes
Query count per page load. Any query without an index. Anything that will hurt at 10k users.

## 7. Deferred
## 8. Blocked
```

End with:

```yaml
---
phase: 1
status: complete | partial
tables_created: N
migrations: N
rows_migrated: { users: N, tasks: N, sprints: N, reward_events: N }
idor_endpoints_tested: N
idor_failures: 0
concurrency_test_passed: true
build_passing: true
next_phase_blocked_by: []
---
```
