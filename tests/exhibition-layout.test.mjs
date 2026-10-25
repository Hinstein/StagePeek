import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadVenues} from '../server/venues.mjs';
import {normalizeVenueManifest,validateVenueManifest} from '../server/venue-import.mjs';
import {baseSeatRecords,sectionPoint,sectionSteps,stageRects,performer,blockSpan} from '../public/geometry.mjs';
import {sceneCollisions,seatRecords,stageBoxes} from '../public/scene-geometry.mjs';
const v=loadVenues().get('hkcec-hall-5bc');
const manifest=JSON.parse(readFileSync(new URL('../data/manual-venues/hkcec-hall-5bc.json',import.meta.url)));

test('exhibition source polygons, dated rig and uncertainty survive canonical normalization',()=>{
 const rebuilt=normalizeVenueManifest(manifest);
 assert.deepEqual(rebuilt.geometry,v.geometry);
 assert.deepEqual(rebuilt.sections,v.sections);
 assert.equal(rebuilt.sections.filter(s=>!s.block.risers).length,40);
 assert.equal(rebuilt.sections.filter(s=>s.block.risers).length,18);
 assert.equal(rebuilt.accuracy.metricCalibrated,false);
 assert.equal(rebuilt.accuracy.completeSeatInventory,false);
 assert.match(rebuilt.accuracy.coverage,/非官方区号/);
});

test('notched blocks keep the runway gap and all seating remains inside source outlines',()=>{
 const section=v.sections.find(s=>s.id==='ivana-floor-2-left-4');
 // Original diagram's x=489 notch narrows the rear half to [5.1,8.9].
 const p=sectionPoint(v,section,.8,-1);
 assert.ok(p[0]>5.099&&p[0]<5.101);
 for(const record of baseSeatRecords(v)){
  const s=v.sections.find(s=>s.id===record.section),[left,right]=blockSpan(s.block,record.p[2]);
  assert.ok(record.p[0]>left&&record.p[0]<right,`${s.id}: chair outside polygon`);
  assert.ok(Math.abs(record.angle-Math.PI)<1e-10,'chairs must face the stage, not the slope of the block edge');
 }
 for(const s of v.sections)for(const quad of sectionSteps(v,s).treads){
  const center=quad.reduce((acc,p)=>acc.map((n,i)=>n+p[i]/4),[0,0,0]),[left,right]=blockSpan(s.block,center[2]);
  assert.ok(center[0]>=left-1e-6&&center[0]<=right+1e-6,'deck must not bridge a notch');
 }
});

test('dated stage, thrust, FOH and screens do not intersect chairs or fill equipment gaps',()=>{
 assert.equal(sceneCollisions(v,'end').length,0);
 assert.equal(seatRecords(v).length,baseSeatRecords(v).length,'collision fix must not hide source block seats');
 assert.equal(stageBoxes('end',v).filter(b=>b.kind==='screen').length,2,'do not invent a third automatic backdrop');
 assert.deepEqual(performer('end',v),[-.1,1.5,10.9]);
 for(const preset of ['runway','center'])assert.deepEqual(stageRects(preset,v),stageRects('end',v),'generic preset must not overwrite a dated seating layout');
});

test('manifest rejects non-finite, mismatched and disconnected polygon rows',()=>{
 for(const polygon of [[[0,0],[1,0],[NaN,1]],[[0,0],[1,0],[1,1],[0,1]]]){
  const copy=structuredClone(manifest);copy.sections[0].block.polygon=polygon;
  assert.equal(validateVenueManifest(copy).valid,false);
 }
 const copy=structuredClone(manifest),b=copy.sections[0].block;
 Object.assign(b,{x:2,z:2,width:4,depth:4,polygon:[[0,0],[4,0],[4,4],[3,4],[3,1],[1,1],[1,4],[0,4]]});
 assert.equal(validateVenueManifest(copy).valid,false);
});
