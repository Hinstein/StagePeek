# Public SEO implementation plan

**Goal:** Implement the user-approved ACTION-PLAN and ten findings from the 2026-10-26 audit using the existing Node server.
**Spec:** docs/audits/stagepeek.live-audit/2026-10-26/ACTION-PLAN.md and FULL-AUDIT-REPORT.md.
**Architecture:** One public page registry drives initial HTML, canonical/indexability, breadcrumbs and sitemap. Editorial pages contain original schematic illustrations rather than republishing third-party graphics or seat assets. Existing tool and authorization remain in place.
**Tech:** Node ESM, semantic HTML, CSS, existing Umami and node:test.

## Constraints and decisions
- Preserve unrelated uncommitted work. Do not deploy the mixed working tree or change subscriptions/data publication policies.
- Publish only Kai Tak, Hong Kong Coliseum and Taipei Arena with complete source/version/coverage/limitation disclosures. Fail closed when required source metadata is unavailable.
- Canonical production origin only; utility/private/unknown/parameter pages stay noindex. Public images use an explicit allowlist. No 197 thin pages.
- Privacy/terms describe existing behavior, no invented company/contact/retention promises. GitHub is the verified project contact. Prices read the existing billing service.
- Track anonymous allowlisted pages and aggregate actions only when already configured; never send query strings, ticket labels, account identity or referrer. Auth/subscription attribution requiring private tracking is deliberately excluded.
- Localization and further venue/event expansion depend on actual evidence; no fabricated translations, metrics or current-event claims.

## Tasks
- [x] Add HTTP and registry regressions for useful HTML, exact venue/layout/sample deep links, noindex boundaries, sitemap agreement, schema and static media; watch them fail.
- [x] Implement public registry/content renderer, original previews, service pages, shared navigation, route policy and sitemap. Verify HTTP tests.
- [x] Make 2D usable before loading 3D and prefer an available coordinate-backed default; preserve explicit deep links and 3D fallback. Test route behavior.
- [x] Extend configured optional anonymous analytics to public pages and bounded actions; verify sensitive URL/account exclusions and fixed payloads.
- [x] Run full tests/build, HTTP crawl, browser desktop/mobile checks and repeatable lab performance when available. Record evidence and remaining external checks.

## Review focus
- Unknown/trailing-slash/encoded paths never become soft 404s or sitemap entries.
- Incomplete venue metadata fails closed; a locked venue CTA never silently changes to another venue.
- Source versions and record counts never become capacity/calibration/rights claims.
- Static content requires no JS, 2D requires no WebGL, and loading 3D later preserves active selection.
- Public tracking cannot include ticket parameters, tokens, referrer, hashes or authenticated user state.

## Completion evidence

2026-10-26: build passed; full suite 181 tests / 180 passed / 0 failed / 1 PostgreSQL integration skipped. Browser desktop and 390px checks recorded in IMPLEMENTATION-REPORT.md. Independent review source-failure isolation fixed with RED→GREEN regression; automatic demo no longer emits seat_located. No production deployment or private analytics activation.
