Approval: user explicitly said 同意 方案切换到统一 Supabase Auth.
Scope: StagePeek shared Supabase Auth, membership/RLS, existing app in-place, brand email, tests and rollback.
Latest Skill baseline: email OTP, no authentication links. No exception approval inferred.
S1 auth.mjs:17 custom identity and sessions; replace production path.
S1 app.mjs:46 email admin allow-list; replace production with trusted platform.site_members role.
S2 shared brand hook/sender not ready; implement and verify; never borrow OpenP7M sender.
S2 callback/reset missing; implement noindex pages. No password reset enabled until implemented.
Production snapshot: users/sessions/subscriptions/saved_positions all zero. Recheck at activation.
