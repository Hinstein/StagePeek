import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as THREE from '../public/vendor/three.module.min.js';

for(const path of ['../public/concert-views/viewer.mjs'])test(path+' renders the final camera tween pose even without another dirty event',()=>{
 const source=readFileSync(new URL(path,import.meta.url),'utf8');
 const camera=new THREE.PerspectiveCamera(),target=new THREE.Vector3(0,2,0),end=new THREE.Vector3(10,20,30),canvas={clientWidth:1000,clientHeight:600,dataset:{}};
 const frames=[];
 const run=new Function('THREE','camera','target','end','canvas','frames',`
  let pending=true,last=0,dirty=false,tween={start:0,from:camera.position.clone(),p:end,fromQ:camera.quaternion.clone(),q:camera.quaternion.clone(),fromFov:43,fov:50,target};
  const document={hidden:false},mode='3d',venue={},reduced=false,cameraMode='overview',controls={target:new THREE.Vector3(),enabled:false},clamp=THREE.MathUtils.clamp;
  const renderer={setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){frames.push(camera.position.toArray());},info:{render:{calls:1},memory:{geometries:1}}};
  const scene={},palette={clear:0},phoneFraming=false,floorView=false,roofGroup={visible:false},labelsForView=()=>{},wake=()=>{};
  ${source.slice(source.indexOf('  function animate('),source.indexOf('  let down=null;'))}
  animate(1000);
  return {pending,tween,enabled:controls.enabled};
 `);
 const state=run(THREE,camera,target,end,canvas,frames);
 assert.deepEqual(frames,[end.toArray()]);
 assert.equal(canvas.dataset.frame,'1');assert.equal(state.tween,null);assert.equal(state.enabled,true);
});

for(const path of ['../public/concert-views/viewer.mjs'])test(path+' hands an in-progress overview transition to the first drag',()=>{
 const source=readFileSync(new URL(path,import.meta.url),'utf8');
 const capture=source.slice(source.indexOf("  canvas.addEventListener('pointerdown',e=>"),source.indexOf('  const audienceGestures='));
 const run=new Function('cameraMode',`
  let tween={start:0},down=null,wakes=0,listener;
  const controls={enabled:false},canvas={addEventListener(type,fn){listener=fn;}},wake=()=>wakes++;
  ${capture}
  listener({button:0,clientX:100,clientY:100});
  // OrbitControls receives this same pointerdown after the capture listener.
  return {accepted:controls.enabled,tween,wakes,down};
 `);
 const overview=run('overview');
 assert.equal(overview.accepted,true,'first drag must reach OrbitControls during the transition');
 assert.equal(overview.tween,null,'the flight must not overwrite the user drag');
 assert.equal(overview.wakes,1);
 assert.equal(run('seat').accepted,false,'seated drag belongs to gaze controls');
});
