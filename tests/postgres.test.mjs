import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {once} from 'node:events';
import {postgresSql,postgresSchema,openPostgres} from '../server/postgres-store.mjs';
import {loadConfig} from '../server/config.mjs';
import {AuthService,hash} from '../server/auth.mjs';
import {transaction,limit} from '../server/store.mjs';
import {entitlements} from '../server/access.mjs';
import {createApplication} from '../server/app.mjs';

test('PostgreSQL placeholders preserve SQL literals and production cannot fall back to SQLite',()=>{
  assert.equal(postgresSql("SELECT '?' AS literal, \"?\" FROM users WHERE id=? AND email=?"),"SELECT '?' AS literal, \"?\" FROM users WHERE id=$1 AND email=$2");
  assert.throws(()=>postgresSchema('public; DROP SCHEMA public'),/schema/);
  assert.throws(()=>loadConfig({NODE_ENV:'production',APP_URL:'https://stagepeek.live'}),/PostgreSQL/);
});

test('real PostgreSQL authentication, rollback, isolation and HTTP entitlement flow',{
  skip:process.env.POSTGRES_INTEGRATION!=='true'
},async t=>{
  assert.equal(process.env.DATABASE_SCHEMA,'site_stagepeek_dev','Integration tests only use the development schema');
  const config={databaseUrl:process.env.DATABASE_URL,databaseSchema:process.env.DATABASE_SCHEMA};
  const db=await openPostgres(config),peer=await openPostgres(config),auth=new AuthService(db);
  const prefix=randomUUID(),address=prefix+'@pg-integration.test',key='pg-test:'+prefix;
  let id,server;
  t.after(async()=>{
    if(server)await new Promise(resolve=>server.close(resolve));
    if(id){
      for(const table of ['sessions','oauth_attempts','saved_positions','billing_customers','checkout_attempts','local_billing_tokens','subscriptions'])await db.prepare(`DELETE FROM ${table} WHERE user_id=?`).run(id);
      await db.prepare('DELETE FROM users WHERE id=?').run(id);
    }
    await db.prepare('DELETE FROM login_tokens WHERE email=?').run(address);
    await db.prepare('DELETE FROM rate_limits WHERE key=?').run(key);
    await db.close();await peer.close();
  });
  await t.test('only one concurrent token consumption can succeed across pools',async()=>{
    const attempt=await auth.issueEmail(address);
    const results=await Promise.allSettled([auth.consumeEmail(attempt.token),new AuthService(peer).consumeEmail(attempt.token)]);
    assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
    const user=results.find(r=>r.status==='fulfilled').value;id=user.id;
    assert.equal((await db.prepare('SELECT token_hash FROM login_tokens WHERE email=?').get(address)).token_hash,hash(attempt.token));
    assert.equal((await entitlements(db,user)).plan,'free');
    const token=await auth.createSession(id);
    assert.equal((await new AuthService(peer).readSession(token)).id,id);
    await auth.revokeSession(token);assert.equal(await new AuthService(peer).readSession(token),null);
  });
  await t.test('rollback and concurrent limits retain database integrity',async()=>{
    await assert.rejects(()=>transaction(db,async()=>{
      await db.prepare('UPDATE users SET email=? WHERE id=?').run(prefix+'-rollback@pg-integration.test',id);
      throw new Error('abort transaction');
    }),/abort transaction/);
    assert.equal((await auth.user(id)).email,address);
    const attempts=await Promise.allSettled([limit(db,key,1,60000),limit(peer,key,1,60000)]);
    assert.equal(attempts.filter(x=>x.status==='fulfilled').length,1);
    assert.equal(attempts.find(x=>x.status==='rejected').reason.code,'RATE_LIMITED');
  });
  await t.test('project role cannot read production schema, shared Auth or create tables',async()=>{
    for(const sql of ['SELECT * FROM site_stagepeek.users','SELECT * FROM auth.users','CREATE TABLE site_stagepeek_dev.forbidden(id text)']){
      await assert.rejects(()=>db.exec(sql),e=>e.code==='42501');
    }
  });
  await t.test('HTTP login, save, subscription gating and logout run against PostgreSQL',async()=>{
    const appConfig={appUrl:'http://127.0.0.1:4180',devMailbox:true,production:false,freeVenueIds:['tottenham']};
    const venues={catalog:()=>[{id:'tottenham'},{id:'sofi'}],get:id=>['tottenham','sofi'].includes(id)?{id}:null,
      resolve:()=>({status:'matched',section:'122',row:'14',seat:'679',layout:'end'})};
    const app=createApplication({db,config:appConfig,venues});server=app.server;
    server.listen(0,'127.0.0.1');await once(server,'listening');appConfig.appUrl=`http://127.0.0.1:${server.address().port}`;
    const call=(path,{cookie='',body}={})=>fetch(appConfig.appUrl+path,{method:body?'POST':'GET',headers:{Cookie:cookie,...(body?{Origin:appConfig.appUrl,'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
    const cookies=r=>r.headers.getSetCookie().map(x=>x.split(';')[0]).join('; ');
    const request=await call('/api/auth/email',{body:{email:address}});assert.equal(request.status,200);
    const token=new URLSearchParams(new URL(app.email.outbox[0].url).hash.slice(1)).get('token');
    const verified=await call('/api/auth/email/verify',{cookie:cookies(request),body:{token}});assert.equal(verified.status,200);
    const cookie=cookies(verified);
    assert.equal((await(await call('/api/me',{cookie})).json()).user.id,id);
    assert.equal((await call('/api/venues/sofi',{cookie})).status,403);
    const saved=await call('/api/positions',{cookie,body:{venueId:'tottenham',section:'122',row:'14',seat:'679'}});assert.equal(saved.status,201);
    assert.equal((await(await call('/api/positions',{cookie})).json()).positions.length,1);
    await db.prepare('INSERT INTO subscriptions VALUES(?,?,?,?,?,?,?)').run('pg_test_'+prefix,id,'active',Date.now()+60000,0,'test_monthly',Date.now());
    assert.equal((await call('/api/venues/sofi',{cookie})).status,200);
    const out=await call('/api/auth/logout',{cookie,body:{}});assert.equal(out.status,200);
    assert.equal((await(await call('/api/me',{cookie})).json()).user,null);
  });
});
