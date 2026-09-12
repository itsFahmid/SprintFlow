# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Students and self-learners who reach for SprintFlow when they have an overwhelming list of study tasks and want to structure their time into focused, time-boxed sessions without having to plan manually. They are motivated but distraction-prone, and they want to feel rewarded for the work they actually complete.

## Product Purpose

SprintFlow converts a raw, unstructured to-do dump into a sequenced, time-boxed sprint plan using AI -- then guides users through each focus session with a built-in Pomodoro timer and rewards them for completing sprints. Success means the user finishes a session feeling like they made real, visible progress.

## Positioning

SprintFlow's meaningfully different mechanism is: paste your tasks and get a ready-to-run sprint plan in seconds, with no manual grooming required. An AI takes the raw list, sequences and time-boxes it into sprints, and the app guides execution from start to finish. No other tool in the Pomodoro/task-manager space does all three steps (AI planning, in-session guidance, reward) in a single frictionless flow.

## Operating Context

- Users arrive with a list of tasks already in their head or clipboard -- entry is a paste or quick type into the task input.
- Sessions happen on desktop browsers (web app), typically at a study desk or work setup.
- The app runs sprint-by-sprint: users start a sprint, follow the timer, and mark tasks complete. Incomplete tasks can be carried over to the next sprint.
- Users track progress over time through analytics and earn rewards/badges for completed sprints and streaks.
- Key workflow surfaces: landing page, onboarding, dashboard, tasks, planner, sprints (active session), rewards, analytics, settings.

## Capabilities and Constraints

- AI sprint generation: Users paste a task list; the @google/generative-ai SDK (Gemini) sequences and time-boxes them into sprints.
- Pomodoro timer: Built-in focus timer with configurable session durations, running per sprint.
- Sprint management: Create, edit, carry over, interrupt, and complete sprints with associated modals (SprintEditModal, CarryOverModal, SprintInterruptedModal, ExitFocusModal).
- Task management: Full task list with a detail drawer (TaskDetailDrawer).
- Planner view: Calendar/date-based task organization.
- Rewards system: Badges, streaks, and progress tracking for completed sprints.
- Analytics: Session and sprint history visualized over time.
- Auth: Login, signup, forgot-password, account deletion, password change.
- Subscription/paywall: Free tier with a paid upgrade path (pricing page, checkout, PaywallModal).
- Notifications: In-app notification center (NotificationCenter).
- Stack: Next.js 16.3 (App Router), React 19, TypeScript, Tailwind CSS v4, PostgreSQL (via postgres package), deployed via Docker.

## Brand Commitments

- Name: SprintFlow -- confirmed and locked.
- Visual identity: Currently evolving; no locked logo, palette, or illustration set. The incumbent codebase uses a purple primary (#7c3aed) and an indigo secondary (#6366f1) on both a light marketing surface and a near-white app shell. This is the existing visual direction, not a hard constraint.
- Typography: Outfit (headings) + Inter (body) from Google Fonts -- established in the codebase.

## Evidence on Hand

- Full Next.js codebase at D:\SprintFlow\src with 16 app routes and 13 shared components.
- globals.css defines a complete CSS custom-property token system (colors, shadows, transitions).
- db.json (48 KB) contains backend data schema evidence.
- No external logo file, brand guide, or design asset file found in the repo -- these are absent and must not be fabricated.

## Product Principles

1. Zero-friction entry. The product's superpower is "paste and go" -- every surface should eliminate setup steps and respect the user's impatience to get started.
2. Make progress feel real. Rewards, completion states, and visible streaks exist because motivation decays without feedback. Design must make done-ness feel satisfying.
3. AI does the planning, humans do the doing. The interface should surface AI decisions (sprint sequencing, time estimates) as confident guidance, not uncertain suggestions.
4. Operate mode first. The app shell is a tool, not a marketing surface -- scanability, task density, and native web expectations outrank expressive decoration inside the authenticated product.
5. Grow through delight, not friction. The paywall and upgrade path should feel like a natural unlock, not a wall -- earned access through demonstrated value.

## Accessibility & Inclusion

No specific accessibility standard has been mandated. Default to WCAG 2.1 AA for interactive controls, focus states, and color contrast as a baseline for all future design work.
