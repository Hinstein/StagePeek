# Venue Directory and Event Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a country/region classified venue directory for all catalog venues and replace the explorer's long event list with a date-grouped responsive picker.

**Architecture:** Reuse the existing venue repository catalog and localized public-page renderer. Add a small shared region/country presentation helper, server-render the complete directory with data attributes for client filtering, and add a focused explorer event-picker renderer that groups available events by local calendar date without changing event APIs or venue data.

**Tech Stack:** Node.js ESM, existing HTTP renderer, vanilla browser modules, existing CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-28-stagepeek-page-ux-audit-design.md` plus the user's venue directory reference and dated event-picker request.

## Global Constraints

- Preserve the five locales and default English behavior.
- Do not change seat geometry, source assets, event data, or billing rules.
- Public venue cards must state access/model status truthfully; no invented capacity or verification claims.
- Query-string explorer pages remain non-indexable.
- Keep the shared workspace untouched; commit only scoped files from this isolated release checkout.

## Review Focus

- A venue with no explicit country field must still appear under a deterministic country/region derived from its city prefix.
- A locked venue must remain visible in the directory and picker but must open the existing plan/login flow instead of bypassing access checks.
- A catalog with 197 venues must not produce malformed HTML or a horizontal overflow on 390px.
- Events crossing midnight/time zones must group by the supplied event date string consistently and keep the original event id.
- An empty or failed event response must keep the picker compact and show the existing empty/error state.

### Task 1: Shared venue classification and directory data

**Files:**
- Modify: `public/catalog.mjs`
- Modify: `server/public-pages.mjs`
- Modify: `public/translations/en.mjs`
- Modify: `public/translations/ja.mjs`
- Modify: `public/translations/ko.mjs`
- Modify: `public/translations/zh-CN.mjs`
- Modify: `public/translations/zh-TW.mjs`
- Test: `tests/catalog.test.mjs`

**Interfaces:**
- `classifyVenueRegion(country)` returns a stable region key.
- `groupVenuesByCountry(venues, locale)` remains deterministic and sorts by localized display label.
- `createPublicSite(venues).render('/venues/', context)` renders all catalog entries grouped by country with region filter metadata.

- [ ] Add tests for country fallback, region keys, deterministic group order, and 197-entry preservation.
- [ ] Implement region mapping for Asia, Europe, North America, Oceania, and Other; keep Hong Kong, Macau, Taiwan as distinct product regions while grouping them under Asia.
- [ ] Extend the public directory renderer to receive the complete catalog, show total count, region filter buttons, search input, country headings, and venue cards with source/section count and access/model status.
- [ ] Add localized labels for directory controls and status text in all five locale files.
- [ ] Run `node --test tests/catalog.test.mjs`.

### Task 2: Directory styling and client filtering

**Files:**
- Create: `public/venue-directory.mjs`
- Modify: `public/public-pages.css`
- Modify: `server/public-pages.mjs`
- Test: `tests/public-pages.test.mjs`

**Interfaces:**
- `public/venue-directory.mjs` reads `[data-venue-directory]`, `[data-region]`, and `[data-venue-search]` attributes and only toggles visibility.

- [ ] Add public-page assertions for all catalog cards, region metadata, localized links, and the module script.
- [ ] Implement search and region filtering with accessible result count updates; keep all venues rendered for non-JavaScript users.
- [ ] Style country sections and cards to match the StagePeek dark visual language, with responsive 3-column/2-column/1-column grids and no horizontal overflow at 390px.
- [ ] Add a compact status badge for Free, Pro, source seats available, or catalog-only based on existing fields.
- [ ] Run focused public-page tests and `git diff --check`.

### Task 3: Date-grouped event picker

**Files:**
- Modify: `public/app.mjs`
- Modify: `public/index.html`
- Modify: `public/style.css`
- Modify: `public/translations/en.mjs`
- Modify: `public/translations/ja.mjs`
- Modify: `public/translations/ko.mjs`
- Modify: `public/translations/zh-CN.mjs`
- Modify: `public/translations/zh-TW.mjs`
- Test: `tests/app-selection.test.mjs`

**Interfaces:**
- Add a pure `groupEventsByDate(events)` export/helper used by the event rendering path.
- Preserve existing event selection callbacks and event ids.

- [ ] Add tests for date grouping, stable ordering, duplicate dates, and no-event input.
- [ ] Replace the current long event list markup with date sections containing responsive event cards: date label, event name, stage/layout label, status, and select action.
- [ ] Cap each date group to a compact visible grid with an explicit “show more” control when needed; keep the existing event count and empty/error messages.
- [ ] Ensure selecting an event still updates layout, source notes, URL state, and the existing renderer.
- [ ] Add localized labels for date groups, show-more, selected state, and event metadata.
- [ ] Run focused app-selection tests.

### Task 4: Verification and release evidence

**Files:**
- Create: `docs/audits/seo-ux-fixes-2026-10-27/VENUE-DIRECTORY-EVENT-PICKER-RESULTS.md`

- [ ] Run `npm run build`, focused tests, full `npm test`, and `git diff --check`.
- [ ] Use Ego at desktop and 390px to verify `/venues/`, country/region filtering, a locked venue, and event cards on `/explore`.
- [ ] Save screenshots and record the release SHA, tested catalog count, and any deferred data-quality work.
- [ ] Commit only the implementation and evidence files, push `main`, and verify the finished deployment.
