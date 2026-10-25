import {resolve,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {openStore,transaction} from '../server/store.mjs';

export function seedLocal(env=process.env){
  if(env.NODE_ENV==='production')throw new Error('Local fixtures are forbidden in production');
  const path=resolve(env.LOCAL_DB_PATH||fileURLToPath(new URL('../var/seatpeep-local.sqlite',import.meta.url)));
  if(!basename(path).endsWith('-local.sqlite'))throw new Error('Fixtures require a separate *-local.sqlite database');
  const db=openStore(path),now=Date.now();
  try{transaction(db,()=>{
    for(const [name,expiry] of [['free',null],['pro',now+30*86400_000],['expired',now-86400_000],['admin',null]]){
      const email=name+'@seatpeep.test';
      db.prepare('INSERT OR IGNORE INTO users(id,email,created_at) VALUES(?,?,?)').run(randomUUID(),email,now);
      const user=db.prepare('SELECT id FROM users WHERE email=?').get(email);
      if(expiry!==null)db.prepare('INSERT OR REPLACE INTO subscriptions VALUES(?,?,?,?,?,?,?)').run('local_'+name,user.id,'active',expiry,0,'local_fixture_monthly',now);
    }
  });}finally{db.close();}
  return path;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{console.log('Local fixture database:',seedLocal());console.log('Test emails: free@seatpeep.test, pro@seatpeep.test, expired@seatpeep.test');}
  catch(error){console.error(error.message);process.exitCode=1;}
}
