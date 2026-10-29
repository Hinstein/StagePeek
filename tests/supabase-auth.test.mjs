import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {once} from 'node:events';
import {SupabaseAuth} from '../server/supabase-auth.mjs';
import {openStore} from '../server/store.mjs';
import {createApplication} from '../server/app.mjs';
import {loadConfig} from '../server/config.mjs';

const uid='fced42be-6c11-4fe8-b802-69b6ab3ebf41',site='472e7705-2a72-423d-8aad-cf59497ab4e9';
const config=()=>({authMode:'supabase',supabaseUrl:'https://supabase.openp7m.com',supabaseAnonKey:'public-anon-test',siteId:site,authCookieKey:randomBytes(32).toString('base64'),authEmailEnabled:true,appUrl:'http://127.0.0.1:4180'});
function fixture({role='member',confirmed=true,failUser=false}={}){
 const calls=[];let joined=false,refreshes=0,consumed=false,revoked=false;
 const db={prepare(sql){return {get:async id=>{
  if(sql.includes('join_shared_member'))joined=true;
  return joined?{id,auth_user_id:id,site_id:site,member_role:role,created_at:1}:null;
 }}}};
 const fetch=async(url,init)=>{
  const u=new URL(url);calls.push({path:u.pathname,query:u.search,body:init.body?JSON.parse(init.body):null});
  if(u.pathname.endsWith('/otp'))return Response.json({});
  if(u.pathname.endsWith('/verify')){
   const input=JSON.parse(init.body);if(input.token!=='123456'||consumed)return Response.json({},{status:403});
   consumed=true;return Response.json({access_token:'access-token',refresh_token:'refresh-secret',expires_in:3600});
  }
  if(u.pathname.endsWith('/token')){refreshes++;return Response.json({access_token:'new-access',refresh_token:'new-refresh',expires_in:3600});}
  if(u.pathname.endsWith('/user'))return failUser?Response.json({},{status:503}):revoked?Response.json({},{status:401}):Response.json({id:uid,email:'test@example.com',email_confirmed_at:confirmed?'2026-01-01':null,user_metadata:{role:'admin',site_id:'forged'}});
  if(u.pathname.endsWith('/logout')){revoked=true;return Response.json({});}
  throw new Error('Unexpected mock URL');
 };
 return {db,fetch,calls,refreshes:()=>refreshes};
}
test('production forbids local identity and untrusted Auth origins',()=>{
 assert.throws(()=>loadConfig({NODE_ENV:'production',APP_URL:'https://stagepeek.live',AUTH_MODE:'local'}),/shared Supabase/);
 assert.throws(()=>new SupabaseAuth({}, {...config(),supabaseUrl:'https://attacker.example'}),/shared Supabase/);
 assert.throws(()=>new SupabaseAuth({}, {...config(),authCookieKey:''}),/32 random bytes/);
});
test('repeated unconfirmed registration resends the signup code',async()=>{
 const calls=[];
 const auth=new SupabaseAuth({},config(),{fetch:async(url,init)=>{
  const u=new URL(url);calls.push({path:u.pathname,body:init.body?JSON.parse(init.body):null});
  if(u.pathname.endsWith('/signup'))return Response.json({id:uid,identities:[]});
  if(u.pathname.endsWith('/resend'))return Response.json({});
  throw new Error('Unexpected mock URL');
 }});
 await auth.register('TEST@example.com','a-long-test-password','en');
 assert.deepEqual(calls.map(call=>call.path),['/auth/v1/signup','/auth/v1/resend']);
 assert.deepEqual(calls[1].body,{type:'signup',email:'test@example.com'});
 const firstSignup=[];
 const firstAuth=new SupabaseAuth({},config(),{fetch:async(url,init)=>{
  const u=new URL(url);firstSignup.push(u.pathname);
  if(u.pathname.endsWith('/signup'))return Response.json({id:uid,identities:[{provider:'email'}]});
  throw new Error('Unexpected mock URL');
 }});
 await firstAuth.register('new@example.com','a-long-test-password','en');
 assert.deepEqual(firstSignup,['/auth/v1/signup']);
});
test('Supabase OTP creates only a project member and rejects reuse; cookie hides credentials',async()=>{
 const f=fixture(),auth=new SupabaseAuth(f.db,config(),f);
 await auth.sendOtp(' TEST@example.com ');
 assert.equal(f.calls[0].body.email,'test@example.com');assert.match(f.calls[0].query,/redirect_to=/);
 const result=await auth.verifyOtp('test@example.com','123456');assert.equal(result.user.role,'member');
 assert.equal(result.cookie.includes('refresh-secret'),false);assert.equal(result.cookie.includes('test@example.com'),false);
 assert.equal((await auth.resolve(result.cookie)).user.id,uid);
 await assert.rejects(auth.verifyOtp('test@example.com','123456'),{code:'INVALID_OTP'});
 assert.equal((await auth.resolve('old-custom-session')).user,null);
 const bytes=Buffer.from(result.cookie,'base64url');bytes[30]^=1;assert.equal((await auth.resolve(bytes.toString('base64url'))).user,null);
 await auth.logout(result.cookie);assert.equal((await auth.resolve(result.cookie)).user,null);
});
test('unconfirmed email and missing membership never authorize a shared identity',async()=>{
 let f=fixture({confirmed:false}),auth=new SupabaseAuth(f.db,config(),f);
 await assert.rejects(auth.verifyOtp('test@example.com','123456'),{code:'LOGIN_REQUIRED'});
 f=fixture();auth=new SupabaseAuth(f.db,config(),f);
 const token=auth.seal({access:'x',refresh:'y',expires:Date.now()+600000,until:Date.now()+600000});
 assert.equal((await auth.resolve(token)).user,null,'shared account has no implicit StagePeek membership');
});
test('concurrent refresh requests share one rotation and outages preserve the session',async()=>{
 let now=100000;const f=fixture(),auth=new SupabaseAuth(f.db,config(),{...f,clock:()=>now});
 const {cookie}=await auth.verifyOtp('test@example.com','123456');now+=3600_000;
 const results=await Promise.all([auth.resolve(cookie),auth.resolve(cookie)]);assert.equal(f.refreshes(),1);assert.ok(results.every(r=>r.user.id===uid&&r.cookie));
 const failed=fixture({failUser:true}),offline=new SupabaseAuth(failed.db,config(),failed);
 const token=offline.seal({access:'x',refresh:'y',expires:Date.now()+600000,until:Date.now()+600000});
 await assert.rejects(offline.resolve(token),{code:'AUTH_UNAVAILABLE'});
});
test('HTTP shared OTP enforces browser binding, role, origin and production-disabled legacy paths',async t=>{
 const f=fixture(),db=openStore(':memory:'),original=db.prepare.bind(db);let joined=false;
 db.prepare=sql=>sql.includes('shared_member')?{get:async()=>{
  if(sql.includes('join_shared_member')){
   joined=true;await original('INSERT INTO users(id,email,created_at) VALUES(?,?,?) ON CONFLICT DO NOTHING').run(uid,'test@example.com',1);
  }
  return joined?{id:uid,auth_user_id:uid,site_id:site,member_role:'member',created_at:1}:null;
 }}:original(sql);
 const cfg={...config(),adminEmails:['test@example.com'],freeVenueIds:['free']};
 const venues={ids:()=>['free','paid'],catalog:()=>[{id:'free'},{id:'paid'}],get:id=>['free','paid'].includes(id)?{id}:null};
 const app=createApplication({db,config:cfg,venues,fetch:f.fetch});app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
 cfg.appUrl=`http://127.0.0.1:${app.server.address().port}`;
 t.after(async()=>{await new Promise(r=>app.server.close(r));await db.close();});
 const call=(path,body,cookie='',origin=cfg.appUrl)=>fetch(cfg.appUrl+path,{method:body?'POST':'GET',headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
 const send=await call('/api/auth/email',{email:'test@example.com'});assert.equal(send.status,200);
 const pending=send.headers.getSetCookie().map(s=>s.split(';')[0]).join('; ');
 assert.equal((await call('/api/auth/email/verify',{code:'123456'})).status,400);
 assert.equal((await call('/api/auth/email/verify',{code:'123456'},pending,'https://attacker.example')).status,403);
 const login=await call('/api/auth/email/verify',{code:'123456'},pending);assert.equal(login.status,200);
 const cookies=login.headers.getSetCookie();assert.ok(cookies.some(s=>/supabase=.*HttpOnly; SameSite=Lax/.test(s)));
 const session=cookies.map(s=>s.split(';')[0]).join('; '),me=await(await call('/api/me',null,session)).json();
 assert.equal(me.providers.auth,'supabase');assert.equal(me.user.role,'member');assert.equal(me.access.plan,'free');
 assert.equal((await call('/api/admin/access',null,session)).status,403,'email allow-list cannot grant shared admins');
 assert.equal((await call('/api/venues/paid',null,session)).status,403);
 assert.equal((await call('/api/dev/mailbox',null,session)).status,404);
 assert.equal((await call('/api/auth/google/start',{},session)).status,503);
 for(const path of ['/auth/callback','/auth/reset']){const r=await call(path);assert.equal(r.status,200);assert.match(r.headers.get('X-Robots-Tag'),/noindex/);}
 assert.equal((await db.prepare('SELECT count(*) n FROM login_tokens').get()).n,0);
 assert.equal((await db.prepare('SELECT count(*) n FROM sessions').get()).n,0);
});
