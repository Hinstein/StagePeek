import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {releasedVenues} from '../server/concert-views/release.mjs';
import {sourceBowlDisplay} from '../public/concert-views/source-bowl-display.mjs';
import {venueName,venueRegion} from '../public/translations/venue-labels.mjs';

const views=loadConcertViews({localDrafts:true});
for(const [id,layout,count,sections,city,duplicates] of [
 ['kaohsiung-arena','end',11658,32,'高雄',7],
 ['kaohsiung-arena','center',14934,50,'高雄',7],
 ['kaohsiung-music-center','end',3003,10,'高雄',1],
 ['taichung-opera-house','end',1994,17,'台中',0]
])test(`${id}/${layout} retains sourced identities and shares the existing display and lookup`,()=>{
 const venue=views.venues.get(id,layout);
 assert.ok(venue);assert.equal(venue.sourceSeats.length,count);assert.equal(venue.sections.length,sections);
 assert.ok(venue.city.includes(city));assert.equal(venue.publicationStatus,'not-published');
 assert.equal(venue.accuracy.metricCalibrated,false);assert.equal(venue.accuracy.completeSeatInventory,false);
 const bytes=readFileSync(new URL(`../data/concert-views/regional-sources/raw/${id}.json`,import.meta.url));
 assert.equal(venue.seatLayout.assetSha256,createHash('sha256').update(bytes).digest('hex'));
 const keys=venue.sourceSeats.map(s=>JSON.stringify([s.section,s.row,s.seat]));
 // The reference itself repeats seven K-Arena tickets and one music-center ticket.
 // Keep those records, but never resolve an ambiguous ticket to an arbitrary chair.
 assert.equal(count-new Set(keys).size,duplicates);
 for(const key of new Set(keys.filter((k,i)=>keys.indexOf(k)!==i))){
  const [section,row,seat]=JSON.parse(key),result=views.venues.resolve(id,{layout,section,row,seat});
  assert.equal(result.status,'ambiguous');assert.equal(result.position,null);
 }
 for(const seat of venue.sourceSeats){
  assert.ok(seat.position.every(Number.isFinite));assert.ok(Number.isFinite(seat.yaw));
  assert.equal(seat.sourceRecord.assetSha256,venue.seatLayout.assetSha256);
 }
 for(const seat of [venue.sourceSeats[0],venue.sourceSeats[Math.floor(count/2)],venue.sourceSeats.at(-1)]){
  const result=views.venues.resolve(id,{layout,section:seat.section,row:seat.row,seat:seat.seat});
  assert.equal(result.status,'matched');assert.deepEqual(result.position,seat.position);
  const unknown=views.venues.resolve(id,{layout,section:seat.section,row:seat.row,seat:'99999'});
  assert.equal(unknown.status,'unverified');assert.equal(unknown.position,null);
 }
 const model=sourceBowlDisplay(venue);
 assert.equal(model.records.length,count);assert.equal(model.supplements.length,0);
 assert.deepEqual(model.records.map(s=>[s.section,s.row,s.seat,s.p]),venue.sourceSeats.map(s=>[s.section,s.row,s.seat,s.position]));
 assert.ok(model.treads.length);assert.ok(model.walls.length);
 for(const locale of ['en','zh-CN','zh-TW','ja','ko']){
  assert.ok(venueName(venue,locale));assert.ok(venueRegion(venue,locale));
 }
 assert.match(venueName(venue,'en'),/Kaohsiung|Taichung/);
});

test('new batch remains private until visual review and release acceptance',()=>{
 const released=releasedVenues(views);
 for(const id of ['kaohsiung-arena','kaohsiung-music-center','taichung-opera-house']){
  assert.equal(loadConcertViews().venues.get(id),null);
  assert.equal(released.get(id),null);
  assert.ok(!released.catalog().some(v=>v.id===id));
 }
});

test('Kaohsiung layouts filter closed/retracted banks without mutating retained geometry',()=>{
 const raw=JSON.parse(readFileSync(new URL('../data/concert-views/regional-sources/raw/kaohsiung-arena.json',import.meta.url))).geometry;
 const center=views.venues.get('kaohsiung-arena','center'),end=views.venues.get('kaohsiung-arena','end');
 const seat=center?.sourceSeats.find(s=>s.section==='201'&&s.row==='19');
 assert.ok(seat);assert.equal(end.sourceSeats.some(s=>s.section==='201'),false);
 const tuple=raw.zones.find(z=>z.id==='201'&&z.tier==='2F').rows[0][1];
 assert.deepEqual(seat.position,[tuple[0]/100,raw.H.f2H19,tuple[1]/100]);
 assert.equal(seat.seat,String(tuple[2]));
 assert.deepEqual(center.sourceStage,{x:0,z:0,width:12,depth:12,height:1.5});
 assert.deepEqual(center.sourceZones,[]);
 assert.equal(views.venues.resolve('kaohsiung-arena',{layout:'end2'}).status,'unknown-layout');
});
