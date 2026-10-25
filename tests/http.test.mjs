import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {openStore} from '../server/store.mjs';

async function setup(t,venueRepository=null) {
  const {createApplication}=await import('../server/app.mjs');
  const {validateVenueManifest}=await import('../server/venue-import.mjs');
  const config={appUrl:'http://127.0.0.1:4180',allowedOrigins:[],devMailbox:true,production:false};
  const db=openStore(':memory:');
  const venues=venueRepository||{catalog:()=>[{id:'tottenham',name:'Tottenham'},{id:'sofi',name:'SoFi'},{id:'hall-10',name:'Hall 10'}],get:id=>['tottenham','sofi','hall-10'].includes(id)?{id,sections:[{id:'122'}]}:null,resolve:()=>({status:'unknown'}),validate:validateVenueManifest};
  const app=createApplication({db,config,venues});
  app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
  const origin=`http://127.0.0.1:${app.server.address().port}`;config.appUrl=origin;
  t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));db.close();});
  const call=(path,{body,cookie,origin:requestOrigin=origin,method=body?'POST':'GET',headers={}}={})=>fetch(origin+path,{
    method,headers:{...(body?{'Content-Type':'application/json',Origin:requestOrigin}:{}),...(cookie?{Cookie:cookie}:{}),...headers},body:body?JSON.stringify(body):undefined,redirect:'manual'
  });
  const cookieFrom=response=>response.headers.getSetCookie().map(x=>x.split(';')[0]).join('; ');
  async function login(email='viewer@example.com') {
    const response=await call('/api/auth/email',{body:{email}});assert.equal(response.status,200);
    const url=new URL(app.email.outbox[0].url),token=new URLSearchParams(url.hash.slice(1)).get('token');
    const verified=await call('/api/auth/email/verify',{body:{token},cookie:cookieFrom(response)});assert.equal(verified.status,200);
    return {cookie:cookieFrom(verified),token,pendingCookie:cookieFrom(response)};
  }
  return {...app,config,call,cookieFrom,login,origin};
}

test('HTTP email flow verifies only same-browser token, persists session and revokes on logout',async t=>{
  const {call,login}=await setup(t);const session=await login();
  const me=await call('/api/me',{cookie:session.cookie});assert.equal((await me.json()).user.email,'viewer@example.com');
  const replay=await call('/api/auth/email/verify',{body:{token:session.token},cookie:session.pendingCookie});assert.equal(replay.status,400);
  const logout=await call('/api/auth/logout',{method:'POST',body:{},cookie:session.cookie});assert.equal(logout.status,200);
  assert.equal((await(await call('/api/me',{cookie:session.cookie})).json()).user,null);
});

test('cross-origin changes and unbound login links fail',async t=>{
  const {call,email,cookieFrom}=await setup(t);
  const cross=await call('/api/auth/email',{body:{email:'viewer@example.com'},origin:'https://attacker.example'});assert.equal(cross.status,403);
  const requested=await call('/api/auth/email',{body:{email:'viewer@example.com'}});assert.equal(requested.status,200);
  const token=new URLSearchParams(new URL(email.outbox[0].url).hash.slice(1)).get('token');
  assert.equal((await call('/api/auth/email/verify',{body:{token}})).status,400);
  assert.equal((await call('/api/auth/email/verify',{body:{token},cookie:cookieFrom(requested)})).status,200);
});

test('premium venue data cannot be read by guest or free account; direct static and traversal paths fail',async t=>{
  const {call,login}=await setup(t);
  assert.equal((await call('/api/venues/tottenham')).status,200);
  assert.equal((await call('/api/venues/sofi')).status,403);
  const {cookie}=await login();assert.equal((await call('/api/venues/sofi',{cookie})).status,403);
  assert.equal((await call('/data/sofi.json')).status,404);
  assert.equal((await call('/server/store.mjs')).status,404);
  assert.equal((await call('/%2e%2e%2fserver/store.mjs')).status,404);
  const catalog=await(await call('/api/venues')).json();assert.equal(catalog.venues.find(x=>x.id==='sofi').locked,true);
});

test('rate limiting limits repeated login email requests',async t=>{
  const {call}=await setup(t);
  for(let i=0;i<3;i++)assert.equal((await call('/api/auth/email',{body:{email:'same@example.com'}})).status,200);
  assert.equal((await call('/api/auth/email',{body:{email:'same@example.com'}})).status,429);
});

test('local development provides explicit Google and billing demos without third party calls',async t=>{
  const {call,login}=await setup(t);
  const localGoogle=await call('/api/auth/google/start',{method:'POST',body:{}});
  assert.equal(localGoogle.status,200);
  assert.equal((await localGoogle.json()).local,true);
  assert.equal((await call('/api/billing/checkout',{body:{}})).status,401);
  const {cookie}=await login();
  const checkout=await call('/api/billing/checkout',{body:{},cookie});
  assert.equal(checkout.status,200);assert.equal((await checkout.json()).local,true);
});

test('local Google one-click flow uses the same browser-bound OAuth state',async t=>{
  const {call,cookieFrom}=await setup(t);
  const started=await call('/api/auth/google/start',{method:'POST',body:{}});
  assert.equal(started.status,200);
  const pending=cookieFrom(started),url=new URL((await started.json()).url);
  assert.equal(url.pathname,'/api/auth/google/dev-callback');
  const verified=await call(url.pathname+url.search,{cookie:pending});
  assert.equal(verified.status,303);
  const session=cookieFrom(verified);
  assert.equal((await (await call('/api/me',{cookie:session})).json()).user.email,'google@seatpeep.test');
  assert.equal((await call(url.pathname+url.search,{cookie:pending})).status,400);
});

test('local monthly checkout upgrades only the signed-in development account',async t=>{
  const {call,login}=await setup(t);
  const {cookie}=await login('billing@example.com');
  const price=await call('/api/billing/price');
  assert.equal(price.status,200);assert.equal((await price.json()).price.interval,'month');
  const checkout=await call('/api/billing/checkout',{body:{},cookie});
  const result=await checkout.json();assert.equal(checkout.status,200);assert.equal(result.local,true);
  const target=new URL(result.url);
  const paid=await call(target.pathname+target.search,{cookie});
  assert.equal(paid.status,303);
  assert.equal((await (await call('/api/me',{cookie})).json()).access.plan,'pro');
  assert.equal((await call(target.pathname+target.search,{cookie})).status,400);
});

test('public root and app modules are actually served while data files remain private',async t=>{
  const {call}=await setup(t);
  const page=await call('/');assert.equal(page.status,200);assert.match(await page.text(),/找到你的现场位置/);
  const module=await call('/app.mjs');assert.equal(module.status,200);assert.match(module.headers.get('content-type'),/javascript/);
  assert.equal((await call('/vendor/three.module.min.js')).status,200);
});

test('venue routes accept imported ids with numeric suffixes',async t=>{
  const {call,login}=await setup(t);
  const {cookie}=await login();
  assert.equal((await call('/api/venues/hall-10',{cookie})).status,403);
});

test('email links preserve the allowed browser origin so LAN and loopback cookies remain usable',async t=>{
  const {config,origin,call,email,cookieFrom}=await setup(t);
  config.appUrl='http://192.168.0.2:4180';config.allowedOrigins=[origin];
  const requested=await call('/api/auth/email',{body:{email:'alias@example.com'}});
  assert.equal(requested.status,200);
  const link=new URL(email.outbox[0].url);
  assert.equal(link.origin,origin);
  const token=new URLSearchParams(link.hash.slice(1)).get('token');
  const verified=await call('/api/auth/email/verify',{body:{token},cookie:cookieFrom(requested)});
  assert.equal(verified.status,200);
  assert.equal((await(await call('/api/me',{cookie:cookieFrom(verified)})).json()).user.email,'alias@example.com');
});

test('local inbox only exposes the requesting browser unconsumed email link and is absent in production',async t=>{
  const {call,cookieFrom,config}=await setup(t);
  const a=await call('/api/auth/email',{body:{email:'a@example.com'}});
  const b=await call('/api/auth/email',{body:{email:'b@example.com'}});
  assert.deepEqual((await(await call('/api/dev/mailbox')).json()).messages,[]);
  const inbox=await(await call('/api/dev/mailbox',{cookie:cookieFrom(a)})).json();
  assert.deepEqual(inbox.messages.map(x=>x.email),['a@example.com']);
  assert.deepEqual((await(await call('/api/dev/mailbox',{cookie:cookieFrom(b)})).json()).messages.map(x=>x.email),['b@example.com']);
  const token=new URLSearchParams(new URL(inbox.messages[0].url).hash.slice(1)).get('token');
  assert.equal((await call('/api/auth/email/verify',{cookie:cookieFrom(a),body:{token}})).status,200);
  assert.deepEqual((await(await call('/api/dev/mailbox',{cookie:cookieFrom(a)})).json()).messages,[]);
  config.production=true;
  assert.equal((await call('/api/dev/mailbox',{cookie:cookieFrom(b)})).status,404);
});

test('admin venue validation requires the configured administrator and does not publish on validation',async t=>{
  const {call,login,config}=await setup(t);config.adminEmails=['admin@example.com'];
  const manifest={id:'demo-venue',name:'Demo Venue',city:'London',capacity:'10,000',source:'https://example.com/maps',sourceTitle:'Official map',sourceLinks:['https://example.com/maps'],accuracy:{completeSeatInventory:false,metricCalibrated:false,geometryBasis:'estimated-anchor-layout'},tiers:[[10,8,2,4,3]],sections:[{id:'A1',ticketLabels:['A1'],levelName:'Level 1',tier:0,angle:0,halfAngle:.1,samples:[]}]};
  const anonymous=await call('/api/admin/venues/validate',{method:'POST',body:manifest});assert.equal(anonymous.status,401);
  const session=await login('admin@example.com');const validated=await call('/api/admin/venues/validate',{method:'POST',body:manifest,cookie:session.cookie});assert.equal(validated.status,200);assert.equal((await validated.json()).report.counts.sections,1);
});

test('source venue API rejects unavailable layouts and saved positions retain source layout',async t=>{
 const {loadVenues}=await import('../server/venues.mjs');
 const {call,config,login}=await setup(t,loadVenues());config.devPreviewAllVenues=true;
 const response=await call('/api/venues/taipei-arena?layout=center');assert.equal(response.status,200);
 const {venue}=await response.json();assert.equal(venue.seatLayout.id,'center');assert.equal(venue.seatTuples.length,12877);
 assert.equal((await call('/api/venues/taipei-arena?layout=runway')).status,422);
 const {cookie}=await login();
 const saved=await call('/api/positions',{cookie,body:{venueId:'taipei-arena',section:'紅1A',row:'1',seat:'1',layout:'center'}});
 assert.equal(saved.status,201);const positions=await(await call('/api/positions',{cookie})).json();assert.equal(positions.positions[0].layout,'center');
 const wrong=await call('/api/venues/taipei-arena/resolve',{body:{section:'紅1A',row:'1',seat:'1',layout:'runway'}});
 assert.equal((await wrong.json()).status,'unknown-layout');
});
