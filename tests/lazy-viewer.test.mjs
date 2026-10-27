import {interfaceCopy} from '../public/translations/interface.mjs';
const copy=(source,values)=>interfaceCopy(source,values,'zh-CN');
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../public/app.mjs',import.meta.url),'utf8');
const source=app.slice(app.indexOf('let viewerLoading=null;'),app.indexOf("try{\n  const params=new URLSearchParams(location.search)")).replace("await import('./viewer.mjs')",'await load()');
function harness(load){
 const state={mode:'3d'},nodes=new Map(),toasts=[],modes=[];
 const $=id=>{if(!nodes.has(id))nodes.set(id,{});return nodes.get(id);};
 const camera={setMode:mode=>modes.push(mode),setZoom:()=>{}};
 const create=new Function('load','state','$','render','toast','chooseSection','chooseSample','chooseEstimatedSeat','window','copy',`let viewer=null;${source};return {ensureViewer};`);
 const {ensureViewer}=create(load,state,$,()=>{},text=>toasts.push(text),()=>{},()=>{},()=>{},{stagepeekTrack:()=>{}},copy);
 return {state,$,toasts,modes,camera,ensureViewer};
}
test('WebGL creation failure keeps the selected venue usable in 2D',async()=>{
 const h=harness(async()=>({createViewer:()=>{throw new Error('WebGL unavailable');}}));
 h.state.venue={id:'taipei-arena'};await h.ensureViewer();
 assert.equal(h.state.mode,'2d');assert.equal(h.state.venue.id,'taipei-arena');
 assert.equal(h.$('mode-3d').disabled,true);assert.match(h.toasts[0],/二维地图/);
});
test('concurrent 3D requests share a load and honor a switch back to 2D while loading',async()=>{
 let finish,calls=0;const h=harness(()=>{calls++;return new Promise(resolve=>finish=resolve);});
 const first=h.ensureViewer(),second=h.ensureViewer();assert.equal(calls,1);
 h.state.mode='2d';finish({createViewer:()=>h.camera});await Promise.all([first,second]);
 assert.deepEqual(h.modes,['2d']);assert.equal(h.$('mode-3d').disabled,false);
 await h.ensureViewer();assert.equal(calls,1);
});
