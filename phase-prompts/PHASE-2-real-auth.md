# PHASE 2 — Real Auth

> Paste into Antigravity once Phase 1 is merged and `PHASE_1_REPORT.md` says complete.
> Target: 1 week.

---

## CONTEXT

**SprintFlow** — Next.js 16 / React 19 / TypeScript focus-sprint app heading for paid SaaS launch. Phases 0 (security triage) and 1 (relational database) are done. Read `PHASE_0_REPORT.md`, `PHASE_1_REPORT.md` and `AUDIT_REPORT.md` before starting.

Authentication currently works but is incomplete: there is **no email infrastructure at all**, so password reset is a client-side `setTimeout` fake (`src/app/forgot-password/page.tsx:61-87`), email addresses are never verified, and password changes don't require the old password (SEC-06). This phase makes the account lifecycle real.

## STANDING RULES

1. **Scope lock.** Auth, email and rate limiting only. No billing, no analytics rework, no tests, no UI redesign. Out-of-scope findings go in Deferred.
2. **No UI regressions.** Reuse the existing design system and components — the forgot-password and login pages already look good, you are replacing what's behind them, not how they look.
3. Small commits, conventional messages. `npx tsc --noEmit` and `npm run build` pass at every commit.
4. **Never invent secrets.** New env vars go in `.env.example` with comments and nothing else.
5. Evidence for every claim.

## TASKS

### 2.1 — Transactional email provider

- Integrate **Resend** (simplest, good deliverability, generous free tier). If the owner has said otherwise, use their choice.
- Create `src/lib/email/` with a single `sendEmail()` interface and one module per template. Templates must be real HTML matching SprintFlow's brand — reuse the colours and typography from `src/app/globals.css`, and include a plain-text alternative for every email.
- In development, when no API key is set, log the rendered email to the console instead of sending. Never fail a signup because email is unavailable.
- Templates needed this phase: **verify your email**, **password reset**, **password changed** (security notice), **new login from a new device** (optional but cheap).
- Add an `emails` or `email_log` table recording every send (user_id, template, to, status, provider_id, sent_at). You will need this the first time a user says "I never got the email".
- Document in `docs/OPERATIONS.md`: the domain, SPF/DKIM/DMARC records the owner must add to DNS, and how to check deliverability. Flag clearly that emails will land in spam until DNS is configured — this is an owner action you cannot do.

### 2.2 — Email verification

- Add `email_verification_tokens` (or reuse a generic `tokens` table): id, user_id, token_hash, expires_at, used_at.
- **Store a hash of the token, never the token itself.** Same rule for reset tokens below.
- On signup: create the account, send the verification email, let the user into the app. Do not block usage on verification — that kills activation. Instead show a dismissible banner, and gate only what genuinely needs a verified address (checkout, in Phase 4).
- `GET /api/auth/verify?token=...` → validate, mark `users.email_verified_at`, mark token used, redirect to a friendly confirmation page.
- Tokens: single-use, 24-hour expiry, 32 bytes of `crypto.randomBytes`.
- Add a "resend verification email" action, rate limited to 3 per hour per user.

### 2.3 — Real password reset (replaces the fake flow)

- Delete the `setTimeout` simulation in `src/app/forgot-password/page.tsx` entirely.
- `POST /api/auth/forgot-password`: accepts an email, and **always returns the same success response whether or not the account exists** — no user enumeration. Rate limit: 3/hour per email, 10/hour per IP.
- `POST /api/auth/reset-password`: token + new password. Token is single-use, expires in **1 hour**, and is invalidated the moment it's used or a new one is requested.
- On successful reset: hash the new password, **delete every session for that user** (force re-login everywhere), and send the "password changed" security email.
- Build the `/reset-password` page to match the existing auth page design.

### 2.4 — Fix the password change endpoint (SEC-06)

- `src/app/api/user/settings/route.ts` currently sets `user.passwordHash = newPassword` with no verification and no hashing. Require `currentPassword`, verify it, hash the new one, and enforce the same password policy as signup.
- After a password change: invalidate all other sessions but keep the current one, and send the security-notice email.
- Wire `src/components/ChangePasswordModal.tsx` to the corrected contract.

### 2.5 — Remove the legacy `mock_` path

Phase 0 left a compatibility branch that accepts `mock_`-prefixed hashes on login and silently upgrades them. Verify every account in the database now has a real bcrypt/argon2 hash, then **delete that branch and the TODO comment**. Report the query you used to confirm zero legacy hashes remain.

### 2.6 — Real rate limiting (SEC-07)

- Replace Phase 0's in-memory limiter with **Upstash Redis** (`@upstash/ratelimit`) — free tier is sufficient, and it survives redeploys and works across serverless instances, which in-memory does not.
- Apply sliding-window limits:

| Endpoint | Limit |
|---|---|
| `POST /api/auth/login` | 5 / 15 min per IP+email, 20 / hour per IP |
| `POST /api/auth/signup` | 5 / hour per IP |
| `POST /api/auth/forgot-password` | 3 / hour per email, 10 / hour per IP |
| `POST /api/analyze` | 10 / hour, 30 / day per user |
| all other authenticated API routes | 100 / min per user |

- Return `429` with a `Retry-After` header and a friendly client-side message — not a raw error.
- Add progressive lockout on repeated login failure (short delay after 5, longer after 10) and record failed attempts so Phase 5 monitoring can alert on them.
- Keep a documented in-memory fallback for local dev when Redis env vars are absent.

### 2.7 — Session hardening

- Add a session list to Settings → Account: device/user-agent, last seen, "sign out this device", "sign out everywhere". The `sessions` table from Phase 1 already holds what you need.
- Add a cleanup job or query that deletes expired sessions. Note in the report how it should be scheduled.
- Add CSRF protection on state-changing requests — Next's `SameSite=Lax` cookie covers most of it; add an origin check in middleware for anything it doesn't, and say explicitly what you relied on.

### 2.8 — Auth security headers

In `next.config.ts` add `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Content-Security-Policy`. Start the CSP in report-only mode, load every page, collect violations, fix them, then enforce. Paste the final policy.

## OUT OF SCOPE

Payments and billing · analytics rework · gamification server validation · tests · CI · admin panel · cookie consent banner (Phase 5) · ESLint cleanup.

## DEFINITION OF DONE

- [ ] `grep -rn "setTimeout" src/app/forgot-password/` returns nothing auth-related
- [ ] Full reset flow works end to end against a real inbox: request → receive email → click → set password → old sessions dead → login with new password
- [ ] Reset token cannot be used twice — demonstrate the second attempt failing
- [ ] Reset token expires — demonstrate with a manually aged token
- [ ] Requesting a reset for a non-existent email returns an identical response and timing to an existing one
- [ ] Password change without `currentPassword` → 400; with a wrong one → 401
- [ ] Zero `mock_` hashes remain — query output pasted
- [ ] Rate limits verified by firing over the limit with a loop and showing the `429`
- [ ] Verification email arrives and marks the account verified
- [ ] Security headers present — `curl -I` output pasted
- [ ] CSP enforced with no console violations on any page
- [ ] `npx tsc --noEmit` clean, `npm run build` passes
- [ ] Full manual pass: signup → verify → use app → change password → reset password → sign out everywhere → log back in

## DELIVERABLE

Write `PHASE_2_REPORT.md` in the repo root:

```
# Phase 2 Report — Real Auth
Date · Start commit · End commit

## 1. Task Status
| Task | Status | Commits | Evidence |

## 2. Auth Flow Map
Each flow (signup, verify, login, logout, forgot, reset, change password, delete account)
as a numbered sequence of endpoints, with tokens used, their lifetime, and where they're stored.

## 3. Email
Provider, templates built, DNS records the owner must add, deliverability status,
and what is still unverified because DNS isn't configured.

## 4. Rate Limits Applied
| Endpoint | Limit | Backend | Verified how |

## 5. Verification Log
Real command output for every Definition of Done item.

## 6. Security Headers & CSP
Final policy, and anything you had to loosen, with the reason.

## 7. Deferred
## 8. Blocked
```

End with:

```yaml
---
phase: 2
status: complete | partial
email_provider: resend
templates: [verify, reset, password_changed, ...]
rate_limit_backend: upstash
legacy_mock_hashes_remaining: 0
csp_enforced: true
dns_action_required_by_owner: ["SPF", "DKIM", "DMARC"]
build_passing: true
next_phase_blocked_by: []
---
```
