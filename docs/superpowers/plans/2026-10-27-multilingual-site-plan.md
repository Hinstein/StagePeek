# StagePeek Multilingual Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the entire ordinary user-facing StagePeek site English-first with reviewed English, Simplified Chinese, Traditional Chinese, Japanese, and Korean localized routes and a globe language switcher.

**Architecture:** Add a shared locale registry and translation resource layer at the server/client boundary. The server resolves a locale-prefixed public route, renders localized public HTML and SEO metadata, and serves the same static app modules; browser modules read the locale from a small serialized runtime config and use the same translation keys for dynamic text. `/` and locale-less tool/auth links are English canonical entry points; localized equivalents use `/zh-CN/`, `/zh-TW/`, `/ja/`, and `/ko/`.

**Tech Stack:** Node.js ESM, existing `node:http` server, vanilla HTML/CSS/JavaScript modules, existing Node test runner, generated XML sitemap.

**Spec:** `docs/superpowers/specs/2026-10-27-multilingual-site-design.md`

## Global Constraints

- Supported locales are `en`, `zh-CN`, `zh-TW`, `ja`, and `ko`; `/` is English.
- Ordinary user-facing pages are localized; admin, research, and internal review pages remain internal tools.
- Use reviewed product copy by locale, not literal string replacement or browser auto-translation.
- Preserve data-status meaning, seat labels, source versions, legal meaning, privacy behavior, auth safety, and existing 2D/3D logic.
- Localized indexable pages require self-canonical, reciprocal `hreflang`, and the correct document language.
- Keep explorer parameters and safe authentication return paths when switching language.
- Do not add a dependency or change the data model unless an existing boundary requires it.

## Review Focus

- Locale-less `/` must render English while an explicitly localized route renders only that locale, with no redirect loop; test the server route matrix in Task 2.
- A language switch on a deep explorer URL must preserve allowed query parameters and drop unsafe/private parameters; test the URL builder in Task 1.
- A missing translation key must be detected during checks and must not silently create a falsely complete localized page; test resource validation in Task 1.
- Japanese/Korean/Traditional Chinese strings must fit controls and preserve accessibility labels; test representative rendered pages and 390px browser layouts in Tasks 4 and 6.
- Localized canonical/hreflang/sitemap entries must match real 200 routes and exclude private, internal, and parameterized pages; test metadata and sitemap generation in Task 2.

### Task 1: Locale registry, translation resources, and safe URL helpers

**Files:**
- Create: `server/locales.mjs`
- Create: `public/locales.mjs`
- Create: `public/translations/en.mjs`
- Create: `public/translations/zh-CN.mjs`
- Create: `public/translations/zh-TW.mjs`
- Create: `public/translations/ja.mjs`
- Create: `public/translations/ko.mjs`
- Modify: `tests/public-pages.test.mjs` or create `tests/locales.test.mjs`

**Interfaces:**
- Produces `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`, `normalizeLocale(value)`, `parseLocalizedPath(path)`, `localizedPath(locale,path)`, `localizedQuery(locale,url)`, `translationKeys(locale)`, and `assertCompleteTranslations()`.
- `parseLocalizedPath()` returns `{locale,path}` with `en` represented by the locale-less canonical path.
- `localizedQuery()` keeps the explorer allowlist and the existing safe `next` value rules; it never copies token, session, or arbitrary query values.
- Browser resources expose `getLocale()`, `setLocaleUrl(locale)`, `t(key, values)`, and `setDocumentLocale(locale)` without duplicating server routing logic.

- [ ] **Step 1: Write failing tests** for all five locale codes, default English parsing, prefixed route round-trips, explorer parameter allowlisting, and missing-key detection.
- [ ] **Step 2: Run `node --test tests/locales.test.mjs`** and confirm the new tests fail because the registry and resources do not exist.
- [ ] **Step 3: Implement the shared locale registry and safe URL helpers** in `server/locales.mjs`, then implement browser resource loading and locale state in `public/locales.mjs`.
- [ ] **Step 4: Add reviewed translation dictionaries** for shared navigation/actions, language labels, home, explorer, auth/account, public guides, plans, contact, privacy, and terms. Use locale-native product copy and explicit interpolators for counts, dates, source versions, and seat labels.
- [ ] **Step 5: Run the locale tests** and verify all keys exist for every locale.
- [ ] **Step 6: Commit** `feat: add reviewed locale resources and safe locale routes`.

### Task 2: Server localized routing, public rendering, metadata, and sitemap

**Files:**
- Modify: `server/app.mjs`
- Modify: `server/public-pages.mjs`
- Modify: `scripts/build-public-sitemap.mjs`
- Modify: `public/sitemap.xml` (generated)
- Modify: `tests/public-pages.test.mjs`

**Interfaces:**
- `createPublicSite(venues).registry(locale)` returns the indexable route records for that locale.
- `createPublicSite(venues).render(path, {locale, ...context})` renders the localized page and its locale-aware links.
- `publicSite.parse(path)` returns the normalized `{locale,path}` used by the request handler.
- `publicSite.sitemap()` emits all canonical localized indexable URLs, excluding parameterized, private, and internal routes.

- [ ] **Step 1: Extend public-page tests** for English root, all four prefixed locale roots, representative localized directory/venue/legal routes, localized `lang`, self-canonical, all reciprocal hreflang links, x-default, and noindex behavior for privacy/terms/auth/tool state.
- [ ] **Step 2: Run the focused public-page tests** and confirm failures identify the missing localized route and metadata behavior.
- [ ] **Step 3: Add locale parsing before the existing public/static file resolution** in `server/app.mjs`; keep legacy API paths and internal static tools outside localized routing.
- [ ] **Step 4: Refactor `server/public-pages.mjs` to render from locale-aware page records and translation keys**, including localized navigation, breadcrumbs, home guide cards, structured data language, Open Graph locale, canonical URLs, and reciprocal hreflang.
- [ ] **Step 5: Update sitemap generation** to emit English root plus the four prefixed equivalents for indexable public pages only; regenerate `public/sitemap.xml` from the same registry.
- [ ] **Step 6: Run focused tests and inspect response HTML** for every locale's home, directory, one venue guide, methodology, plans, and contact pages.
- [ ] **Step 7: Commit** `feat: render localized public routes and metadata`.

### Task 3: Shared globe language control and localized public navigation

**Files:**
- Modify: `public/home.html`
- Modify: `public/home.mjs`
- Modify: `public/home.css`
- Modify: `public/index.html`
- Modify: `public/style.css`
- Modify: `public/auth.html`
- Modify: `public/auth.css`
- Modify: `public/public-pages.css`
- Modify: `public/locales.mjs`
- Create or modify: `public/language-switcher.mjs`
- Modify: `server/public-pages.mjs` for static shell config
- Modify: relevant browser tests

**Interfaces:**
- `mountLanguageSwitcher(root, {locale, path, query})` renders the globe button/menu and navigates to `localizedQuery()` results.
- The control uses an accessible button label, current-locale state, keyboard focus behavior, and the five language names in their own scripts.

- [ ] **Step 1: Add browser tests or DOM-level checks** for the globe control, current locale marking, and deep-link query preservation.
- [ ] **Step 2: Implement the shared control** and include it in the homepage, explorer, auth/account shell, and server-rendered public-page header/footer.
- [ ] **Step 3: Replace hardcoded public navigation labels and document language setup** with translation lookups while keeping the existing visual system and responsive breakpoints.
- [ ] **Step 4: Verify desktop and 390px layouts**, including long Japanese/Korean labels, menu focus, and no horizontal overflow.
- [ ] **Step 5: Commit** `feat: add globe language switcher to public shells`.

### Task 4: Localize the explorer and dynamic venue UI

**Files:**
- Modify: `public/app.mjs`
- Modify: `public/index.html`
- Modify: `public/geometry.mjs` only if a user-visible label is currently embedded there
- Modify: `public/venue-draft-panel.mjs`, `public/source-maps-panel.mjs`, and related dynamic modules where visible strings are emitted
- Modify: `tests/app-selection.test.mjs`
- Create or modify: `tests/localized-tool.test.mjs`

**Interfaces:**
- `public/app.mjs` initializes locale from the server-injected route config, passes it to all visible formatters, and uses `t(key, values)` for status/toast/event/layout/seat text.
- API payloads remain locale-neutral; only presentation strings and locale-aware date/number formatting change.

- [ ] **Step 1: Add failing tests** for English default labels, each localized tool shell, locale-aware venue/seat status text, and preserved deep-link selection.
- [ ] **Step 2: Implement shell translation** for forms, controls, cards, dialogs, FAQ, source status, and accessibility labels.
- [ ] **Step 3: Replace dynamic hardcoded strings** in selection, resolve, event, save, billing, and error paths with translation keys and `Intl` formatters.
- [ ] **Step 4: Keep venue names, section IDs, row tokens, and source labels as data**, not translated identifiers; translate only explanatory UI around them.
- [ ] **Step 5: Run tool tests** and exercise a free Kai Tak deep link in all five locales.
- [ ] **Step 6: Commit** `feat: localize explorer and seat status messaging`.

### Task 5: Localize authentication, account, and legal flows

**Files:**
- Modify: `public/auth-page.mjs`
- Modify: `public/auth.html`
- Modify: `public/account-summary.mjs`
- Modify: `server/shared-auth-routes.mjs` only for user-facing redirect/query locale propagation
- Modify: `tests/auth.test.mjs` and/or create `tests/auth-locales.test.mjs`

**Interfaces:**
- Auth routes accept the locale-prefixed path and carry `lang` through safe return routes without trusting arbitrary redirect values.
- `accountSummary(me, locale)` returns localized plan/status/limit text while preserving numeric values.

- [ ] **Step 1: Add failing tests** for localized login/register/reset/account states, safe locale-preserving return URLs, and translated error codes.
- [ ] **Step 2: Move existing bilingual auth strings into the shared locale resources** and add reviewed Traditional Chinese, Japanese, and Korean copy.
- [ ] **Step 3: Update auth routing and redirects** so verification, Google callbacks, consent, logout, and account links return to the selected locale.
- [ ] **Step 4: Verify no secrets, tokens, or email addresses enter translated URLs or analytics payloads.**
- [ ] **Step 5: Run auth tests** and manually exercise login shell states without submitting real credentials.
- [ ] **Step 6: Commit** `feat: localize authentication and account flows`.

### Task 6: Locale review, accessibility, release verification, and deployment

**Files:**
- Modify: `docs/operations/deployment.md` or create a dated release note under `docs/operations/`
- Create: `docs/audits/multilingual-2026-10-27/LOCALIZATION-REVIEW.md`
- Modify: `tests/public-pages.test.mjs`, `tests/analytics.test.mjs`, and any focused test files as needed

**Interfaces:**
- The review document records each locale's copy reviewer/status, route coverage, known limitations, and the exact release commit.

- [ ] **Step 1: Run `npm run build`, focused tests, `git diff --check`, and relevant syntax checks.**
- [ ] **Step 2: Start the local server and inspect rendered HTML for all five locales and representative public routes.**
- [ ] **Step 3: Use Ego browser to verify the globe menu, switching on desktop and 390px mobile, explorer query preservation, and localized 3D/tool UI.**
- [ ] **Step 4: Review copy by locale** for naturalness, terminology, punctuation, date/number formatting, button fit, and data-status/legal meaning; record any explicitly deferred strings.
- [ ] **Step 5: Verify localized sitemap, canonical/hreflang, robots/noindex, analytics path allowlists, and no accidental indexing of query/state URLs.**
- [ ] **Step 6: Publish the scoped release through the existing deployment workflow, confirm the deployed commit and live route checks, then add the release evidence to the review document.**
- [ ] **Step 7: Commit** `docs: record multilingual localization review and release evidence`.

