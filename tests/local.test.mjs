import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {openStore} from '../server/store.mjs';
import {entitlements} from '../server/access.mjs';

test('local seed creates free, active and expired fixtures only in an isolated development database',t=>{
  const directory=mkdtempSync(join(tmpdir(),'seatpeep-local-'));t.after(()=>rmSync(directory,{recursive:true}));
  const path=join(directory,'seatpeep-local.sqlite');
  const run=env=>spawnSync(process.execPath,['scripts/seed-local.mjs'],{encoding:'utf8',env:{...process.env,...env,LOCAL_DB_PATH:path}});
  const denied=run({NODE_ENV:'production'});assert.notEqual(denied.status,0);assert.equal(existsSync(path),false);
  const seeded=run({NODE_ENV:'development'});assert.equal(seeded.status,0,seeded.stderr);
  const db=openStore(path);t.after(()=>db.close());
  for(const [email,plan] of [['free@seatpeep.test','free'],['pro@seatpeep.test','pro'],['expired@seatpeep.test','free'],['admin@seatpeep.test','free']]){
    const user=db.prepare('SELECT * FROM users WHERE email=?').get(email);assert.ok(user);assert.equal(entitlements(db,user).plan,plan);
  }
  assert.equal(run({NODE_ENV:'development'}).status,0);
  assert.equal(db.prepare('SELECT count(*) n FROM users').get().n,4);
});
