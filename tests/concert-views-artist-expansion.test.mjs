import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {releasedVenues} from '../server/concert-views/release.mjs';
import {curveSeatReference,seatRanges} from '../scripts/curve-seat-reference.mjs';
import {baseSeatRecords,stageRects} from '../public/concert-views/geometry.mjs';
import {sourceBowlDisplay} from '../public/concert-views/source-bowl-display.mjs';
import {buildTicketMapReference,buildTicketMapDraft,inside,validPolygon,seatDigest} from '../server/concert-views/ticket-map-draft.mjs';
import {sourceEventDisplayDraft,eventChairFootprint} from '../public/concert-views/source-event-display.mjs';
import {loadTicketMapPreviews} from '../server/concert-views/ticket-map-previews.mjs';
import {presentConcertVenue} from '../server/concert-views/presentation.mjs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url));
const views=loadConcertViews({localDrafts:true});
const raw=JSON.parse(read('data/concert-views/regional-sources/raw/kaohsiung-national.json')).geometry;

test('retained seat ranges preserve gaps and reject overlapping identities',()=>{
 assert.deepEqual([...seatRanges('1-2:89-80;5:16-12,5-1')],[[1,[[80,89]]],[2,[[80,89]]],[5,[[12,16],[1,5]]]]);
 assert.throws(()=>seatRanges('1:1-5,3-7'),/Overlapping/);
 assert.throws(()=>seatRanges('1:1-5;1:7-9'),/Duplicate/);
 assert.throws(()=>seatRanges('1:unknown'),/Invalid/);
});

test('curve conversion retains every supplied identity without filling missing sections or seat gaps',()=>{
 const result=curveSeatReference(raw),expected=[];
 // Independent expansion of the retained textual numbering, not the converter's parser.
 for(const tier of raw.tiers)for(const section of tier.sections)for(const group of (section.seats||'').split(';').filter(Boolean)){
  const [rows,numbers]=group.split(':'),r=rows.split('-').map(Number);
  for(let row=r[0];row<=(r[1]??r[0]);row++)for(const range of numbers.split(',')){
   const endpoints=range.split('-').map(Number);
   for(let seat=Math.min(...endpoints);seat<=Math.max(...endpoints);seat++)expected.push(JSON.stringify([section.id,String(row),seat]));
  }
 }
 const keys=result.seats.map(s=>JSON.stringify(s.slice(0,3)));
 assert.equal(keys.length,40407);assert.equal(new Set(keys).size,40407);
 assert.deepEqual([...keys].sort(),expected.sort());assert.equal(result.clipped.length,0);
 assert.deepEqual(result.excludedParts,[{tier:'UW',section:'B04',part:'main'},{tier:'UW',section:'B04',part:'strip'}]);
 assert.equal(result.seats.some(s=>s[0]==='E18'&&s[1]==='5'&&s[2]===6),false);
 assert.ok(result.seats.some(s=>s[0]==='E18'&&s[1]==='5'&&s[2]===12));
 const first=result.seats[0];assert.equal(first[4],raw.tiers[0].tread[0]);
 assert.ok(result.seats.every(s=>s.slice(3,8).every(Number.isFinite)));
});

test('Kaohsiung queries source numbering at explicitly model-derived positions, never raw measured XYZ',()=>{
 const v=views.venues.get('kaohsiung-national','end');
 assert.equal(v.sourceSeats.length,40407);assert.equal(v.sections.length,135);
 assert.equal(v.accuracy.position,'reference-model-estimate');
 const catalog=views.venues.catalog().find(x=>x.id===v.id);
 assert.equal(catalog.accuracy.position,'reference-model-estimate');
 assert.equal(catalog.accuracy.seatDataStatus,'source-numbering-derived-positions');
 assert.equal(v.accuracy.metricCalibrated,false);assert.equal(v.accuracy.completeSeatInventory,false);
 for(const sample of [v.sourceSeats[0],v.sourceSeats[20000],v.sourceSeats.at(-1)]){
  const result=views.venues.resolve(v.id,{layout:'end',section:sample.section,row:sample.row,seat:sample.seat});
  assert.equal(result.status,'matched');assert.equal(result.positionStatus,'reference-model-estimate');
  assert.equal(result.identityStatus,'source-range-reference');assert.deepEqual(result.position,sample.position);
 }
 const unknown=views.venues.resolve(v.id,{section:'E18',row:'5',seat:'6'});
 assert.equal(unknown.status,'unverified');assert.equal(unknown.position,null);
 assert.deepEqual(stageRects('end',v),[],'a generic concert stage is not BTS evidence');
 const model=sourceBowlDisplay(v);assert.equal(model.records.length,40407);assert.equal(model.supplements.length,0);
 assert.deepEqual(model.records.map(s=>s.p),v.sourceSeats.map(s=>s.position));
});

test('Tokyo and Singapore use section-only shared models with no fabricated ticket lookup or generic stage',()=>{
 for(const [id,count,country] of [['tokyo-dome',304,'日本'],['singapore-national',122,'新加坡']]){
  const v=views.venues.get(id);assert.equal(v.sections.length,count);assert.equal(v.sourceSeats,undefined);
  assert.equal(v.referenceModel.id,'end');assert.match(v.referenceModel.sha256,/^[a-f0-9]{64}$/);
  assert.equal(presentConcertVenue(v).country,country);assert.deepEqual(stageRects('end',v),[]);
  assert.equal(views.venues.resolve(id,{section:v.sections[0].id,row:'1',seat:'1'}).status,'unverified');
  const records=baseSeatRecords(v);assert.ok(records.length);assert.ok(records.every(r=>r.visualOnly&&r.sourceSeat===false));
 }
});

test('artist batch remains local; source-seat and section-model chart bindings cannot be interchanged',()=>{
 const manifest=JSON.parse(read('data/research-events/artist-led-2026-11-13/references.json'));
 const released=releasedVenues(views);assert.equal(released.catalog().length,39);
 for(const id of ['kaohsiung-national','tokyo-dome','singapore-national']){
  assert.equal(loadConcertViews().venues.get(id),null);assert.equal(released.get(id),null);
 }
 for(const recipe of manifest.references){
  const venue=views.venues.get(recipe.venueId,recipe.seatLayoutId);
  const draft=views.previews.get(recipe.id,{includeLocal:true});assert.ok(draft,recipe.id);
  assert.equal(draft.displayMode,'estimated-layout');assert.deepEqual(draft.event.dates,recipe.event.dates);
  assert.ok(draft.stage.length);assert.equal(draft.registration.allowDistances,false);
  assert.equal(views.previews.get(recipe.id),null);assert.ok(views.previews.artifact(recipe.id,{includeLocal:true}));
  if(venue.referenceModel){
   assert.equal(draft.fixedSeats,undefined);assert.equal(draft.venueModel.sha256,venue.referenceModel.sha256);
   const changed=loadTicketMapPreviews({venues:{get:()=>({...venue,referenceModel:{...venue.referenceModel,sha256:'0'.repeat(64)}})}});
   assert.equal(changed.get(recipe.id,{includeLocal:true}),null);
   assert.throws(()=>buildTicketMapReference({...recipe,seatLayoutId:'center'},{venue,readSource:read}),/binding mismatch/);
  }
 }
});

test('artist event traces preserve the bound model and provide coherent identity-free floor views',()=>{
 const manifest=JSON.parse(read('data/research-events/artist-led-2026-11-13/references.json'));
 for(const recipe of manifest.references){
  const venue=views.venues.get(recipe.venueId),before=JSON.stringify(venue);
  const draft=buildTicketMapDraft(recipe,{venue,readSource:read});
  const display=sourceEventDisplayDraft(venue,draft);
  assert.deepEqual(draft.audit.modelEnvelopeOutsideVertices,[]);
  assert.deepEqual(draft.audit.seatEnvelopeConflicts,[]);
  assert.equal(draft.registration.allowPublication,false);assert.equal(draft.registration.metricCalibrated,false);
  assert.equal(draft.registration.independentHoldoutPassed,false);assert.equal(draft.closedSections,null);
  assert.ok([...draft.stage,...draft.zones,...draft.equipment].every(s=>validPolygon(s.polygon)&&s.actor==='Codex AI'&&s.positionStatus==='estimated-registration'));
  if(venue.sourceSeats)assert.equal(draft.fixedSeats.identityPositionSha256,seatDigest(venue.sourceSeats));
  for(const chair of display.floorChairs){
   assert.ok(chair.visualOnly);assert.equal(chair.sourceSeat,false);assert.equal(chair.row,undefined);assert.equal(chair.seat,undefined);assert.equal(chair.ticket,undefined);
   const zone=display.zones.find(z=>z.id===chair.zoneId);
   assert.ok(eventChairFootprint(chair).every(p=>inside(p,zone.polygon)));
   assert.ok([...display.stage,...display.equipment].every(shape=>eventChairFootprint(chair).every(p=>!inside(p,shape.polygon))));
  }
  if(venue.id==='singapore-national'){
   assert.equal(display.floorChairs.length,0,'standing pen never becomes a seated grid');
   assert.equal(display.floorViews.length,1);assert.equal(display.equipment.length,5);
   assert.ok(inside([display.floorViews[0].p[0],display.floorViews[0].p[2]],display.zones[0].polygon));
   assert.ok([...display.stage,...display.equipment].every(shape=>!inside([display.floorViews[0].p[0],display.floorViews[0].p[2]],shape.polygon)),'standing eye must be outside stage and equipment');
   const eye=[display.floorViews[0].p[0],display.floorViews[0].p[2]],target=display.stage[0].labelPosition;
   for(let i=0;i<=100;i++)assert.ok(display.equipment.every(shape=>!inside(eye.map((v,axis)=>v+(target[axis]-v)*i/100),shape.polygon)),'standing preview must have a clear direction toward the stage');
  }else if(venue.id==='philippine-arena'){
   assert.equal(display.floorChairs.length,0);assert.equal(display.floorViews.length,1);
  }else assert.ok(display.floorChairs.length>1000);
  if(venue.id==='kaohsiung-national'){
   assert.equal(display.stage.length,5);assert.equal(display.zones.length,54);
   for(const wing of ['A','M','R','Y']){
    const zones=display.zones.filter(z=>z.seatingGroup===wing);
    assert.ok(zones.length>=13);assert.equal(new Set(zones.map(z=>z.seatingAngle)).size,1);
    assert.ok(display.floorChairs.filter(c=>zones.some(z=>z.id===c.zoneId)).every(c=>c.angle===zones[0].seatingAngle));
   }
  }
  assert.equal(JSON.stringify(venue),before);
  if(venue.referenceModel)assert.throws(()=>buildTicketMapDraft({...recipe,venueModelSha256:'0'.repeat(64)},{venue,readSource:read}),/rebind/);
 }
});
