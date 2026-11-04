import test from 'node:test';
import assert from 'node:assert/strict';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {sourceBowlDisplay} from '../public/concert-views/source-bowl-display.mjs';
import {o2EventDisplayDraft} from '../public/concert-views/o2-display.mjs';
import {eventChairFootprint,eventPointInside} from '../public/concert-views/source-event-display.mjs';
import {inside,validPolygon} from '../server/concert-views/ticket-map-draft.mjs';

const views=loadConcertViews();
const batch=[
 ['twcv-accor-arena-paris',14493,'accor-gaga-20251117',false],
 ['twcv-ziggo-dome-amsterdam',10093,'ziggo-gaga-20251109',false],
 ['twcv-uber-arena-berlin',11256,'uber-muse-20261118',false],
 ['twcv-kia-forum-los-angeles',13869,'kia-forum-don-omar-20261106',true],
 ['twcv-united-center-chicago',17335,'unc-katseye-20261105',true],
 ['twcv-ubs-arena-new-york',14429,'ubs-anuel-aa-20261106',true],
 ['twcv-prudential-center-newark',14979,'pru-xg-20261114',true],
 ['twcv-state-farm-arena-atlanta',13700,'sfa-doja-cat-20261117',true]
];
for(const [id,count,event,seated]of batch){
 test(id+' retains every source chair with support, numbering and an event-specific layout',()=>{
  const venue=views.venues.get(id),model=sourceBowlDisplay(venue),draft=views.previews.get(event);
  assert.equal(model.records.length,count);assert.equal(model.shellBasis,'estimated-continuous-bank');assert.ok(model.walls.length>0);assert.ok(model.banks.length>0);assert.ok(model.aisleSteps.length>0);
  assert.deepEqual(model.records.map(r=>[r.section,r.row,r.seat,r.p]),venue.sourceSeats.map(s=>[s.section,s.row,s.seat,s.position]));
  const rows=new Map(model.rows.map(r=>[JSON.stringify([r.section,r.level,r.row,r.y]),r]));
  for(const q of model.treads)assert.ok(validPolygon(q.map(([x,,z])=>[x,z])));
  for(const [index,record] of model.records.entries()){
   const row=rows.get(JSON.stringify([record.section,record.level,record.row,record.p[1]]));
   assert.ok(row.treads.some(q=>inside([record.p[0],record.p[2]],q.map(([x,,z])=>[x,z]))));
   for(const [x,,z] of model.footprints[index])assert.ok(inside([x,z],row.polygon.map(([x,,z])=>[x,z])),'entire chair footprint is supported');
   assert.ok(Math.sin(record.angle)*record.p[0]+Math.cos(record.angle)*record.p[2]<=1e-5,'chair faces the bowl');
  }
  for(const bank of model.banks){
   assert.equal(bank.basis,'estimated-continuous-bank');
   for(const [i,row]of bank.rows.entries()){
    assert.equal(row.front.length,row.back.length);
    assert.ok(row.front.every(p=>p.every(Number.isFinite)));
    if(i)assert.ok(model.risers.some(q=>q[0]===row.front[0]&&q[3]===bank.rows[i-1].back[0]),'adjacent rows share the connecting riser');
   }
  }
  for(const step of model.aisleSteps){
   const polygon=step.tread.map(([x,,z])=>[x,z]);
   assert.ok(validPolygon(polygon));assert.equal(step.sections.length,2);
   assert.ok(model.records.filter(r=>step.sections.includes(r.section)&&r.level===step.level&&Math.abs(r.p[1]-step.tread[0][1])<.2).every(r=>!inside([r.p[0],r.p[2]],polygon)),'walking steps do not cover source chairs');
  }
  const ticket=venue.sourceSeats[Math.floor(count/2)];
  assert.deepEqual(views.venues.resolve(id,{layout:venue.seatLayout.id,...ticket}).position,ticket.position);
  assert.equal(views.venues.resolve(id,{layout:venue.seatLayout.id,...ticket,seat:'not-a-ticket'}).status,'unverified');
  assert.equal(draft.fixedSeats.count,count);assert.equal(draft.venueId,id);assert.equal(draft.audit.seatEnvelopeConflicts.length,0);
  assert.equal(draft.registration.allowPublication,false);assert.equal(draft.registration.allowDistances,false);
  const display=o2EventDisplayDraft(venue,draft);
  assert.equal(o2EventDisplayDraft(venue,draft),display,'stable display chair references support picking');
  assert.equal(display.floorChairs.length>0,seated);
  for(const shape of [...display.stage,...display.zones,...display.equipment]){
   assert.ok(eventPointInside(shape.labelPosition,shape.polygon));
   assert.ok(!(shape.holes||[]).some(h=>eventPointInside(shape.labelPosition,h)));
  }
  for(const chair of display.floorChairs){
   assert.equal(chair.visualOnly,true);assert.equal(chair.row,undefined);assert.equal(chair.seat,undefined);assert.equal(chair.position,undefined);
   const zone=display.zones.find(z=>z.id===chair.zoneId);assert.equal(zone.kind,'price-zone');
   const footprint=eventChairFootprint(chair);
   assert.ok(footprint.every(p=>inside(p,zone.polygon)&&!(zone.holes||[]).some(h=>inside(p,h))));
   assert.ok([...display.stage,...display.equipment].every(s=>footprint.every(p=>!inside(p,s.polygon))));
  }
 });
}
