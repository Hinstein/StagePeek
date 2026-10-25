import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadVenues} from '../server/venues.mjs';
const manifest=JSON.parse(readFileSync(new URL('../references/rea/shijiao-evidence/data-sources/seat-assets-manifest.json',import.meta.url)));
const raw=entry=>JSON.parse(readFileSync(entry.path));

test('every retained source seat uses its printed identity and original XYZ in the selected layout',()=>{
 const repo=loadVenues();let checked=0,ambiguous=0;
 for(const entry of manifest){const source=raw(entry),variants=Array.isArray(source)?{bowl:{seats:source}}:source.variants;
  for(const [layout,variant] of Object.entries(variants)){
   const venue=repo.get(entry.venue,layout);assert.equal(venue.seatLayout?.id,layout);assert.equal(venue.sourceSeats.length,variant.seats.length);
   const counts=new Map();for(const r of variant.seats){const key=JSON.stringify(r.slice(0,3).map(String));counts.set(key,(counts.get(key)||0)+1);}
   for(const [index,r] of variant.seats.entries()){
    const position=Array.isArray(source)?[-r[3],r[11],-r[4]]:r.slice(3,6),seat=venue.sourceSeats[index];
    assert.deepEqual(seat.position,position);assert.equal(seat.sourceRecord.index,index);assert.equal(seat.sourceRecord.assetSha256,entry.sha256);
    const found=repo.resolve(entry.venue,{layout,section:String(r[0]),row:String(r[1]),seat:String(r[2])});
    if(counts.get(JSON.stringify(r.slice(0,3).map(String)))>1){assert.equal(found.status,'ambiguous');ambiguous++;continue;}
    assert.equal(found.status,'matched');assert.deepEqual(found.position,position);assert.equal(found.positionStatus,'source-coordinate');checked++;
   }
   assert.equal(venue.accuracy.metricCalibrated,false);
  }
 }
 assert.equal(checked+ambiguous,138856);console.log({checked,ambiguous});
});

test('source layout boundaries never silently fall back or infer intervening seats',()=>{
 const repo=loadVenues(),id='taipei-arena';
 assert.equal(repo.get(id,'runway'),null);
 assert.equal(repo.resolve(id,{layout:'runway',section:'紅1A',row:'1',seat:'1'}).status,'unknown-layout');
 const end=raw(manifest.find(x=>x.venue===id)).variants.end.seats;
 const keys=new Set(end.map(r=>JSON.stringify(r.slice(0,3))));
 const onlyCenter=raw(manifest.find(x=>x.venue===id)).variants.center.seats.find(r=>!keys.has(JSON.stringify(r.slice(0,3))));
 const input={section:String(onlyCenter[0]),row:String(onlyCenter[1]),seat:String(onlyCenter[2])};
 assert.equal(repo.resolve(id,{...input,layout:'center'}).status,'matched');
 assert.notEqual(repo.resolve(id,{...input,layout:'end'}).status,'matched');
 assert.equal(repo.resolve(id,{layout:'end',section:'紅1B',row:'9999',seat:'1'}).status,'unverified');
});

test('western identity-only samples cannot acquire generated seat XYZ',()=>{
 const repo=loadVenues();
 for(const id of ['tottenham','metlife','sofi'])for(const section of repo.get(id).sections)for(const sample of section.samples){
  const found=repo.resolve(id,sample);assert.equal(found.status,'matched');assert.equal(found.position,null);assert.equal(found.positionStatus,'unavailable');
 }
});

test('source stage, performer and 2D positions share the unchanged source coordinate frame',async()=>{
 const {stageRects,performer,audienceSightline}=await import('../public/geometry.mjs');
 const repo=loadVenues(),venue=repo.get('taipei-arena','end');
 assert.deepEqual(stageRects('end',venue),[{x:0,z:-22,w:20,d:12,h:1.6}]);
 assert.deepEqual(performer('end',venue),[0,1.6,-22]);
 const seat=venue.sourceSeats[0];
 assert.deepEqual(audienceSightline(venue,'end',seat.position).target,[0,2.475,-22]);
 const kai=repo.get('kai-tak-stadium');assert.deepEqual(stageRects('bowl',kai),[]);assert.equal(performer('bowl',kai),null);
 assert.equal(audienceSightline(kai,'bowl',kai.sourceSeats[0].position),null);
});

test('source tread strips follow actual row elevations and do not bridge aisle gaps',async()=>{
 const {sourceSeatDecks}=await import('../public/seating.mjs');
 const repo=loadVenues(),venue=repo.get('hong-kong-coliseum','center');
 const quads=sourceSeatDecks(venue.sourceSeats);
 assert.ok(quads.length>1000);for(const q of quads){assert.equal(q.length,4);assert.ok(q.every(p=>p.every(Number.isFinite)));assert.ok(q.every(p=>p[1]===q[0][1]));}
 const isolated=[venue.sourceSeats[0],{...venue.sourceSeats[0],seat:'other',position:[999,99,999]}];
 const split=sourceSeatDecks(isolated);assert.equal(split.length,2);
});

test('decoded reference examples independently confirm position, facing and source counts',()=>{
 const repo=loadVenues();
 const examples=JSON.parse(readFileSync(new URL('../references/rea/shijiao-evidence/data-sources/decoded-seat-examples.json',import.meta.url))).examples;
 for(const example of examples){const venue=repo.get(example.venue,example.layout||'bowl'),actual=venue.sourceSeats[0],expected=example.decoded_first_seat;
  assert.equal(venue.sourceSeats.length,example.record_count);assert.deepEqual(actual.position,expected.position);assert.ok(Math.abs(actual.yaw-expected.yaw)<1e-12);assert.ok(Math.abs(actual.treadYaw-expected.treadYaw)<1e-12);
  assert.equal(actual.section,expected.section);assert.equal(actual.row,expected.rowLabel);assert.equal(actual.seat,String(expected.number));
 }
});

test('catalog source counts describe the same default layout returned by venue detail',()=>{
 const repo=loadVenues();
 for(const entry of manifest){const row=repo.catalog().find(v=>v.id===entry.venue),venue=repo.get(entry.venue);
  assert.equal(row.sectionCount,venue.sections.length);assert.equal(row.sourceSeatCount,venue.sourceSeats.length);assert.equal(row.accuracy.seatDataStatus,'full-retained-asset');
 }
});
