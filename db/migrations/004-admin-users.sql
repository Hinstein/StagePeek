-- Additive read-only directory. Run as the platform migration administrator.
BEGIN;
SET LOCAL ROLE postgres;
SET LOCAL search_path=site_stagepeek,pg_catalog;

CREATE FUNCTION admin_user_directory()
RETURNS TABLE(id text,email text,created_at bigint,role text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=pg_catalog AS $$
BEGIN
 IF NOT site_stagepeek.shared_admin() THEN
  RAISE EXCEPTION 'StagePeek administrator required' USING ERRCODE='42501';
 END IF;
 RETURN QUERY
 SELECT u.id,lower(a.email)::text,u.created_at,m.role::text
 FROM site_stagepeek.users u
 JOIN platform.site_members m ON m.site_id=u.site_id AND m.user_id=u.auth_user_id
 JOIN auth.users a ON a.id=u.auth_user_id
 WHERE u.site_id='472e7705-2a72-423d-8aad-cf59497ab4e9'
   AND a.email_confirmed_at IS NOT NULL AND a.deleted_at IS NULL;
END $$;
REVOKE ALL ON FUNCTION admin_user_directory() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION admin_user_directory() TO app_site_stagepeek;
INSERT INTO schema_migrations(version) VALUES(4);
COMMIT;
