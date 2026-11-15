import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {once} from 'node:events';
import {Readable} from 'node:stream';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {releasedVenues} from '../server/concert-views/release.mjs';
import {buildTicketMapReference,digest,seatDigest} from '../server/concert-views/ticket-map-draft.mjs';
import {o2EventDisplayDraft} from '../public/concert-views/o2-display.mjs';
import {openStore} from '../server/store.mjs';
import {createApplication} from '../server/app.mjs';

const views=loadConcertViews({localDrafts:true});
const manifest=JSON.parse(readFileSync(new URL('../data/research-events/regional-concert-maps-2026-11-12/references.json',import.meta.url)));
const readSource=path=>readFileSync(new URL('../'+path,import.meta.url));

test('twenty-one real event charts retain source bytes, dates, layout binding and untouched seats',()=>{
 assert.equal(manifest.references.length,21);
 for(const recipe of manifest.references){
  const venue=views.venues.get(recipe.venueId,recipe.seatLayoutId),before=seatDigest(venue.sourceSeats);
  const draft=views.previews.get(recipe.id,{includeLocal:true});assert.ok(draft,recipe.id);
  assert.equal(draft.displayMode,'reference-only');assert.deepEqual(draft.event,recipe.event);
  assert.equal(draft.fixedSeats.identityPositionSha256,before);
  for(const source of [draft.source,draft.eventSource])assert.equal(digest(readSource(source.path)),source.sha256);
  if(draft.source.derivation){
   const original=draft.source.derivation.original;
   assert.equal(digest(readSource(original.path)),original.sha256);
   assert.match(readSource(original.path).toString(),/^<svg[\s>]/);
   assert.match(draft.source.derivation.actor,/Codex/);
  }
  assert.equal(draft.registration.allowPublication,false);assert.equal(draft.registration.allowDistances,false);
  assert.deepEqual([draft.stage,draft.zones,draft.equipment,draft.temporarySeats],[[],[],[],[]]);
  assert.equal(o2EventDisplayDraft(venue,draft),null,'unregistered chart must not produce any 2D/3D overlay');
  assert.equal(seatDigest(venue.sourceSeats),before);
  assert.ok(views.previews.artifact(recipe.id,{includeLocal:true}).bytes.length>10000);
 }
 assert.deepEqual(views.previews.get('tmc-atarayo-20261219',{includeLocal:true}).event.dates,['2026-12-19']);
 assert.deepEqual(views.previews.get('nch-mco-20261122',{includeLocal:true}).event.dates,['2026-11-22']);
 assert.equal(views.previews.get('kaitak-straykids-20261205',{includeLocal:true}).seatLayoutId,'bowl');
 assert.deepEqual(views.previews.get('clapper-victon-20261211',{includeLocal:true}).event.dates,['2026-12-11']);
 assert.deepEqual(views.previews.get('tpac-globe-agong-20260118',{includeLocal:true}).event.dates,['2026-01-18']);
 assert.equal(views.previews.get('tpac-globe-agong-20260118',{includeLocal:true}).venueId,'taipei-pac-globe-playhouse');
 assert.deepEqual(views.previews.get('tpac-grand-acg-20261213',{includeLocal:true}).event.dates,['2026-12-13']);
 assert.equal(views.previews.get('tttc-nco-20261205',{includeLocal:true}).venueId,'taiwan-traditional-theatre-center-grand-theater');
 const jessica=views.previews.get('ntu-jessica-20270220',{includeLocal:true});
 assert.deepEqual(jessica.event.dates,['2027-02-20'],'official postponement supersedes the stale October date');
 assert.equal(jessica.venueId,'ntu-sports-center');
 for(const day of [27,28,29]){
  const gigi=views.previews.get('hkc-gigi-202611'+day,{includeLocal:true});
  assert.deepEqual(gigi.event.dates,['2026-11-'+day]);
  assert.equal(gigi.venueId,'hong-kong-coliseum');
  assert.match(gigi.event.bindingNote,/partial sectional preview/);
 }
 assert.equal(new Set([27,28,29].map(day=>views.previews.get('hkc-gigi-202611'+day,{includeLocal:true}).source.sha256)).size,3,'date-specific charts must not collapse into one source');
 const lesmis=views.previews.get('nt-lesmis-20250627',{includeLocal:true});
 assert.deepEqual(lesmis.event.dates,['2025-06-27']);
 assert.equal(lesmis.venueId,'national-theater-taipei');
 assert.match(lesmis.event.bindingNote,/Secondary archived reproduction/);
 assert.match(lesmis.source.url,/^https:\/\/cpok.tw\//);
 const riize=views.previews.get('viva-riize-20240601',{includeLocal:true});
 assert.equal(riize.venueId,'asiaworld-viva');assert.equal(riize.seatLayoutId,'end');
 assert.deepEqual(riize.event.dates,['2024-06-01']);
 assert.match(riize.event.bindingNote,/Hall 8 & 10/);
 assert.match(riize.source.url,/^https:\/\/www.asiaworld-expo.com\//);
 const rene=views.previews.get('taipei-rene-20261205',{includeLocal:true});assert.equal(rene.seatLayoutId,'center');
 assert.equal(views.previews.get('taipei-accusefive-20261106',{includeLocal:true}).seatLayoutId,'end');
 assert.deepEqual(views.previews.get('runway-donghae-20260627',{includeLocal:true}).event.dates,['2026-06-27','2026-06-28']);
 assert.deepEqual(views.previews.get('zepp-karencici-20261127',{includeLocal:true}).event.dates,['2026-11-27']);
});

test('reference importer rejects changed source bytes and a wrong venue/layout binding',()=>{
 const recipe=manifest.references[0],venue=views.venues.get(recipe.venueId,recipe.seatLayoutId);
 assert.throws(()=>buildTicketMapReference(recipe,{venue,readSource:()=>Buffer.from('not the downloaded chart')}),/hash mismatch/);
 assert.throws(()=>buildTicketMapReference(recipe,{venue:views.venues.get(recipe.venueId,'center'),readSource}),/binding mismatch/);
});

test('new local references stay out of default preview APIs while the original ten remain available',()=>{
 for(const recipe of manifest.references){
  assert.equal(views.previews.get(recipe.id),null);assert.equal(views.previews.artifact(recipe.id),null);
  assert.ok(!views.previews.list(recipe.venueId).some(e=>e.id===recipe.id));
  assert.ok(views.previews.list(recipe.venueId,{includeLocal:true}).some(e=>e.id===recipe.id));
 }
 const index=JSON.parse(readSource('data/research-events/ticket-map-pipeline/index.json'));
 const retained=index.layouts.filter(e=>!e.localOnly);assert.equal(retained.length,10);
 for(const entry of retained)assert.equal(views.previews.get(entry.id).version,entry.sha256);
});

test('private event routes expose the correct reference card and immutable original image',async()=>{
 for(const recipe of manifest.references){
  async function get(path){
   const req=Readable.from([]);req.method='GET';
   const res={headers:{},setHeader(k,v){this.headers[k]=v;},writeHead(status,headers){this.status=status;Object.assign(this.headers,headers);},end(body){this.body=body;}};
   await views.handle(req,res,new URL(path,'http://localhost'));return res;
  }
  const events=JSON.parse((await get('/api/concert-views/venues/'+recipe.venueId+'/events')).body);
  const event=events.researchConcerts.find(e=>e.id===recipe.id);
  assert.equal(event.ticketMapDraft.displayMode,'reference-only');assert.equal(event.ticketMapDraft.seatLayoutId,recipe.seatLayoutId);
  assert.deepEqual(event.dates,recipe.event.dates);
  const image=await get('/api/concert-views/ticket-map-previews/'+recipe.id+'/image');
  assert.equal(image.status,200);assert.match(image.headers['Content-Type'],/^image\//);
  assert.equal(digest(image.body),recipe.source.sha256);
 }
});

test('released HTTP routes cannot reveal unreviewed local event maps',async t=>{
 const db=openStore(':memory:');
 const config={appUrl:'http://127.0.0.1',allowedOrigins:[],authMode:'local',production:false};
 const app=createApplication({db,config,venues:releasedVenues(views),concertViews:views});
 app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
 config.appUrl=`http://127.0.0.1:${app.server.address().port}`;
 t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));await db.close();});
 const get=path=>fetch(config.appUrl+path);
 for(const recipe of manifest.references){
  assert.equal((await get('/api/viewer/ticket-map-previews/'+recipe.id)).status,404);
  assert.equal((await get('/api/concert-views/ticket-map-previews/'+recipe.id+'/image')).status,404);
 }
 const events=await(await get('/api/venues/taipei-arena/events')).json();
 assert.deepEqual(events.researchConcerts,[]);
});
