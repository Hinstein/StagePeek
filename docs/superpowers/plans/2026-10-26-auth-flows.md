# StagePeek Auth Flows Implementation Plan

> Execute inline using superpowers:executing-plans; preserve the dirty primary workspace. User approved the design with registration corrected to email+password → OTP → original page.

Goal: complete shared Supabase registration, password/OTP login, OTP recovery and Google PKCE, with original-seat return and project consent.
Architecture: existing Node BFF owns encrypted HttpOnly cookies. Supabase owns passwords/identities. Short-lived one-use flow records store no password, OTP, or bearer token; recovery credentials remain server-side. Shared PG migrations are additive.
Tech stack: Node24, pg, native fetch, vanilla HTML/CSS/JS.
Spec: docs/superpowers/specs/2026-10-26-auth-user-flows-design.md (primary workspace).

## Constraints and review focus
- No private credentials in source/logs/frontend; no real emails without authorized recipient.
- Registration never overwrites an existing password. OTP login does not create new identities.
- Recovery cannot authorize business requests; consumed flows cannot replay or race.
- Google uses shared Auth PKCE and browser binding, never legacy production Google.
- Safe same-origin return context preserves seat/event; consent blocks business writes.

## Tasks
1. [x] Add failing Auth flow tests for signup payload/order, isolated recovery, repeat/parallel use, PKCE, returnTo, consent. Implement provider and additive PG/SQLite test support. Run focused tests.
2. [x] Add HTTP integration tests for browser binding, origin, routes, flow type and permission boundary. Implement shared routing, capability/config switches, consent/account APIs. Run Auth and HTTP tests.
3. [x] Build shared auth pages and public legal drafts, account controls, links from venue UI, return state, accessible mobile states. Add browser-flow checks and run syntax/build/full suite.
4. [ ] Review security and deployed configuration; enable only confirmed capabilities, prepare branded recovery registry, record acceptance gaps. Sync scoped changes to primary workspace; no bulk-add unrelated data. Deploy in existing authorized application only after required validation and review.

## Execution ledger
- Baseline: isolated published checkout 201faeb; primary workspace main7642af1 is dirty and will not be reset.
- Existing findings F1–F6 are in the design; user authorized implementation.

- Verification: 148 pass / 0 fail / 1 default PG integration skip; actual v3 migration/RLS rehearsal separately passed and rolled back. Final read-only review: no remaining Critical/Important. Real delivery and Google remain separately unverified.
