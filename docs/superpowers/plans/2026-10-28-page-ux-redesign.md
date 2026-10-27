# StagePeek Page UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rework the shared navigation, explorer workflow, async states, and account handoffs so a new user can complete a seat lookup on desktop or mobile without guessing the next action.

**Architecture:** Keep the existing vanilla HTML/ES modules, venue APIs, seat geometry, event data, billing rules, and five locale dictionaries. Add a small explorer state presentation layer in the existing `app.mjs`, use explicit DOM status/step elements for progressive disclosure, and extend the current browser-facing tests plus a deterministic interaction harness rather than introducing a new framework.

**Tech Stack:** Node.js ESM, existing HTTP renderer, vanilla browser modules, existing CSS, Node test runner, Ego browser for live visual and interaction checks.

**Spec:** `docs/superpowers/specs/2026-10-28-stagepeek-page-ux-audit-design.md`

## Global Constraints

- Preserve default English and the five reviewed locales: `en`, `zh-CN`, `zh-TW`, `ja`, and `ko`.
- Do not change seat geometry, source assets, event source data, venue access policy, subscription price, or payment/auth protocol.
- Keep the language control as a globe icon with an accessible label; mobile navigation must remain usable at 390px.
- Do not claim a seat is verified when the API only returns an estimate or a section preview.
- Keep explorer query-string routes non-indexable and preserve safe return context through login/account transitions.
- Do not publish the dirty shared workspace; changes come from the isolated release checkout only.

## Review Focus

- A first-time visitor with no URL parameters can identify the three explorer steps and the next enabled action without reading implementation text.
- A venue API delay, rejected venue request, empty event list, and failed seat resolve each leave a visible status with a retry or recovery action.
- A locked venue never bypasses access checks when selected from the new venue step or a deep link.
- A 390px viewport keeps the globe, sign-in/account action, form controls, map controls, event cards, and save action reachable without horizontal scroll.
- Switching locale during an in-progress explorer route preserves venue, event, layout, section, row, seat, mode, and zoom while updating visible labels and document language.

## Files and Responsibilities

- Modify `public/index.html` to add explicit explorer step containers, status/live regions, recovery actions, and accessible labels without changing API contracts.
- Modify `public/app.mjs` to render localized shell copy, manage step state, announce loading/success/error outcomes, handle retry actions, and keep focus on the active result.
- Modify `public/style.css` to create the step hierarchy, mobile flow, disabled/loading states, and 44px touch targets while preserving the existing arena theme and map geometry.
- Modify `public/translations/interface.mjs` and the five locale files to add reviewed labels for steps, statuses, retry/back actions, input hints, save/login outcomes, and empty states.
- Modify `public/auth.html`, `public/auth-page.mjs`, and `public/auth.css` to make login/account return paths explicit and keep account sections readable on mobile.
- Modify `tests/app-selection.test.mjs`, `tests/public-pages.test.mjs`, and add `tests/explorer-ux.test.mjs` for pure step/status behavior and rendered accessibility contracts.
- Add `docs/audits/seo-ux-fixes-2026-10-27/PAGE-UX-REDESIGN-RESULTS.md` with test commands, browser evidence, deployment SHA, and deferred data work.

### Task 1: Explorer semantics and state contract

- [ ] Add failing tests for the three step labels, initial venue-loading state, retry control, `aria-live` result status, and save/login action semantics.
- [ ] Add stable IDs and `data-explorer-step` attributes to the venue, ticket location, and result sections in `public/index.html`.
- [ ] Add status regions for venue load, seat resolution, event loading, and save outcomes; every async region must expose `role="status"` or `aria-live="polite"`.
- [ ] Add localized input hints and a visible example for section/row/seat without changing the field names or submitted values.
- [ ] Run the new focused tests and verify they fail before implementation.

### Task 2: Implement progressive explorer flow

- [ ] Add `renderExplorerProgress()` and `setAsyncStatus()` in `public/app.mjs` so the happy path reads as Venue → Ticket location → Your view.
- [ ] Set venue step to loading/ready/error, keep the venue select disabled only while loading, and provide a retry action on failure.
- [ ] Make `Find my seat` depend on a loaded venue and valid required fields; show an in-button progress label during resolve and move focus to the result status after completion.
- [ ] Distinguish matched, estimated, unknown-section, unavailable-layout, empty-event, and request-failed outcomes with a next action for each.
- [ ] Keep locked venue behavior on the existing plan dialog and retain the original selection when access is denied.
- [ ] Keep save behavior truthful: matched source seats can save; guests get a sign-in action; estimates stay clearly unsaveable.
- [ ] Run `tests/explorer-ux.test.mjs`, `tests/app-selection.test.mjs`, and the focused public-page tests.

### Task 3: Localized navigation and account handoff

- [ ] Replace remaining explorer shell hard-coded copy with reviewed translation keys, including labels, map mode buttons, source notes, event metadata, loading states, and errors.
- [ ] Ensure the globe menu supports keyboard focus, Escape close, `aria-expanded`, and preserves all explorer context when switching locale.
- [ ] Add explicit “Back to explorer” and “Account” actions to the login/account surface, preserving `next` safely and retaining locale.
- [ ] Make empty saved-seat, subscription, and auth-error states explain what action is available next.
- [ ] Add locale assertions for the new keys and ensure no registration link is reintroduced.

### Task 4: Visual hierarchy and mobile interaction pass

- [ ] Style the three steps as a clear responsive flow, with the active step visually distinct and the result card separated from the map.
- [ ] Give all interactive controls at least 44px touch targets at 390px; keep the language globe, account action, map controls, event cards, and save action reachable.
- [ ] Prevent loading overlays and wrapped toolbars from obscuring labels, error messages, or the current section; keep reduced-motion behavior intact.
- [ ] Preserve the current dark arena palette and the existing source/geometry disclaimers.
- [ ] Capture desktop 1280px and mobile 390px screenshots for the home, explorer, login, account, and venue directory flows.

### Task 5: End-to-end verification and release

- [ ] Run `npm run build`, `npm test`, focused explorer/public tests, and `git diff --check`.
- [ ] Use Ego to exercise: homepage → free Kai Tak → section/sample → successful resolve → 2D/3D switch; locked venue → plan flow; failed venue load → retry; empty/failed event state; guest save → login; locale switch on mobile.
- [ ] Verify no horizontal overflow at 390px and no hidden or duplicate navigation actions across all five locales.
- [ ] Record screenshots, commands, final code SHA, deployment status, and deferred seat/3D data work in the release result document.
- [ ] Commit only scoped files, push `main`, trigger Coolify with the full SHA, and repeat the critical online flows after deployment.
