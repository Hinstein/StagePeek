import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadVenues} from '../server/concert-views/venues.mjs';
import {loadRenderBatch,applyRenderBatch} from '../server/concert-views/render-batch.mjs';
import {baseSeatRecords,standSurfaces} from '../public/concert-views/geometry.mjs';
import {sourceMapPolygons,sourceStandGeometry} from '../public/concert-views/seating.mjs';
import * as seating from '../public/concert-views/seating.mjs';
import {chairParts,polygonIntersectsBox,seatIntersectsBox} from '../public/concert-views/spatial.mjs';
import {chairGeometry} from '../public/concert-views/chair-geometry.mjs';

const raw=JSON.parse(readFileSync(new URL('../data/research-twconcertview/2026-10-27/raw/the-o2-arena-london.json',import.meta.url)));
const original=loadVenues(undefined,{includeResearch:true}).get('twcv-the-o2-arena-london','o2a');
const venue=applyRenderBatch(original,loadRenderBatch());
const records=baseSeatRecords(venue);
const seat=(section,number)=>records.find(s=>s.section===section&&s.row==='14'&&s.seat===number);
const angleBetween=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
const inside=(p,poly)=>{
 let result=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];
  if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])result=!result;
 }
 return result;
};

test('O2 section guides separate adjacent ticket blocks and leave internal seat gaps open',()=>{
 assert.equal(typeof seating.sourceSectionGuides,'function','section selection needs a ground boundary as well as a chair colour');
 const before=JSON.stringify(venue.sourceSeats),guides=seating.sourceSectionGuides(venue.sourceSeats,'o2a');
 const a=guides.find(g=>g.section==='109'&&g.row==='17'&&g.last==='277');
 const b=guides.find(g=>g.section==='110'&&g.row==='17'&&g.first==='278');
 assert.ok(a&&b);
 assert.deepEqual(a.right,b.left,'both sections must share one boundary between the close 277/278 chairs');
 const gap=venue.sourceSeats.filter(s=>s.section==='109'&&s.row==='17'&&['266','274'].includes(s.seat));
 const midpoint=[(gap[0].position[0]+gap[1].position[0])/2,(gap[0].position[2]+gap[1].position[2])/2];
 assert.ok(!guides.filter(g=>g.row==='17'&&g.level==='L1').some(g=>inside(midpoint,g.polygon.map(p=>[p[0],p[2]]))),'highlight must not fill the source gap inside 109');
 for(const record of records){
  const matches=guides.filter(g=>g.section===record.section&&g.row===record.row&&g.level===record.level);
  assert.equal(matches.filter(g=>inside([record.p[0],record.p[2]],g.polygon.map(p=>[p[0],p[2]]))).length,1,`${record.section}/${record.row}/${record.seat} belongs to exactly one guide ribbon`);
 }
 assert.equal(JSON.stringify(venue.sourceSeats),before,'presentation guides never renumber or relocate source seats');
});

test('O2 aisle half steps stay in seat-free gaps and connect consecutive row heights',()=>{
 assert.equal(typeof seating.sourceAisleSteps,'function');
 const stairs=seating.sourceAisleSteps(venue.sourceSeats,'o2a');
 assert.ok(stairs.length>100,'wide row gaps need intermediate walking steps, not full-height seating risers');
 for(const step of stairs){
  assert.ok(step.top>step.bottom&&step.top-step.bottom<.3);
  assert.equal(step.tread.length,4);
  for(const record of records){
   if(record.level!==step.level||record.p[1]+.575<step.bottom||record.p[1]>step.top)continue;
   for(const part of record.chairParts){
    const box={size:[part.size[0]*record.width,part.size[1],part.size[2]],angle:record.angle,center:[record.p[0]+part.center[2]*Math.sin(record.angle),record.p[1]+part.center[1],record.p[2]+part.center[2]*Math.cos(record.angle)]};
    assert.ok(![step.tread,...step.risers].some(face=>polygonIntersectsBox(face,box)),`aisle cuts ${record.section}/${record.row}/${record.seat}`);
   }
  }
 }
});

test('O2 uses retained source steps at the 108/109 join, including its seat-free walkway',()=>{
 const point=[21.723,35.215];
 assert.ok(raw.geo.tread.some(t=>t.t==='L1'&&t.y===4.7&&inside(point,t.p)));
 assert.ok(standSurfaces(venue).some(s=>s.kind==='source-tread'&&s.points[0][1]===4.7&&inside(point,s.points.map(p=>[p[0],p[2]]))));
 assert.equal(venue.researchRenderBatch.standGeometry.treads.length,raw.geo.tread.length);
 assert.equal(venue.researchRenderBatch.standGeometry.risers.length,raw.geo.riser.length);
 assert.deepEqual(venue.researchRenderBatch.standGeometry.floor,raw.shell.floor);
 assert.equal(original.researchRenderBatch,undefined);
 for(const [i,s]of records.entries())assert.deepEqual(s.p,original.sourceSeats[i].position);
});

test('O2 display chairs follow local row tangents continuously across section boundaries',()=>{
 for(const [a,b]of [[seat('108','257'),seat('109','258')],[seat('109','277'),seat('110','278')]]){
  assert.ok(angleBetween(a.angle,b.angle)<.12,'a section ID must not introduce a 30 degree heading jump');
  const dx=b.p[0]-a.p[0],dz=b.p[2]-a.p[2];
  assert.ok(Math.abs(dx*Math.sin(a.angle)+dz*Math.cos(a.angle))/Math.hypot(dx,dz)<.15);
 }
 const straight=records.filter(s=>s.section==='111'&&s.row==='14'&&Math.abs(s.p[2])<6);
 assert.ok(straight.every(s=>angleBetween(s.angle,-Math.PI/2)<.015),'straight side rows remain parallel');
 assert.ok(records.every((s,i)=>s.yaw===original.sourceSeats[i].yaw),'retained source yaw is not rewritten');
});

test('O2 staggered section joins do not twist otherwise smooth rows',()=>{
 // 410/411 have a lateral offset at the boundary. Using that connecting
 // vector as a row tangent twisted four chairs by about 17 degrees.
 for(const row of ['1','7','14','19']){
  const join=records.filter(s=>s.level==='L4'&&s.row===row&&Number(s.seat)>=689&&Number(s.seat)<=696).sort((a,b)=>Number(a.seat)-Number(b.seat));
  assert.ok(join.length>=6);
  for(let i=1;i<join.length;i++)assert.ok(angleBetween(join[i-1].angle,join[i].angle)<.08,`${join[i].section}/${row}/${join[i].seat} must follow its own row, not the offset between blocks`);
 }
});

test('O2 2D symbols use chair dimensions and the same heading as 3D, not tread depth',()=>{
 const s=seat('109','277'),index=original.sourceSeats.filter(x=>x.section==='109'&&x.level==='L1').findIndex(x=>x.row===s.row&&x.seat===s.seat);
 const polygon=sourceMapPolygons(venue.sourceSeats,'L1','o2a').get('109')[index].points;
 const width=Math.hypot(polygon[1][0]-polygon[0][0],polygon[1][1]-polygon[0][1]);
 const depth=Math.hypot(polygon[2][0]-polygon[1][0],polygon[2][1]-polygon[1][1]);
 assert.ok(Math.abs(width-chairParts[0].size[0]*s.width)<1e-9);
 assert.ok(Math.abs(depth-chairParts[0].size[2])<1e-9);
 assert.ok(Math.abs((polygon[1][0]-polygon[0][0])*Math.sin(s.angle)+(polygon[1][1]-polygon[0][1])*Math.cos(s.angle))<1e-9);
 assert.equal(records.filter(s=>s.section==='109'&&s.row==='14').length,11,'the source gap must not be populated with invented chairs');
});

test('O2 row skin closes the measured half-unit crack between rows 14 and 15',()=>{
 const point=[22.419227861632958,36.2290685174544];
 assert.ok(!raw.geo.tread.some(t=>t.t==='L1'&&t.y===4.7&&inside(point,t.p)),'fixture is an actual crack in the retained mesh');
 const skin=sourceStandGeometry(venue.sourceSeats,'o2a',venue.researchRenderBatch.standGeometry);
 assert.ok(skin.treads.some(q=>q[0][1]===4.7&&inside(point,q.map(p=>[p[0],p[2]]))),'the lower tread reaches the next row front');
 assert.equal(skin.rows.length,43);
 assert.equal(skin.rows.filter(row=>row.level==='L1').length,24);
 assert.equal(skin.rows.filter(row=>row.level==='L4').length,19);
 assert.ok(skin.risers.every(q=>Math.abs(q[0][1]-q[2][1])<1),'a riser never joins separate levels');
});

test('O2 structural rows survive missing chairs and preserve the upper stage opening',()=>{
 const retained=venue.researchRenderBatch.standGeometry;
 const skin=sourceStandGeometry(venue.sourceSeats,'o2a',retained);
 const withoutChairs=sourceStandGeometry([],'o2a',retained);
 assert.deepEqual(withoutChairs,skin,'the structural surface is independent of the current chair inventory');
 assert.ok(skin.treads.every((q,i)=>skin.treadLevels[i]!=='L4'||!inside([0,-50],q.map(p=>[p[0],p[2]]))));
 assert.deepEqual(skin.floor,raw.shell.floor);
});

test('every O2 source chair has a supporting surface on its own row and level',()=>{
 const skin=sourceStandGeometry(venue.sourceSeats,'o2a',venue.researchRenderBatch.standGeometry),rows=new Map();
 for(const [i,q]of skin.treads.entries()){
  const key=JSON.stringify([skin.treadLevels[i],q[0][1]]);
  if(!rows.has(key))rows.set(key,[]);rows.get(key).push(q.map(p=>[p[0],p[2]]));
 }
 for(const seat of venue.sourceSeats){
  assert.ok(rows.get(JSON.stringify([seat.level,seat.position[1]])).some(q=>inside([seat.position[0],seat.position[2]],q)),`unsupported ${seat.section}/${seat.row}/${seat.seat}`);
 }
});

test('O2 row skin has one visible tread at straight stands and corner joins',()=>{
 const skin=sourceStandGeometry(venue.sourceSeats,'o2a',venue.researchRenderBatch.standGeometry);
 for(const point of [[26.94,8.43],[21.723,35.215],[-27.1,4.1]]){
  assert.equal(skin.treads.filter(q=>q[0][1]===4.7&&inside(point,q.map(p=>[p[0],p[2]]))).length,1,'coplanar source and reconstructed treads must not compete in the depth buffer');
 }
});

test('O2 continuous corner treads do not acquire short zigzags from overlapping source patches',()=>{
 const skin=sourceStandGeometry(venue.sourceSeats,'o2a',venue.researchRenderBatch.standGeometry);
 const edges=skin.risers.filter(q=>q[0][1]===5.81&&q[0][0]>10&&q[0][0]<13&&q[0][2]>42&&q[0][2]<46).sort((a,b)=>Math.atan2(a[0][2],a[0][0])-Math.atan2(b[0][2],b[0][0]));
 assert.ok(edges.length>10);
 for(let i=1;i<edges.length;i++){
  const a=edges[i-1],b=edges[i];
  if(Math.hypot(a[1][0]-b[0][0],a[1][2]-b[0][2])>1e-5)continue;
  const heading=q=>Math.atan2(q[1][2]-q[0][2],q[1][0]-q[0][0]);
  assert.ok(angleBetween(heading(a),heading(b))<.35,'a continuous corner must not turn 70 degrees over a tenth of a source unit');
 }
});

test('rounded chair surfaces keep the shared collision bounds and vertical backrest',()=>{
 for(const part of records[0].chairParts.slice(0,2)){
  const geometry=chairGeometry(part,true);geometry.computeBoundingBox();
  for(let axis=0;axis<3;axis++)for(const end of ['min','max']){
   const value=geometry.boundingBox[end].getComponent(axis);
   assert.ok(value>=part.center[axis]-part.size[axis]/2-1e-6&&value<=part.center[axis]+part.size[axis]/2+1e-6,'rounding never expands a chair into its neighbour or walkway');
  }
  const normals=geometry.getAttribute('normal');
  assert.ok(Array.from({length:normals.count},(_,i)=>[normals.getX(i),normals.getY(i),normals.getZ(i)]).some(n=>n.filter(v=>Math.abs(v)>.1).length>1),'bevels carry diagonal normals instead of six hard box faces');
  geometry.dispose();
 }
 const record=seat('109','277'),box={size:[.02,.02,.02],center:[record.p[0]-.19*Math.sin(record.angle),record.p[1]+.63,record.p[2]-.19*Math.cos(record.angle)]};
 assert.equal(seatIntersectsBox(record,box),false,'clearance uses the same short O2 backrest as the viewer');
 assert.equal(seatIntersectsBox({...record,chairParts},box),true,'legacy taller chairs keep their own collision bounds');
});

test('O2 step risers and boundary walls do not cut through source cushions or backrests',()=>{
 const skin=sourceStandGeometry(venue.sourceSeats,'o2a',venue.researchRenderBatch.standGeometry),buckets=new Map();
 assert.ok(skin.walls.length>0,'keep structural boundary walls rather than hiding them');
 for(const record of records){
  const key=JSON.stringify([Math.floor(record.p[0]/2),Math.floor(record.p[2]/2)]);
  if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(record);
 }
 for(const face of [...skin.risers,...skin.walls]){
  const lo=[0,1,2].map(axis=>Math.min(...face.map(p=>p[axis]))),hi=[0,1,2].map(axis=>Math.max(...face.map(p=>p[axis])));
  for(let x=Math.floor((lo[0]-.5)/2);x<=Math.floor((hi[0]+.5)/2);x++)for(let z=Math.floor((lo[2]-.5)/2);z<=Math.floor((hi[2]+.5)/2);z++){
   for(const record of buckets.get(JSON.stringify([x,z]))||[]){
    if(record.p[1]+.685<=lo[1]||record.p[1]+.22>=hi[1])continue;
    for(const part of record.chairParts.slice(0,2)){
     const box={size:[part.size[0]*record.width,part.size[1],part.size[2]],angle:record.angle,center:[record.p[0]+part.center[2]*Math.sin(record.angle),record.p[1]+part.center[1],record.p[2]+part.center[2]*Math.cos(record.angle)]};
     assert.ok(!polygonIntersectsBox(face,box),`step face cuts ${record.section}/${record.row}/${record.seat} at ${JSON.stringify(face)}`);
    }
   }
  }
 }
});
