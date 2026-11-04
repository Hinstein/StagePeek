import {venuePalette} from '../public/venue-view/venue-palette.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadConcertViews} from '../server/concert-views/index.mjs';
const loadGlobalSources=()=>({get:id=>id==='ovo-hydro'?loadConcertViews().hydro:null});
import {buildHydroDisplay} from '../public/concert-views/hydro-display.mjs';
import {HYDRO_CAMERA_POLICY,createHydroCamera} from '../public/concert-views/hydro-camera.mjs';
import * as THREE from '../public/vendor/three.module.min.js';
import {chairGeometry} from '../public/concert-views/chair-geometry.mjs';
import {chairParts} from '../public/concert-views/spatial.mjs';
import {phoneFrameRect} from '../public/concert-views/explorer-state.mjs';
import {roofStructure} from '../public/concert-views/scene-geometry.mjs';

const source=readFileSync(new URL('../public/concert-views/hydro-viewer.mjs',import.meta.url),'utf8');
const model=buildHydroDisplay(loadGlobalSources().get('ovo-hydro'),'hydro-event-noah-kahan-20261105');

test('Hydro audience camera keeps inferred chair identity and eye position after a reference and on repeat entry',()=>{
 const canvas={dataset:{}},poses=[];
 const viewer=new Function('model','canvas','pose','HYDRO_CAMERA_POLICY','venuePalette','copy',`
  let selected='section-204',picked=null,mode='overview',referenceLabel=null;
  const chairMeshes=[],root={remove(){}},render=()=>{};
  const label=()=>({material:{map:{dispose(){}},dispose(){}}});
  ${source.slice(source.indexOf(' function audience('),source.indexOf(' function stage('))}
  return {audience,selectReference};
 `)(model,canvas,(position,target,fov)=>poses.push({position,target,fov}),HYDRO_CAMERA_POLICY,venuePalette,text=>text);
 viewer.audience(model.references[0].chair);
 assert.ok(canvas.dataset.referenceTicket);
 const chair=model.sections.find(s=>s.id==='section-204').chairs.find(c=>!c.referenceTicket);
 viewer.audience(chair);
 assert.equal(canvas.dataset.referenceTicket,'');
 assert.ok(canvas.dataset.inferredTicket);
 assert.equal(canvas.dataset.seatPosition,JSON.stringify(chair.p));
 assert.deepEqual(poses.at(-1).position,[chair.p[0],chair.p[1]+1.18,chair.p[2]]);
 viewer.audience();
 assert.deepEqual(poses.at(-1),poses.at(-2));
 viewer.selectReference(null);
 viewer.audience(null,'D');
 const row=model.sections.find(s=>s.id==='section-204').chairs.filter(c=>c.displayRow==='D');
 const middle=row[Math.floor(row.length/2)];
 assert.deepEqual(poses.at(-1).position,[middle.p[0],middle.p[1]+1.18,middle.p[2]]);
 assert.equal(poses.at(-1).fov,50);
 for(const section of model.sections){
  const chair=section.chairs[Math.floor(section.chairs.length/2)];viewer.audience(chair);
  const view=poses.at(-1),camera=new THREE.PerspectiveCamera(view.fov,16/9,.1,1000);
  camera.position.set(...view.position);camera.lookAt(new THREE.Vector3(...view.target));camera.updateMatrixWorld();
  const performer=new THREE.Vector3(model.performer[0],model.performer[1]+1,model.performer[2]).project(camera);
  assert.ok(performer.y>.27&&performer.y<.36,`${section.label}: performer is above centre with less empty sky`);
  assert.ok(Math.abs(performer.x)<.001);assert.deepEqual(view.position,[chair.p[0],chair.p[1]+1.18,chair.p[2]]);
 }
});


test('shipped Hydro viewer preserves camera on model changes and seated taps cannot change seats',()=>{
 class Canvas extends EventTarget {parentElement={style:{setProperty(){}}};dataset={};width=1000;clientHeight=600;setPointerCapture(){}getBoundingClientRect(){return {width:this.width,height:this.clientHeight,left:0,top:0};}}
 class Controls extends THREE.EventDispatcher {target=new THREE.Vector3();update(){}dispose(){}}
 const context={measureText:t=>({width:t.length*30}),strokeText(){},fillText(){}};
 const document={createElement:()=>({getContext:()=>context})};
 let renderedScene,renderedCamera,viewport;
 const renderer=class {setPixelRatio(){}setSize(){}setViewport(...args){viewport=args;}setScissor(){}setScissorTest(){}clear(){}render(scene,camera){renderedScene=scene;renderedCamera=camera;}dispose(){}};
 const Observer=class {observe(){}disconnect(){}};
 const create=new Function('venuePalette','THREE','OrbitControls','chairGeometry','chairParts','document','ResizeObserver','devicePixelRatio','createHydroCamera','HYDRO_CAMERA_POLICY','phoneFrameRect','roofStructure','copy',source.replace(/^import .*;\n/gm,'').replace('export function','function')+';return createHydroViewer;')(venuePalette,{...THREE,WebGLRenderer:renderer},Controls,chairGeometry,chairParts,document,Observer,1,createHydroCamera,HYDRO_CAMERA_POLICY,phoneFrameRect,roofStructure,text=>text);
 const canvas=new Canvas();let picks=0;
 const viewer=create(canvas,()=>picks++);viewer.setModel(model);
 const aisle=renderedScene.children.flatMap(o=>o.children).find(o=>o.material?.color?.getHexString()==='737b90');
 assert.ok(aisle,'walking surfaces are rendered');
 assert.ok(aisle.material.depthTest&&aisle.material.depthWrite,'aisles retain normal occlusion');
 assert.ok(aisle.material.polygonOffset&&aisle.material.polygonOffsetFactor<0&&aisle.material.polygonOffsetUnits<0,'coplanar aisle patches must have a stable depth priority over treads');
 viewer.selectSection('section-225');viewer.audience(model.sections.find(s=>s.id==='section-225').chairs[0]);
 viewer.togglePhoneFrame(true);viewer.toggleRoof(true);viewer.toggleEventFloor(false);
 assert.equal(canvas.dataset.phoneFrame,'true');assert.equal(canvas.dataset.roof,'true');
 assert.deepEqual(JSON.parse(canvas.dataset.frameRect),phoneFrameRect(1000,600));
 const roof=renderedScene.children.flatMap(o=>o.children).find(o=>o.isLineSegments);assert.ok(roof.visible);
 assert.ok(renderedScene.children.flatMap(o=>o.children).filter(o=>o.userData.zone?.kind==='standing').every(o=>!o.visible));
 assert.ok(renderedScene.children.flatMap(o=>o.children).filter(o=>o.userData.zone?.kind==='stage').every(o=>o.visible));
 assert.ok(Math.abs(renderedCamera.aspect-4/3)<1e-12);
 const frame=phoneFrameRect(1000,600);assert.deepEqual(viewport,[frame.x,600-frame.y-frame.height,frame.width,frame.height]);
 const unchanged=viewer.getView();canvas.width=390;canvas.clientHeight=440;viewer.render();assert.deepEqual(viewer.getView(),unchanged);assert.ok(Math.abs(renderedCamera.aspect-4/3)<1e-12);
 const view=viewer.getView();view.target=[10,5,0];view.fov=42;viewer.restoreView(view);
 const event=(type)=>{const e=new Event(type);Object.assign(e,{clientX:100,clientY:100});canvas.dispatchEvent(e);};
 event('pointerdown');event('pointerup');assert.equal(picks,0);assert.deepEqual(viewer.getView(),view);
 viewer.setModel(buildHydroDisplay(loadGlobalSources().get('ovo-hydro'),'hydro-event-noah-kahan-20261106'));
 assert.deepEqual(viewer.getView(),view);assert.equal(canvas.dataset.phoneFrame,'true');assert.equal(canvas.dataset.roof,'true');assert.equal(canvas.dataset.eventFloor,'false');
 viewer.togglePhoneFrame(false);assert.deepEqual(viewer.getView(),view);viewer.togglePhoneFrame(true);
 viewer.setModel(buildHydroDisplay(loadGlobalSources().get('ovo-hydro')));assert.deepEqual(viewer.getView(),view);
 viewer.setModel(model);viewer.stage();viewer.setModel(buildHydroDisplay(loadGlobalSources().get('ovo-hydro')));assert.equal(viewer.getView().mode,'overview');
 viewer.dispose();
});
