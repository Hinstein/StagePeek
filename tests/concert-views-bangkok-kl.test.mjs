import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {releasedVenues} from '../server/concert-views/release.mjs';
import {presentConcertVenue} from '../server/concert-views/presentation.mjs';
import {baseSeatRecords,stageRects,sectionRenderHalfAngle} from '../public/concert-views/geometry.mjs';
import {sourceEventDisplayDraft,eventChairFootprint} from '../public/concert-views/source-event-display.mjs';
import {inside} from '../server/concert-views/ticket-map-draft.mjs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url));
const views=loadConcertViews({localDrafts:true});
const manifest=JSON.parse(read('data/research-events/artist-led-2026-11-13/references.json'));
const ids=['rajamangala','bukit-jalil'];

test('Bangkok and Kuala Lumpur remain private chart-labelled models, without invented tickets',()=>{
 const released=releasedVenues(views);assert.equal(released.catalog().length,39);
 for(const [i,id] of ids.entries()){
  const venue=views.venues.get(id),retained=JSON.parse(read('data/venues.json')).venues[id];
  assert.equal(retained.sections.length,36);assert.equal(retained.sections[0].id,'L1-01');
  assert.equal(venue.sections.length,[100,112][i]);
  assert.equal(presentConcertVenue(venue).country,['泰国','马来西亚'][i]);
  assert.equal(released.get(id),null);assert.equal(loadConcertViews().venues.get(id),null);
  assert.deepEqual(stageRects('end',venue),[]);
  assert.equal(venue.publicationStatus,'not-published');assert.equal(venue.accuracy.metricCalibrated,false);
  assert.equal(venue.accuracy.completeSeatInventory,false);assert.equal(venue.sourceSeats,undefined);
  assert.ok(baseSeatRecords(venue).every(r=>r.visualOnly&&r.sourceSeat===false&&!('row' in r)&&!('seat' in r)&&!('position' in r)&&!('ticket' in r)));
  assert.equal(views.venues.resolve(id,{section:venue.sections[0].id,row:'1',seat:'1'}).status,'unverified');
 }
});

test('transcribed section names, chart hashes and radial gaps are retained',()=>{
 for(const id of ids){
  const model=JSON.parse(read(`data/concert-views/artist-models/${id}.json`));
  for(const source of [model.source,model.transcription])assert.equal(createHash('sha256').update(read(source.path)).digest('hex'),source.sha256);
  const venue=views.venues.get(id);
  assert.equal(new Set(venue.sections.map(s=>s.id)).size,venue.sections.length);
  for(const tier of [0,1,2]){
   const peers=venue.sections.filter(s=>s.tier===tier).sort((a,b)=>a.angle-b.angle);
   for(let i=0;i<peers.length;i++){
    const a=peers[i],b=peers[(i+1)%peers.length];
    const gap=(b.angle-a.angle+2*Math.PI)%(2*Math.PI);
    assert.ok(gap>sectionRenderHalfAngle(venue,a)+sectionRenderHalfAngle(venue,b));
   }
  }
 }
 const kl=views.venues.get('bukit-jalil');
 for(const id of ['131A','201A','201B','327A','327B','334'])assert.ok(kl.sections.some(s=>s.id===id));
 for(const id of ['201','301','310','318','327'])assert.ok(!kl.sections.some(s=>s.id===id));
 assert.ok(views.venues.get('rajamangala').sections.some(s=>s.id==='W1SA'));
});

test('official events preserve the end-stage mixed floor and 360-degree all-seated distinction',()=>{
 for(const [i,id] of ids.entries()){
  const recipe=manifest.references.find(r=>r.venueId===id),venue=views.venues.get(id);
  assert.deepEqual(recipe.event.dates,i?['2026-12-12','2026-12-13']:['2027-04-24','2027-04-25']);
  const draft=views.previews.get(recipe.id,{includeLocal:true});
  assert.equal(views.previews.get(recipe.id),null);assert.equal(draft.venueModel.sha256,venue.referenceModel.sha256);
  assert.equal(draft.registration.allowPublication,false);assert.equal(draft.registration.allowDistances,false);
  assert.deepEqual(draft.audit.modelEnvelopeOutsideVertices,[]);assert.deepEqual(draft.audit.seatEnvelopeConflicts,[]);
  const display=sourceEventDisplayDraft(venue,draft);
  assert.equal(display.stage.length,i?5:1);assert.equal(display.zones.length,i?58:17);
  assert.equal(display.floorViews.length,i?0:1);assert.ok(display.floorChairs.length>1000);
  assert.ok(display.zones.every(z=>i?z.seating==='illustrative':z.id==='st'||z.seating==='illustrative'));
  for(const chair of display.floorChairs){
   assert.ok(chair.visualOnly&&chair.sourceSeat===false&&!('seat' in chair)&&!('row' in chair));
   const footprint=eventChairFootprint(chair);
   assert.ok(footprint.every(p=>inside(p,display.zones.find(z=>z.id===chair.zoneId).polygon)));
   for(const shape of [...display.stage,...display.equipment])assert.ok(footprint.every(p=>!inside(p,shape.polygon)));
  }
  if(i){
   assert.equal(new Set(display.floorChairs.map(c=>c.angle)).size,4);
   for(const chair of display.floorChairs)assert.equal(chair.angle,{A:0,B:-Math.PI/2,C:Math.PI,D:Math.PI/2}[chair.label[0]]);
  }
  if(!i)assert.ok(inside([display.floorViews[0].p[0],display.floorViews[0].p[2]],display.zones.find(z=>z.id==='st').polygon));
 }
});

test('Kuala Lumpur PNG preserves the original WebP provenance without signed URL queries',()=>{
 const recipe=manifest.references.find(r=>r.venueId==='bukit-jalil');
 const source=recipe.source.derivation.source;
 assert.equal(createHash('sha256').update(read(source.path)).digest('hex'),source.sha256);
 assert.equal(new URL(source.url).search,'');
 assert.equal(views.previews.artifact(recipe.id,{includeLocal:true}).contentType,'image/png');
});
