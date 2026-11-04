import test from 'node:test';
import assert from 'node:assert/strict';
import {createHydroMapGestures} from '../public/concert-views/hydro-map-gestures.mjs';

function harness(){
 const svg=new EventTarget(),captures=[];
 // A letterboxed SVG: one viewBox unit spans two CSS pixels, with an offset.
 svg.getScreenCTM=()=>({inverse:()=>({a:.5,d:.5,e:-10,f:-50})});
 svg.createSVGPoint=()=>({x:0,y:0,matrixTransform(m){return {x:this.x*m.a+m.e,y:this.y*m.d+m.f};}});
 svg.setPointerCapture=id=>captures.push(id);
 let view={zoom:2,pan:[-20,-40]},commits=0;
 const rig=createHydroMapGestures(svg,()=>view,(next,commit)=>{view=next;if(commit)commits++;});
 function event(type,values={}){const e=new Event(type,{cancelable:true});Object.assign(e,{button:0,...values});svg.dispatchEvent(e);return e;}
 return {rig,event,captures,get view(){return view;},get commits(){return commits;}};
}
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≈ ${b}`);

test('Hydro 2D pinch preserves the world point under the moving fingers with SVG letterboxing',()=>{
 const h=harness();
 h.event('pointerdown',{pointerId:1,clientX:100,clientY:200});
 h.event('pointerdown',{pointerId:2,clientX:200,clientY:200});
 // Old midpoint=(65,50), world point=(42.5,45). New midpoint=(90,60).
 h.event('pointermove',{pointerId:2,clientX:300,clientY:240});
 close((90-h.view.pan[0])/h.view.zoom,42.5);close((60-h.view.pan[1])/h.view.zoom,45);
 assert.ok(h.view.zoom>4);assert.ok(h.captures.includes(1)&&h.captures.includes(2));
 h.event('pointerup',{pointerId:2});const pan=[...h.view.pan];
 h.event('pointermove',{pointerId:1,clientX:110,clientY:220});
 close(h.view.pan[0],pan[0]+5);close(h.view.pan[1],pan[1]+10);
 h.event('pointercancel',{pointerId:1});assert.equal(h.commits,2);
 const settled=structuredClone(h.view);h.event('pointermove',{pointerId:1,clientX:800,clientY:700});assert.deepEqual(h.view,settled);
 h.rig.dispose();
});

test('Hydro 2D taps still select, drag/pinch clicks are suppressed, and a new tap recovers',()=>{
 const h=harness();
 h.event('pointerdown',{pointerId:1,clientX:100,clientY:200});h.event('pointerup',{pointerId:1});
 assert.equal(h.event('click').defaultPrevented,false);assert.equal(h.captures.length,0);
 h.event('pointerdown',{pointerId:2,clientX:100,clientY:200});
 h.event('pointermove',{pointerId:2,clientX:120,clientY:210});h.event('pointerup',{pointerId:2});
 assert.equal(h.event('click').defaultPrevented,true);
 h.event('pointerdown',{pointerId:3,clientX:100,clientY:200});h.event('pointerup',{pointerId:3});
 assert.equal(h.event('click').defaultPrevented,false);h.rig.dispose();
});

test('Hydro 2D wheel uses the cursor anchor, bounds zoom and releases handlers on disposal',()=>{
 const h=harness(),world=[30,45];
 assert.equal(h.event('wheel',{clientX:100,clientY:200,deltaY:-100}).defaultPrevented,true);
 close((40-h.view.pan[0])/h.view.zoom,world[0]);close((50-h.view.pan[1])/h.view.zoom,world[1]);
 for(let i=0;i<30;i++)h.event('wheel',{clientX:100,clientY:200,deltaY:-100});assert.equal(h.view.zoom,8);
 for(let i=0;i<60;i++)h.event('wheel',{clientX:100,clientY:200,deltaY:100});assert.equal(h.view.zoom,.75);
 h.rig.dispose();const settled=structuredClone(h.view);h.event('wheel',{clientX:0,clientY:0,deltaY:-1});assert.deepEqual(h.view,settled);
});
