import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {openStore} from '../server/store.mjs';
import {AuthService} from '../server/auth.mjs';
import {createApplication} from '../server/app.mjs';
import {safeReturn} from '../public/auth-contract.mjs';

const now=Date.parse('2026-11-04T02:00:00Z');
async function setup(t){
  const db=openStore(':memory:');
  const config={appUrl:'http://127.0.0.1',adminEmails:['admin@example.com'],devMailbox:true};
  for(const row of [
    ['admin','admin@example.com',now-20*86400_000],
    ['old','older@example.com',now-8*86400_000],
    ['week','week@example.com',now-3*86400_000],
    ['today','today@example.com',Date.parse('2026-11-03T17:00:00Z')],
    ['literal','percent_%@example.com',now]
  ])await db.prepare('INSERT INTO users(id,email,created_at) VALUES(?,?,?)').run(...row);
  const venues={ids:()=>['free'],catalog:()=>[{id:'free',name:'Free'}],get:()=>null};
  const app=createApplication({db,config,venues,clock:()=>now});
  app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
  config.appUrl=`http://127.0.0.1:${app.server.address().port}`;
  const auth=new AuthService(db,{clock:()=>now});
  const admin='ss_session='+await auth.createSession('admin'),member='ss_session='+await auth.createSession('week');
  t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));await db.close();});
  const call=(path,cookie='')=>fetch(config.appUrl+path,{headers:{Cookie:cookie},redirect:'manual'});
  return {db,config,call,admin,member};
}

test('user directory and capability require an administrator',async t=>{
  const f=await setup(t);
  assert.equal((await f.call('/api/admin/users')).status,401);
  assert.equal((await f.call('/api/admin/users',f.member)).status,403);
  assert.equal((await(await f.call('/api/me',f.member)).json()).admin,false);
  assert.equal((await(await f.call('/api/me',f.admin)).json()).admin,true);
  const response=await f.call('/api/admin/users',f.admin);
  assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
  assert.deepEqual((await response.json()).summary,{total:5,today:2,last7Days:3});
});

test('directory search is literal and case insensitive, with bounded stable pagination',async t=>{
  const f=await setup(t);
  const data=await(await f.call('/api/admin/users?pageSize=2&page=2',f.admin)).json();
  assert.equal(data.page,2);assert.equal(data.pages,3);assert.equal(data.total,5);
  assert.deepEqual(data.users.map(u=>u.id),['week','old']);
  assert.deepEqual(Object.keys(data.users[0]).sort(),['createdAt','email','id','role']);
  const searched=await(await f.call('/api/admin/users?q=PERCENT_%25',f.admin)).json();
  assert.equal(searched.total,1);assert.equal(searched.users[0].id,'literal');
  assert.equal(searched.summary.total,5);
  assert.equal((await(await f.call('/api/admin/users?q=absent',f.admin)).json()).users.length,0);
  assert.equal((await(await f.call('/api/admin/users?page=999',f.admin)).json()).page,1);
  for(const query of ['page=0','page=-1','page=1.2','page=1e3','pageSize=101','pageSize=0','q='+('x'.repeat(201))]){
    assert.equal((await f.call('/api/admin/users?'+query,f.admin)).status,400,query);
  }
});

test('admin page aliases expose a login shell without exposing user data',async t=>{
  const f=await setup(t);
  for(const path of ['/admin','/admin/','/admin.html']){
    const response=await f.call(path);assert.equal(response.status,200,path);
    assert.match(response.headers.get('X-Robots-Tag'),/noindex/);
    const html=await response.text();assert.match(html,/tabler/);assert.doesNotMatch(html,/admin@example.com/);
  }
});

test('account page exposes the admin entry only to an authorized account',async t=>{
  const f=await setup(t);
  for(const cookie of ['',f.member])assert.doesNotMatch(await(await f.call('/account',cookie)).text(),/<a[^>]+href="\/admin"/);
  assert.match(await(await f.call('/account',f.admin)).text(),/<a[^>]+href="\/admin"[^>]*>管理后台/);
});

test('admin login can return to its fixed dashboard without opening redirects or auth loops',()=>{
  assert.equal(safeReturn('/admin'),'/admin');
  for(const path of ['/admin/','/admin.html'])assert.equal(safeReturn(path),'/admin');
  for(const path of ['//evil.invalid/admin','https://evil.invalid/admin','/admin.evil.invalid','/auth/login','/admin/users','/zh-CN/admin'])assert.equal(safeReturn(path),'/');
  assert.equal(safeReturn('/admin?next=https://evil.invalid&token=secret'),'/admin');
});
