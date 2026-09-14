# PHASE 5 — Launch Hardening

> Paste into Antigravity once Phase 4 is merged and `PHASE_4_REPORT.md` says complete.
> Target: 1.5 weeks. This is the last phase before you can charge a stranger.

---

## CONTEXT

**SprintFlow** — Next.js 16 / React 19 / TypeScript focus-sprint app. Phases 0–4 are done: security triaged, relational Postgres, real auth and email, every displayed number real, real payments with webhook-driven entitlement. Read all five prior reports and `AUDIT_REPORT.md` first.

What remains is everything that stops a launch from becoming a disaster you can't see: no tests, no CI, no error tracking, 72 ESLint errors, an untouched README template, missing accessibility work, and missing legal surface.

**Test scope is deliberately narrow.** Do not chase coverage percentages. Test the paths where a bug costs money, loses data, or leaks access — and nothing else. A solo pre-launch product does not need 80% coverage; it needs confidence in auth, billing, and data.

## STANDING RULES

1. **Scope lock.** Hardening only. No new features, no redesign, no refactor for its own sake.
2. **Fix, don't suppress.** Do not silence an ESLint rule to make the count go down. If a rule genuinely doesn't apply, disable it in config with a written justification, not with inline `eslint-disable` scattered through files.
3. Small commits, conventional messages.
4. Evidence for every claim.

## TASKS

### 5.1 — Targeted test suite

Set up **Vitest** for unit/integration and **Playwright** for end-to-end. Then test only these:

**Must have unit/integration coverage:**
- Password hashing and verification
- Session creation, validation, expiry, invalidation
- Token generation, single-use enforcement, expiry (verification + reset)
- Every entitlement rule from Phase 4 — table-driven, one case per plan/status combination
- Webhook signature verification (valid, invalid, replayed, out-of-order)
- Reward ledger derivation and idempotency
- Analytics aggregation against a fixed seed with hand-checked expected values
- Rate limiter behaviour at and over the limit
- Every Zod schema's rejection cases

**Must have E2E coverage:**
- Signup → verify email → onboarding → first sprint → completion → rewards update
- Login → wrong password → lockout → reset password → login with new password
- Free user hits AI quota → sees the cap → upgrades → quota lifts
- Checkout (test card) → webhook → Pro unlocked → cancel → access until period end
- Account deletion → data actually gone → login fails

**Explicitly do not test:** styling, animation, static marketing copy, third-party library internals.

Every test must be deterministic. No `sleep`-based waits, no dependence on wall-clock time or network flakiness. Tests run against a disposable database that migrations build from scratch.

### 5.2 — CI/CD

- GitHub Actions workflow on every push and PR: install → `tsc --noEmit` → lint → unit tests → build → E2E against a service-container Postgres.
- Fail the build on any step. A red CI that everyone ignores is worse than no CI.
- `npm audit --audit-level=high` as a gate, plus Dependabot or Renovate for updates.
- A secret-scanning step (gitleaks or equivalent) so Phase 0's `db.json` incident cannot recur.
- Document the deploy: target host, environment variables, build command, migration step, rollback procedure. Migrations must run before the new code goes live, and must be backward-compatible with the previous version for the length of a deploy.
- Separate **staging** and **production** environments with separate databases and separate provider keys. Never test a payment flow against production.

### 5.3 — Error tracking and monitoring

- Integrate **Sentry** for both server and client, with source maps uploaded and release tagging.
- Scrub PII before sending: no passwords, no tokens, no full email addresses, no request bodies from auth or billing routes.
- Add `/api/health` returning app status, database connectivity, and version. Point an uptime monitor at it.
- Structured server logging with request IDs. Never log a secret, a token, or a password — grep the codebase for `console.log` and audit every remaining one.
- Alerts that reach a phone: webhook handler failures, payment failures, error-rate spikes, database connection loss, health check down. An unnoticed broken webhook silently stops your revenue.

### 5.4 — Clear the ESLint backlog (QAL-01)

- Fix all 72 errors. Prioritise the `react-hooks/set-state-in-effect` violations — those cause real cascading re-renders in `SprintEditModal.tsx`, `ThemeProvider.tsx`, `ThemeToggle.tsx`, not just lint noise.
- Work the 424 warnings down as far as is sensible; `no-explicit-any` in particular should be replaced with real types, not suppressed.
- Add Prettier and a pre-commit hook (husky + lint-staged) so the backlog cannot rebuild.
- Report the before and after counts.

### 5.5 — Accessibility

The audit scored this 4/10. Fix, at minimum:

- **Focus traps in every modal and drawer** — `SprintEditModal`, `TaskDetailDrawer`, `CarryOverModal`, `ChangePasswordModal`, `DeleteAccountModal`, `NotificationCenter`. Tab must not escape an open dialog; Escape must close; focus must return to the trigger on close.
- `aria-hidden="true"` on every decorative SVG icon; real `aria-label`s on icon-only buttons.
- Every form input properly associated with a label; errors linked via `aria-describedby` and announced.
- Full keyboard operability: the entire core flow — create a task, start a sprint, pause, complete — without a mouse. Test it and say so.
- Visible focus indicators everywhere, including in dark mode.
- Colour contrast ≥ 4.5:1 for body text in both themes. Run a checker and paste the results; list any failure and its fix.
- Semantic landmarks and a skip-to-content link.
- `prefers-reduced-motion` honoured across the Framer Motion animations.
- Run axe-core (or Lighthouse a11y) on every page and paste the scores before and after.

### 5.6 — Legal and compliance

- Cookie consent banner, only if you actually set non-essential cookies. If every cookie is strictly necessary, **say so in the privacy policy and skip the banner** — do not ship a pointless one.
- Move Terms and Privacy out of landing-page modals into real, linkable, indexable pages at `/terms` and `/privacy`, with a last-updated date.
- The privacy policy must accurately describe what you actually do: what data you collect, that task content is sent to Google Gemini for processing, what your payment provider receives, retention periods, and how to exercise data rights. **Write it from the real data flows in the codebase**, not from a template.
- GDPR mechanics: data export (Phase 3 built it — link it from the privacy policy), data deletion (Phase 0 built it — confirm it still cascades), and a documented request process.
- Add a DPA note and subprocessor list: Google (Gemini), your payment provider, your email provider, your host, Sentry.
- Flag clearly in the report that a lawyer should review these before launch. You are producing an honest, accurate draft, not legal advice.

### 5.7 — Performance

- Run Lighthouse on every page, mobile and desktop. Paste the scores.
- Address the biggest offenders: `src/app/tasks/page.tsx` (1,435 lines), `settings/page.tsx` (1,365), `page.tsx` (1,158), `dashboard/page.tsx` (1,044). Split them into components — not for tidiness, but because they ship as one client bundle.
- Check what's `"use client"` that doesn't need to be. Server components where possible.
- `next/image` for every image, `next/font` for fonts, dynamic imports for heavy below-the-fold components.
- Measure and report Core Web Vitals. Report bundle size per route before and after.

### 5.8 — Documentation

- Replace the template `README.md`: what SprintFlow is, stack, prerequisites, local setup from a cold clone, environment variables (every one, with what it's for and where to get it), common commands, troubleshooting.
- `docs/ARCHITECTURE.md`: request flow, directory conventions, the database schema, the entitlement model, the webhook pipeline.
- `docs/OPERATIONS.md`: deploy, rollback, backup/restore, migration procedure, incident runbook ("payments stopped working" / "database is down" / "AI endpoint is being abused"), on-call contacts.
- `docs/API.md`: every endpoint, auth requirement, request/response shape, rate limit, error codes.
- `.env.example` complete and accurate.
- **Verify the setup docs by following them literally on a clean clone.** Report anything that didn't work and fix the docs, not your memory of the setup.

### 5.9 — Pre-launch sweep

- Re-run every check from `AUDIT_REPORT.md` and produce a final scorecard in the same format, so the owner can see the delta from 28/100.
- Full manual pass on a phone — real device, not a simulator — for the whole core flow.
- Cross-browser: Chrome, Safari, Firefox, mobile Safari. iOS Safari in particular breaks timers and audio in ways Chrome doesn't.
- Check every user-facing string for spelling and grammar. Check every link for 404s. Check every empty state, error state, and loading state still exists after five phases of change.
- Confirm nothing in the client bundle contains a personal email, a test credential, or a `TODO` visible to users.

## OUT OF SCOPE

New features · admin back-office (defer until support volume demands it) · multi-tenancy/teams (SprintFlow is single-user B2C — per-user accounts *are* the tenancy model) · marketing site work · mobile apps.

## DEFINITION OF DONE

- [ ] Test suite runs green locally and in CI; list every test and what it protects
- [ ] CI fails correctly when a test is deliberately broken — demonstrate it
- [ ] Sentry receives a deliberately thrown test error, with PII scrubbed — show the payload
- [ ] `/api/health` returns healthy; uptime monitor configured
- [ ] `npm run lint` → 0 errors. Warnings reported with before/after counts.
- [ ] axe-core scores pasted for every page; every serious/critical violation fixed
- [ ] Complete core flow driven by keyboard only — describe the path taken
- [ ] Lighthouse scores pasted for every page, mobile and desktop
- [ ] Cold clone → follow README → running app. Transcript pasted.
- [ ] `/terms` and `/privacy` live, accurate to the real data flows, linked in the footer
- [ ] Data export and deletion both verified working end to end one final time
- [ ] Final audit scorecard produced, area by area, against the original
- [ ] `npm audit` → 0 critical, 0 high
- [ ] Secret scan clean across full git history
- [ ] `npx tsc --noEmit` clean, `npm run build` passes, E2E green

## DELIVERABLE

Write `PHASE_5_REPORT.md` **and** `LAUNCH_READINESS.md` in the repo root.

`PHASE_5_REPORT.md`:

```
# Phase 5 Report — Launch Hardening
Date · Start commit · End commit

## 1. Task Status
| Task | Status | Commits | Evidence |

## 2. Test Inventory
| Test | Type | What it protects | Passing |

## 3. CI Pipeline
Steps, gates, proof it fails when it should.

## 4. Monitoring & Alerting
What is watched, what alerts, where the alert goes.

## 5. Accessibility Before/After
Per page: axe violations before, after, what was fixed.

## 6. Performance Before/After
Per route: bundle size and Lighthouse, before and after.

## 7. Legal Surface
What was written, what it claims, what a lawyer must still review.

## 8. Documentation Verification
Cold-clone transcript and what the docs got wrong.

## 9. Deferred
## 10. Blocked
```

`LAUNCH_READINESS.md` — the document the owner actually decides from:

```
# SprintFlow — Launch Readiness

## Final Scorecard
Same 12 areas as AUDIT_REPORT.md, scored now, with the original score alongside.
Overall: X/100 (was 28/100)

## Sellable? YES / NO — one sentence

## Owner Actions Before Going Live
Numbered checklist of everything only a human can do: rotate keys, switch to live
payment keys, register the production webhook, configure DNS for email, set up the
uptime monitor, review legal pages, provision production database and backups.

## Known Limitations at Launch
Honest list of what is still weak, deferred, or untested.

## First 30 Days — What Will Break First
Your best prediction, with what to watch and where the alert will come from.
```

End `PHASE_5_REPORT.md` with:

```yaml
---
phase: 5
status: complete | partial
tests: { unit: N, integration: N, e2e: N }
ci_gates: [typecheck, lint, test, build, e2e, audit, secret-scan]
lint_errors: 0
a11y_serious_violations: 0
lighthouse: { performance: N, accessibility: N, best_practices: N, seo: N }
docs_verified_cold_clone: true
final_score: N
sellable: true | false
owner_actions_before_live: [...]
known_limitations: [...]
---
```
