import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../public/vendor/three.module.min.js';
import {createHydroCamera,encodeHydroView,decodeHydroView,HYDRO_CAMERA_POLICY} from '../public/concert-views/hydro-camera.mjs';

function harness(){
 const canvas=new EventTarget();canvas.setPointerCapture=()=>{};canvas.clientHeight=600;
 const controls=new THREE.EventDispatcher();controls.target=new THREE.Vector3();controls.update=()=>{};
 const camera=new THREE.PerspectiveCamera();let commits=0;
 const rig=createHydroCamera(camera,controls,canvas,()=>{},()=>commits++);
 const event=(type,values)=>{const e=new Event(type,{cancelable:true});Object.assign(e,values);canvas.dispatchEvent(e);return e;};
 return {camera,controls,rig,event,get commits(){return commits;}};
}
const audience={mode:'audience',position:[36,7,-26],target:[0,2,-40],fov:60};

test('audience mouse/touch look and wheel/pinch zoom keep the eye fixed, with no orbit or pan',()=>{
 const h=harness();h.rig.setView(audience);const eye=h.camera.position.toArray();
 assert.equal(h.controls.enabled,false);
 h.event('pointerdown',{pointerId:1,button:0,clientX:100,clientY:100});
 h.event('pointermove',{pointerId:1,clientX:145,clientY:110});
 assert.deepEqual(h.camera.position.toArray(),eye);assert.notDeepEqual(h.rig.state().target,audience.target);
 h.event('pointerup',{pointerId:1});const target=h.rig.state().target;
 h.rig.zoomBy(1.4);assert.deepEqual(h.rig.state().position,eye);assert.ok(h.rig.state().fov<60);
 assert.equal(h.event('wheel',{deltaY:-120,deltaMode:0}).defaultPrevented,true);
 assert.ok(h.rig.state().fov<60);assert.deepEqual(h.rig.state().target,target);
 h.event('pointerdown',{pointerId:2,button:0,clientX:100,clientY:100});h.event('pointerdown',{pointerId:3,button:0,clientX:150,clientY:100});
 const fov=h.rig.state().fov;h.event('pointermove',{pointerId:3,clientX:180,clientY:100});
 assert.ok(h.rig.state().fov<fov);assert.deepEqual(h.rig.state().position,eye);assert.deepEqual(h.rig.state().target,target);
 h.event('pointercancel',{pointerId:2});h.event('pointerup',{pointerId:3});
 assert.ok(h.commits>=5);h.rig.dispose();
});

test('camera modes restore exact gaze/zoom; orbit remains enabled outside audience',()=>{
 const h=harness();h.rig.setView(audience);
 for(const mode of ['overview','near','stage']){h.rig.setView({...audience,mode});assert.equal(h.controls.enabled,true);}
 h.rig.setView(audience);h.event('wheel',{deltaY:1e6,deltaMode:0});assert.ok(h.rig.state().fov<=HYDRO_CAMERA_POLICY.maxFov);
 const state=h.rig.state();h.rig.setView({...audience,mode:'near'});h.rig.setView(state);assert.deepEqual(h.rig.state(),state);
 h.rig.dispose();
});

test('versioned camera URLs round-trip, reject stale ticket state and malformed values',()=>{
 const key='camera-test-selection',encoded=encodeHydroView(audience,key);
 assert.deepEqual(decodeHydroView(encoded,key),audience);
 assert.deepEqual(decodeHydroView(encoded.replace(HYDRO_CAMERA_POLICY.version,'v1'),key),audience,'legacy saved gaze/FOV survives new default framing');
 assert.equal(decodeHydroView(encoded,'section-204/D/66'),null);
 for(const value of [encoded.replace(HYDRO_CAMERA_POLICY.version,'v9'),encoded.replace('~36~','~NaN~'),encoded.replace('~60','~0'),encoded+'~1'])assert.equal(decodeHydroView(value,key),null);
});

test('continuous phone magnifications change only FOV and round-trip through saved links',()=>{
 const h=harness();h.rig.setView(audience);
 for(const value of [1,2,5.4,8,10]){
  h.rig.setZoom(value);const view=h.rig.state();
  assert.deepEqual(view.position,audience.position);assert.deepEqual(view.target,audience.target);
  assert.ok(Math.abs(Math.tan(25*Math.PI/180)/Math.tan(view.fov*Math.PI/360)-value)<1e-10);
  assert.deepEqual(decodeHydroView(encodeHydroView(view,'seat'),'seat'),view);
 }
 h.event('wheel',{deltaY:-120,deltaMode:0});assert.equal(h.rig.state().fov,HYDRO_CAMERA_POLICY.minFov);
 h.rig.dispose();
});
