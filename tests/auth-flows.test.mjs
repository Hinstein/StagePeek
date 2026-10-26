import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {SupabaseAuth} from '../server/supabase-auth.mjs';
import {openStore} from '../server/store.mjs';

const cfg={supabaseUrl:'https://supabase.openp7m.com',supabaseAnonKey:'test-public',siteId:'472e7705-2a72-423d-8aad-cf59497ab4e9',authCookieKey:randomBytes(32).toString('base64'),authEmailEnabled:true,authRecoveryEnabled:true,authGoogleEnabled:true,appUrl:'https://stagepeek.live'};
const uid='fced42be-6c11-4fe8-b802-69b6ab3ebf41';
function setup(){
 const db=openStore(':memory:'),original=db.prepare.bind(db),calls=[];
 db.prepare=sql=>sql.includes('shared_member')?{get:async()=>({id:uid,auth_user_id:uid,site_id:cfg.siteId,created_at:1,member_role:'member'})}:original(sql);
 const fetch=async(url,init)=>{const u=new URL(url),body=init.body?JSON.parse(init.body):null;calls.push({url:u,body,method:init.method});
  if(u.pathname.endsWith('/user'))return Response.json(init.method==='PUT'?{}:{id:uid,email:'test@example.com',email_confirmed_at:'2026-01-01',identities:[{provider:'google'}]});
  if(u.pathname.endsWith('/verify')||u.pathname.endsWith('/token'))return Response.json({access_token:'access',refresh_token:'refresh',expires_in:3600});
  return Response.json({});
 };
 return {db,calls,auth:new SupabaseAuth(db,cfg,{fetch})};
}
test('registration sends password to signup before consuming signup OTP, never OTP-create-user',async()=>{
 const f=setup();try{
  await f.auth.register('TEST@example.com','a-long-test-password');
  assert.equal(f.calls[0].url.pathname,'/auth/v1/signup');assert.equal(f.calls[0].body.email,'test@example.com');
  assert.equal(f.calls[0].body.password,'a-long-test-password');
  await f.auth.verifyOtp('test@example.com','123456','signup');assert.equal(f.calls[1].body.type,'signup');
  await f.auth.sendOtp('test@example.com');assert.equal(f.calls.at(-1).body.create_user,false);
  await assert.rejects(f.auth.register('test@example.com','short'),{code:'WEAK_PASSWORD'});
  await f.auth.resendSignup('test@example.com','en');assert.equal(f.calls.at(-1).url.searchParams.get('redirect_to'),'https://stagepeek.live/auth/callback?lang=en');
 }finally{await f.db.close();}
});
test('recovery grant is server-stored, isolated from login and atomically single-use',async()=>{
 const f=setup();try{
  const grant=await f.auth.verifyRecovery('test@example.com','123456','/');
  assert.equal((await f.auth.resolve(grant)).user,null);
  assert.equal(grant.includes('access'),false);
  const row=await f.db.prepare('SELECT payload FROM auth_flows').get();assert.equal(row.payload.includes('refresh'),false);
  const results=await Promise.allSettled([f.auth.completePassword(grant,'a-new-long-password','recovery'),f.auth.completePassword(grant,'a-new-long-password','recovery')]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  assert.equal(f.calls.filter(c=>c.method==='PUT').length,1);
  assert.equal(f.calls.find(c=>c.url.pathname.endsWith('/verify')).body.type,'recovery');
 }finally{await f.db.close();}
});
test('Google PKCE grant is browser-bound, no password/legacy provider and safe return',async()=>{
 const f=setup();try{
  const start=await f.auth.startGoogle('/?venue=sofi&section=101');
  const u=new URL(start.url);assert.equal(u.origin,'https://supabase.openp7m.com');assert.equal(u.searchParams.get('provider'),'google');
  assert.equal(u.searchParams.get('code_challenge_method'),'s256');assert.equal(u.searchParams.get('code_challenge').length,43);
  await assert.rejects(f.auth.finishGoogle('bad','code'),{code:'AUTH_FLOW_EXPIRED'});
  const result=await f.auth.finishGoogle(start.flow,'code');assert.equal(result.returnTo,'/?venue=sofi&section=101');
  assert.equal(result.user.googleConnected,true);assert.equal(f.calls.at(-2).url.searchParams.get('grant_type'),'pkce');
  await assert.rejects(f.auth.finishGoogle(start.flow,'code'),{code:'AUTH_FLOW_EXPIRED'});
  const bad=await f.auth.startGoogle('//evil.invalid');assert.equal((await f.auth.finishGoogle(bad.flow,'another')).returnTo,'/');
 }finally{await f.db.close();}
});

test('HTTP registration, recovery and consent preserve boundaries and original location',async t=>{
 const {createApplication}=await import('../server/app.mjs');const {once}=await import('node:events');
 const f=setup(),config={...cfg,production:false,authMode:'supabase',freeVenueIds:['free'],allowedOrigins:[]};
 let failVerify=false;
 const app=createApplication({db:f.db,config,venues:{ids:()=>['free','paid'],catalog:()=>[{id:'free'},{id:'paid'}],get:id=>({id})},fetch:async(url,init)=>{
  // Same fixture service, joined member rows are supplied by setup().
  const u=new URL(url);if(u.pathname.endsWith('/verify')&&failVerify)return Response.json({},{status:503});if(u.pathname.endsWith('/settings'))return Response.json({external:{google:true}});
  if(u.pathname.endsWith('/user'))return Response.json({id:uid,email:'test@example.com',email_confirmed_at:'2026-01-01',identities:[{provider:'google'}]});
  if(u.pathname.endsWith('/verify')||u.pathname.endsWith('/token'))return Response.json({access_token:'access',refresh_token:'refresh',expires_in:3600});
  return Response.json({});
 }});
 app.server.listen(0,'127.0.0.1');await once(app.server,'listening');config.appUrl=`http://127.0.0.1:${app.server.address().port}`;
 // Test repository identity exists; production join_shared_member owns this insert.
 await f.db.prepare('INSERT INTO users(id,email,created_at) VALUES(?,?,?)').run(uid,'test@example.com',1);
 t.after(async()=>{await new Promise(r=>app.server.close(r));await f.db.close();});
 let jar=new Map();const call=async(path,body,origin=config.appUrl)=>{
  const r=await fetch(config.appUrl+path,{method:body?'POST':'GET',redirect:'manual',headers:{Origin:origin,Cookie:[...jar].map(([k,v])=>k+'='+v).join('; '),'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  for(const c of r.headers.getSetCookie()){const [k,v]=c.split(';')[0].split('=');jar.set(k,v);}return r;
 };
 assert.equal((await call('/api/auth/register',{email:'test@example.com',password:'long-test-password',consent:false})).status,400);
 const start=await call('/api/auth/register',{email:'test@example.com',password:'long-test-password',consent:true,returnTo:'/?venue=sofi&section=101'});assert.equal(start.status,200);
 assert.equal((await call('/api/me')).status,200);
 assert.equal((await call('/api/auth/email/verify',{code:'123456'})).status,400,'login OTP cannot consume signup flow');
 failVerify=true;assert.equal((await call('/api/auth/register/verify',{code:'123456'})).status,503);assert.equal((await(await call('/api/auth/status')).json()).flow.kind,'signup');failVerify=false;
 const verify=await call('/api/auth/register/verify',{code:'123456'});assert.equal(verify.status,200);assert.equal((await verify.json()).returnTo,'/?venue=sofi&section=101');
 assert.equal((await(await call('/api/me')).json()).consent.required,false);
 assert.equal((await call('/api/venues/paid')).status,403);
 assert.equal((await call('/api/auth/logout',{})).status,200);
 assert.equal((await call('/api/auth/recovery',{email:'test@example.com',returnTo:'//evil.invalid'})).status,200);
 assert.equal((await call('/api/auth/recovery/verify',{code:'123456'})).status,200);
 assert.equal((await(await call('/api/me')).json()).user,null);
 assert.equal((await call('/api/auth/recovery/complete',{password:'new-long-password'},'https://evil.invalid')).status,403);
 assert.equal((await call('/api/auth/recovery/complete',{password:'new-long-password'})).status,200);
 assert.equal((await call('/api/auth/recovery/complete',{password:'new-long-password'})).status,400);
});

test('safe return rejects encoded separators and authentication loops',async()=>{
 const {safeReturn}=await import('../public/auth-contract.mjs');
 for(const value of ['//evil.invalid','/\\evil.invalid','/auth/login','/%2f%2fevil.invalid','https://evil.invalid'])assert.equal(safeReturn(value),'/');
 assert.equal(safeReturn('/?venue=sofi&section=101&token=secret'),'/?venue=sofi&section=101');
});
test('flow status exposes no credentials; recovery completion reports committed update despite logout outage',async()=>{
 const f=setup();try{
  const grant=await f.auth.verifyRecovery('test@example.com','123456','/');
  assert.equal((await f.auth.flows.peek(grant)).kind,'recovery');
  const upstream=f.auth.fetch;f.auth.fetch=async(url,init)=>url.includes('/logout')?Response.json({},{status:503}):upstream(url,init);
  const result=await f.auth.completePassword(grant,'another-long-password');assert.equal(result.sessionsRevoked,false);
  assert.equal(await f.auth.flows.peek(grant),null);
 }finally{await f.db.close();}
});

test('temporary password-update failure keeps the verified recovery context retryable',async()=>{
 const f=setup();try{
  const grant=await f.auth.verifyRecovery('test@example.com','123456','/');const upstream=f.auth.fetch;let fail=true;
  f.auth.fetch=async(url,init)=>init.method==='PUT'&&fail?Response.json({},{status:503}):upstream(url,init);
  await assert.rejects(f.auth.completePassword(grant,'retryable-new-password'),{code:'AUTH_UNAVAILABLE'});
  assert.equal((await f.auth.flows.peek(grant))?.kind,'recovery');
  fail=false;await f.auth.completePassword(grant,'retryable-new-password');
  assert.equal(await f.auth.flows.peek(grant),null);
 }finally{await f.db.close();}
});


test('venue return preserves ticket aliases and seat/zoom context across authentication',async()=>{
 const {venueReturn}=await import('../public/auth-contract.mjs');
 const {loadVenues}=await import('../server/venues.mjs');const venues=loadVenues();
 const original=venues.resolve('metlife',{section:'103WC',row:'46',seat:'27'});assert.equal(original.status,'matched');
 const next=venueReturn({venueId:'metlife',sectionId:original.sectionId,result:original,layout:'end',mode:'3d',zoom:4,event:{id:'event-test'}});
 const p=new URL(next,'https://stagepeek.live').searchParams;assert.equal(p.get('section'),'103WC');assert.equal(p.get('zoom'),'4');assert.equal(p.get('event'),'event-test');
 assert.equal(venues.resolve(p.get('venue'),Object.fromEntries(p)).status,'matched');
});


test('consent never takes over account security or recovery pages',async()=>{
 const {needsConsentPage}=await import('../public/auth-contract.mjs');const me={user:{id:uid},consent:{required:true}};
 for(const page of ['account','setup','reset','recover-code','new-password'])assert.equal(needsConsentPage(page,me),false);
 for(const page of ['login','register','continue'])assert.equal(needsConsentPage(page,me),true);
});


test('unknown outcome after password update cannot reopen recovery credentials',async()=>{
 const f=setup();try{
  const grant=await f.auth.verifyRecovery('test@example.com','123456','/');const upstream=f.auth.fetch;let updates=0;
  f.auth.fetch=async(url,init)=>{if(init.method==='PUT'){updates++;throw new Error('Response lost after commit');}return upstream(url,init);};
  await assert.rejects(f.auth.completePassword(grant,'first-long-password'),{code:'AUTH_PASSWORD_RESULT_UNKNOWN'});
  await assert.rejects(f.auth.completePassword(grant,'second-long-password'),{code:'AUTH_FLOW_EXPIRED'});assert.equal(updates,1);
 }finally{await f.db.close();}
});
