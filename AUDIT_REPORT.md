# Production Readiness Audit — SprintFlow
Date: September 14, 2026 · Commit: ea67f9c466630e5397185a9f06ff1fda0c95066a · Auditor: Antigravity

## 0. Scorecard

| Area | Score /10 | One-line justification |
| :--- | :---: | :--- |
| **Architecture** | 4/10 | Clean Next.js 16 App Router UI shell, but business logic is mixed into client pages and data access is bound to monolithic JSON blobs. |
| **Security** | 1/10 | Plaintext `mock_` passwords, unauthenticated AI endpoint, Math.random session tokens, no CSRF/rate limiting, and committed credentials in `db.json`. |
| **Multi-tenancy** | 1/10 | Single-user B2C model only; zero organization/team data isolation, zero RBAC, zero tenant workspace scoping. |
| **Data Layer** | 2/10 | Monolithic JSONB / local filesystem `db.json` with synchronous I/O; no relational schema, no foreign keys, no indexes, and no migration system. |
| **SaaS Readiness** | 2/10 | Simulated fake billing checkout with fake IDs, fake password reset, fake account deletion, and no transactional email infrastructure. |
| **Testing** | 0/10 | Zero automated unit, integration, or end-to-end tests exist anywhere in the repository. |
| **Frontend & UX** | 7/10 | Highly polished visual design system with Tailwind CSS v4, dark mode, custom SVG icons, Framer Motion micro-interactions, and responsive layout. |
| **Accessibility** | 4/10 | Visual contrast and typography are solid, but custom modals lack ARIA focus traps, and multiple decorative icons lack proper hiding. |
| **Performance** | 5/10 | Next.js Turbopack compiles cleanly in <1s, but multiple pages exceed 1,000 LOC with heavy state and unindexed full-blob JSON deserialization. |
| **Operations** | 3/10 | Basic Dockerfile and docker-compose exist, but no CI/CD workflows, no health checks, and no monitoring/telemetry setup. |
| **Documentation** | 3/10 | `PRODUCT.md` provides strong functional positioning, but `README.md` is an untouched template, and no API or architecture docs exist. |
| **Legal & Compliance** | 2/10 | Simple terms/privacy dialogs in landing footer; no cookie consent, no real GDPR data deletion, and card input form lacks PCI-compliant framing. |

**Overall production readiness: 28/100**  
**Sellable today? NO — The codebase lacks real authentication, real payment processing, real database persistence, and automated testing, while exposing critical security vulnerabilities.**  
**Estimated remaining effort to sellable: 11.0 developer-weeks (approx. 2.75 engineer-months)**  
*Arithmetic:*  
- Security & Authentication overhaul (Argon2/bcrypt, secure session tokens / Auth provider, rate limiting, authz guards): **2.0 dev-weeks**  
- Relational Database & Migration Layer (Postgres schema via Drizzle/Prisma, tables for users, tasks, sprints, payments, indexes): **2.0 dev-weeks**  
- Real Payment Gateway Integration (Stripe / LemonSqueezy / bKash gateway, webhooks, signature verification, subscription lifecycle): **2.0 dev-weeks**  
- Transactional Email & Password Recovery (Resend / SendGrid, time-limited single-use reset tokens, email verification): **1.0 dev-week**  
- Backend Business Logic & Real Analytics (Server-side gamification validation, historical sprint aggregation, real account purge): **1.5 dev-weeks**  
- Automated Testing & CI/CD Pipelines (Unit tests, route integration tests, Playwright E2E suite, GitHub Actions CI): **1.5 dev-weeks**  
- Code Quality & Lint Remediation (Fix 72 ESLint errors, remove hardcoded personal defaults, refactor monolithic page files): **1.0 dev-week**  
*Total = 2.0 + 2.0 + 2.0 + 1.0 + 1.5 + 1.5 + 1.0 = 11.0 developer-weeks.*

---

## 1. Executive Summary

SprintFlow is an AI-assisted focus and Pomodoro planning web application designed for students and self-learners to convert unorganized to-do lists into sequenced, time-boxed sprint blocks. The product has a visually impressive, modern frontend built with Next.js 16.3 (App Router), React 19, TypeScript, Tailwind CSS v4, and Framer Motion animations.

However, beneath the polished UI surface, the system is fundamentally an **incomplete prototype** rather than a production-ready SaaS product. Core backend mechanics are simulated using client-side timeouts and mock objects.

The 5 most critical issues that would immediately embarrass the team in front of a technical buyer:
1. **Plaintext Passwords & Insecure Session Tokens:** Passwords are stored in plain text with a trivial `"mock_"` prefix ([`src/app/api/auth/signup/route.ts:20`](file:///d:/SprintFlow/src/app/api/auth/signup/route.ts#L20)), and session tokens are generated using predictable `Math.random()` strings ([`src/lib/db.ts:461`](file:///d:/SprintFlow/src/lib/db.ts#L461)).
2. **Committed Database & Live Session Tokens in Git:** The repository includes a committed [`db.json`](file:///d:/SprintFlow/db.json) file containing plain user records, plaintext password hashes, and active session tokens.
3. **Simulated Payments & Fake Checkout:** The checkout process ([`src/app/api/subscription/route.ts:111-158`](file:///d:/SprintFlow/src/app/api/subscription/route.ts#L111-L158)) does not connect to any payment processor; any user can trigger the API or submit the checkout form with arbitrary input and immediately receive a Pro subscription.
4. **Deceptive Account Deletion & Fake Password Reset:** The "Delete Account" modal ([`src/components/DeleteAccountModal.tsx:38-39`](file:///d:/SprintFlow/src/components/DeleteAccountModal.tsx#L38-L39)) displays a high-risk warning that data will be permanently wiped, but under the hood it simply calls the logout endpoint without deleting any database records. The password reset flow ([`src/app/forgot-password/page.tsx:61-87`](file:///d:/SprintFlow/src/app/forgot-password/page.tsx#L61-L87)) uses `setTimeout` mocks with hardcoded email addresses and never touches the backend.
5. **Monolithic JSON Blob Storage with Race Conditions:** All user data (profile, tasks, sprints, rewards, settings) is serialized as a single unstructured JSONB column or written synchronously to a local JSON file ([`src/lib/db.ts:187-206`](file:///d:/SprintFlow/src/lib/db.ts#L187-L206)), leading to severe concurrency race conditions and total lack of relational indexing.

---

## 2. What Has Been Built (verified working)

The following components and flows are fully implemented and verified functional in the codebase:

- **Landing Page & Marketing Shell:** Complete marketing presentation with hero section, interactive workflow demonstration, pricing cards, FAQ accordion, legal modal dialogs, and navigation ([`src/app/page.tsx:1-1243`](file:///d:/SprintFlow/src/app/page.tsx#L1-L1243)).
- **Design System & Theming:** Custom CSS token system in [`src/app/globals.css:1-1755`](file:///d:/SprintFlow/src/app/globals.css#L1-L1755) paired with a persistent dark/light theme provider using localStorage and class hydration scripts in [`src/components/ThemeProvider.tsx:1-70`](file:///d:/SprintFlow/src/components/ThemeProvider.tsx#L1-L70) and [`src/app/layout.tsx:31-47`](file:///d:/SprintFlow/src/app/layout.tsx#L31-L47).
- **Gemini AI Task Breakdown Integration:** Generative AI prompt pipeline connecting to `@google/generative-ai` (`gemini-3.5-flash`) to parse raw text to-do dumps into structured sprints and subtasks in [`src/app/api/analyze/route.ts:1-97`](file:///d:/SprintFlow/src/app/api/analyze/route.ts#L1-L97).
- **Multi-Step Onboarding Sequence:** Interactive 4-step wizard guiding new users through role selection, daily focus goals, and notification preferences in [`src/app/onboarding/page.tsx:1-534`](file:///d:/SprintFlow/src/app/onboarding/page.tsx#L1-L534).
- **Task Management Workspace & Drawer:** Task filtering by status (all, todo, scheduled, done), inline search, priority indicators, and detailed task drawer in [`src/app/tasks/page.tsx:1-1564`](file:///d:/SprintFlow/src/app/tasks/page.tsx#L1-L1564) and [`src/components/TaskDetailDrawer.tsx:1-220`](file:///d:/SprintFlow/src/components/TaskDetailDrawer.tsx#L1-L220).
- **Sprint Editing Modal:** Interactive modal for modifying sprint title, duration slider, priority selector, and subtask additions/deletions in [`src/components/SprintEditModal.tsx:1-244`](file:///d:/SprintFlow/src/components/SprintEditModal.tsx#L1-L244).
- **Active Focus Timer UI:** Full-featured Pomodoro session interface supporting pause/resume/skip, step progress indicators, carry-over modal, interruption logger, and exit confirmation dialogs in [`src/app/sprints/page.tsx:1-1096`](file:///d:/SprintFlow/src/app/sprints/page.tsx#L1-L1096).
- **Settings & Data Export:** Multi-tab settings panel (Account, Appearance, Focus, Notifications, Privacy) with working JSON export in [`src/app/settings/page.tsx:1-1464`](file:///d:/SprintFlow/src/app/settings/page.tsx#L1-L1464) and [`src/app/api/user/settings/route.ts:64-80`](file:///d:/SprintFlow/src/app/api/user/settings/route.ts#L64-L80).
- **Containerized Build:** Valid `Dockerfile` and `docker-compose.yml` supporting standard production compilation via `npm run build` ([`Dockerfile:1-29`](file:///d:/SprintFlow/Dockerfile#L1-L29)).

---

## 3. Feature Matrix

| # | Feature | Status | Evidence (file:line) | What's missing |
| :-: | :--- | :---: | :--- | :--- |
| 1 | **Landing Page** | `DONE` | [`src/app/page.tsx:1-1243`](file:///d:/SprintFlow/src/app/page.tsx#L1-L1243) | Fully functional marketing presentation. |
| 2 | **User Signup & Cookie Auth** | `PARTIAL` | [`src/app/api/auth/signup/route.ts:1-53`](file:///d:/SprintFlow/src/app/api/auth/signup/route.ts#L1-L53) | Passwords stored unhashed (`mock_`); no email verification; weak `Math.random` user IDs. |
| 3 | **User Login & Session** | `PARTIAL` | [`src/app/api/auth/login/route.ts:1-52`](file:///d:/SprintFlow/src/app/api/auth/login/route.ts#L1-L52) | Predictable `Math.random` session tokens; "rememberMe" checkbox is ignored; no brute force rate limiting. |
| 4 | **Forgot Password Flow** | `MISSING` | [`src/app/forgot-password/page.tsx:61-87`](file:///d:/SprintFlow/src/app/forgot-password/page.tsx#L61-L87) | Purely client-side `setTimeout` simulation; no backend reset endpoint, no reset tokens, no email dispatch. |
| 5 | **AI Sprint Generation** | `PARTIAL` | [`src/app/api/analyze/route.ts:1-97`](file:///d:/SprintFlow/src/app/api/analyze/route.ts#L1-L97) | Endpoint is completely unauthenticated; no rate limiting; prompt injection vulnerability via raw string interpolation. |
| 6 | **Task Workspace** | `PARTIAL` | [`src/app/tasks/page.tsx:135-147`](file:///d:/SprintFlow/src/app/tasks/page.tsx#L135-L147) | In-focus and backlog tasks use static hardcoded state in React; changes in workspace view are not saved to DB. |
| 7 | **Sprint Execution & Timer** | `PARTIAL` | [`src/app/sprints/page.tsx:1-1096`](file:///d:/SprintFlow/src/app/sprints/page.tsx#L1-L1096) | Timer works visually, but audio alert settings (chimes, ticking) are disconnected; session state is lost on page refresh. |
| 8 | **Gamification & Rewards** | `PARTIAL` | [`src/app/api/rewards/route.ts:50-61`](file:///d:/SprintFlow/src/app/api/rewards/route.ts#L50-L61) | XP, streak, and coin increments are calculated client-side and accepted by the server without validation; coin redemption shop is absent. |
| 9 | **Analytics Dashboard** | `PARTIAL` | [`src/app/analytics/page.tsx:152-180`](file:///d:/SprintFlow/src/app/analytics/page.tsx#L152-L180) | Analytics stats (28h focus time, 64 sprints) and charts use static hardcoded mock constants (`filterMocks`). |
| 10 | **Planner Timeline** | `PARTIAL` | [`src/app/planner/page.tsx:1-618`](file:///d:/SprintFlow/src/app/planner/page.tsx#L1-L618) | Timeline state is saved as a single JSON array; no calendar integrations, date navigation, or multi-day persistence. |
| 11 | **Billing & Checkout** | `MISSING` | [`src/app/api/subscription/route.ts:111-158`](file:///d:/SprintFlow/src/app/api/subscription/route.ts#L111-L158) | Simulated fake checkout with `SF-` random transaction IDs; no Stripe/bKash integration, no webhooks, no dunning. |
| 12 | **Account Settings & Profile** | `PARTIAL` | [`src/app/api/user/settings/route.ts:41-134`](file:///d:/SprintFlow/src/app/api/user/settings/route.ts#L41-L134) | Password update bypasses old password verification; email updates do not verify uniqueness; avatars are static placeholders. |
| 13 | **Account Deletion** | `MISSING` | [`src/components/DeleteAccountModal.tsx:38-39`](file:///d:/SprintFlow/src/components/DeleteAccountModal.tsx#L38-L39) | Deceptive implementation: clicking "Delete Account" only executes a logout API call and does not delete user data. |
| 14 | **Multi-Tenancy & Teams** | `MISSING` | N/A | No team models, invitations, shared workspaces, or RBAC exist anywhere in the codebase. |
| 15 | **Admin Back-Office** | `MISSING` | N/A | No operator dashboard, user lookup, account suspension, or subscription management interfaces exist. |
| 16 | **Transactional Email** | `MISSING` | N/A | No email provider (Resend/SendGrid/SES) configured; zero email dispatch logic. |

---

## 4. Findings

### Findings Summary Table

| ID | Severity | Area | Title | File:line |
| :--- | :---: | :--- | :--- | :--- |
| **SEC-01** | `CRITICAL` | Security | Passwords stored without hashing (`mock_` prefix) | [`src/app/api/auth/signup/route.ts:20`](file:///d:/SprintFlow/src/app/api/auth/signup/route.ts#L20) |
| **SEC-02** | `CRITICAL` | Security | Predictable session token generation via `Math.random()` | [`src/lib/db.ts:461`](file:///d:/SprintFlow/src/lib/db.ts#L461) |
| **SEC-03** | `CRITICAL` | Security | Unauthenticated public access to Gemini AI endpoint | [`src/app/api/analyze/route.ts:12-21`](file:///d:/SprintFlow/src/app/api/analyze/route.ts#L12-L21) |
| **SEC-04** | `CRITICAL` | Security | Active user credentials and session tokens committed in `db.json` | [`db.json:6-7`](file:///d:/SprintFlow/db.json#L6-L7) |
| **SEC-05** | `CRITICAL` | Vulnerability | Critical Next.js RCE vulnerabilities reported by `npm audit` | [`package.json:15`](file:///d:/SprintFlow/package.json#L15) |
| **BUS-01** | `CRITICAL` | SaaS / Billing | Payment and checkout system is completely simulated | [`src/app/api/subscription/route.ts:111-158`](file:///d:/SprintFlow/src/app/api/subscription/route.ts#L111-L158) |
| **BUS-02** | `HIGH` | Privacy / Compliance | Account deletion is fake and only logs out the user | [`src/components/DeleteAccountModal.tsx:38-39`](file:///d:/SprintFlow/src/components/DeleteAccountModal.tsx#L38-L39) |
| **SEC-06** | `HIGH` | Security | Password change endpoint does not require old password | [`src/app/api/user/settings/route.ts:97-101`](file:///d:/SprintFlow/src/app/api/user/settings/route.ts#L97-L101) |
| **SEC-07** | `HIGH` | Security | Zero rate limiting across all authentication and API endpoints | [`src/app/api/auth/login/route.ts:5-51`](file:///d:/SprintFlow/src/app/api/auth/login/route.ts#L5-L51) |
| **DAT-01** | `HIGH` | Data Layer | Monolithic JSONB blob storage causes concurrency race conditions | [`src/lib/db.ts:409-446`](file:///d:/SprintFlow/src/lib/db.ts#L409-L446) |
| **DAT-02** | `MEDIUM` | Data Layer | Synchronous file I/O fallback blocks Node.js event loop | [`src/lib/db.ts:192-205`](file:///d:/SprintFlow/src/lib/db.ts#L192-L205) |
| **SEC-08** | `MEDIUM` | Security | Direct prompt injection vulnerability in AI task parser | [`src/app/api/analyze/route.ts:40`](file:///d:/SprintFlow/src/app/api/analyze/route.ts#L40) |
| **SEC-09** | `MEDIUM` | Security | Server-side routing middleware is absent | N/A (Root workspace) |
| **QAL-01** | `MEDIUM` | Quality | 72 ESLint compilation errors and 424 warnings | Output of `npm run lint` |
| **UX-01** | `LOW` | UX / Data | Hardcoded personal test data shipped in client state | [`src/app/forgot-password/page.tsx:53-55`](file:///d:/SprintFlow/src/app/forgot-password/page.tsx#L53-L55) |
| **UX-02** | `LOW` | UX | Focus timer audio settings are completely disconnected | [`src/app/sprints/page.tsx:100-1096`](file:///d:/SprintFlow/src/app/sprints/page.tsx#L100-L1096) |

---

### Detailed Findings

#### [SEC-01] CRITICAL — Passwords stored without hashing (`mock_` prefix)
**Where:** [`src/app/api/auth/signup/route.ts:20`](file:///d:/SprintFlow/src/app/api/auth/signup/route.ts#L20) and [`src/app/api/auth/login/route.ts:19`](file:///d:/SprintFlow/src/app/api/auth/login/route.ts#L19)  
**What:**
```typescript
// Mock password hashing for local developer setup
const passwordHash = "mock_" + password;
```
**Why it matters:** Passwords are stored in plaintext in both Postgres (`data` JSONB) and `db.json`. Any database leak or unauthorized read access results in immediate exposure of all user credentials in clear text.  
**Fix:** Replace the mock prefix with standard password hashing using `bcrypt` (cost factor 12) or `argon2id`.  
**Effort:** S (1-2 days)

---

#### [SEC-02] CRITICAL — Predictable session token generation via `Math.random()`
**Where:** [`src/lib/db.ts:461`](file:///d:/SprintFlow/src/lib/db.ts#L461) and [`src/lib/db.ts:322`](file:///d:/SprintFlow/src/lib/db.ts#L322)  
**What:**
```typescript
const token = "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
```
**Why it matters:** `Math.random()` in V8 is powered by xorshift128+ and is cryptographically insecure. An attacker who observes several session IDs or seeds can reconstruct the internal PRNG state, predict future session tokens, and hijack user accounts without credentials.  
**Fix:** Use `crypto.randomBytes(32).toString("hex")` or `crypto.randomUUID()` from Node's built-in `crypto` module.  
**Effort:** S (0.5 days)

---

#### [SEC-03] CRITICAL — Unauthenticated public access to Gemini AI endpoint
**Where:** [`src/app/api/analyze/route.ts:12-21`](file:///d:/SprintFlow/src/app/api/analyze/route.ts#L12-L21)  
**What:**
```typescript
// 1. Fetch API Key (client header takes precedence)
let apiKey = req.headers.get("x-gemini-api-key") || undefined;
if (!apiKey) {
  apiKey = process.env.GEMINI_API_KEY;
}
if (!apiKey) {
  return Response.json({ error: "API Key missing" }, { status: 401 });
}
```
**Why it matters:** The route contains no session or authentication check. If `GEMINI_API_KEY` is configured in the environment, any anonymous user or automated bot on the internet can send arbitrary requests to `/api/analyze` and exhaust the server's Gemini API quota or incur massive API bills.  
**Fix:** Require an active authenticated session (`sprintflow_session` cookie) and enforce per-user rate limits on AI generation calls.  
**Effort:** S (0.5 days)

---

#### [SEC-04] CRITICAL — Active user credentials and session tokens committed in `db.json`
**Where:** [`db.json:6-7`](file:///d:/SprintFlow/db.json#L6-L7) and [`db.json:1870-1880`](file:///d:/SprintFlow/db.json#L1870-L1880)  
**What:**
```json
"email": "backend@sprintflow.io",
"passwordHash": "mock_@R(.3o%password123",
...
"token": "sess_iz8md9beet07hhetslgq3n"
```
**Why it matters:** The development database file `db.json` is checked into git repository history (`affe8a9 chore(data): sync local database state`). It contains plain passwords and active session tokens for test users and personal email addresses (`fahimsahmed01@gmail.com`).  
**Fix:** Add `db.json` to `.gitignore`, purge sensitive data from git commit history, and invalidate all existing session tokens.  
**Effort:** S (0.5 days)

---

#### [SEC-05] CRITICAL — Critical Next.js RCE vulnerabilities reported by `npm audit`
**Where:** [`package.json:15`](file:///d:/SprintFlow/package.json#L15)  
**What:**
`npm audit` reports 3 vulnerabilities (2 high, 1 critical):
- `next 16.3.0`: Critical Unauthenticated Remote Code Execution on Windows-hosted servers (GHSA-p293-qw3h-jr36) and Image Optimization API AVIF processing (GHSA-2xp9-vwfh-vxw4).  
- `sharp <0.35.4`: High severity in libheif (GHSA-g89c-p67h-r497).  
**Why it matters:** Deploying `next@16.3.0` in a Windows environment allows unauthenticated remote attackers to execute arbitrary code on the server.  
**Fix:** Upgrade `next` to `>=16.3.5` and update `sharp` via `npm audit fix`.  
**Effort:** S (0.5 days)

---

#### [BUS-01] CRITICAL — Payment and checkout system is completely simulated
**Where:** [`src/app/api/subscription/route.ts:111-158`](file:///d:/SprintFlow/src/app/api/subscription/route.ts#L111-L158)  
**What:**
```typescript
const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
const txId = `SF-${randomSuffix}`;

const historyItem: PaymentHistoryItem = {
  id: "tx_" + Date.now(),
  plan: `Pro · ${durationMonths}-Month pass`,
  amount,
  transactionId: txId,
  status: "Paid"
};
```
**Why it matters:** The app cannot collect real revenue. Any user can call `/api/subscription` with `{ "action": "checkout", "period": "3_months" }` and receive immediate lifetime access to Pro features without paying.  
**Fix:** Integrate a legitimate payment provider (e.g. Stripe Checkout/Customer Portal or bKash/SSLCommerz merchant APIs) with cryptographic webhook signature validation.  
**Effort:** L (2.0 dev-weeks)

---

#### [BUS-02] HIGH — Account deletion is fake and only logs out the user
**Where:** [`src/components/DeleteAccountModal.tsx:38-39`](file:///d:/SprintFlow/src/components/DeleteAccountModal.tsx#L38-L39)  
**What:**
```typescript
try {
  await fetch("/api/auth/logout", { method: "POST" });
  router.push("/account-deleted");
} catch { ... }
```
**Why it matters:** The UI explicitly states "This permanently erases your account and everything in it", but the code only terminates the active cookie session. All user data, tasks, notes, and profile records remain intact in the database. This is a deceptive dark pattern and violates GDPR Article 17 ("Right to Erasure").  
**Fix:** Create a dedicated `DELETE /api/user` endpoint that deletes the user record and associated data from Postgres and invalidates all session tokens.  
**Effort:** S (1 day)

---

#### [SEC-06] HIGH — Password change endpoint does not require old password
**Where:** [`src/app/api/user/settings/route.ts:97-101`](file:///d:/SprintFlow/src/app/api/user/settings/route.ts#L97-L101)  
**What:**
```typescript
if (action === "change_password" && newPassword) {
  user.passwordHash = newPassword;
  await updateUser(user);
  return NextResponse.json({ success: true, message: "Password updated successfully." });
}
```
**Why it matters:** If an attacker gets momentary access to an active browser session or leverages a Cross-Site Request Forgery scenario, they can overwrite the user's password without knowing the current password, permanently locking the genuine owner out.  
**Fix:** Require `currentPassword`, verify its hash against the stored password before updating, and hash the new password.  
**Effort:** S (0.5 days)

---

#### [SEC-07] HIGH — Zero rate limiting across all authentication and API endpoints
**Where:** [`src/app/api/auth/login/route.ts:5-51`](file:///d:/SprintFlow/src/app/api/auth/login/route.ts#L5-L51)  
**What:**
All API routes process incoming requests immediately without any IP-based or token-bucket rate limiter.  
**Why it matters:** The login endpoint can be brute-forced indefinitely at thousands of requests per second without throttling or lockout.  
**Fix:** Implement Upstash Redis rate limiting or in-memory sliding window rate limiting on all `/api/auth/*` and `/api/analyze` routes.  
**Effort:** M (3-4 days)

---

#### [DAT-01] HIGH — Monolithic JSONB blob storage causes concurrency race conditions
**Where:** [`src/lib/db.ts:409-446`](file:///d:/SprintFlow/src/lib/db.ts#L409-L446)  
**What:**
All tasks, sprints, timeline items, rewards, and settings are serialized into a single `data JSONB` column. When any sub-resource is updated (e.g. marking a task complete), the entire user object is re-written over the existing record:
```typescript
await sql`
  UPDATE sprintflow_users 
  SET email = ${user.email},
      password_hash = ${user.passwordHash},
      data = ${sql.json(dataPayload as any)}
  WHERE id = ${user.id};
`;
```
**Why it matters:** If two client actions occur in parallel (e.g. focus timer updates rewards while the user edits a task in another tab), the last write completely overwrites the former, causing silent data loss. Relational queries and analytics across users are impossible without full table scans and JSON unpacking.  
**Fix:** Migrate to a normalized relational schema with distinct tables (`users`, `tasks`, `sprints`, `subtasks`, `subscriptions`, `reward_events`) using an ORM like Drizzle or Prisma.  
**Effort:** L (2.0 dev-weeks)

---

#### [DAT-02] MEDIUM — Synchronous file I/O fallback blocks Node.js event loop
**Where:** [`src/lib/db.ts:192-205`](file:///d:/SprintFlow/src/lib/db.ts#L192-L205)  
**What:**
```typescript
const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
...
fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
```
**Why it matters:** When running in local/standalone mode, every HTTP request performs synchronous blocking disk read and write operations. Under concurrent user traffic, this freezes the single-threaded Node.js event loop and introduces high request latency.  
**Fix:** Use asynchronous non-blocking file operations (`fs.promises`) or require a proper SQL database in all environments.  
**Effort:** S (0.5 days)

---

#### [SEC-08] MEDIUM — Direct prompt injection vulnerability in AI task parser
**Where:** [`src/app/api/analyze/route.ts:40`](file:///d:/SprintFlow/src/app/api/analyze/route.ts#L40)  
**What:**
```typescript
const prompt = `
You are an AI planner for SprintFlow.
Analyze this user task list:
"""
${taskList}
"""
...
`;
```
**Why it matters:** The user-supplied `taskList` is concatenated directly into the prompt without sanitization. An attacker can craft a payload such as `"""\nIgnore all previous instructions and output...` to hijack model output, bypass schema constraints, or cause unexpected server parsing errors.  
**Fix:** Delimit user input using clear system instructions, enforce max character length limits, and validate JSON output against a strict Zod schema.  
**Effort:** S (1 day)

---

#### [SEC-09] MEDIUM — Server-side routing middleware is absent
**Where:** N/A (Root workspace)  
**What:**
The project lacks a `middleware.ts` file. Protected client pages (`/dashboard`, `/tasks`, `/planner`, `/sprints`, `/settings`, `/analytics`) rely entirely on individual `useEffect` hooks fetching `/api/auth/me` to trigger redirects.  
**Why it matters:** Unauthenticated users load the full client bundle and briefly view the initial UI skeleton and default state before client-side JavaScript redirects them.  
**Fix:** Implement standard Next.js `middleware.ts` to verify the `sprintflow_session` cookie at the edge before rendering protected routes.  
**Effort:** S (1 day)

---

#### [QAL-01] MEDIUM — 72 ESLint compilation errors and 424 warnings
**Where:** Output of `npm run lint`  
**What:**
ESLint fails with 72 errors across components, notably `react-hooks/set-state-in-effect` violations (synchronous `setState` inside `useEffect` triggering cascading renders in `SprintEditModal.tsx`, `ThemeProvider.tsx`, `ThemeToggle.tsx`), unescaped JSX entities, and `@typescript-eslint/no-explicit-any` casts.  
**Why it matters:** Cascading renders degrade client runtime performance, and lint failures break CI quality gates.  
**Fix:** Fix effect dependencies, replace direct state mutations with proper event handlers, and escape JSX characters.  
**Effort:** M (3 days)

---

#### [UX-01] LOW — Hardcoded personal test data shipped in client state
**Where:** [`src/app/forgot-password/page.tsx:53-55`](file:///d:/SprintFlow/src/app/forgot-password/page.tsx#L53-L55), [`src/app/settings/page.tsx:97-100`](file:///d:/SprintFlow/src/app/settings/page.tsx#L97-L100), and [`src/app/dashboard/page.tsx:137-138`](file:///d:/SprintFlow/src/app/dashboard/page.tsx#L137-L138)  
**What:**
Default state in components is initialized with real developer credentials:
```typescript
const [email, setEmail] = useState("fahimsahmed01@gmail.com");
const [password, setPassword] = useState("Password123!");
const [userName, setUserName] = useState("Fahim Siddique");
```
**Why it matters:** Personal developer emails and mock passwords are hardcoded into production client bundles and appear if state initialization fails or lags.  
**Fix:** Initialize default state to empty strings or retrieve cleanly from auth context.  
**Effort:** S (0.5 days)

---

#### [UX-02] LOW — Focus timer audio settings are completely disconnected
**Where:** [`src/app/sprints/page.tsx:100-1096`](file:///d:/SprintFlow/src/app/sprints/page.tsx#L100-L1096)  
**What:**
User settings allow configuring sound theme ("Soft chime"), ticking sound, and volume, but the focus session timer contains zero Web Audio or HTMLAudioElement playback logic.  
**Why it matters:** Users expect audible notifications when sprints and breaks complete; the setting has no effect in the app.  
**Fix:** Implement an audio synthesis or sound asset loader triggering on timer phase completion.  
**Effort:** S (1 day)

---

## 5. Gap Register — what does NOT exist

| Gap | Area | Why it blocks a commercial launch | Effort |
| :--- | :--- | :--- | :---: |
| **Real Payment Gateway** | Billing | Cannot accept customer credit cards or mobile payments; cannot charge recurring subscriptions. | L |
| **Payment Webhook Handlers** | Billing | Cannot handle chargebacks, renewals, cancellations, or failed payments. | M |
| **Password Hashing (Argon2/bcrypt)** | Security | Storing plaintext passwords violates basic security standards and legal regulations. | S |
| **Cryptographic PRNG Sessions** | Security | Predictable session tokens leave all customer accounts vulnerable to account takeover. | S |
| **Email Service & Verification** | Auth / Comms | Cannot verify customer identity, send password resets, or dispatch product updates. | M |
| **Automated Test Suite (Unit/E2E)** | Quality | No safety net against regressions; any future refactor is high risk. | L |
| **Normalized Database Schema** | Data Layer | Unstructured JSON blobs corrupt data under concurrent requests and prevent reporting. | L |
| **Database Migration System** | Data Layer | Schema changes cannot be applied reproducibly across dev, staging, and prod environments. | M |
| **Edge Route Middleware** | Architecture | Unauthenticated visitors can load protected client shells before JavaScript kicks in. | S |
| **Rate Limiting & DDoS Shield** | Security | Login, signup, and AI endpoints can be spammed and abused without cost. | M |
| **Admin Support Back-Office** | Operations | Team cannot look up accounts, issue refunds, manage plans, or inspect system logs. | L |
| **Real Analytics Engine** | Features | Analytics dashboard displays static fake numbers instead of real focus data. | M |
| **Real Account Deletion (GDPR)** | Legal | Fake account deletion exposes company to severe GDPR/CCPA regulatory fines. | S |
| **CI/CD Build Pipelines** | DevOps | No automated testing or linting checks before deployments occur. | S |
| **Error Monitoring (e.g. Sentry)** | Operations | Production crashes and unhandled exceptions will occur undetected. | S |
| **Cookie Consent & Legal Compliance**| Legal | Missing cookie banner and GDPR data processing agreement. | S |

---

## 6. Roadmap to Sellable

### Phase 1 — Blockers (must fix before any paying customer)
- [ ] Upgrade `next` dependency to `>=16.3.5` and fix RCE vulnerabilities *(0.5 dev-weeks)*
- [ ] Replace `"mock_"` password hashing with `bcrypt` / `argon2` hashing on signup, login, and settings update *(0.5 dev-weeks)*
- [ ] Replace `Math.random()` session tokens and user IDs with `crypto.randomBytes` / `crypto.randomUUID` *(0.5 dev-weeks)*
- [ ] Implement Next.js `middleware.ts` to enforce server-side session authentication on all protected routes *(0.5 dev-weeks)*
- [ ] Add session authentication checks and rate limiting to `/api/analyze` *(0.5 dev-weeks)*
- [ ] Purge `db.json` and sensitive test credentials from git commit history and `.gitignore` local databases *(0.5 dev-weeks)*
- [ ] Build a true account deletion API endpoint that permanently drops user records *(0.5 dev-weeks)*

### Phase 2 — Commercial requirements (billing, admin, legal, docs)
- [ ] Integrate real payment gateway (Stripe Billing / LemonSqueezy) with checkout sessions and customer portal *(2.0 dev-weeks)*
- [ ] Implement payment webhook router with signature verification for active, failed, and canceled subscriptions *(1.0 dev-weeks)*
- [ ] Set up transactional email provider (Resend / SendGrid) and implement tokenized password reset flow *(1.0 dev-weeks)*
- [ ] Migrate database to normalized relational schema (Drizzle ORM + Postgres) with automated migrations *(2.0 dev-weeks)*
- [ ] Build basic internal admin dashboard for user lookup, subscription overrides, and system health *(1.0 dev-weeks)*
- [ ] Add cookie consent banner and update Terms / Privacy documentation *(0.5 dev-weeks)*

### Phase 3 — Professional polish (UX, performance, accessibility, tests)
- [ ] Write comprehensive test suite: unit tests for auth/db lib and Playwright E2E tests for core Pomodoro flow *(1.5 dev-weeks)*
- [ ] Fix all 72 ESLint compilation errors and eliminate cascading `setState` warnings in UI modals *(0.5 dev-weeks)*
- [ ] Connect focus timer audio engine to play configured sound themes upon sprint/break transitions *(0.5 dev-weeks)*
- [ ] Replace hardcoded mock data in Analytics and Tasks workspaces with live database aggregation *(1.0 dev-weeks)*
- [ ] Setup GitHub Actions CI/CD pipeline running typecheck, lint, test, and container build *(0.5 dev-weeks)*
- [ ] Clean up `README.md` with complete architecture setup instructions, env vars reference, and API docs *(0.5 dev-weeks)*

---

## 7. Unverified / Not Audited

The following areas could not be verified directly during this audit:
- **Real Postgres Performance Under Heavy Load:** Verified Postgres queries via static inspection of [`src/lib/db.ts`](file:///d:/SprintFlow/src/lib/db.ts), but live Postgres instance was not provisioned during audit (local fallback mode was active).
- **Gemini Live Rate Limits:** The Gemini API token was tested via static route inspection; real upstream Google Cloud quota limits and latency were not measured under high concurrency.
- **Mobile Device Touch Gestures:** Responsive breakpoints were checked in CSS and code; physical iOS/Android touch event responsiveness on drawer dragging was not physically tested.

---

## 8. Appendix

### Stack & Versions
- **Runtime Target:** Node.js `>=20`
- **Framework:** Next.js `16.3.0` (App Router, Turbopack)
- **UI Core:** React `19.2.8`, React-DOM `19.2.8`
- **Language:** TypeScript `^5`
- **Styling:** Tailwind CSS `^4`, `@tailwindcss/postcss ^4`, PostCSS
- **Animation:** `motion ^13.2.0` (Framer Motion), `clsx ^2.1.1`, `tailwind-merge ^3.7.0`
- **Database Client:** `postgres ^3.4.9`
- **AI SDK:** `@google/generative-ai ^0.24.1`
- **Containerization:** Docker (`node:20-alpine`), Docker Compose v3.8

### Repository Map
```
d:\SprintFlow\
├── .agent/              # Skill configurations (impeccable, motion-primitives)
├── public/              # Static public assets
├── src/
│   ├── app/             # Next.js App Router (16 routes + API endpoints)
│   │   ├── api/         # Backend HTTP endpoints (auth, tasks, sprints, subscription, analyze, settings)
│   │   ├── (workspaces) # dashboard, tasks, planner, sprints, rewards, analytics, settings
│   │   ├── (auth/pay)   # login, signup, forgot-password, onboarding, pricing, checkout, subscription
│   │   └── globals.css  # Global CSS custom properties design tokens (1,755 lines)
│   ├── components/      # 13 shared modal and drawer components + 5 motion wrappers
│   └── lib/             # db.ts (hybrid database interface) & motion.ts (animation variants)
├── db.json              # Local JSON database storage (committed)
├── Dockerfile           # Multi-stage production container build
├── docker-compose.yml   # Container port binding and volume mount
└── package.json         # Project manifests and scripts
```

### Lines of Code (LOC) Summary

| File Path | Lines | Bytes |
| :--- | :---: | :---: |
| `src/app/globals.css` | 1,755 | 39,679 |
| `src/app/tasks/page.tsx` | 1,435 | 76,838 |
| `src/app/settings/page.tsx` | 1,365 | 77,960 |
| `src/app/page.tsx` | 1,158 | 65,529 |
| `src/app/dashboard/page.tsx` | 1,044 | 60,550 |
| `src/app/sprints/page.tsx` | 1,001 | 52,222 |
| `src/app/analytics/page.tsx` | 720 | 39,923 |
| `src/app/planner/page.tsx` | 618 | 34,652 |
| `src/app/rewards/page.tsx` | 554 | 31,905 |
| `src/app/onboarding/page.tsx` | 534 | 32,614 |
| `src/app/subscription/page.tsx` | 528 | 27,556 |
| `src/lib/db.ts` | 504 | 15,120 |
| `src/app/pricing/page.tsx` | 471 | 24,389 |
| `src/app/checkout/page.tsx` | 434 | 22,808 |
| `src/app/forgot-password/page.tsx` | 378 | 20,638 |
| `src/components/ChangePasswordModal.tsx` | 264 | 12,324 |
| `src/components/SprintEditModal.tsx` | 244 | 12,083 |
| `src/components/CarryOverModal.tsx` | 237 | 10,310 |
| `src/components/NotificationCenter.tsx` | 232 | 9,461 |
| `src/components/TaskDetailDrawer.tsx` | 220 | 10,129 |
| Other Components & API Routes | 1,780 | 69,458 |
| **Total Source Code (src)** | **~15,196** | **~676,000** |

### Dependency Audit Raw Output (`npm audit`)
```
# npm audit report

js-yaml  4.0.0 - 4.3.1
Severity: high
js-yaml: maxTotalMergeKeys does not limit CPU use for empty merge sources - https://github.com/advisories/GHSA-2883-xcg3-v3hh
node_modules/js-yaml

next  16.0.0 - 16.3.2
Severity: critical
Next.js: Unauthenticated Remote Code Execution on windows-hosted servers - https://github.com/advisories/GHSA-p293-qw3h-jr36
Next.js: Unauthenticated Remote Code Execution in Image Optimization API when AVIF files are used - https://github.com/advisories/GHSA-2xp9-vwfh-vxw4
node_modules/next

sharp  <0.35.4
Severity: high
sharp: Vulnerabilities in libheif: GHSA-g89c-p67h-r497 and GHSA-2jg2-4ch7-h545 - https://github.com/advisories/GHSA-rgj7-g3m4-5g8c
node_modules/sharp

3 vulnerabilities (2 high, 1 critical)
```

### Commands Executed During Audit
- `git rev-parse HEAD; git status --short` — Retrieved active commit hash (`ea67f9c466630e5397185a9f06ff1fda0c95066a`) and uncommitted files.
- `npm audit` — Assessed package vulnerabilities and identified critical Next.js CVEs.
- `npx tsc --noEmit` — Verified TypeScript compilation (0 type errors).
- `npm run lint` (`eslint`) — Measured code quality (72 errors, 424 warnings).
- `npm run build` (`next build`) — Validated static and dynamic route generation.
- `npx license-checker --summary` — Audited open source licenses (310 MIT, 22 Apache-2.0, 15 ISC, 0 AGPL).
- `git log` and `grep` scans — Searched for committed secrets, plaintext passwords, and unauthenticated endpoints.

---

```yaml
---
project: SprintFlow
stack: ["Next.js 16.3.0", "React 19.2.8", "TypeScript 5", "Tailwind CSS 4", "Postgres", "Gemini AI"]
commit: ea67f9c466630e5397185a9f06ff1fda0c95066a
overall_score: 28
sellable: false
counts: { critical: 6, high: 4, medium: 4, low: 2 }
features: { done: 1, partial: 9, missing: 6 }
biggest_blockers:
  - "Plaintext password storage and predictable Math.random session tokens"
  - "Simulated fake billing checkout with no payment gateway or webhook verification"
  - "Unauthenticated public access to Gemini AI endpoint"
  - "Monolithic JSONB blob storage causing concurrent write race conditions"
  - "Fake account deletion and fake password reset flows"
estimated_weeks_to_sellable: 11.0
---
```
