# Admin users implementation plan

**Goal:** Give StagePeek administrators a simple read-only user dashboard using an existing open-source template.

**Design:** Adapt Tabler's Bootstrap HTML dashboard shell, cards and table, with its pinned MIT-licensed CSS served locally. Keep the existing Node HTTP/ES module stack and free venue settings. Expose `/admin` and retain `/admin.html`; show total project users, today's joins (Asia/Shanghai), rolling 7-day joins, email/ID search and pagination. List email, user ID, join time and project role. Counts describe confirmed accounts that have joined StagePeek, not shared-platform registrations or unconfirmed signup attempts. No user mutations.

**Approaches:** Tabler fits the current HTML application without a new framework; AdminLTE is also compatible but offers no advantage for this small directory. React admin templates would require a separate framework/build pipeline. Template selection is delegated by the user's request; Tabler is the implementation choice.

**Constraints:** Shared Supabase mode trusts only the existing project admin/owner role, never the local email allow-list. A narrow SECURITY DEFINER SQL function must check `shared_admin()` and return only this site's directory columns; no broad user-table grants or RLS changes. Local SQLite uses existing `ADMIN_EMAILS`. A visible account link must use the same server-side administrator predicate. Production migration/deployment is a separate operation and is not run by this task.

**Workspace:** Work in the current checkout to retain the substantial existing uncommitted application state; use targeted edits and a saved baseline diff. No commits, branch resets or unrelated edits.

- [x] Add failing behavior tests for authorization, statistics, search, pagination, empty results and validation.
- [x] Add directory query module, protected API, shared admin capability and additive SQL migration.
- [x] Vendor pinned Tabler CSS/license, adapt admin shell/users table and retain venue configuration; add account entry.
- [x] Verify focused tests, syntax checks, full suite and real PostgreSQL privilege/site-isolation assertions in an isolated local fixture; inspect the UI with Ego.

**Review focus:** Ordinary shared members must remain denied even when their email is allow-listed; unauthenticated visitors see a login state; wildcard searches are literal; pagination is bounded; failure must clear stale user data and allow retry; database migration is required before production can read the directory.

**Review/verification:** See `docs/operations/admin-users-2026-11-04.md`. Review found an unsupported login return target; added an exact `/admin` return allow-list and regression test. Existing shared header/auth rendering defects are outside this task; the admin entry is server-rendered independently.

**Integration authorization:** The user's later request to merge into `main` authorizes committing and merging this feature. Integration uses a clean checkout and only these feature changes; unrelated working files remain preserved. Clean-main verification is recorded in the operations note.
