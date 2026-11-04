import test from 'node:test';
import assert from 'node:assert/strict';
import {loadConcertViews} from '../server/concert-views/index.mjs';
const loadGlobalSources=()=>({get:id=>id==='ovo-hydro'?loadConcertViews().hydro:null});
import {buildHydroDisplay,hydroPoint,locateHydroReference} from '../public/concert-views/hydro-display.mjs';
import {chairParts} from '../public/concert-views/spatial.mjs';

const venue=loadGlobalSources().get('ovo-hydro');
const model=buildHydroDisplay(venue,venue.eventPlans[0].id);
function inside(p,polygon){
 let result=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];
  if((a[2]>p[2])!==(b[2]>p[2])&&p[0]<(b[0]-a[0])*(p[2]-a[2])/(b[2]-a[2])+a[0])result=!result;
 }
 return result;
}
function footprint(chair){
 const c=Math.cos(chair.angle),s=Math.sin(chair.angle);
 return chairParts.flatMap(part=>[-1,1].flatMap(x=>[-1,1].map(z=>{
  const a=part.center[0]+x*part.size[0]/2,b=part.center[2]+z*part.size[2]/2;
  return [chair.p[0]+a*c+b*s,chair.p[1],chair.p[2]-a*s+b*c];
 })));
}

test('Hydro reconstruction retains all 50 literal blocks and source row identities without inventing tickets',()=>{
 const before=JSON.stringify(venue);
 const next=buildHydroDisplay(venue,venue.eventPlans[0].id);
 assert.equal(JSON.stringify(venue),before);
 assert.deepEqual(next.sections.map(s=>s.id).sort(),venue.venueDraft.map.sections.map(s=>s.id).sort());
 assert.ok(next.sections.some(s=>s.label==='052'));
 assert.equal(next.chairs.length,10109);
 for(const section of next.sections){
  const sourceRows=venue.rowCatalogs.flatMap(c=>c.sections).find(s=>s.label===section.label).rowLabels;
  assert.deepEqual(section.rows,sourceRows);
  for(const chair of section.chairs){
   assert.ok(sourceRows.includes(chair.displayRow));assert.equal(chair.visualOnly,true);assert.equal(chair.sourceSeat,false);
   for(const key of ['row','seat','position','ticket'])assert.equal(Object.hasOwn(chair,key),false);
   assert.ok([...chair.p,chair.angle].every(Number.isFinite));
   assert.ok(Math.sin(chair.angle)*-chair.p[0]+Math.cos(chair.angle)*-chair.p[2]>0);
  }
 }
 assert.equal(next.metricCalibrated,false);assert.equal(next.completeSeatInventory,false);
 assert.equal(next.publicationStatus,'not-published');assert.equal(next.rightsDecision,'undecided');
});

test('whole chair footprints are supported by their row surfaces and stay clear of event areas and aisle steps',()=>{
 const surfaces=new Map();
 for(const tread of model.treads){const y=tread[0][1];if(!surfaces.has(y))surfaces.set(y,[]);surfaces.get(y).push(tread);}
 for(const chair of model.chairs){
  const row=surfaces.get(chair.p[1]);
  for(const point of footprint(chair)){
   assert.ok(row.some(q=>inside(point,q)),`${chair.section} ${chair.displayRow} unsupported chair`);
   assert.ok(!model.shapes.some(shape=>chair.p[1]<shape.height+.02&&inside(point,shape.points)),`${chair.section} crosses event area`);
   assert.ok(!model.stairs.some(q=>Math.abs(q[0][1]-chair.p[1])<.01&&inside(point,q)),`${chair.section} crosses aisle`);
  }
 }
});

test('shared Hydro aisles emit each walking surface once',()=>{
 const keys=model.stairs.map(q=>q.map(p=>p.map(v=>v.toFixed(8)).join(',')).sort().join(';'));
 assert.equal(new Set(keys).size,keys.length,'adjacent sections must not draw duplicate walking surfaces');
});

test('Hydro source event preserves standing floor, front porch opening and stage performer; base is stage-free',()=>{
 assert.equal(model.shapes.length,7);assert.equal(model.shapes.filter(s=>s.kind==='stage').length,4);
 const porch=model.shapes.find(s=>s.id==='front-porch');
 const centre=hydroPoint(510,497);
 assert.ok(inside(centre,porch.points));
 assert.ok(model.shapes.filter(s=>s.kind==='stage').every(s=>!inside(centre,s.points)));
 assert.ok(inside(model.performer,model.shapes.find(s=>s.id==='stage-main').points));
 assert.equal(model.performer[1],1.25);
 const base=buildHydroDisplay(venue);
 assert.deepEqual(base.shapes,[]);assert.equal(base.performer,null);
 assert.deepEqual(base.chairs,model.chairs);
 const second=buildHydroDisplay(venue,venue.eventPlans[1].id);
 assert.deepEqual(second.shapes,model.shapes);
 assert.throws(()=>buildHydroDisplay(venue,'other-event'),/Unbound/);
 assert.throws(()=>buildHydroDisplay({...venue,id:'other-venue'}),/requires/);
});

test('Hydro named references resolve without manufacturing a source ticket or substituting an unknown seat',()=>{
 assert.equal(model.references.length,80);
 for(const r of model.references){
  const found=locateHydroReference(model,r.reference);
  assert.equal(found.status,'reference');assert.equal(found.chair,r.chair);
  assert.equal(found.reference.eventAvailability,'unknown');
  if(found.status==='inferred'){
   assert.ok(['author-estimate','retained-reference','section-order'].includes(found.reference.anchorBasis));
   assert.equal(found.reference.priorEventId,venue.eventPlans[0].id);
  }
  assert.ok(['estimated-model-row-fraction','estimated-numbered-row-slot'].includes(found.reference.positionBasis));
  assert.equal(found.chair.sourceSeat,false);
  for(const key of ['row','seat','position','ticket'])assert.equal(Object.hasOwn(found.chair,key),false);
 }
 assert.equal(locateHydroReference(model,{section:'204',row:'d',seat:'66'}).status,'reference');
 for(const input of [{section:'204',row:'D',seat:'999'},{section:'204',row:'?',seat:'66'},{section:'999',row:'D',seat:'66'}])assert.equal(locateHydroReference(model,input).chair,null);
 assert.equal(locateHydroReference(model,{section:'218',row:'E',seat:'292'}).status,'inferred');
 assert.equal(locateHydroReference(model,{section:'206',row:'E',seat:'97'}).status,'inferred');
 assert.equal(locateHydroReference(model,{section:'235',row:'S',seat:'330'}).status,'inferred');
 assert.equal(model.eventRows['204'].D,15);
 assert.equal(model.eventRows['206'].E,undefined);
 assert.equal(buildHydroDisplay(venue).eventRows,null);
 assert.equal(buildHydroDisplay(venue,venue.eventPlans[1].id).eventRows,null);
});

test('Hydro reference positions follow the retained model along each row instead of all using its midpoint',()=>{
 const before=JSON.stringify(venue);
 const next=buildHydroDisplay(venue);
 let offCentre=0;
 for(const r of next.references){
  const row=next.sections.find(s=>s.id===r.chair.section).chairs.filter(c=>c.displayRow===r.reference.row);
  assert.equal(row.indexOf(r.chair),Math.min(row.length-1,Math.floor(r.reference.rowFraction*row.length)));
  assert.equal(row.filter(c=>c.referenceTicket?.seat===r.reference.seat).length,1);
  if(r.chair!==row[Math.floor(row.length/2)])offCentre++;
 }
 assert.ok(offCentre>=12);
 assert.equal(JSON.stringify(venue),before);
 const d=locateHydroReference(next,{section:'204',row:'D',seat:'66'}).chair;
 const row=next.sections.find(s=>s.label==='204').chairs.filter(c=>c.displayRow==='D');
 assert.ok(row.indexOf(d)<row.length/3);
 assert.deepEqual(d.p,locateHydroReference(model,{section:'204',row:'D',seat:'66'}).chair.p);
});

test('two reference anchors in one row keep separate locations and reject display-slot collisions',()=>{
 // Synthetic provider fixture: this tests mapping, not a new Hydro seat claim.
 const fixture=structuredClone(venue),first=fixture.numberingReference.references.find(r=>r.section==='204');
 fixture.numberingReference.references=[{...first,rowFraction:.1},{...first,seat:'67',rowFraction:.9}];
 const next=buildHydroDisplay(fixture);
 const a=locateHydroReference(next,{section:'204',row:'D',seat:'66'});
 const b=locateHydroReference(next,{section:'204',row:'D',seat:'67'});
 assert.notEqual(a.chair,b.chair);assert.notDeepEqual(a.chair.p,b.chair.p);
 const row=next.sections.find(s=>s.label==='204').chairs.filter(c=>c.displayRow==='D');
 assert.ok(row.indexOf(a.chair)<row.indexOf(b.chair));
 fixture.numberingReference.references[1].rowFraction=.1;
 assert.throws(()=>buildHydroDisplay(fixture),/share a display chair/);
});

test('204 numbered rows retain first/middle/last order, separate chairs and clear entrance breaks',()=>{
 for(const [row,high,low]of [['A',67,55],['B',68,55],['C',68,55],['D',69,55],['F',40,31]]){
  const chairs=model.sections.find(s=>s.label==='204').chairs.filter(c=>c.displayRow===row);
  assert.equal(chairs.length,high-low+1);
  for(let i=0;i<chairs.length;i++){
   const found=locateHydroReference(model,{section:'204',row,seat:String(high-i)});
   assert.equal(found.chair,chairs[i]);
   assert.equal(found.reference.eventAvailability,'unknown');
  }
  assert.equal(locateHydroReference(model,{section:'204',row,seat:String(high+1)}).chair,null);
  assert.equal(locateHydroReference(model,{section:'204',row,seat:String(low-1)}).chair,null);
 }
 assert.equal(locateHydroReference(model,{section:'204',row:'E',seat:'66'}).status,'inferred');
 assert.equal(new Set(model.references.map(r=>r.chair)).size,80);
 const other=buildHydroDisplay(venue,venue.eventPlans[1].id);
 for(const r of model.references.filter(r=>r.reference.section==='204'))assert.deepEqual(locateHydroReference(other,r.reference).chair.p,r.chair.p);
});

test('full illustrative Hydro numbering is unique, round-trips every chair and preserves all supported anchors',()=>{
 const all=[...model.references,...model.inferredReferences];
 assert.equal(all.length,model.chairs.length);
 assert.equal(model.inferredReferences.length,10029);
 assert.equal(model.numberingRows.length,518);
 assert.equal(new Set(all.map(v=>[v.reference.section,v.reference.row,v.reference.seat].join('/'))).size,all.length);
 assert.equal(new Set(all.map(v=>v.chair)).size,model.chairs.length);
 for(const item of all){
  const found=locateHydroReference(model,item.reference);
  assert.equal(found.chair,item.chair);
  assert.equal(found.status,item.chair.referenceTicket?'reference':'inferred');
  assert.equal(found.reference.eventAvailability,'unknown');
 }
 for(const section of model.sections)for(const label of section.rows){
  const row=section.chairs.filter(c=>c.displayRow===label);
  const ids=row.map(c=>Number((c.referenceTicket||c.inferredTicket).seat));
  assert.ok(ids.every(v=>Number.isInteger(v)&&v>0));
  assert.ok(ids.every((v,i)=>!i||v===ids[i-1]-1),`${section.label}/${label} follows row direction`);
  assert.equal(locateHydroReference(model,{section:section.label,row:label,seat:String(Math.max(...ids)+1)}).chair,null);
 }
 assert.ok(model.numberingRows.every(r=>r.conflicts.length===0));
 assert.ok(model.numberingRows.some(r=>r.method==='section-order-only'));
 assert.ok(model.numberingRows.some(r=>r.method==='neighbor-section-anchor'));
 assert.equal(locateHydroReference(model,{section:'204',row:'E',seat:'66'}).status,'inferred');
 for(const input of [{section:'206',row:'E',seat:'97'},{section:'218',row:'E',seat:'292'},{section:'235',row:'S',seat:'330'}]){
  const found=locateHydroReference(model,input);
  assert.equal(found.status,'inferred');assert.equal(found.reference.anchorBasis,'author-estimate');
  assert.equal(found.chair.referenceTicket,undefined);
 }
});
