-- Additive. No identity or business data is rewritten. Run as migration admin.
BEGIN;
SET LOCAL search_path=site_stagepeek,pg_catalog;
CREATE TABLE auth_flows(id text PRIMARY KEY,kind text NOT NULL,payload text NOT NULL,expires_at bigint NOT NULL);
CREATE INDEX auth_flows_expiry ON auth_flows(expires_at);
CREATE TABLE auth_consents(user_id text PRIMARY KEY REFERENCES users(id),version text NOT NULL,accepted_at bigint NOT NULL);
ALTER TABLE auth_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_flows FORCE ROW LEVEL SECURITY;
ALTER TABLE auth_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_consents FORCE ROW LEVEL SECURITY;
REVOKE ALL ON auth_flows,auth_consents FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,DELETE ON auth_flows TO app_site_stagepeek;
GRANT SELECT,INSERT,UPDATE ON auth_consents TO app_site_stagepeek;
-- Flows are usable only by the server role with a high-entropy browser handle.
CREATE POLICY server_flows ON auth_flows TO app_site_stagepeek USING(true) WITH CHECK(true);
CREATE POLICY owner_consent ON auth_consents TO app_site_stagepeek
 USING(site_stagepeek.owns_shared_data(user_id)) WITH CHECK(site_stagepeek.owns_shared_data(user_id));
INSERT INTO schema_migrations(version) VALUES(3);
COMMIT;
