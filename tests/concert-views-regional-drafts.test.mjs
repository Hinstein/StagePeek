import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Readable} from 'node:stream';
import {loadVenues} from '../server/concert-views/venues.mjs';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {sourceBowlDisplay} from '../public/concert-views/source-bowl-display.mjs';

const views=loadConcertViews({localDrafts:true});
const asset=JSON.parse(readFileSync(new URL('../data/source-seats/taipei-arena.json',import.meta.url),'utf8'));

test('Taipei is opt-in and never enters the default production concert inventory',()=>{
 assert.equal(loadVenues().get('taipei-arena'),null);
 assert.equal(loadConcertViews().venues.get('taipei-arena'),null);
 assert.ok(loadVenues(undefined,{localDrafts:true}).get('taipei-arena'));
});

for(const [layout,count,sections,label] of [['end',10000,79,'紅1B'],['center',12877,98,'紅1A']]){
 test(`Taipei ${layout} preserves every retained source record and supports exact lookup`,()=>{
  const venue=views.venues.get('taipei-arena',layout);
  assert.equal(venue.sourceSeats.length,count);assert.equal(venue.sections.length,sections);
  assert.equal(venue.publicationStatus,'not-published');assert.equal(venue.rightsDecision,'undecided');
  assert.equal(venue.accuracy.metricCalibrated,false);assert.equal(venue.accuracy.completeSeatInventory,false);
  venue.sourceSeats.forEach((seat,index)=>{
   const raw=asset.variants[layout].seats[index];
   assert.deepEqual([seat.section,seat.row,seat.seat,seat.position],[String(raw[0]),String(raw[1]),String(raw[2]),raw.slice(3,6)]);
   assert.equal(seat.yaw,Math.atan2(-raw[6],-raw[7]));assert.equal(seat.treadYaw,Math.atan2(-raw[12],-raw[13]));
   assert.deepEqual([seat.level,seat.depth,seat.chairWidth,seat.rowDepth],[String(raw[8]),raw[9],raw[10],raw[11]]);
   assert.deepEqual(seat.sourceRecord,{assetSha256:asset.metadata.assetSha256,index});
  });
  const ticket=views.venues.resolve(venue.id,{layout,section:label,row:'1',seat:'1'});
  assert.equal(ticket.status,'matched');assert.deepEqual(ticket.position,venue.sourceSeats[0].position);
  const unknown=views.venues.resolve(venue.id,{layout,section:label,row:'1',seat:'not-a-ticket'});
  assert.equal(unknown.status,'unverified');assert.equal(unknown.position,null);
  const model=sourceBowlDisplay(venue);
  assert.deepEqual(model.records.map(r=>[r.section,r.row,r.seat,r.p]),venue.sourceSeats.map(r=>[r.section,r.row,r.seat,r.position]));
  assert.equal(model.supplements.length,0);assert.ok(model.treads.length>0);assert.ok(model.walls.length>0);
 });
}

test('Taipei stage and floor zones belong to the requested layout',()=>{
 const end=views.venues.get('taipei-arena','end'),center=views.venues.get('taipei-arena','center');
 assert.deepEqual(end.sourceStage,{x:0,z:-22,width:20,depth:12,height:1.6});
 assert.deepEqual(center.sourceStage,{x:0,z:0,width:14,depth:14,height:1.6});
 assert.deepEqual(end.sourceZones.map(z=>z.id),['standing-1']);assert.deepEqual(center.sourceZones,[]);
 assert.equal(views.venues.get('taipei-arena','missing'),null);
 assert.equal(views.venues.resolve('taipei-arena',{layout:'missing'}).status,'unknown-layout');
 assert.equal(asset.metadata.assetSha256,'f1b66f49d6ef8dc34f3a7aaf1cdfe621d45e1b6a28316c39d8539869344f6b5d');
});

test('local API presents Taiwan separately, isolates layouts and has no invented concert',async()=>{
 async function request(target,path){
  const response={setHeader(){},writeHead(status){this.status=status;},end(body){this.body=JSON.parse(body);}};
  await target.handle(Readable.from([]),response,new URL(path,'http://localhost'),{path});
  return response.body;
 }
 // Use the actual route handler without opening a network port.
 const target={handle(req,...args){req.method='GET';return views.handle(req,...args);}};
 const catalog=await request(target,'/api/concert-views/venues');
 const taipei=catalog.venues.find(v=>v.id==='taipei-arena');
 assert.equal(taipei.name,'台北小巨蛋');assert.equal(taipei.country,'台湾');
 const events=await request(target,'/api/concert-views/venues/taipei-arena/events');
 assert.deepEqual(events,{events:[],researchConcerts:[]});
 const production=loadConcertViews();
 await assert.rejects(request({handle(req,...args){req.method='GET';return production.handle(req,...args);}},'/api/concert-views/venues/taipei-arena'),e=>e.status===404);
});
