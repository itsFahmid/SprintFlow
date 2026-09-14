# PHASE 3 — Make the Lies True

> Paste into Antigravity once Phase 2 is merged and `PHASE_2_REPORT.md` says complete.
> Target: 2 weeks. Do this **before** billing.

---

## CONTEXT

**SprintFlow** — Next.js 16 / React 19 / TypeScript focus-sprint app heading for paid SaaS launch. Phases 0 (security), 1 (relational database) and 2 (auth + email) are done. Read those reports and `AUDIT_REPORT.md` first.

The UI currently displays things that are not true. The analytics dashboard shows `28h focused` and `64 sprints` from hardcoded constants (`src/app/analytics/page.tsx:152-180`). The task workspace holds tasks in React state that never reach the database (`src/app/tasks/page.tsx:135-147`). XP, streaks and coins are computed on the client and accepted by the server without validation (`src/app/api/rewards/route.ts:50-61`). The timer's sound settings control nothing. Refreshing mid-sprint loses the session.

**This phase is about product integrity, not features.** Charging money for a dashboard of invented numbers is how you get chargebacks. Every number on screen must be derived from something the user actually did.

## STANDING RULES

1. **Scope lock.** Make existing features real. Do not add new features, do not touch billing, do not redesign. New feature ideas go in Deferred.
2. **The UI is the specification.** The designs are good — the job is to make the data behind them genuine, not to change how they look. Where a component shows a metric, find or build the real source for that exact metric.
3. **No number without a source.** By the end of this phase, every figure rendered anywhere in the app must trace to a database row. You will list them all in the report.
4. Small commits, conventional messages. `tsc` and `build` clean at every commit.
5. Evidence for every claim.

## TASKS

### 3.1 — Inventory every fake value first

Before writing any code, grep the whole `src/` tree for hardcoded data feeding the UI: mock constants, `filterMocks`, static arrays, placeholder numbers, lorem text, fake chart series, dummy avatars, "Coming soon" strings.

Produce a table — value, file:line, what it pretends to be, where the real data must come from — and put it in your report **before** the implementation sections. Work through that table as your checklist. Report the total count.

### 3.2 — Persist the task workspace

- Wire `src/app/tasks/page.tsx` to real API calls. Creating, editing, reordering, completing, deleting, and moving between in-focus and backlog must all persist.
- Use optimistic UI updates with rollback on failure — the app currently feels instant and must keep feeling instant.
- Reordering writes the `position` column; do not re-index every row on every drag, use fractional positions or a batched update.
- Subtasks from `src/components/SprintEditModal.tsx` and `TaskDetailDrawer.tsx` persist too.
- Every mutation is scoped to the session's `user_id` — re-verify, don't assume Phase 1 covered a route you're adding.

### 3.3 — Server-authoritative gamification

The client currently tells the server how much XP to add. That's an open door: anyone can `POST` themselves to level 99, and once coins buy anything it becomes a real exploit.

- Move all XP/coin/streak calculation server-side. The client reports **events** ("sprint completed, id X"), never **outcomes** ("+50 XP").
- Write each award to the `reward_events` ledger from Phase 1. Current XP, level, coins and streak are **derived** by aggregating the ledger, never stored as a mutable counter.
- Make awards idempotent — completing the same sprint twice must not pay twice. Enforce with a unique constraint on (user_id, source_type, source_id).
- Validate plausibility server-side: a sprint cannot complete before it started, cannot be shorter than its recorded elapsed time, cannot complete more than once.
- Streak logic runs server-side against the user's timezone. Decide and document what breaks a streak and what counts as a day.
- Keep the exact same numbers and animations on screen — only the source of truth moves.

### 3.4 — Real analytics

- Delete every mock constant in `src/app/analytics/page.tsx`.
- Build aggregation queries over `sprint_events` and `reward_events`: total focus time, sprints completed, completion rate, focus by day/week/month, best time of day, interruption counts, streak history, task throughput.
- The existing date/range filters must actually filter.
- **Empty and new-user states matter here.** A user on day one has no data. Design a genuine empty state — "complete your first sprint to see your patterns" — not a chart of zeros and not fake sample data. This is the single most common place where a polished app suddenly looks broken.
- Pre-aggregate if a query gets slow, but measure first and report the timings. Do not optimise blind.
- If you build or modify any chart, load the `dataviz` skill before writing chart code.

### 3.5 — Durable sprint sessions

- A running sprint must survive a page refresh, a tab close, and a device switch. Persist timer state server-side (started_at, paused_at, accumulated pause duration, current step) and reconstruct elapsed time from timestamps on load — **never** from a client-side counter that stops when the tab sleeps.
- Handle the awkward cases explicitly and say what you chose: browser closed mid-sprint, sprint left running overnight, same account open in two tabs.
- Write every transition to `sprint_events` — that table is what Phase 3.4's analytics reads.
- The carry-over modal and interruption logger must write real rows.

### 3.6 — Connect the timer audio (UX-02)

- Settings expose sound theme, ticking, and volume, and none of them do anything. Implement playback on sprint end, break start, and break end.
- Use the Web Audio API with short generated tones or small bundled assets. Respect the volume setting, and respect `prefers-reduced-motion` / system mute conventions.
- Browsers block audio until the user interacts with the page — handle that gracefully and don't throw.
- Ship a real "Test sound" button in Settings so the setting is verifiable by the user.

### 3.7 — Notifications that work

- `src/components/NotificationCenter.tsx` must read real events, not a static array.
- If browser notifications are offered in Settings, implement them with a proper permission request flow and a fallback when denied. If they're not going to be implemented this phase, **remove the setting from the UI** rather than shipping a toggle that does nothing.
- Same rule applies everywhere: a control that does nothing is worse than a missing control.

### 3.8 — Settings actually apply

Walk every setting in `src/app/settings/page.tsx` one by one — theme, focus/break durations, long-break interval, auto-start, notification prefs, sound. For each: confirm it persists, confirm it changes behaviour, and confirm it survives logout/login. Any setting that can't be made real this phase gets removed from the UI. Report the full list with a verdict per setting.

### 3.9 — Data export

Settings has a JSON export. Make it complete — every table the user owns, in a documented format — and add CSV for tasks and sprint history. This is both a user feature and the GDPR Article 20 portability obligation that Phase 5 will need.

## OUT OF SCOPE

Payments and billing · admin panel · tests · CI · cookie consent · ESLint cleanup · new features of any kind · visual redesign.

## DEFINITION OF DONE

- [ ] The fake-value inventory from 3.1 is fully worked through — every row resolved or explicitly deferred with a reason
- [ ] `grep -rn "mock\|Mock\|dummy\|placeholder\|lorem" src/` returns only legitimate hits, each one explained
- [ ] A brand-new account shows honest empty states on every page — screenshot each one
- [ ] Seeded account with known data shows analytics that **match hand-calculated expected values**. Show the arithmetic.
- [ ] XP exploit closed: `POST` a forged reward payload and show the server rejecting it
- [ ] Double-award closed: complete the same sprint twice, show only one ledger entry
- [ ] Refresh mid-sprint → timer resumes at the correct elapsed time. Demonstrate with timestamps.
- [ ] Close the browser for 5 minutes mid-sprint, reopen → state is correct per your documented rule
- [ ] Every setting verified individually with a per-setting verdict table
- [ ] Sound plays on sprint end at the configured volume and theme
- [ ] Tasks survive logout/login on a different browser
- [ ] `npx tsc --noEmit` clean, `npm run build` passes
- [ ] Full manual pass on a fresh account: signup → onboarding → AI-generate sprints → run two full sprints with an interruption → check analytics reflects exactly those two → check rewards ledger → export data → verify export contains it all

## DELIVERABLE

Write `PHASE_3_REPORT.md` in the repo root:

```
# Phase 3 Report — Make the Lies True
Date · Start commit · End commit

## 1. Fake Value Inventory & Resolution
| Value | file:line | Was | Now sourced from | Status |
Every single one. This is the core of the report.

## 2. Task Status
| Task | Status | Commits | Evidence |

## 3. Metric Provenance Map
| Metric shown in UI | Where displayed | Query / derivation | Source table |
Every number in the product.

## 4. Analytics Correctness Proof
Seeded data → expected values calculated by hand → actual values rendered. Side by side.

## 5. Anti-Cheat
Each gamification exploit you tested, the payload, and the server's response.

## 6. Settings Verdict Table
| Setting | Persists? | Changes behaviour? | Verdict (works / removed) |

## 7. Empty States
Screenshot or description per page for a zero-data account.

## 8. Performance
Query timings for analytics at seed scale, and projected at 1k sprints/user.

## 9. Deferred
## 10. Blocked
```

End with:

```yaml
---
phase: 3
status: complete | partial
fake_values_found: N
fake_values_resolved: N
metrics_with_real_source: N
settings_working: N
settings_removed: N
exploits_tested: N
exploits_open: 0
build_passing: true
next_phase_blocked_by: []
---
```
