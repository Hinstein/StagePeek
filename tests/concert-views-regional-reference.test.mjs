import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {baseSeatRecords,stageRects} from '../public/concert-views/geometry.mjs';
import {sourceBowlDisplay} from '../public/concert-views/source-bowl-display.mjs';
import {venueName,venueRegion} from '../public/translations/venue-labels.mjs';
const directory=new URL('../data/concert-views/regional-sources/',import.meta.url);
const index=JSON.parse(readFileSync(new URL('index.json',directory))).venues;
const views=loadConcertViews({localDrafts:true});

test('every regional layout loads through the actual scene API, including estimated and standing venues',async()=>{
 const ids=JSON.parse(readFileSync(new URL('../data/concert-views/regional-drafts.json',import.meta.url))).venueIds;
 for(const id of ids)for(const layout of views.venues.get(id).seatLayouts||[{id:'end'}]){
  const response={setHeader(){},writeHead(status){this.status=status;},end(body){this.body=JSON.parse(body);}};
  await views.handle({method:'GET'},response,new URL(`http://localhost/api/concert-views/venues/${id}?layout=${layout.id}`));
  assert.equal(response.status,200,`${id}/${layout.id}`);
  assert.equal(response.body.venue.id,id);
  assert.equal(response.body.venue.seatTuples?.length||0,views.venues.get(id,layout.id).sourceSeats?.length||0);
 }
});

test('regional conversion retains source tuples, raw hash and ticket identities for every layout',()=>{
 for(const [id,meta] of Object.entries(index)){
  assert.equal(meta.assetSha256,createHash('sha256').update(readFileSync(new URL('raw/'+id+'.json',directory))).digest('hex'));
  assert.equal(loadConcertViews().venues.get(id),null);
  const asset=JSON.parse(readFileSync(new URL(id+'.json',directory)));
  for(const layout of meta.layouts){
   const v=views.venues.get(id,layout.id),raw=asset.variants[layout.id];
   assert.equal(v.sourceSeats.length,layout.count,id);assert.equal(v.sections.length,layout.sectionCount,id);
   const records=baseSeatRecords(v);
   assert.equal(records.length,raw.seats.length,id);
   for(const [i,r] of records.entries()){
    assert.deepEqual([r.section,r.row,r.seat,r.p],[String(raw.seats[i][0]),String(raw.seats[i][1]),String(raw.seats[i][2]),raw.seats[i].slice(3,6)]);
    assert.equal(r.sourceRecord.index,i);assert.equal(r.sourceRecord.assetSha256,meta.assetSha256);
   }
   if(records.length)assert.equal(sourceBowlDisplay(v).records.length,records.length);
   for(const part of stageRects(layout.id,v))assert.ok([part.x,part.z,part.w,part.d,part.h].every(Number.isFinite),id);
   assert.ok(v.geometry.floor.every(n=>Number.isFinite(n)&&n>12),id);
  }
 }
});

test('standing areas have shared polygons and viewpoints, never fake seats or tickets',()=>{
 for(const id of ['westar-taipei','legacy-tera-taipei','moondog-taipei','sub-live-taipei']){
  const v=views.venues.get(id);
  assert.equal(baseSeatRecords(v).length,0,id);
  assert.ok(v.sections.length>0);
  for(const s of v.sections){
   assert.equal(s.kind,'standing');assert.ok(s.polygon.flat().every(Number.isFinite));assert.ok(s.center.every(Number.isFinite));assert.deepEqual(s.samples,[]);
   const found=views.venues.resolve(id,{section:s.id,row:'1',seat:'1'});
   assert.equal(found.status,'unverified');assert.equal(found.position,null);
  }
 }
});

test('Zepp seated and standing variants cannot mix the first-floor chair grid and GA area',()=>{
 const standing=views.venues.get('zepp-new-taipei'),seated=views.venues.get('zepp-new-taipei','end');
 assert.equal(standing.seatLayout.id,'standing');assert.equal(standing.sourceSeats.length,291);
 assert.ok(standing.sourceSeats.every(s=>s.level==='2F'));
 assert.equal(standing.sections.filter(s=>s.kind==='standing').length,1);
 assert.equal(seated.sourceSeats.length,1025);assert.equal(seated.sourceZones.length,0);
 assert.ok(seated.sections.every(s=>s.kind!=='standing'));
});

test('new venues reuse localized names and Taiwan grouping without changing ticket labels',()=>{
 for(const id of Object.keys(index))for(const locale of ['en','zh-CN','zh-TW','ja','ko']){
  const v={...views.venues.get(id),country:'台湾'};
  assert.ok(venueName(v,locale));assert.ok(venueRegion(v,locale));
  if(locale==='en')assert.doesNotMatch(venueName(v,locale),/[\u4e00-\u9fff]/);
 }
});

test('shared renderer omits empty chair batches for standing-only venues and retains seated instances',async()=>{
 const THREE=await import('../public/vendor/three.module.min.js');
 const source=readFileSync(new URL('../public/concert-views/viewer.mjs',import.meta.url),'utf8');
 const place=new Function('THREE','records','world','dummy','vec','material','palette',source.slice(source.indexOf('    const placeInstances='),source.indexOf('    // O2 keeps'))+';return placeInstances;');
 for(const id of ['westar-taipei','sub-live-taipei','taipei-city-stage']){
  const records=baseSeatRecords(views.venues.get(id)),world=new THREE.Group(),meshes=[];
  place(THREE,records,world,new THREE.Object3D(),p=>new THREE.Vector3(...p),()=>new THREE.MeshBasicMaterial(),{})([new THREE.BoxGeometry(1,1,1)],meshes);
  assert.equal(meshes.length,records.length?1:0,id);
  if(records.length){assert.equal(meshes[0].count,records.length);meshes[0].setColorAt(0,new THREE.Color('purple'));assert.ok(meshes[0].instanceColor);}
 }
});
