# PHASE 4 — Real Money

> Paste into Antigravity once Phase 3 is merged and `PHASE_3_REPORT.md` says complete.
> Target: 2 weeks.

---

## ⚠️ DECIDE THIS BEFORE YOU PASTE

Fill this in — the agent cannot choose for you, and choosing wrong costs a rebuild:

```
PAYMENT PROVIDER: <<fill in>>
TARGET MARKET:    <<global / Bangladesh only / both>>
CURRENCY:         <<USD / BDT / both>>
PRICE POINTS:     <<e.g. Pro monthly $X, 3-month $Y, annual $Z>>
BUSINESS ENTITY:  <<registered company + country, or individual>>
```

Why it matters: direct Stripe accounts require a supported merchant country, and Bangladesh has historically not been one — **verify your own eligibility before committing**. The realistic options:

- **Merchant of record** (Paddle, LemonSqueezy, Gumroad) — they are the seller of record, handle global cards, and take on VAT/sales-tax filing. Higher fee, far less paperwork, works from many countries Stripe won't onboard directly. Usually the right answer for a solo founder selling globally.
- **Local gateway** (SSLCommerz, aamarPay, bKash/Nagad) — needed if you're selling to Bangladeshi customers in BDT. Note that most local gateways have weak or no native recurring-subscription support, so you will likely sell **fixed-term passes** (the existing "3-month pass" model already fits this) rather than auto-renewing subscriptions.
- **Both**, routed by customer region — most work, do it only if you actually have both audiences.

If you're unsure, a merchant of record is the lower-risk default. Do not let the agent pick.

---

## CONTEXT

**SprintFlow** — Next.js 16 / React 19 / TypeScript focus-sprint app. Phases 0–3 are done: security triaged, relational Postgres schema in place (including empty `subscriptions` and `payments` tables), real auth with verified email, and every displayed number now traces to real data. Read those reports and `AUDIT_REPORT.md` first.

Billing today is entirely fake (`src/app/api/subscription/route.ts:111-158`): it mints an `SF-` transaction ID from `Math.random()` and grants Pro. Anyone can `POST` themselves a subscription. This phase replaces that with real money movement.

**This is the highest-risk phase in the project.** Bugs here mean charging people wrongly, failing to charge them, or granting access that wasn't paid for. Move slowly and test every path.

## STANDING RULES

1. **Scope lock.** Billing and entitlement only. No new product features, no analytics changes, no redesign.
2. **Never trust the client about money.** Entitlement is derived from the provider's webhook state in your database. A client claim that someone is Pro is worthless.
3. **Never store card data.** All card entry happens in the provider's hosted checkout or their iframe/SDK element. If the current `src/app/checkout/page.tsx` collects raw card fields in your own form, **that form must be replaced, not secured** — it puts you in PCI-DSS scope you cannot satisfy.
4. Test mode only until every acceptance test passes. Live keys are the owner's last step, not yours.
5. Small commits, conventional messages. `tsc` and `build` clean at every commit.
6. Evidence for every claim.

## TASKS

### 4.1 — Model the plans before writing code

Produce, in your report, before implementing:

- The plan matrix: each plan, price, billing period, and **exactly which features it gates**.
- The free-tier limits. This is a business decision with a real cost attached — see 4.7.
- The entitlement rules: what happens at signup, on payment, on renewal, on failure, on cancellation, at period end, on refund.
- The state machine for `subscriptions.status`: every state, every legal transition, and what the user can do in each.

Get this table right first. Rewriting entitlement logic after it ships means auditing every existing customer by hand.

### 4.2 — Provider integration

- Integrate the provider named in the decision block above, using their official SDK. Pin the version.
- Create products and prices in the provider's **test** environment via their dashboard or API, and store the provider IDs in config, never hardcoded in components.
- Replace the fake checkout with the provider's hosted checkout or hosted element. Delete the simulated flow in `src/app/api/subscription/route.ts` entirely — do not leave it behind a flag.
- Persist the provider's customer ID on the user at first checkout, and reuse it forever.
- Require a **verified email** before checkout (Phase 2 built verification for this).

### 4.3 — Webhooks — the real source of truth

- Build `POST /api/webhooks/<provider>` that **verifies the cryptographic signature on every request** and rejects unsigned or mis-signed payloads with a 400. An unsigned webhook endpoint is a "give me a free subscription" button.
- Handle at minimum: checkout completed, payment succeeded, payment failed, subscription created/updated/cancelled, refund issued, dispute/chargeback opened.
- **Idempotency is mandatory.** Providers retry, and will deliver the same event more than once. Store every event ID in a `webhook_events` table with a unique constraint and skip duplicates. Log every event raw, including ones you don't handle yet — you will need them to debug.
- Handle out-of-order delivery: a `subscription.updated` can arrive before the `checkout.completed` that caused it. Reconcile by comparing the provider's timestamps, not arrival order.
- Never grant entitlement from the browser redirect back to your success page. The redirect is a UI hint; the webhook is the truth. Show a "confirming your payment…" state that polls until the webhook lands.
- The endpoint must be exempt from CSRF and from the Phase 2 rate limiter.

### 4.4 — Entitlement enforcement

- One server-side helper — `getEntitlements(userId)` — is the only way any code asks what a user may do. No feature check anywhere reads `subscription.plan` directly.
- Enforce gates **server-side on every protected route**. Hiding a button in the UI is not enforcement; assume a determined user calls your API directly.
- Mirror the gates in the UI with honest upgrade prompts.
- Handle grace periods explicitly: a failed renewal should not instantly delete access. Define the window and say what the user sees during it.
- Handle downgrade: what happens to data that exceeds the free plan's limits? Do not silently delete anything. Document the rule.

### 4.5 — Subscription lifecycle UI

Build, in the existing design language:

- Current plan, status, renewal or expiry date, and price.
- Upgrade and downgrade, with correct proration handling (or a clear statement that you don't prorate).
- Cancel — honest about what happens and when. Cancel at period end, not instantly, unless the user explicitly asks for immediate.
- Payment method update (hand off to the provider's portal where one exists).
- Real invoice and payment history from the `payments` table, with downloadable receipts.
- Reactivate a cancelled subscription.

### 4.6 — Dunning and failed payments

- On payment failure: email the user, show an in-app banner, start the grace period, and follow the provider's retry schedule.
- Escalating emails across the grace window, then a final downgrade notice.
- Never surprise anyone: send a renewal reminder before charging an annual or multi-month plan.
- All emails go through the Phase 2 email infrastructure and get logged.

### 4.7 — Usage metering and cost control

**The audit missed this and it is a genuine threat to the business.** Every AI call to Gemini costs the owner money, and there is currently no cap on free users.

- Add a `usage_events` table: user_id, feature, quantity, cost_estimate_minor, occurred_at.
- Record every AI generation with its estimated cost.
- Enforce a per-plan monthly quota on AI generations. Free tier gets a hard cap with a clear in-app counter; paid tiers get a higher one.
- Build a `/api/admin/usage`-style query (no UI needed yet) reporting total AI spend, spend per user, and the worst offenders.
- **Calculate and report the unit economics**: cost of one free user per month at the cap you set, cost of one paid user at typical usage, and the resulting gross margin at each price point. If the margin is negative at the proposed price, say so loudly — that is a finding, not an implementation detail.
- Keep the bring-your-own-Gemini-key path from Phase 0 working, and consider making it the free tier's escape hatch. Note the tradeoff in your report.

### 4.8 — Financial correctness

- Store money as **integer minor units** (cents/poisha) with an explicit currency column. Never floats. If any existing code uses a float for an amount, fix it.
- Reconciliation script: compare your `payments` table against the provider's records for a date range and report discrepancies. Run it and paste the output.
- Log every entitlement change to an append-only audit table: who, what, when, which webhook event caused it. When a customer disputes their access, this is the only thing that will save you.

## OUT OF SCOPE

New product features · analytics changes · admin UI (the usage query is API-only for now) · tests beyond the billing paths listed below · CI · cookie consent.

## DEFINITION OF DONE

Every one of these must be demonstrated in test mode with real provider test cards:

- [ ] `grep -rn "SF-\|Math.random" src/app/api/subscription/` returns nothing
- [ ] No raw card field exists in any SprintFlow-owned form — confirm by inspecting the checkout page
- [ ] Happy path: checkout → webhook → entitlement granted → Pro features unlock
- [ ] **Forged webhook with an invalid signature → 400, no entitlement granted.** Paste the attempt and response.
- [ ] Duplicate webhook delivery → processed exactly once. Fire the same event ID twice and show one ledger row.
- [ ] Out-of-order delivery handled — send the events reversed and show correct final state
- [ ] Declined card → no entitlement, user sees a clear error
- [ ] Failed renewal → grace period → dunning emails → downgrade at the end of the window
- [ ] Cancellation → access continues to period end → expires correctly
- [ ] Refund → entitlement revoked
- [ ] Chargeback event → handled per your documented rule
- [ ] Direct API call to a Pro-gated endpoint as a free user → 403. Test every gated endpoint and list them.
- [ ] AI quota enforced: exceed the free cap and show the 429/402 and the in-app counter
- [ ] Reconciliation script run, output pasted, zero unexplained discrepancies
- [ ] All amounts stored as integers — schema output pasted
- [ ] `npx tsc --noEmit` clean, `npm run build` passes

## DELIVERABLE

Write `PHASE_4_REPORT.md` in the repo root:

```
# Phase 4 Report — Real Money
Date · Start commit · End commit · Provider · Test/Live mode

## 1. Plan Matrix & Entitlements
| Plan | Price | Period | Features unlocked | AI quota | Limits |

## 2. Subscription State Machine
Every state, every transition, what triggers it, what the user sees.

## 3. Task Status
| Task | Status | Commits | Evidence |

## 4. Webhook Handling
| Event | Handled? | Idempotent? | Effect on entitlement | Tested how |

## 5. Billing Test Matrix
| Scenario | Steps | Expected | Actual | Pass/Fail |
All Definition of Done scenarios, with real output.

## 6. Entitlement Enforcement Audit
| Gated endpoint/feature | Server-side check? | file:line | Tested as free user |

## 7. Unit Economics
Cost per free user/month · cost per paid user/month · gross margin per plan.
State plainly whether the pricing works.

## 8. Money Safety
Integer storage confirmation · reconciliation output · audit log design.

## 9. Owner Action Required Before Going Live
Live API keys, webhook endpoint registration, business verification, tax settings,
anything the agent cannot do.

## 10. Deferred
## 11. Blocked
```

End with:

```yaml
---
phase: 4
status: complete | partial
provider: <name>
mode: test
webhook_events_handled: N
signature_verification: true
idempotency: true
billing_scenarios_tested: N
billing_scenarios_failed: 0
gated_endpoints: N
gated_endpoints_enforced_server_side: N
free_user_monthly_cost_estimate: "<amount>"
gross_margin_pro: "<percent>"
pricing_viable: true | false
build_passing: true
owner_actions_before_live: [...]
next_phase_blocked_by: []
---
```
