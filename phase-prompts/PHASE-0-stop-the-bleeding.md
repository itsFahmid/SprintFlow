# PHASE 0 — Stop the Bleeding

> Paste into Antigravity with the SprintFlow repo open.
> Target: 2–3 days. Do this before anything else.

---

## CONTEXT

You are working on **SprintFlow**, a Next.js 16 / React 19 / TypeScript Pomodoro-and-sprint planning app being taken from prototype to a sellable SaaS product. An audit (`AUDIT_REPORT.md` in the repo root) found 6 CRITICAL and 4 HIGH findings. This is **Phase 0 of 6**: fix only the issues that are actively dangerous while the app sits on a developer machine or a public host.

Read `AUDIT_REPORT.md` first. Findings referenced by ID below are defined there.

## STANDING RULES (apply to every task in this phase)

1. **Scope lock.** Implement only what is listed under TASKS. Do not refactor unrelated code, do not rename things for tidiness, do not start work belonging to later phases (database migration, email, billing, tests). If you spot something out of scope, add it to the Deferred list in your report instead of fixing it.
2. **Do not break the UI.** The frontend is the strongest part of this product. No visual regressions. If a change requires a UI adjustment, make the minimum one and note it.
3. **Small commits, one concern each**, with conventional-commit messages (`fix(auth): ...`). Never squash unrelated changes together.
4. **Verify, don't assume.** After each task, actually run the app and exercise the flow. `npm run build` and `npx tsc --noEmit` must pass before you call the phase done.
5. **Never invent secrets.** If a value must come from the environment, add it to `.env.example` with a comment and stop — do not generate a placeholder that looks real.
6. Every claim in your final report needs a `file:line` or a command + its output.

## TASKS

### 0.1 — Purge committed secrets (SEC-04) — DO THIS FIRST

- Add `db.json`, `.env`, `.env.local`, `*.db` to `.gitignore`.
- `git rm --cached db.json` so it stops tracking, keep the local file.
- Rewrite git history to remove `db.json` from **all** commits — use `git filter-repo` (preferred) or BFG. Print the exact commands you ran.
- Scan full history for any other secret: `GEMINI_API_KEY`, Postgres connection strings, tokens, `.env` files. Report every hit with commit SHA.
- Invalidate every session token currently present in `db.json` / the database (delete the sessions table rows or the `sessions` key).
- Write a short `SECURITY_ROTATION.md` listing exactly which credentials the owner must rotate by hand (Gemini API key, any DB password, any password that appeared in plaintext). You cannot rotate these yourself — just produce the checklist.

### 0.2 — Patch dependency CVEs (SEC-05)

- Upgrade `next` to `>=16.3.5`, `sharp` to `>=0.35.4`, and resolve the `js-yaml` advisory.
- Run `npm audit` after and paste the output. Target: 0 critical, 0 high.
- Re-run `npm run build` — Next 16.3.x minor upgrades occasionally shift App Router behaviour. Report anything that broke.

### 0.3 — Real password hashing (SEC-01)

- Add `bcrypt` (cost factor 12) — or `argon2id` if you prefer, but pick one and use it everywhere.
- Replace the `"mock_" + password` scheme in `src/app/api/auth/signup/route.ts`, `src/app/api/auth/login/route.ts`, and `src/app/api/user/settings/route.ts`.
- **Migration path for existing records:** on login, if the stored hash starts with `mock_`, verify against the legacy plaintext, then immediately re-hash and persist the bcrypt hash. Delete the legacy branch entirely in Phase 2 — leave a `// TODO(phase-2): remove legacy mock_ path` comment.
- Enforce a minimum password policy server-side (length ≥ 8; reject the top-100 common passwords via a small embedded list). Client-side validation alone does not count.

### 0.4 — Cryptographic session tokens and IDs (SEC-02)

- Replace every `Math.random()` used for a token, session ID, user ID, or transaction ID with `crypto.randomUUID()` or `crypto.randomBytes(32).toString("hex")`.
- Grep the whole repo for `Math.random` and report each remaining use, confirming it is cosmetic only (animation jitter, etc.).
- Set session cookie flags properly: `HttpOnly`, `Secure` in production, `SameSite=Lax`, and an explicit `maxAge`.
- Give sessions a real expiry and check it server-side on every validation. Wire the currently-ignored "Remember me" checkbox to choose between a short and a long `maxAge`.

### 0.5 — Server-side route protection (SEC-09)

- Add `middleware.ts` at the project root that checks the `sprintflow_session` cookie and redirects unauthenticated requests away from `/dashboard`, `/tasks`, `/planner`, `/sprints`, `/rewards`, `/analytics`, `/settings`, `/onboarding`, `/checkout`, `/subscription`.
- Use a `matcher` config so the middleware does not run on static assets or the landing page.
- Keep the existing client-side `useEffect` checks as defence in depth; do not remove them.
- Verify by requesting a protected route with no cookie via `curl -I` and confirming a 307 to `/login`.

### 0.6 — Lock down the AI endpoint (SEC-03 + SEC-08)

- Require a valid authenticated session on `POST /api/analyze`. No session → 401.
- Add per-user rate limiting: **10 requests/hour, 30/day**, in-memory sliding window is acceptable for now (note in the report that it resets on redeploy and needs Redis at scale).
- Cap the input: reject `taskList` over 4,000 characters with a 400.
- Harden the prompt against injection: put user content in a clearly delimited block, add an explicit instruction that content inside the block is data and never instructions, and validate the model's JSON response against a strict Zod schema before returning it. Malformed output → 502 with a clean user-facing message, never a raw parse error.
- Keep the existing `x-gemini-api-key` client-header path working (it's a useful bring-your-own-key option) but **only** for authenticated users, and never log the header value.

### 0.7 — Real account deletion (BUS-02)

- Build `DELETE /api/user` that requires an authenticated session **and** password re-entry, then permanently deletes the user record, all their data, and every session token they hold.
- Wire `src/components/DeleteAccountModal.tsx` to call it instead of `/api/auth/logout`.
- Add a typed confirmation (user must type their email or the word `DELETE`) before the button enables.
- The UI already promises permanent erasure — after this change that promise must be literally true. State in your report exactly what rows/keys get removed.

### 0.8 — Strip hardcoded personal data (UX-01)

- Replace every hardcoded default with an empty string or a value from auth context: `fahimsahmed01@gmail.com`, `Password123!`, `Fahim Siddique`, and anything similar.
- Grep the full `src/` tree for `@gmail.com`, `Password`, and hardcoded names. Report every hit and its resolution.

## OUT OF SCOPE — do not do these in Phase 0

Database migration to a relational schema · email sending · password reset backend · payment integration · replacing mock analytics data · writing tests · CI/CD · fixing the 72 ESLint errors · admin panel · cookie consent.

## DEFINITION OF DONE

All must be true and demonstrated in your report:

- [ ] `git log --all -- db.json` returns nothing
- [ ] `npm audit` → 0 critical, 0 high
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npm run build` succeeds
- [ ] No password is stored unhashed anywhere; verified by inspecting a freshly created account's record
- [ ] `grep -rn "Math.random" src/` shows only cosmetic uses
- [ ] `curl -I` on a protected route with no cookie → redirect, not 200
- [ ] `curl -X POST /api/analyze` with no session → 401
- [ ] Deleting a test account actually removes its record — shown by querying before and after
- [ ] Signup → onboarding → create task → start sprint → logout → login still works end to end

## DELIVERABLE

Write `PHASE_0_REPORT.md` in the repo root:

```
# Phase 0 Report — Stop the Bleeding
Date · Start commit · End commit

## 1. Task Status
| Task | Status (DONE/PARTIAL/BLOCKED) | Commits | Evidence (file:line or command output) |

## 2. Secrets Found & Rotation Required
Table: secret · where found · commit SHA · purged? · owner must rotate manually? 

## 3. Before / After
Table of each security control: what it was, what it is now, file:line.

## 4. Verification Log
Every command from Definition of Done, with its actual output pasted.

## 5. Things I Changed That You Should Look At
Anything where you had to make a judgement call or touch the UI.

## 6. Deferred
Out-of-scope problems spotted, with file:line, for later phases.

## 7. Blocked
Anything you could not complete, and exactly what input you need.
```

End the report with:

```yaml
---
phase: 0
status: complete | partial
findings_resolved: [SEC-01, SEC-02, ...]
findings_remaining: [...]
new_issues_found: [...]
manual_action_required: ["rotate Gemini API key", ...]
build_passing: true
next_phase_blocked_by: []
---
```
