import test from 'node:test';
import assert from 'node:assert/strict';
import {mountVenueView,mountVenueTicketForm,VENUE_VIEW_CONTROLS} from '../public/venue-view/venue-view-controls.mjs';
import {bindAudienceGestures,VENUE_CAMERA_POLICY,venueZoomToFov,venueFovToZoom,scaleVenueFov} from '../public/venue-view/venue-camera-policy.mjs';
import {venuePalette} from '../public/venue-view/venue-palette.mjs';

class Element extends EventTarget {
 constructor(doc){super();this.ownerDocument=doc;this.children=[];this.dataset={};this.attributes={};this.style={setProperty:(k,v)=>this.style[k]=v};this.classes=new Set();this.classList={add:k=>this.classes.add(k),contains:k=>this.classes.has(k),toggle:(k,on)=>on?this.classes.add(k):this.classes.delete(k)};}
 append(...children){this.children.push(...children);}
 prepend(...children){this.children.unshift(...children);}
 setAttribute(k,v){this.attributes[k]=String(v);}
 toggleAttribute(k,value){if(value)this.setAttribute(k,'');else delete this.attributes[k];}
}
class Document extends EventTarget {
 constructor(){super();this.body=new Element(this);this.fullscreenElement=null;}
 createElement(){return new Element(this);}
 async exitFullscreen(){this.fullscreenElement=null;this.dispatchEvent(new Event('fullscreenchange'));}
}
function view(legacyIds=false){const doc=new Document(),root=doc.createElement(),canvas=doc.createElement(),map=doc.createElement(),selection=doc.createElement(),actions=[];const shell=mountVenueView(root,{canvas,map,selection,legacyIds,onAction:(...args)=>actions.push(args)});return {doc,root,canvas,map,shell,actions};}
function all(root){return [root,...root.children.flatMap(all)];}

test('both venue adapters receive the same mandatory controls, palette and phone frame',()=>{
 for(const legacy of [false,true]){
  const h=view(legacy),nodes=all(h.root);
  assert.equal(h.root.dataset.component,'venue-view-v1');
  for(const action of Object.keys(VENUE_VIEW_CONTROLS))assert.ok(h.shell.controls[action],action);
  assert.equal(nodes.filter(n=>n.dataset.zoom).length,0,'no fixed zoom buttons');
  const slider=nodes.find(n=>n.type==='range'),reticle=nodes.find(n=>n.className==='camera-reticle');
  assert.equal(slider.min,'1');assert.equal(slider.max,'10');assert.equal(slider.step,'0.1');
  assert.ok(all(reticle).includes(slider),'zoom is inside phone framing');
  slider.value='5.4';slider.oninput();assert.deepEqual(h.actions.at(-1),['zoom',5.4]);
  slider.value='10';slider.oninput();assert.deepEqual(h.actions.at(-1),['zoom',10]);
  for(const [key,value]of Object.entries(venuePalette))assert.equal(h.root.style['--venue-'+key],value);
  h.shell.controls.phone.onclick();assert.deepEqual(h.actions.at(-1),['phone',undefined]);
  h.shell.update({mode:'3d',cameraMode:'audience',canAudience:true,canStage:true,phone:true,roof:true,zoom:5});
  assert.equal(h.canvas.hidden,false);assert.equal(h.map.style.display,'none');
  assert.ok(h.root.classList.contains('phone-framing'));
  assert.equal(nodes.find(n=>n.className==='camera-reticle').hidden,false);
  assert.equal(h.shell.controls.audience.attributes['aria-pressed'],'true');
  assert.equal(slider.value,'5');assert.equal(slider.attributes['aria-valuetext'],'5×');
  h.shell.update({mode:'3d',cameraMode:'audience',canAudience:true,phone:false});assert.equal(reticle.hidden,true);
  h.shell.update({mode:'3d',cameraMode:'overview',canAudience:true,phone:true});assert.equal(reticle.hidden,true);
  h.shell.update({mode:'2d',canAudience:false,canStage:false,mapZoom:2});
  assert.equal(h.canvas.hidden,true);assert.equal(h.map.style.display,'block');
  assert.equal(h.shell.controls.phone.disabled,true);assert.equal(h.shell.controls.stage.disabled,true);
  assert.equal(nodes.find(n=>n.attributes['aria-label']==='地图缩放').textContent,'200%');
  h.shell.dispose();
 }
});

test('fullscreen uses native API or fallback, exits on Escape and cleans up on disposal',async()=>{
 const h=view(),full=all(h.root).find(n=>n.dataset.viewAction==='fullscreen');
 await full.onclick();assert.ok(h.root.classList.contains('is-expanded'));
 const escape=new Event('keydown');escape.key='Escape';h.doc.dispatchEvent(escape);
 assert.equal(h.root.classList.contains('is-expanded'),false);
 h.root.requestFullscreen=async()=>{h.doc.fullscreenElement=h.root;h.doc.dispatchEvent(new Event('fullscreenchange'));};
 await full.onclick();assert.equal(full.attributes['aria-label'],'退出全屏');
 await full.onclick();assert.equal(h.doc.fullscreenElement,null);
 h.root.requestFullscreen=undefined;await full.onclick();h.shell.dispose();
 assert.equal(h.doc.body.classList.contains('explorer-expanded'),false);
 h.root.classList.add('is-expanded');h.doc.dispatchEvent(escape);assert.ok(h.root.classList.contains('is-expanded'),'listener removed');
});

test('shared ticket form normalizes input and delegates lookup without inventing identities',()=>{
 const doc=new Document(),form=doc.createElement(),section=doc.createElement(),row=doc.createElement(),seat=doc.createElement(),submit=doc.createElement();
 row.value=' t ';seat.value=' 319 ';let result;
 const mounted=mountVenueTicketForm(form,{section,row,seat,submit,onSubmit:()=>result=[row.value,seat.value]});
 const event=new Event('submit',{cancelable:true});form.onsubmit(event);
 assert.equal(event.defaultPrevented,true);assert.deepEqual(result,['T','319']);
 assert.equal(form.dataset.component,'venue-ticket-v1');assert.equal(seat.inputMode,'numeric');
 mounted.dispose();assert.equal(form.onsubmit,null);
});

test('shared seated gestures stop after capture loss or disposal; zoom policy round trips',()=>{
 const canvas=new EventTarget();canvas.setPointerCapture=()=>{};let looks=0,zooms=0,factor=1;
 const rig=bindAudienceGestures(canvas,{active:()=>true,onLook:()=>looks++,onZoom:value=>{zooms++;factor=value;}});
 const emit=(type,values)=>{const e=new Event(type,{cancelable:true});Object.assign(e,values);canvas.dispatchEvent(e);};
 emit('pointerdown',{button:0,pointerId:1,clientX:0,clientY:0});emit('pointermove',{pointerId:1,clientX:20,clientY:0});assert.equal(looks,1);
 emit('lostpointercapture',{pointerId:1});emit('pointermove',{pointerId:1,clientX:40,clientY:0});assert.equal(looks,1);
 emit('pointerdown',{button:0,pointerId:2,clientX:0,clientY:0});emit('pointerdown',{button:0,pointerId:3,clientX:10,clientY:0});
 emit('pointermove',{pointerId:3,clientX:20,clientY:0});assert.equal(looks,1);assert.equal(factor,2);
 rig.clear();emit('pointermove',{pointerId:3,clientX:30,clientY:0});assert.equal(zooms,1);
 emit('wheel',{deltaMode:0,deltaY:100});assert.equal(zooms,2);rig.dispose();emit('wheel',{deltaY:100});assert.equal(zooms,2);
 for(const zoom of [1,2,5.4,8,10])assert.ok(Math.abs(venueFovToZoom(venueZoomToFov(zoom))-zoom)<1e-10);
 assert.equal(scaleVenueFov(50,2),25);assert.equal(scaleVenueFov(50,100),venueZoomToFov(10));assert.equal(scaleVenueFov(50,.01),75);
 assert.equal(VENUE_CAMERA_POLICY.eyeHeight,1.18);assert.ok(Object.isFrozen(VENUE_CAMERA_POLICY));
});

test('map rotation is available regardless of legacy element IDs',()=>{
 for(const legacy of [false,true]){
  const h=view(legacy);h.shell.update({mode:'2d'});
  assert.notEqual(h.shell.controls.mapRotate.hidden,true);
  h.shell.controls.mapRotate.onclick();assert.deepEqual(h.actions.at(-1),['mapRotate',undefined]);
  h.shell.dispose();
 }
});
