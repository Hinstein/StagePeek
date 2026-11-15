import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {readFileSync} from 'node:fs';
import {openStore} from '../server/store.mjs';
import {createApplication} from '../server/app.mjs';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {releasedVenues} from '../server/concert-views/release.mjs';
import {sourceBowlDisplay} from '../public/concert-views/source-bowl-display.mjs';
import {validPolygon,inside} from '../server/concert-views/ticket-map-draft.mjs';
import {baseSeatRecords,sectionRenderHalfAngle} from '../public/concert-views/geometry.mjs';

const views=loadConcertViews({localDrafts:true}),venues=releasedVenues(views);
const regional=JSON.parse(readFileSync(new URL('../data/concert-views/regional-drafts.json',import.meta.url))).venueIds;

test('release replaces old inventory with the explicit rebuilt catalog',()=>{
 assert.equal(venues.ids().length,39);assert.equal(venues.catalog().length,39);
 const released=JSON.parse(readFileSync(new URL('../data/concert-views/release.json',import.meta.url))).venueIds;
 assert.deepEqual(venues.ids().sort(),[...released].sort());
 for(const id of regional){
  assert.ok(views.venues.get(id),id+' draft remains available locally');
  assert.equal(Boolean(venues.get(id)),released.includes(id),id+' release requires explicit selection');
 }
 for(const id of ['sofi','metlife','tottenham',...JSON.parse(readFileSync(new URL('../data/concert-views/archived.json',import.meta.url))).venues.map(v=>v.id)]){
  assert.equal(venues.get(id),null);assert.equal(venues.resolve(id,{}).status,'unknown-venue');
 }
 assert.throws(()=>venues.publish({}),e=>e.code==='RELEASE_REVIEW_REQUIRED');
});

test('regional estimated sections do not overlap or create seats outside named sections',()=>{
 for(const id of regional){
  const venue=views.venues.get(id);
  if(venue.sourceSeats?.length)continue;
  const records=baseSeatRecords(venue);
  assert.ok(records.length>0||venue.sections.every(s=>s.kind==='standing'),id);
  assert.ok(records.every(r=>venue.sections.some(s=>s.id===r.section)),id);
  assert.ok(records.every(r=>r.visualOnly===true&&r.sourceSeat===false&&!('row' in r)&&!('seat' in r)&&!('position' in r)),id+' estimated chairs cannot acquire source tickets');
  for(const section of venue.sections.filter(s=>!s.block&&s.kind!=='standing')){
   const peers=venue.sections.filter(s=>s!==section&&s.kind!=='standing'&&s.tier===section.tier&&(s.radialStart??0)===(section.radialStart??0)&&(s.radialEnd??1)===(section.radialEnd??1));
   for(const peer of peers){
    const gap=Math.abs(Math.atan2(Math.sin(section.angle-peer.angle),Math.cos(section.angle-peer.angle)));
    assert.ok(sectionRenderHalfAngle(venue,section)+sectionRenderHalfAngle(venue,peer)<gap,`${id}/${section.id}/${peer.id}`);
   }
  }
 }
});

test('every retained regional layout has finite structural geometry and supports its original seats',()=>{
 for(const id of regional){
  const base=views.venues.get(id);
  for(const layout of base.seatLayouts||[{id:null}]){
   const venue=views.venues.get(id,layout.id),model=sourceBowlDisplay(venue);
   if(!venue.sourceSeats?.length){assert.ok(venue.sections.length>0,id);continue;}
   assert.ok(model,id);assert.equal(model.records.length,venue.sourceSeats.length,id);
   assert.deepEqual(model.records.map(r=>[r.section,r.row,r.seat,r.p]),venue.sourceSeats.map(r=>[r.section,r.row,r.seat,r.position]),id);
   for(const q of model.treads){assert.ok(q.flat().every(Number.isFinite),id);assert.ok(validPolygon(q.map(([x,,z])=>[x,z])),id);}
   const rows=Map.groupBy(model.rows,r=>JSON.stringify([r.section,r.level,r.row]));
   for(const r of model.records)assert.ok(rows.get(JSON.stringify([r.section,r.level,r.row]))?.some(row=>row.treads.some(q=>inside([r.p[0],r.p[2]],q.map(([x,,z])=>[x,z])))),`${id}/${layout.id}/${r.section}/${r.row}/${r.seat}`);
  }
 }
});

test('Coliseum structural terraces close sparse ticket gaps without adding tickets',()=>{
 for(const layout of ['center','end']){
  const venue=venues.get('hong-kong-coliseum',layout),model=sourceBowlDisplay(venue);
  assert.ok(model.concourse.length>1000);
  assert.equal(model.records.length,venue.sourceSeats.length);
  assert.equal(model.supplements.length,0);
  if(layout==='end')assert.ok(model.concourse.every(q=>q.every(p=>p[1]>0)),'floor blocks must not become a closed structural ring');
  for(const q of model.concourse){assert.ok(q.flat().every(Number.isFinite));assert.ok(validPolygon(q.map(([x,,z])=>[x,z])));}
  const y=venue.sourceSeats.find(s=>s.level==='1').position[1]-.075;
  const ring=model.concourse.filter(q=>q.every(p=>Math.abs(p[1]-y)<1e-8));
  for(let i=0;i<192;i++){
   const angle=-Math.PI+(i+.5)*Math.PI*2/192;
   assert.ok(ring.some(q=>{const a=Math.atan2(q[0][0],q[0][2]),b=Math.atan2(q[1][0],q[1][2]);return angle>=a-1e-6&&angle<=b+1e-6;}),'every azimuth retains a structural tread');
  }
 }
 assert.equal(sourceBowlDisplay(venues.get('taipei-arena')).concourse.length,0,'open layouts do not inherit the closed-bowl foundation');
});

test('released public scene preserves subscription access and hides unselected data',async t=>{
 const db=openStore(':memory:');
 const config={appUrl:'http://127.0.0.1',allowedOrigins:[],authMode:'local',production:false};
 const app=createApplication({db,config,venues,concertViews:views});
 app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
 config.appUrl=`http://127.0.0.1:${app.server.address().port}`;
 t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));await db.close();});
 const get=(path,session)=>fetch(config.appUrl+path,{redirect:'manual',headers:session?{Cookie:'ss_session='+session}:{}});
 const catalog=await(await get('/api/venues')).json();assert.equal(catalog.venues.length,39);
 const freeCount=catalog.venues.filter(v=>!v.locked).length;
 assert.match(await(await get('/')).text(),new RegExp(`${freeCount} selected venues are free`));
 assert.deepEqual(catalog.venues.map(v=>v.id).sort(),venues.ids().sort());
 for(const path of ['/explore','/zh-CN/explore','/zh-TW/explore','/ja/explore','/ko/explore'])assert.match(await(await get(path)).text(),/stagepeek-viewer-mode" content="public/);
 assert.equal((await get('/concert-views/app.mjs')).status,200);
 for(const path of ['/api/concert-views/venues','/api/concert-views/hydro/ovo-hydro/image','/api/venues/sofi','/api/viewer/hydro/ovo-hydro/image'])assert.equal((await get(path)).status,404,path);
 assert.equal((await get('/api/venues/taipei-arena?layout=center')).status,200);
 assert.equal((await get('/api/viewer/hydro/ovo-hydro')).status,403);
 const user=await app.auth.consumeEmail((await app.auth.issueEmail('release-test@example.invalid')).token);
 await db.prepare('INSERT INTO subscriptions(id,user_id,status,period_end,cancel_at_period_end,price_id) VALUES(?,?,?,?,?,?)').run('release-test',user.id,'active',Date.now()+3600000,0,'test');
 const session=await app.auth.createSession(user.id);
 for(const id of venues.ids())assert.equal((await get('/api/venues/'+id,session)).status,200,id);
 const hydro=await get('/api/viewer/hydro/ovo-hydro',session);assert.equal(hydro.status,200);
 assert.equal((await hydro.json()).venue.id,'ovo-hydro');
 assert.equal((await get('/api/me',session)).status,200);
});
