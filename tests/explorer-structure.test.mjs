import test from 'node:test';
import assert from 'node:assert/strict';
import {loadVenues} from '../server/venues.mjs';
import * as scene from '../public/scene-geometry.mjs';
const venues=loadVenues();
test('illustrative roof spans each venue above all seats without changing source positions or stage',()=>{
 for(const id of ['tokyo-garden-theater','ajinomoto-stadium','tottenham','kspo-dome','asiaworld-viva']){
  const v=venues.get(id,'end'),records=scene.seatRecords(v,'end');
  const before=JSON.stringify([records,scene.stageBoxes('end',v)]);
  const roof=scene.roofStructure(v,records);
  assert.equal(roof.basis,'illustrative');
  assert.ok(roof.segments.length>20&&roof.segments.length<5000);
  const highest=records.reduce((max,r)=>Math.max(max,r.p[1]),0);
  for(const p of roof.segments){assert.ok(p.every(Number.isFinite));assert.ok(p[1]>highest+2);}
  assert.equal(JSON.stringify([records,scene.stageBoxes('end',v)]),before);
 }
});
