import {DatabaseSync} from 'node:sqlite';
import {chmodSync,mkdirSync} from 'node:fs';
import {resolve,basename} from 'node:path';
import {openPostgres} from '../server/postgres-store.mjs';
import {transaction} from '../server/store.mjs';

const source=resolve(process.argv[2]||'var/seatpeep.sqlite');
const schema=process.env.DATABASE_SCHEMA||'site_stagepeek';
if(basename(source).includes('-local')&&!schema.endsWith('_dev'))throw new Error('Local demo data can only migrate into the development schema');
const tables=['users','login_tokens','sessions','oauth_attempts','billing_customers','checkout_attempts','local_billing_tokens','subscriptions','webhook_events','saved_positions','rate_limits','access_settings'];
const sqlite=new DatabaseSync(source,{readOnly:true});
let db;
try{
  const available=new Set(sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(x=>x.name));
  const counts=Object.fromEntries(tables.map(table=>[table,available.has(table)?sqlite.prepare(`SELECT count(*) n FROM ${table}`).get().n:0]));
  if(!process.argv.includes('--apply'))console.log(JSON.stringify({dryRun:true,source,schema,counts,note:'Use --apply after reviewing source and destination; destination must be empty.'},null,2));
  else{
    if(!available.has('users'))throw new Error('Source is not an initialized StagePeek database');
    if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required');
    mkdirSync('var/backups',{recursive:true,mode:0o700});
    const snapshot=resolve(`var/backups/sqlite-before-postgres-${Date.now()}.sqlite`);
    sqlite.prepare('VACUUM INTO ?').run(snapshot);chmodSync(snapshot,0o600);
    db=await openPostgres({databaseUrl:process.env.DATABASE_URL,databaseSchema:schema});
    const stable=new DatabaseSync(snapshot,{readOnly:true});
    try{
      await transaction(db,async()=>{
        for(const table of tables){if((await db.prepare(`SELECT count(*) n FROM ${table}`).get()).n)throw new Error('Destination must be empty; refusing to merge or overwrite accounts');}
        for(const table of tables){
          if(!available.has(table))continue;
          for(const row of stable.prepare(`SELECT * FROM ${table}`).iterate()){
            const columns=Object.keys(row);
            if(columns.some(x=>!/^\w+$/.test(x)))throw new Error('Unexpected SQLite column');
            await db.prepare(`INSERT INTO ${table}(${columns.join(',')}) VALUES(${columns.map(()=>'?').join(',')})`).run(...Object.values(row));
          }
          const before=stable.prepare(`SELECT count(*) n FROM ${table}`).get().n;
          if((await db.prepare(`SELECT count(*) n FROM ${table}`).get()).n!==before)throw new Error('Migration row count mismatch');
        }
      });
      console.log(JSON.stringify({migrated:true,source,schema,snapshot,counts,verified:'row counts, constraints and transaction commit; source unchanged'},null,2));
    }finally{stable.close();}
  }
}finally{sqlite.close();if(db)await db.close();}
