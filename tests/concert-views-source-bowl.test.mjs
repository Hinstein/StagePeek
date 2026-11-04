import test from 'node:test';
import assert from 'node:assert/strict';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {sourceBowlDisplay,sourceRowLabelAnchors} from '../public/concert-views/source-bowl-display.mjs';
import {inside,validPolygon} from '../server/concert-views/ticket-map-draft.mjs';
const views=loadConcertViews(),venue=views.venues.get('twcv-accor-arena-paris','acc');

test('continuous banks preserve every Accor identity/XYZ and support its chairs',()=>{
 const m=sourceBowlDisplay(venue);assert.equal(m.records.length,14493);assert.equal(m.shellBasis,'estimated-continuous-bank');assert.ok(m.walls.length>0);
 assert.deepEqual(m.records.map(r=>[r.section,r.row,r.seat,r.p]),venue.sourceSeats.map(r=>[r.section,r.row,r.seat,r.position]));
 for(const q of m.treads)assert.ok(validPolygon(q.map(([x,,z])=>[x,z])));
 for(const r of m.records){
  const rows=m.rows.filter(row=>row.section===r.section&&row.level===r.level&&row.row===r.row&&row.y===r.p[1]);
  assert.ok(rows.some(row=>row.treads.some(q=>inside([r.p[0],r.p[2]],q.map(([x,,z])=>[x,z])))),JSON.stringify([r.section,r.row,r.seat]));
 }
 assert.equal(m.guides.length,m.rows.length,'structural rows remain continuous across missing source points');assert.ok(m.aisleSteps.length>0);
 assert.ok(sourceRowLabelAnchors(venue,'N').length>0);assert.equal(m.supplements.length,0);
 assert.equal(sourceBowlDisplay(views.venues.get('twcv-the-o2-arena-london')),null,'O2 accepted model is separate');
});
test('Accor event binds the retained asset, standing areas and source provenance',()=>{
 const draft=views.previews.get('accor-gaga-20251117');assert.ok(draft);assert.equal(draft.fixedSeats.count,14493);
 assert.equal(draft.zones.length,3);assert.ok(draft.zones.every(s=>s.kind==='standing'));assert.equal(draft.temporarySeats.length,0);
 assert.equal(draft.audit.seatEnvelopeConflicts.length,0);assert.equal(draft.registration.allowPublication,false);
 const ticket=venue.sourceSeats[0];const resolved=views.venues.resolve(venue.id,{layout:'acc',...ticket});
 assert.equal(resolved.status,'matched');assert.deepEqual(resolved.position,ticket.position);
 assert.equal(views.venues.resolve(venue.id,{layout:'acc',section:ticket.section,row:ticket.row,seat:'not-a-ticket'}).status,'unverified');
});

test('short end rows and missing interior points do not cut holes or sawteeth into a structural bank',async()=>{
 const {sourceBankShell}=await import('../public/concert-views/source-bank-shell.mjs');
 const rows=Array.from({length:5},(_,r)=>({section:'A',level:'L',row:String(r+1),y:r*.4,seats:Array.from({length:11},(_,i)=>i).filter(i=>r===0||r===4?i>=3&&i<=7:i!==5).map(i=>({position:[i-5,r*.4,20+r],rowDepth:.9}))}));
 const original=JSON.stringify(rows),shell=sourceBankShell(rows),bank=shell.banks[0];
 assert.equal(JSON.stringify(rows),original);assert.equal(bank.rows.length,5);
 for(const row of bank.rows){
  assert.ok(validPolygon(row.polygon.map(([x,,z])=>[x,z])));
  assert.ok(inside([0,20+Number(row.row)-1],row.polygon.map(([x,,z])=>[x,z])),'missing source point retains structural floor');
  assert.ok(inside([-5,20+Number(row.row)-1],row.polygon.map(([x,,z])=>[x,z])),'short first and last rows retain the bank width');
 }
 for(const side of [0,-1]){
  const edge=bank.rows.flatMap(row=>[row.front.at(side),row.back.at(side)]),a=edge[0],b=edge.at(-1);
  for(const p of edge)assert.ok(Math.abs((b[0]-a[0])*(p[2]-a[2])-(b[2]-a[2])*(p[0]-a[0]))<1e-7,'bank side follows one smooth boundary');
 }
 const opposite=rows.map(row=>({...row,section:'B',seats:row.seats.map(s=>({...s,position:[-s.position[0],s.position[1],-s.position[2]]}))}));
 assert.equal(sourceBankShell([...rows,...opposite]).aisleSteps.length,0,'wide service or stage openings stay open');
});
