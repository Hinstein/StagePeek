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
const ids=['kyocera-dome','philippine-arena'];

test('Osaka and Philippines share section-only models without public release or ticket identities',()=>{
 const published=releasedVenues(views);assert.equal(published.catalog().length,39);
 for(const [i,id] of ids.entries()){
  const venue=views.venues.get(id),records=baseSeatRecords(venue);
  assert.equal(venue.sections.length,[52,80][i]);assert.ok(records.length>10000);
  assert.equal(presentConcertVenue(venue).country,['日本','菲律宾'][i]);
  assert.equal(venue.researchOnly,true);assert.equal(venue.publicationStatus,'not-published');
  assert.equal(venue.accuracy.metricCalibrated,false);assert.equal(venue.accuracy.completeSeatInventory,false);
  assert.deepEqual(stageRects('end',venue),[]);assert.equal(venue.sourceSeats,undefined);
  assert.equal(published.get(id),null);assert.equal(loadConcertViews().venues.get(id),null);
  assert.equal(views.venues.resolve(id,{section:venue.sections[0].id,row:'1',seat:'1'}).status,'unverified');
  assert.ok(records.every(r=>r.visualOnly&&r.sourceSeat===false&&!('row' in r)&&!('seat' in r)&&!('ticket' in r)&&!('position' in r)));
 }
});

test('Philippine section transcription replaces synthetic labels only in the private model',()=>{
 const retained=JSON.parse(read('data/venues.json')).venues['philippine-arena'];
 assert.equal(retained.sections.length,36);assert.equal(retained.sections[0].id,'L1-01');
 const model=JSON.parse(read('data/concert-views/artist-models/philippine-arena.json'));
 assert.equal(createHash('sha256').update(read(model.source.path)).digest('hex'),model.source.sha256);
 const venue=views.venues.get('philippine-arena');
 const expected=[[103,113],[203,221],[303,322],[404,433]].flatMap(([first,last])=>Array.from({length:last-first+1},(_,i)=>String(first+i)));
 assert.deepEqual(venue.sections.map(s=>s.id),expected);
 assert.ok(venue.sections.every(s=>s.samples.length===0&&s.positionBasis.kind==='operator-curated-anchor'));
 for(const tier of [0,1,2,3]){
  const peers=venue.sections.filter(s=>s.tier===tier).sort((a,b)=>a.angle-b.angle);
  assert.ok(peers.every(s=>s.angle>=-Math.PI/2&&s.angle<=Math.PI/2));
  for(let i=1;i<peers.length;i++)assert.ok(peers[i].angle-peers[i-1].angle>sectionRenderHalfAngle(venue,peers[i])+sectionRenderHalfAngle(venue,peers[i-1]));
 }
});

test('artist-specific charts bind the four evidenced dates and preserve seated versus standing floor behavior',()=>{
 for(const [i,id] of ids.entries()){
  const recipe=manifest.references.find(r=>r.venueId===id);
  assert.deepEqual(recipe.event.dates,i?['2027-05-15','2027-05-16']:['2027-01-19','2027-01-20']);
  const draft=views.previews.get(recipe.id,{includeLocal:true}),venue=views.venues.get(id);
  assert.equal(views.previews.get(recipe.id),null);assert.equal(draft.venueModel.sha256,venue.referenceModel.sha256);
  assert.deepEqual(draft.audit.modelEnvelopeOutsideVertices,[]);assert.deepEqual(draft.audit.seatEnvelopeConflicts,[]);
  assert.equal(draft.registration.allowPublication,false);assert.equal(draft.registration.allowDistances,false);
  const model=sourceEventDisplayDraft(venue,draft);
  assert.equal(model.stage.length,1);
  assert.equal(model.floorViews.length,i?1:0);
  if(i){
   assert.equal(model.floorChairs.length,0);
   assert.ok(inside([model.floorViews[0].p[0],model.floorViews[0].p[2]],model.zones[0].polygon));
   assert.match(recipe.event.bindingNote,/May 18 is not assigned/);
  }
  if(!i){
   assert.equal(model.zones.length,3);assert.ok(model.floorChairs.length>1000);
   for(const chair of model.floorChairs){
    assert.ok(chair.visualOnly&&chair.sourceSeat===false&&!('seat' in chair));
    assert.ok(eventChairFootprint(chair).every(p=>inside(p,model.zones.find(z=>z.id===chair.zoneId).polygon)));
   }
  }
 }
});
