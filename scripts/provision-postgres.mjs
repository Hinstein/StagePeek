// Reuse VPS1's existing PostgreSQL. No new database port/container/firewall rule.
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {postgresSchema} from '../server/postgres-store.mjs';

const schema=postgresSchema(process.argv[2]||'site_stagepeek');
const role='app_'+schema,host='43.135.155.97';
const destination=new URL(`../var/${schema}.env`,import.meta.url);
if(!process.argv.includes('--apply')){
  console.log(JSON.stringify({host,instance:'supabase-db',database:'postgres',schema,role,
    changes:['create isolated schema and least-privilege role','install migration v1','enable RLS for the project role','save server-only connection secret under ignored var/'],
    publicDatabasePort:false,apply:`node scripts/provision-postgres.mjs ${schema} --apply`},null,2));process.exit(0);
}
try{await access(destination);throw new Error('Credentials already exist; refusing to rotate a running database role');}
catch(error){if(error.code!=='ENOENT')throw error;}
const password=randomBytes(32).toString('hex');
const migration=await readFile(new URL('../db/migrations/001-postgres.sql',import.meta.url),'utf8');
const tables=['users','login_tokens','sessions','oauth_attempts','billing_customers','checkout_attempts','local_billing_tokens','subscriptions','webhook_events','saved_positions','rate_limits','access_settings'];
const sql=`BEGIN;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM pg_namespace WHERE nspname='${schema}') OR EXISTS(SELECT 1 FROM pg_roles WHERE rolname='${role}')
 THEN RAISE EXCEPTION 'StagePeek schema or role already exists; review before applying'; END IF;
END $$;
CREATE ROLE ${role} LOGIN PASSWORD '${password}' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
CREATE SCHEMA ${schema};
REVOKE ALL ON SCHEMA ${schema} FROM PUBLIC;
GRANT USAGE ON SCHEMA ${schema} TO ${role};
SET LOCAL search_path=${schema},pg_catalog;
${migration}
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA ${schema} TO ${role};
REVOKE ALL ON ${schema}.schema_migrations FROM ${role};
GRANT SELECT ON ${schema}.schema_migrations TO ${role};
${tables.map(table=>`ALTER TABLE ${schema}.${table} ENABLE ROW LEVEL SECURITY;
ALTER TABLE ${schema}.${table} FORCE ROW LEVEL SECURITY;
CREATE POLICY project_server ON ${schema}.${table} TO ${role} USING (true) WITH CHECK (true);`).join('\n')}
COMMIT;
SELECT 'StagePeek schema ready';`;
const run=(args,input)=>new Promise((resolve,reject)=>{
  const child=spawn('ssh',['-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=10',`ubuntu@${host}`,...args],{stdio:['pipe','pipe','pipe']});
  let output='';child.stdout.on('data',chunk=>output+=chunk);child.stderr.resume();child.stdin.on('error',()=>{});
  child.on('error',()=>reject(new Error('SSH connection failed')));
  child.on('close',code=>code===0?resolve(output.trim()):reject(new Error('PostgreSQL provisioning failed; no remote stderr or secrets are printed')));
  child.stdin.end(input);
});
await run(['sudo -n docker exec -i supabase-db psql -X -qAt -v ON_ERROR_STOP=1 -U postgres -d postgres'],sql);
const pgPort=await run(["sudo -n docker exec supabase-db psql -X -qAt -U postgres -d postgres -c 'show port;'"],'');
if(!/^\d{2,5}$/.test(pgPort))throw new Error('Unexpected PostgreSQL port');
const ip=await run(["sudo -n docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' supabase-db"],'');
if(!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip))throw new Error('Ambiguous PostgreSQL container address');
await mkdir(new URL('../var/',import.meta.url),{recursive:true,mode:0o700});
await writeFile(destination,`DATABASE_URL=postgresql://${role}:${password}@127.0.0.1:15433/postgres\nDATABASE_SCHEMA=${schema}\nDATABASE_POOL_MAX=5\n`,{mode:0o600,flag:'wx'});
console.log(JSON.stringify({ready:true,schema,role,secretFile:destination.pathname,
  localTunnel:`ssh -N -L 127.0.0.1:15433:${ip}:${pgPort} ubuntu@${host}`,
  note:'Credentials are server-only. Production app still requires its own verified protected connection; database is not exposed publicly.'},null,2));
