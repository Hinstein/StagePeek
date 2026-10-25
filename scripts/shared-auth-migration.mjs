import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const apply=process.argv.includes('--apply'),rehearse=process.argv.includes('--rehearse');
if(apply&&rehearse)throw new Error('Choose apply or rehearsal');
const migration=readFileSync(new URL('../db/migrations/002-shared-auth.sql',import.meta.url),'utf8');
const ssh=['-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=10','ubuntu@43.135.155.97'];
const psql='sudo -n docker exec -i supabase-db psql -X -qAt -v ON_ERROR_STOP=1 -U supabase_admin -d postgres';
function run(command,input=''){
 const r=spawnSync('ssh',[...ssh,command],{input,encoding:'utf8',timeout:60000});
 if(r.status!==0){console.error('Shared Auth migration failed; SQL error:',r.stderr.replace(/DETAIL:[^\n]*/g,'DETAIL: redacted'));process.exit(1);}return r.stdout.trim();
}
const counts=JSON.parse(run(psql,"SELECT json_build_object('users',(select count(*) from site_stagepeek.users),'sessions',(select count(*) from site_stagepeek.sessions),'subscriptions',(select count(*) from site_stagepeek.subscriptions),'saved_positions',(select count(*) from site_stagepeek.saved_positions),'version',(select max(version) from site_stagepeek.schema_migrations));"));
console.log(JSON.stringify({mode:apply?'apply':rehearse?'transaction-rehearsal':'plan',counts,siteId:'472e7705-2a72-423d-8aad-cf59497ab4e9',schema:'site_stagepeek',preserves:['existing application UUID','persistent volume','shared identities','other project membership']}));
if(!apply&&!rehearse)process.exit(0);
if(counts.version!==1||Object.entries(counts).some(([key,value])=>key!=='version'&&value!==0))throw new Error('Empty legacy identity schema v1 required; do not auto-map accounts');
const assertions=readFileSync(new URL('../tests/shared-auth-rls.sql',import.meta.url),'utf8');
if(rehearse){console.log(run(psql,migration.replace(/COMMIT;\s*$/,'')+'\n'+assertions+'\nROLLBACK;'));console.log('Rehearsal rolled back: no identities, membership or schema changes retained');}
else{
 const backup='/root/supabase-backups/stagepeek-shared-auth-'+new Date().toISOString().replace(/[:.]/g,'-');
 console.log(run(`sudo -n sh -c 'umask 077; mkdir -p ${backup}; docker exec supabase-db pg_dump -U postgres -d postgres -Fc --schema=auth --schema=platform --schema=site_stagepeek > ${backup}/auth-platform-stagepeek.dump; cp -a /opt/supabase/.env /opt/supabase/docker-compose.yml /opt/supabase/docker-compose.auth-templates.yml ${backup}/; echo ${backup}'`));
 console.log(run(psql,migration));
 console.log('Shared Auth schema v2 installed; application/mail remain separately gated');
}
