import test from 'node:test';
import assert from 'node:assert/strict';
import * as explorer from '../public/explorer-state.mjs';
const {createMapTransform,zoomMap,rotateMap,resetMap}=explorer;

test('zoom keeps a panned map center and is bounded',()=>{
 const original=createMapTransform([10,-4,100,80]);
 const panned=explorer.panMap(original,20,-10);
 const zoomed=zoomMap(panned,2);
 assert.deepEqual(zoomed.viewBox,[55,6,50,40]);
 assert.equal(zoomMap(zoomed,100).zoom,8);
 assert.equal(zoomMap(zoomed,.001).zoom,.75);
 assert.deepEqual(resetMap(zoomed),original);
});
test('quarter turn fits a rectangular map without clipping and resets exactly',()=>{
 const original=createMapTransform([10,-4,100,80]);
 const rotated=rotateMap(original,90);
 assert.deepEqual(rotated.viewBox,[20,-14,80,100]);
 assert.equal(rotated.rotation,90);
 assert.deepEqual(rotateMap(rotated,270),original);
 assert.deepEqual(resetMap(zoomMap(rotated,2)),original);
});
test('rotation preserves the current pan center and pan keeps map content reachable',()=>{
 const original=createMapTransform([0,0,100,50]);
 const panned=explorer.panMap(original,30,20);
 const rotated=rotateMap(panned,90);
 assert.ok(Math.abs(rotated.viewBox[0]-55)<1e-9);
 assert.ok(Math.abs(rotated.viewBox[1]+5)<1e-9);
 assert.ok(Math.abs(rotated.viewBox[2]-50)<1e-9);
 assert.ok(Math.abs(rotated.viewBox[3]-100)<1e-9);
 const dragged=explorer.panMap(original,10000,10000);
 assert.ok(dragged.viewBox[0] < 10000 && dragged.viewBox[1] < 10000);
 assert.ok(dragged.viewBox[0]+dragged.viewBox[2] > 0);
 assert.ok(dragged.viewBox[1]+dragged.viewBox[3] > 0);
});
test('phone frame fits the viewport at a consistent 4:3 aspect',()=>{
 for(const [width,height] of [[1000,560],[390,520],[844,390]]){
  const r=explorer.phoneFrameRect(width,height);
  assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=width&&r.y+r.height<=height);
  assert.ok(Math.abs(r.width/r.height-4/3)<.0001);
 }
});
