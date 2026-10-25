import {resolve,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {openStore,transaction} from '../server/store.mjs';

export async function seedLocal(env=process.env){
  if(env.NODE_ENV==='production')throw new Error('Local fixtures are forbidden in production');
  const path=resolve(env.LOCAL_DB_PATH||fileURLToPath(new URL('../var/seatpeep-local.sqlite',import.meta.url)));
  if(!basename(path).endsWith('-local.sqlite'))throw new Error('Fixtures require a separate *-local.sqlite database');
  const db=openStore(path),now=Date.now();
  try{(await transaction(db,async ()=>{
    for(const [name,expiry] of [['free',null],['pro',now+30*86400_000],['expired',now-86400_000],['admin',null]]){
      const email=name+'@seatpeep.test';
      (await db.prepare('INSERT INTO users(id,email,created_at) VALUES(?,?,?) ON CONFLICT DO NOTHING').run(randomUUID(),email,now));
      const user=(await db.prepare('SELECT id FROM users WHERE email=?').get(email));
      if(expiry!==null)(await db.prepare(`INSERT INTO subscriptions VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET period_end=excluded.period_end,status=excluded.status`).run('local_'+name,user.id,'active',expiry,0,'local_fixture_monthly',now));
    }
  }));}finally{await db.close();}
  return path;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{console.log('Local fixture database:',await seedLocal());console.log('Test emails: free@seatpeep.test, pro@seatpeep.test, expired@seatpeep.test');}
  catch(error){console.error(error.message);process.exitCode=1;}
}
