-- Rehearsal only, inside the migration transaction which is rolled back.
RESET ROLE;
INSERT INTO auth.users(id,email,email_confirmed_at) VALUES
 ('fced42be-6c11-4fe8-b802-69b6ab3ebf41','stagepeek-rls-a@example.invalid',now()),
 ('3fe4c6e5-89d2-4c3a-aa5d-a969206c9896','stagepeek-rls-b@example.invalid',now()),
 ('3fe4c6e5-89d2-4c3a-aa5d-a969206c9897','stagepeek-unconfirmed@example.invalid',null);
SET LOCAL ROLE app_site_stagepeek;
SELECT count(*)=1 AS member_a FROM site_stagepeek.join_shared_member('fced42be-6c11-4fe8-b802-69b6ab3ebf41');
SELECT count(*)=1 AS member_b FROM site_stagepeek.join_shared_member('3fe4c6e5-89d2-4c3a-aa5d-a969206c9896');
SELECT set_config('stagepeek.request','true',true),set_config('request.jwt.claim.sub','fced42be-6c11-4fe8-b802-69b6ab3ebf41',true);
DO $$ BEGIN
 IF site_stagepeek.shared_admin() THEN RAISE EXCEPTION 'Ordinary shared member granted admin'; END IF;
 IF site_stagepeek.owns_shared_data('3fe4c6e5-89d2-4c3a-aa5d-a969206c9896') THEN RAISE EXCEPTION 'Cross-user ownership accepted'; END IF;
 IF has_table_privilege(current_user,(SELECT c.oid FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='auth' AND c.relname='users'),'SELECT') OR has_table_privilege(current_user,(SELECT c.oid FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='platform' AND c.relname='site_members'),'INSERT') THEN RAISE EXCEPTION 'Application can manage shared identity or grants'; END IF;
 BEGIN
  PERFORM site_stagepeek.join_shared_member('3fe4c6e5-89d2-4c3a-aa5d-a969206c9897');
  RAISE EXCEPTION 'Unconfirmed shared identity accepted';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM!='Confirmed shared identity required' THEN RAISE; END IF;
 END;
END $$;
INSERT INTO site_stagepeek.saved_positions(id,user_id,venue_id,section,row_token,seat_token,label,created_at)
 VALUES('rls-a','fced42be-6c11-4fe8-b802-69b6ab3ebf41','test','1','A','1','',0);
DO $$ BEGIN
 BEGIN
  INSERT INTO site_stagepeek.saved_positions(id,user_id,venue_id,section,row_token,seat_token,label,created_at)
  VALUES('rls-forge','3fe4c6e5-89d2-4c3a-aa5d-a969206c9896','test','1','A','1','',0);
  RAISE EXCEPTION 'Cross-user write accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
 BEGIN
  INSERT INTO site_stagepeek.access_settings(key,value,updated_at) VALUES('test','[]',0);
  RAISE EXCEPTION 'Non-admin settings write accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $$;
SELECT set_config('request.jwt.claim.sub','3fe4c6e5-89d2-4c3a-aa5d-a969206c9896',true);
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM site_stagepeek.saved_positions) THEN RAISE EXCEPTION 'Cross-user rows visible without WHERE'; END IF;
END $$;
RESET ROLE;
UPDATE platform.site_members SET role='admin' WHERE site_id='472e7705-2a72-423d-8aad-cf59497ab4e9' AND user_id='3fe4c6e5-89d2-4c3a-aa5d-a969206c9896';
SET LOCAL ROLE app_site_stagepeek;
DO $$ BEGIN IF NOT site_stagepeek.shared_admin() THEN RAISE EXCEPTION 'Trusted project admin unavailable'; END IF; END $$;
SELECT 'RLS rehearsal: confirmed membership, ownership, role and shared identity isolation passed';
