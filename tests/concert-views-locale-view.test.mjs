import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as THREE from '../public/vendor/three.module.min.js';
import {localeViewKey,readLocaleView} from '../public/concert-views/locale-view.mjs';

const key=localeViewKey(new URLSearchParams('venue=o2&layout=o2a&section=110&row=T&seat=319'));
const view={mode:'seat',position:[30,7.18,10],target:[0,2,-20],fov:9.87,phone:true,roof:false};
test('locale view accepts only finite view state belonging to the same selected ticket',()=>{
 assert.deepEqual(readLocaleView(JSON.stringify({key,view}),key),view);
 for(const value of ['{',JSON.stringify({key:'other',view}),JSON.stringify({key,view:{...view,fov:0}}),JSON.stringify({key,view:{...view,position:[null,0,0]}}),JSON.stringify({key,view:{...view,target:view.position}})])assert.equal(readLocaleView(value,key),null);
 assert.notEqual(localeViewKey(new URLSearchParams('venue=o2&layout=o2a&section=110&row=T&seat=318')),key);
});

test('actual viewer restores seated eye, gaze and framing without drift and rejects a different seat',()=>{
 const source=readFileSync(new URL('../public/concert-views/viewer.mjs',import.meta.url),'utf8');
 const camera=new THREE.PerspectiveCamera(),canvas={clientWidth:1000,clientHeight:600,dataset:{}};
 const run=new Function('THREE','camera','canvas','view',`
 let cameraMode='overview',sectionFocus=false,stageFocused=false,phoneFraming=false,tween={};
 let position=[30,6,10],matched=true,dirty=true,pending=false,last=0;
 const vec=p=>new THREE.Vector3(...p),VENUE_CAMERA_POLICY={eyeHeight:1.18},look={},roofGroup={visible:true},controls={enabled:true,target:new THREE.Vector3()};
 const setCameraMode=value=>{cameraMode=value;},setSeatLod=()=>{},updateRowLabels=()=>{},onMode=()=>{},fovToZoom=v=>v,wake=()=>{};
 ${source.slice(source.indexOf('  function getView('),source.indexOf('  function resize('))}
 const restored=restoreView(view),before=getView();
 const document={hidden:false},mode='3d',venue={},reduced=false,clamp=THREE.MathUtils.clamp,labelsForView=()=>{},palette={clear:0},floorView=false,scene={};
 const phoneFrameRect=()=>({x:0,y:0,width:800,height:600});
 const renderer={setScissorTest(){},setViewport(){},setScissor(){},setClearColor(){},clear(){},render(){},info:{render:{calls:1},memory:{geometries:1}}};
 ${source.slice(source.indexOf('  function animate('),source.indexOf('  let down=null;'))}
 animate(1000);animate(1016);
 const after=getView();position=[31,6,10];const rejected=restoreView(view);
 return {restored,before,after,rejected};
 `);
 const result=run(THREE,camera,canvas,view);
 assert.equal(result.restored,true);assert.equal(result.rejected,false);
 for(const state of [result.before,result.after]){
  assert.deepEqual(state.position,view.position);assert.equal(state.fov,view.fov);assert.equal(state.phone,true);assert.equal(state.roof,false);
  const actual=new THREE.Vector3(...state.target).sub(new THREE.Vector3(...state.position)).normalize();
  const expected=new THREE.Vector3(...view.target).sub(new THREE.Vector3(...view.position)).normalize();
  assert.ok(actual.distanceTo(expected)<1e-10);
 }
});
