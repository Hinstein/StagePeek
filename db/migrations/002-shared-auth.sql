-- Run as platform migration administrator after backup. Never use provision_site:
-- StagePeek already owns its business schema. Fixed site registration is additive.
BEGIN;
SET LOCAL ROLE postgres;
SET LOCAL search_path=site_stagepeek,pg_catalog;
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM users) OR EXISTS(SELECT 1 FROM sessions)
    OR EXISTS(SELECT 1 FROM subscriptions) OR EXISTS(SELECT 1 FROM saved_positions) THEN
    RAISE EXCEPTION 'Nonempty legacy identity data: stop and prepare an explicit ID mapping';
  END IF;
END $$;
INSERT INTO platform.sites(site_id,slug,display_name,schema_name,storage_bucket,status,coolify_resource_id,domain)
VALUES('472e7705-2a72-423d-8aad-cf59497ab4e9','seatpeep','StagePeek','site_stagepeek','site-stagepeek','active','capinwnna0ijx4rafkwju3ms','stagepeek.live');
INSERT INTO platform.site_capabilities(site_id) VALUES('472e7705-2a72-423d-8aad-cf59497ab4e9');

ALTER TABLE users ADD COLUMN auth_user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id);
ALTER TABLE users ADD COLUMN site_id uuid NOT NULL DEFAULT '472e7705-2a72-423d-8aad-cf59497ab4e9'
  REFERENCES platform.sites(site_id);
ALTER TABLE users ADD CONSTRAINT shared_identity_id CHECK(id=auth_user_id::text);
ALTER TABLE users ADD CONSTRAINT fixed_project CHECK(site_id='472e7705-2a72-423d-8aad-cf59497ab4e9');

CREATE FUNCTION read_shared_member(target uuid)
RETURNS TABLE(id text,auth_user_id uuid,site_id uuid,created_at bigint,member_role text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT u.id,u.auth_user_id,u.site_id,u.created_at,m.role
 FROM site_stagepeek.users u
 JOIN platform.site_members m ON m.site_id=u.site_id AND m.user_id=u.auth_user_id
 JOIN platform.sites s ON s.site_id=m.site_id
 JOIN auth.users a ON a.id=u.auth_user_id
 WHERE u.auth_user_id=target AND s.status='active' AND a.email_confirmed_at IS NOT NULL
   AND a.deleted_at IS NULL AND (a.banned_until IS NULL OR a.banned_until<now())
$$;
CREATE FUNCTION join_shared_member(target uuid)
RETURNS TABLE(id text,auth_user_id uuid,site_id uuid,created_at bigint,member_role text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog AS $$
DECLARE confirmed_email text;
BEGIN
 IF NOT EXISTS(SELECT 1 FROM platform.sites s WHERE s.site_id='472e7705-2a72-423d-8aad-cf59497ab4e9' AND s.status='active') THEN
   RAISE EXCEPTION 'Project unavailable'; END IF;
 SELECT lower(a.email) INTO confirmed_email FROM auth.users a WHERE a.id=target
 AND a.email_confirmed_at IS NOT NULL AND a.deleted_at IS NULL AND (a.banned_until IS NULL OR a.banned_until<now());
 IF confirmed_email IS NULL THEN RAISE EXCEPTION 'Confirmed shared identity required'; END IF;
 INSERT INTO platform.site_members(site_id,user_id,role) VALUES('472e7705-2a72-423d-8aad-cf59497ab4e9',target,'member')
 ON CONFLICT ON CONSTRAINT site_members_pkey DO NOTHING;
 INSERT INTO site_stagepeek.users(id,email,auth_user_id,created_at) VALUES(target::text,confirmed_email,target,(extract(epoch FROM now())*1000)::bigint)
 ON CONFLICT ON CONSTRAINT users_auth_user_id_key DO UPDATE SET email=excluded.email;
 RETURN QUERY SELECT * FROM site_stagepeek.read_shared_member(target);
END $$;

-- The backend supplies sub only after shared Auth /user validation. No browser
-- claims, emails, metadata or cross-project role are accepted as authority.
CREATE FUNCTION owns_shared_data(target text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT target=nullif(current_setting('request.jwt.claim.sub',true),'') AND EXISTS(
 SELECT 1 FROM site_stagepeek.read_shared_member(nullif(current_setting('request.jwt.claim.sub',true),'')::uuid))
$$;
CREATE FUNCTION shared_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
 SELECT EXISTS(SELECT 1 FROM site_stagepeek.read_shared_member(nullif(current_setting('request.jwt.claim.sub',true),'')::uuid) m WHERE m.member_role IN ('admin','owner'))
$$;
REVOKE ALL ON FUNCTION read_shared_member(uuid),join_shared_member(uuid),owns_shared_data(text),shared_admin() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION read_shared_member(uuid),join_shared_member(uuid),owns_shared_data(text),shared_admin() TO app_site_stagepeek;
REVOKE ALL ON users,login_tokens,sessions,oauth_attempts,local_billing_tokens FROM app_site_stagepeek;

-- Remove the former blanket server policies on user-owned business tables.
DO $$ DECLARE tab text; pol record; BEGIN
 FOREACH tab IN ARRAY ARRAY['users','billing_customers','checkout_attempts','subscriptions','saved_positions','access_settings'] LOOP
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='site_stagepeek' AND tablename=tab LOOP
   EXECUTE format('DROP POLICY %I ON site_stagepeek.%I',pol.policyname,tab);
  END LOOP;
 END LOOP;
 FOREACH tab IN ARRAY ARRAY['billing_customers','checkout_attempts','subscriptions','saved_positions'] LOOP
  EXECUTE format('CREATE POLICY scoped_owner ON site_stagepeek.%I TO app_site_stagepeek USING (site_stagepeek.owns_shared_data(user_id)) WITH CHECK (site_stagepeek.owns_shared_data(user_id))',tab);
 END LOOP;
END $$;
CREATE POLICY billing_webhook_customers ON billing_customers TO app_site_stagepeek
 USING (current_setting('stagepeek.request',true) IS DISTINCT FROM 'true')
 WITH CHECK (current_setting('stagepeek.request',true) IS DISTINCT FROM 'true');
CREATE POLICY billing_webhook_subscriptions ON subscriptions TO app_site_stagepeek
 USING (current_setting('stagepeek.request',true) IS DISTINCT FROM 'true')
 WITH CHECK (current_setting('stagepeek.request',true) IS DISTINCT FROM 'true');
CREATE POLICY public_access_settings ON access_settings FOR SELECT TO app_site_stagepeek USING(true);
CREATE POLICY admin_access_settings ON access_settings FOR ALL TO app_site_stagepeek
 USING(site_stagepeek.shared_admin()) WITH CHECK(site_stagepeek.shared_admin());
INSERT INTO schema_migrations(version) VALUES(2);
COMMIT;
