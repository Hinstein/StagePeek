# StagePeek admin users · 2026-11-04

## Delivered

- `/admin`, `/admin/` and existing `/admin.html`: Tabler 1.7.3 dashboard, served entirely from local assets.
- Total StagePeek members, today (Asia/Shanghai midnight), rolling 7 days (168 hours).
- Read-only email, ID, project role and joined timestamp; literal case-insensitive email/ID search, 25/50/100 rows per page.
- Existing free venue settings retained in the second tab.
- Account/auth pages expose an admin link only when the server authorizes the current user. Login return supports only exact admin paths, normalized to `/admin`.
- Shared Supabase authorization remains project `admin`/`owner`; local fixtures use `ADMIN_EMAILS`. Shared-platform email lists cannot confer admin access.

Counts represent confirmed identities that have joined StagePeek (`site_stagepeek.users` plus the site's membership), excluding deleted identities. They do not count shared-platform-only accounts or pending email confirmations. Join time is the StagePeek membership creation time, not shared Auth's original signup time. The dashboard does not collect or infer last-login/online status.

## Template provenance

Tabler was selected over AdminLTE because its HTML dashboard shell, cards and table fit this small directory without a new framework or runtime plugins. React-oriented templates would require an additional frontend stack. Source: https://github.com/tabler/tabler; sample: https://docs.tabler.io/ui/layout/page-layouts. Version 1.7.3's CSS is copied unchanged under `public/vendor/tabler/`, with archive integrity and MIT license recorded there. No production CDN dependency or new npm dependency.

## Release requirement

Production has **not** been migrated or deployed by this task. Before deploying the code, the platform migration administrator must apply `db/migrations/004-admin-users.sql` to the existing `site_stagepeek` database after migrations 1–3. It creates only a read-only `admin_user_directory()` function and migration record. The function rechecks `shared_admin()` in the database, returns only site-scoped directory columns, and grants execution only to `app_site_stagepeek`; direct user table access and RLS policies stay unchanged. No Supabase service-role key is needed.

Use an existing StagePeek admin/owner account after deployment. No production role grants are changed. If the migration is omitted, the users endpoint reports an error rather than falling back to unrestricted reads; other application routes remain available.

## Verification

- `node --test tests/admin-users.test.mjs tests/auth-flows.test.mjs tests/access.test.mjs tests/analytics.test.mjs`: **24 passed**.
- `npm run check` and `node --check server/admin-users.mjs`: **passed**.
- Fresh isolated PostgreSQL 16 database: existing migrations 1–3 plus migration 4 applied successfully. `tests/admin-users-rls.sql` passed and rolled back fixtures: anonymous/member denied, site scope enforced, revoked admin immediately denied, browser roles denied execute, direct users-table access still denied. Actual Node PostgreSQL adapter/query also passed search/count/result mapping and member denial.
- Ego browser: anonymous login state, seeded local admin directory, search, empty state, 32 test users split into 25 + 7 rows, next-page bounds, free venue settings (10 selected), server-rendered account link, and logout clearing all rows. Phone viewport 390px had no document overflow. Independent read-only review found and prompted the login-return correction.
- Final `npm test`: **500 tests, 482 passed, 17 failed, 1 skipped**. A temporary cloned copy of the pre-task server/frontend ran **495 tests, 477 passed, the identical 17 failed, 1 skipped**. The 5 newly added tests pass; there are no new failure names. The skipped test is the existing optional PostgreSQL integration test; the new SQL boundary was separately exercised against real PostgreSQL as above.

Existing failing tests (unchanged from the pre-task baseline):

- draft intersections appear only on their source level and clear without changing seats
- explorer exposes a three-step flow with actionable async status regions
- explorer keeps seat actions disabled until a complete ticket location is ready
- saving gives visitors a reason to sign in and gives members a confirmation
- StagePeek canonical metadata, crawler routes and utility noindex stay consistent
- mail fallback uses English for locales the existing shared hook does not support
- concurrent 3D requests share a load and honor a switch back to 2D while loading
- selected homepage is the public entry and existing ticket links still open the tool
- directory and three reviewed venue pages deliver useful initial HTML with resolvable CTAs
- sitemap, redirects and role-based indexing agree, including staging and sensitive parameters
- service pages, home schema and public navigation remain usable without scripts
- home, explorer, content and auth routes share one localized navigation and footer
- localized public routes expose translated metadata and reciprocal language links
- every localized public page has a real title and each guide preserves source provenance
- repeated unconfirmed registration resends the signup code
- country-first picker limits venue options to the selected country and puts free venues first
- changing country clears the old choice and deep-link selection restores the correct country

## Main integration verification

The user authorized merging into `main` on 2026-11-04. Only the 15 admin feature files were copied into a clean integration checkout; the existing venue/research changes in the original workspace were excluded. The integration incorporates remote main at `2e7cf06` and preserves its localization and billing changes.

The clean pre-feature main baseline ran **197 tests: 188 passed, 8 failed, 1 skipped**. The merged result ran **202 tests: 193 passed, the identical 8 failed, 1 skipped**; the 5 admin tests add no new failures. Focused admin/auth/access/analytics tests passed **24/24**, and the documented syntax checks passed. These clean-main counts differ from the larger development workspace above because its unrelated, uncommitted tests and features were not merged.

Clean-main existing failures: five billing tests (`checkout uses server monthly price and stored customer`, `pending checkout is reused`, `live provider subscription blocks a new checkout`, `replayed and delayed webhooks`, `wrong price or unknown customer`), canonical metadata/crawler consistency, mail fallback locale, and repeated unconfirmed registration resend. This merge does not alter those behaviors or weaken their tests. Production migration/deployment remain separate from the Git merge.
