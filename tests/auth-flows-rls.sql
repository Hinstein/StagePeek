-- Run inside migration 003 transaction; rollback all fixtures and DDL.
INSERT INTO auth.users(id,email,email_confirmed_at) VALUES
 ('dcbf2a6a-82b7-46d8-a730-e4a1643e04a1','stagepeek-flow-a@example.invalid',now()),
 ('dcbf2a6a-82b7-46d8-a730-e4a1643e04a2','stagepeek-flow-b@example.invalid',now());
SET LOCAL ROLE app_site_stagepeek;
SELECT count(*)=1 FROM site_stagepeek.join_shared_member('dcbf2a6a-82b7-46d8-a730-e4a1643e04a1');
SELECT count(*)=1 FROM site_stagepeek.join_shared_member('dcbf2a6a-82b7-46d8-a730-e4a1643e04a2');
SELECT set_config('stagepeek.request','true',true),set_config('request.jwt.claim.sub','dcbf2a6a-82b7-46d8-a730-e4a1643e04a1',true);
INSERT INTO site_stagepeek.auth_consents VALUES('dcbf2a6a-82b7-46d8-a730-e4a1643e04a1','test',0);
INSERT INTO site_stagepeek.auth_flows VALUES('rehearsal','recovery','encrypted-fixture',1);
DO $$ BEGIN
 BEGIN
  INSERT INTO site_stagepeek.auth_consents VALUES('dcbf2a6a-82b7-46d8-a730-e4a1643e04a2','forged',0);
  RAISE EXCEPTION 'Cross-user consent accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT set_config('request.jwt.claim.sub','dcbf2a6a-82b7-46d8-a730-e4a1643e04a2',true);
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM site_stagepeek.auth_consents) THEN RAISE EXCEPTION 'Cross-user consent visible'; END IF;
END $$;
RESET ROLE;
DO $$ BEGIN
 IF has_table_privilege('anon','site_stagepeek.auth_flows','SELECT') OR has_table_privilege('authenticated','site_stagepeek.auth_flows','SELECT') THEN RAISE EXCEPTION 'Flow credential payload exposed'; END IF;
END $$;
SELECT 'Auth flow server-only storage and per-user consent RLS passed';
