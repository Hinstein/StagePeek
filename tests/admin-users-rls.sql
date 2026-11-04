-- Rehearsal against a database with migrations 1–4; all fixture rows roll back.
BEGIN;
SET LOCAL ROLE postgres;
INSERT INTO auth.users(id,email,email_confirmed_at) VALUES
 ('fad00000-0000-4000-8000-000000000001','directory-admin@example.invalid',now()),
 ('fad00000-0000-4000-8000-000000000002','directory-member@example.invalid',now()),
 ('fad00000-0000-4000-8000-000000000003','other-project@example.invalid',now()),
 ('fad00000-0000-4000-8000-000000000004','unconfirmed@example.invalid',null);
SELECT * FROM site_stagepeek.join_shared_member('fad00000-0000-4000-8000-000000000001');
SELECT * FROM site_stagepeek.join_shared_member('fad00000-0000-4000-8000-000000000002');
UPDATE platform.site_members SET role='admin'
 WHERE site_id='472e7705-2a72-423d-8aad-cf59497ab4e9' AND user_id='fad00000-0000-4000-8000-000000000001';
SET LOCAL ROLE app_site_stagepeek;
SELECT set_config('request.jwt.claim.sub','',true),set_config('stagepeek.request','true',true);
DO $$ BEGIN
 BEGIN
  PERFORM site_stagepeek.admin_user_directory();
  RAISE EXCEPTION 'Anonymous directory access accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT set_config('request.jwt.claim.sub','fad00000-0000-4000-8000-000000000002',true);
DO $$ BEGIN
 BEGIN
  PERFORM site_stagepeek.admin_user_directory();
  RAISE EXCEPTION 'Member directory access accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT set_config('request.jwt.claim.sub','fad00000-0000-4000-8000-000000000001',true);
DO $$ BEGIN
 IF (SELECT count(*) FROM site_stagepeek.admin_user_directory() WHERE id LIKE 'fad00000%')<>2 THEN
  RAISE EXCEPTION 'Directory leaked a shared account without StagePeek membership or omitted a project member'; END IF;
 IF NOT EXISTS(SELECT 1 FROM site_stagepeek.admin_user_directory() WHERE email='directory-admin@example.invalid' AND role='admin') THEN
  RAISE EXCEPTION 'Directory lost the trusted project role'; END IF;
 BEGIN
  PERFORM * FROM site_stagepeek.users;
  RAISE EXCEPTION 'Application gained direct users-table access';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 IF has_function_privilege('anon','site_stagepeek.admin_user_directory()','EXECUTE')
 OR has_function_privilege('authenticated','site_stagepeek.admin_user_directory()','EXECUTE') THEN
  RAISE EXCEPTION 'Browser roles gained directory execution'; END IF;
END $$;
RESET ROLE;
UPDATE platform.site_members SET role='member'
 WHERE site_id='472e7705-2a72-423d-8aad-cf59497ab4e9' AND user_id='fad00000-0000-4000-8000-000000000001';
SET LOCAL ROLE app_site_stagepeek;
DO $$ BEGIN
 BEGIN
  PERFORM site_stagepeek.admin_user_directory();
  RAISE EXCEPTION 'Revoked admin retained directory access';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
ROLLBACK;
SELECT 'Admin directory: anonymous/member denied, project scope enforced, role revocation immediate, base-table grants unchanged' AS result;
