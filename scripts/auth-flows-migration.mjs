import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const apply=process.argv.includes('--apply'),rehearse=process.argv.includes('--rehearse');
if(apply&&rehearse)throw new Error('Choose apply or rehearse');
const ssh=['-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=10','ubuntu@43.135.155.97'];
const psql='sudo -n docker exec -i supabase-db psql -X -qAt -v ON_ERROR_STOP=1 -U supabase_admin -d postgres';
function run(cmd,input=''){
 const r=spawnSync('ssh',[...ssh,cmd],{input,encoding:'utf8',timeout:120000});
 if(r.status!==0)throw new Error('Migration command failed: '+r.stderr.replace(/DETAIL:[^\n]*/g,'DETAIL: redacted'));
 return r.stdout.trim();
}
const state=JSON.parse(run(psql,"SELECT json_build_object('version',(select max(version) from site_stagepeek.schema_migrations),'flows',to_regclass('site_stagepeek.auth_flows') IS NOT NULL,'consents',to_regclass('site_stagepeek.auth_consents') IS NOT NULL);"));
console.log(JSON.stringify({mode:apply?'apply':rehearse?'rollback-rehearsal':'plan',state,schema:'site_stagepeek'}));
if(!apply&&!rehearse)process.exit(0);
if(state.version!==2||state.flows||state.consents)throw new Error('Requires schema v2 without auth-flow tables; do not rerun apply');
const migration=readFileSync(new URL('../db/migrations/003-auth-flows.sql',import.meta.url),'utf8');
if(rehearse){
 const assertions=readFileSync(new URL('../tests/auth-flows-rls.sql',import.meta.url),'utf8');
 run(psql,migration.replace(/COMMIT;\s*$/,'')+'\n'+assertions+'\nROLLBACK;');
 console.log('RLS and migration rehearsal passed and rolled back; no fixture retained');
}else{
 const backup='/root/supabase-backups/stagepeek-auth-flows-'+new Date().toISOString().replace(/[:.]/g,'-');
 console.log(run(`sudo -n sh -c 'set -e; umask 077; mkdir -p ${backup}; docker exec supabase-db pg_dump -U postgres -d postgres -Fc --schema=auth --schema=platform --schema=site_stagepeek > ${backup}/auth-platform-stagepeek.dump; cp -a /opt/platform-auth-mail/mail-projects.preflight.json ${backup}/; echo ${backup}'`));
 run(psql,migration);console.log('Additive schema v3 installed; existing identities, business data and mail configuration preserved');
}
