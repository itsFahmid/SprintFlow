# SprintFlow — Phase Prompts for Antigravity

Six prompts, run in order. Each assumes the previous phase is **merged and its report written**.
Paste one whole file into Antigravity with the repo open. Don't run two at once.

| # | File | What it does | Target |
|---|---|---|---|
| 0 | `PHASE-0-stop-the-bleeding.md` | Secrets purge, CVEs, bcrypt, crypto tokens, middleware, real account deletion | 2–3 days |
| 1 | `PHASE-1-real-database.md` | Normalized Postgres + Drizzle + migrations + data migration | 2 weeks |
| 2 | `PHASE-2-real-auth.md` | Email provider, verification, real password reset, rate limiting | 1 week |
| 3 | `PHASE-3-make-the-lies-true.md` | Real analytics, server-side rewards, task persistence, durable timer, audio | 2 weeks |
| 4 | `PHASE-4-real-money.md` | Payment provider, webhooks, entitlement, dunning, usage metering | 2 weeks |
| 5 | `PHASE-5-launch-hardening.md` | Targeted tests, CI, Sentry, a11y, legal, docs, final scorecard | 1.5 weeks |

**~9 focused weeks.** With a full course load, plan against the calendar: four to five months.

## Before you start Phase 4

It has a decision block at the top you must fill in yourself — payment provider, market,
currency, prices, business entity. The agent cannot choose, and choosing wrong means a rebuild.
Verify your own merchant eligibility before committing to a provider.

## After each phase

The agent writes `PHASE_N_REPORT.md` ending in a YAML block. Bring that report back to Claude
before starting the next phase — the YAML is designed to be read as a checkpoint, and if a
phase came back `partial` or with `next_phase_blocked_by` populated, the next prompt needs
adjusting before you paste it.

## Rules baked into every prompt

- Scope lock — out-of-scope work goes in a Deferred list, not into the diff
- No UI regressions; the frontend is the strongest asset in this repo
- `tsc --noEmit` and `npm run build` clean at every commit
- Evidence (`file:line` or real command output) for every claim
- A Definition of Done checklist the agent must demonstrate, not assert

## Deliberately not in scope anywhere

**Teams, orgs, RBAC, multi-tenant workspaces.** SprintFlow is a single-user B2C focus timer —
per-user accounts *are* the tenancy model. The audit scored multi-tenancy 1/10 by applying a
B2B checklist to a B2C product. Building it would cost weeks and serve nobody.

**Admin back-office.** For your first hundred users, query the database by hand. Build it when
support volume forces you to.
