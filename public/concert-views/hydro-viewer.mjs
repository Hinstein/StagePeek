import {createVenueShell} from './venue-shell.mjs';
import {copy} from '../locales.mjs';
import {venuePalette} from '../venue-view/venue-palette.mjs';
import * as THREE from '../vendor/three.module.min.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {chairGeometry} from './chair-geometry.mjs';
import {chairParts} from './spatial.mjs';
import {createHydroCamera,HYDRO_CAMERA_POLICY} from './hydro-camera.mjs';
import {phoneFrameRect} from './explorer-state.mjs';
import {roofStructure} from './scene-geometry.mjs';
import {fitSceneView} from './scene-camera.mjs';
import {createSceneV2Assets,buildSilhouettePerformer,addStageLightingAndTruss,decorateEquipmentShape} from './scene-v2-kit.mjs';

export function createHydroViewer(canvas,onPick,onViewChange=()=>{}){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 if(renderer.shadowMap){renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;}
 const v2Assets=typeof createSceneV2Assets==='function'?createSceneV2Assets(renderer):null;
 const scene=new THREE.Scene();scene.background=new THREE.Color(venuePalette.background);
 if(v2Assets&&THREE.FogExp2)scene.fog=new THREE.FogExp2(venuePalette.background,.0024);
 if(v2Assets?.envTexture){scene.environment=v2Assets.envTexture;scene.environmentIntensity=.65;}
 scene.add(new THREE.HemisphereLight(0x9ec4f5,0x0d131c,v2Assets?.envTexture?.85:1.45));
 const light=new THREE.DirectionalLight(0xfff1dc,2.1);light.position.set(-60,100,70);
 if(light.shadow){light.castShadow=true;light.shadow.mapSize.set(2048,2048);light.shadow.camera.left=-90;light.shadow.camera.right=90;light.shadow.camera.top=90;light.shadow.camera.bottom=-90;light.shadow.camera.far=320;light.shadow.bias=-0.0006;}
 scene.add(light);
 const fill=new THREE.DirectionalLight(0x7ca6e8,.72);fill.position.set(70,60,-60);scene.add(fill);
 const camera=new THREE.PerspectiveCamera(43,1,.08,800),controls=new OrbitControls(camera,canvas);
 controls.maxPolarAngle=Math.PI/2.02;controls.minDistance=2;controls.maxDistance=450;
 const root=new THREE.Group();scene.add(root);
 const shell=createVenueShell(scene,canvas,render,v2Assets?.concreteTex);
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2(),dummy=new THREE.Object3D();
 let model=null,selected='',picked=null,mode='overview',chairMeshes=[],labels=[],rowLabels=[],start=null,disposed=false,referenceLabel=null,phoneFraming=false,roofMesh=null,eventFloorVisible=true;
 function mesh(geometry,color,parent=root,extra={}){const object=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color,roughness:.88,side:THREE.DoubleSide,...extra}));object.receiveShadow=true;parent.add(object);return object;}
 function quads(list,color,extra={}){
  const points=[],uvs=[];for(const q of list)for(let j=1;j<q.length-1;j++)for(const i of [0,j,j+1]){const p=q[i];points.push(...p);uvs.push((p[0]+p[2])*.18,(p[1]+p[2]*.35)*.18);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.computeVertexNormals();return mesh(g,color,root,extra);
 }
 function label(text,p,size=3){
  const c=document.createElement('canvas');c.width=512;c.height=96;
  const x=c.getContext('2d');x.font='700 58px system-ui';x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=9;x.font=`700 ${Math.min(58,58*460/x.measureText(text).width)}px system-ui`;x.strokeStyle=venuePalette.labelOutline;x.strokeText(text,256,48);x.fillStyle=venuePalette.label;x.fillText(text,256,48);
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,depthWrite:false}));sprite.position.set(...p);sprite.scale.set(size*512/96,size,1);sprite.userData.labelPixels=size===.75?18:26;sprite.userData.textAspect=x.measureText(text).width/96;root.add(sprite);return sprite;
 }
 function clean(){
  const geometries=new Set(),materials=new Set(),textures=new Set();root.traverse(o=>{if(o.geometry&&!o.geometry.userData?.shared)geometries.add(o.geometry);if(o.material){materials.add(o.material);if(o.material.map&&!o.material.map.userData?.shared)textures.add(o.material.map);}});
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();chairMeshes=[];labels=[];rowLabels=[];referenceLabel=null;
 }
 const cameraRig=createHydroCamera(camera,controls,canvas,render,onViewChange);
 function setModel(next){
  const previous=model?getView():null;
  model=next;clean();picked=null;
  const floor=mesh(new THREE.CylinderGeometry(75,75,.4,160),venuePalette.floor,root,v2Assets?{map:v2Assets.floorTex,roughness:.78,metalness:.06}:{});floor.position.y=-.55;
  quads(model.skirts,venuePalette.apron);quads(model.treads,venuePalette.tread,v2Assets?{map:v2Assets.concreteTex}:{});quads(model.risers,venuePalette.riser);
  // The upper half-step also marks the continuous tread. Bias only these
  // coplanar patches; chairs and walls still occlude them normally.
  const aisles=quads(model.stairs,venuePalette.stairs);
  aisles.material.setValues({polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
  quads(model.decks,venuePalette.deck,v2Assets?{map:v2Assets.concreteTex}:{});
  const roof=roofStructure({},model.chairs);
  roofMesh=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(roof.segments.map(p=>new THREE.Vector3(...p))),new THREE.LineBasicMaterial({color:venuePalette.roof}));root.add(roofMesh);shell.bind({roof:roofMesh,floor:[floor]});shell.setVenue('ovo-hydro');
  const chairGeos=v2Assets?[v2Assets.nearChairGeo]:chairParts.map(part=>chairGeometry(part,true));
  for(const geo of chairGeos){
   const chairs=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({color:0xffffff,roughness:.79,metalness:.03,vertexColors:Boolean(geo.attributes?.color)}),model.chairs.length);
   chairs.castShadow=true;chairs.receiveShadow=true;
   for(const [i,chair]of model.chairs.entries()){
    dummy.position.set(...chair.p);dummy.rotation.set(0,chair.angle,0);dummy.scale.set(1,1,1);dummy.updateMatrix();chairs.setMatrixAt(i,dummy.matrix);
    chairs.setColorAt(i,new THREE.Color(chair.section===selected?'#90985b':venuePalette.seat));
   }
   chairs.instanceMatrix.needsUpdate=true;root.add(chairs);chairMeshes.push(chairs);
  }
  for(const s of model.sections){const l=label(s.label,s.labelPoint,2);l.userData.section=s.id;labels.push(l);}
  for(const part of model.shapes){
   const shape=new THREE.Shape(part.points.map(p=>new THREE.Vector2(p[0],-p[2])));
   const g=new THREE.ExtrudeGeometry(shape,{depth:part.height,bevelEnabled:false});g.rotateX(-Math.PI/2);
   const color=part.kind==='stage'?'#1b212b':part.kind==='equipment'?'#232c38':part.kind==='standing'?venuePalette.standing:venuePalette.eventFloor;
   const object=mesh(g,color,root,part.kind==='stage'?{roughness:.52,metalness:.22}:part.kind==='equipment'?{roughness:.55,metalness:.45}:{});object.position.y=.02;object.castShadow=part.kind==='stage'||part.kind==='equipment';object.userData.zone=part;
   if(v2Assets&&part.kind==='stage'&&part.id==='stage-main'){
    const box=new THREE.Box3().setFromObject(object),center=box.getCenter(new THREE.Vector3()).toArray(),size=box.getSize(new THREE.Vector3()).toArray();
    if(typeof addStageLightingAndTruss==='function')addStageLightingAndTruss(root,{angle:0},center,size,v2Assets,{centerStage:false,hasScreenBox:false});
   }else if(v2Assets&&part.kind==='equipment'&&typeof decorateEquipmentShape==='function'){
    decorateEquipmentShape({polygon:part.points.map(([x,,z])=>[x,z]),height:part.height},root);
   }
   if(!['stage-left-arm','stage-right-arm','stage-top-arm'].includes(part.id)){
    const centre=new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());
    const text=part.id==='stage-main'?copy('STAGE · 示意'):copy(part.label);
    const l=label(text,[centre.x,part.height+.45,centre.z],part.id==='front-porch'?1.15:1.5);l.userData.event=true;l.userData.kind=part.kind;labels.push(l);
   }
  }
  if(model.performer){
   if(v2Assets&&typeof buildSilhouettePerformer==='function')buildSilhouettePerformer(model.performer,root,{isEventOverlay:true});
   else{
    const person=new THREE.Group();person.position.set(...model.performer);root.add(person);
    const torso=mesh(new THREE.CylinderGeometry(.19,.16,.63,10),'#b53557',person);torso.position.y=1.08;
    const head=mesh(new THREE.SphereGeometry(.14,12,8),'#d8af8a',person);head.position.y=1.61;
    for(const sign of [-1,1]){const leg=mesh(new THREE.CylinderGeometry(.06,.06,.78,8),'#303b4d',person);leg.position.set(sign*.1,.42,0);const arm=mesh(new THREE.CylinderGeometry(.045,.045,.62,8),'#b53557',person);arm.position.set(sign*.24,1.02,0);}
    const mic=mesh(new THREE.CylinderGeometry(.018,.018,1.4,8),'#303b4d',person);mic.position.set(.3,.7,-.3);
   }
  }
  canvas.dataset.chairs=String(model.chairs.length);canvas.dataset.sourceChairs='0';canvas.dataset.inferredLabels=String(model.inferredReferences.length);canvas.dataset.referenceLabels=String(model.references.length);canvas.dataset.eventZones=JSON.stringify(model.shapes.map(s=>s.label));canvas.dataset.performer=String(!!model.performer);
  if(previous)restoreView(previous);else overview();
 }
 function getView(){return cameraRig.state();}
 function restoreView(view){if(view.mode==='stage'&&!model.performer){overview();return;}mode=view.mode;cameraRig.setView(view);}
 function pose(position,target,fov=43){cameraRig.setView({mode,position,target,fov});}
 function fit(points,direction,aspect,fov){
  const rect=canvas.getBoundingClientRect();
  aspect??=rect.width&&rect.height?rect.width/rect.height:1.3;
  const view=fitSceneView(points.map(p=>new THREE.Vector3(...p)),new THREE.Vector3(...direction),aspect,fov);
  pose(view.p.toArray(),view.target.toArray(),view.fov);
 }
 function overview(){
  mode='overview';
  const points=[...model.chairs.map(c=>[c.p[0],c.p[1]+.9,c.p[2]]),...model.shapes.flatMap(s=>s.points.map(([x,,z])=>[x,s.height,z]))];
  // The wide baseline stays stable on resize; render widens the lens for
  // narrower screens so a saved orbit or zoom keeps its position.
  fit(points,[.82,.90,1.12],1.3);
 }
 function near(){
  const s=model.sections.find(s=>s.id===selected)||model.sections[0],p=s.labelPoint,radial=Math.hypot(p[0],p[2])||1;
  mode='near';
  fit(s.chairs.flatMap(c=>[c.p,[c.p[0],c.p[1]+.9,c.p[2]]]),[-p[0]/radial,.85,-p[2]/radial]);
 }
 function audience(chair=picked,row=null){
  const s=model.sections.find(s=>s.id===selected)||model.sections[0];const choices=s.chairs.filter(c=>c.displayRow===row);const viewpoint=chair||(choices.length?choices[Math.floor(choices.length/2)]:s.chairs[Math.floor(s.chairs.length/2)]);mode='audience';
  selectReference(viewpoint.referenceTicket||viewpoint.inferredTicket?viewpoint:null);picked=viewpoint;
  const eye=[viewpoint.p[0],viewpoint.p[1]+HYDRO_CAMERA_POLICY.eyeHeight,viewpoint.p[2]],target=model.performer?model.performer.map((v,i)=>v+(i===1?1:0)):[0,1,0];
  // Frame the stage above centre without moving the selected seat's eye.
  const distance=Math.hypot(target[0]-eye[0],target[2]-eye[2]);
  if(model.performer)target[1]=eye[1]+distance*Math.tan(Math.atan2(target[1]-eye[1],distance)-HYDRO_CAMERA_POLICY.stageElevation);
  pose(eye,target,HYDRO_CAMERA_POLICY.audienceFov);
 }
 function selectReference(chair){
  if(referenceLabel){root.remove(referenceLabel);referenceLabel.material.map.dispose();referenceLabel.material.dispose();referenceLabel=null;}
  picked=chair;
  for(const m of chairMeshes){for(const [i,c]of model.chairs.entries())m.setColorAt(i,new THREE.Color(c===chair?venuePalette.reference:c.section===selected?'#90985b':venuePalette.seat));m.instanceColor.needsUpdate=true;}
  if(chair){const t=chair.referenceTicket||chair.inferredTicket;referenceLabel=label(`${t.row} / ${t.seat} · ${copy(chair.referenceTicket?'参考':'示意')}`,[chair.p[0],chair.p[1]+1.2,chair.p[2]],.75);}
  canvas.dataset.referenceTicket=chair?.referenceTicket?`${chair.referenceTicket.section}/${chair.referenceTicket.row}/${chair.referenceTicket.seat}`:'';
  canvas.dataset.inferredTicket=chair?.inferredTicket&&!chair.referenceTicket?`${chair.inferredTicket.section}/${chair.inferredTicket.row}/${chair.inferredTicket.seat}`:'';
  canvas.dataset.seatPosition=chair?JSON.stringify(chair.p):'';render();
 }
 function stage(){
  if(!model.performer)return;mode='stage';
  const points=model.shapes.filter(s=>s.kind==='stage').flatMap(s=>s.points.map(([x,,z])=>[x,s.height,z]));
  points.push([model.performer[0],model.performer[1]+1.7,model.performer[2]]);
  fit(points,[.25,.62,-1],undefined,40);
 }
 function selectSection(id){
  selected=id;selectReference(null);
  for(const m of chairMeshes){for(const [i,s]of model.chairs.entries())m.setColorAt(i,new THREE.Color(s.section===id?'#90985b':venuePalette.seat));m.instanceColor.needsUpdate=true;}
  for(const l of rowLabels){root.remove(l);l.material.map.dispose();l.material.dispose();}rowLabels=[];
  const section=model.sections.find(s=>s.id===id);
  if(section)for(const a of section.rowAnchors)rowLabels.push(label(a.label,a.p,.75));
  render();
 }
 function render(){
  if(disposed||!model)return;const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
  const frame=phoneFrameRect(r.width,r.height),framed=phoneFraming&&mode==='audience',height=framed?frame.height:r.height;
  for(const [key,value]of Object.entries(frame))canvas.parentElement.style.setProperty('--frame-'+key,value+'px');
  renderer.setSize(r.width,r.height,false);camera.aspect=framed?frame.width/frame.height:r.width/r.height;camera.fov=mode==='overview'?2*Math.atan(Math.tan((camera.userData.baseFov||43)*Math.PI/360)*Math.max(1,1.3/camera.aspect))*180/Math.PI:(camera.userData.baseFov||43);camera.updateProjectionMatrix();
  root.children.forEach(o=>{if(o.userData.zone)o.visible=eventFloorVisible||o.userData.zone.kind==='stage';});
  // Overview sprites skip depth testing, so mask them behind the opaque GLB canopy.
  const overviewLabels=mode==='overview'&&!(shell.roofVisible&&shell.hasRoof);
  labels.forEach(l=>{l.visible=!!(overviewLabels||mode==='near'&&(l.userData.section===selected||l.userData.event))&&(!l.userData.event||eventFloorVisible||l.userData.kind==='stage');});rowLabels.forEach(l=>{l.visible=mode==='near';});
  if(referenceLabel)referenceLabel.visible=mode==='near'||overviewLabels;
  const labelScale=Math.min(1,r.width/600);
  for(const l of [...labels,...rowLabels,...(referenceLabel?[referenceLabel]:[])]){const size=2*camera.position.distanceTo(l.position)*Math.tan(camera.fov*Math.PI/360)*l.userData.labelPixels*labelScale/height;l.scale.set(size*512/96,size,1);}
  const occupied=[];
  for(const l of [...(referenceLabel?[referenceLabel]:[]),...[...labels].sort((a,b)=>Number(!!b.userData.event)-Number(!!a.userData.event))]){
   if(!l.visible)continue;const p=l.position.clone().project(camera),w=l.userData.textAspect*l.userData.labelPixels*labelScale,h=l.userData.labelPixels*.7*labelScale;const rect=[(p.x+1)*r.width/2-w/2,(1-p.y)*r.height/2-h/2,w,h];
   if(p.z>1||occupied.some(q=>rect[0]<q[0]+q[2]+3&&rect[0]+rect[2]+3>q[0]&&rect[1]<q[1]+q[3]+3&&rect[1]+rect[3]+3>q[1])){l.visible=false;continue;}occupied.push(rect);
  }
  canvas.dataset.cameraMode=mode;canvas.dataset.section=selected;canvas.dataset.rowLabels=String(mode==='near'?rowLabels.length:0);canvas.dataset.cameraPosition=JSON.stringify(camera.position.toArray());canvas.dataset.cameraTarget=JSON.stringify(controls.target.toArray());canvas.dataset.cameraFov=String(camera.fov);canvas.dataset.cameraPolicy=HYDRO_CAMERA_POLICY.version;
  canvas.dataset.phoneFrame=String(framed);canvas.dataset.roof=String(shell.roofVisible);canvas.dataset.eventFloor=String(eventFloorVisible);canvas.dataset.frameRect=framed?JSON.stringify(frame):'';
  renderer.setScissorTest(false);renderer.setViewport(0,0,r.width,r.height);renderer.clear();
  if(framed){renderer.setViewport(frame.x,r.height-frame.y-frame.height,frame.width,frame.height);renderer.setScissor(frame.x,r.height-frame.y-frame.height,frame.width,frame.height);renderer.setScissorTest(true);}
  renderer.render(scene,camera);renderer.setScissorTest(false);
  canvas.dataset.camera=mode;canvas.dataset.frame=String(Number(canvas.dataset.frame||0)+1);if(renderer.info)canvas.dataset.drawCalls=String(renderer.info.render.calls);
 }
 function down(e){start=[e.clientX,e.clientY];}
 function up(e){
  const origin=start;start=null;
  // In a seated view taps cannot silently select a different chair.
  if(mode==='audience'||!origin||Math.hypot(e.clientX-origin[0],e.clientY-origin[1])>5)return;
  const r=canvas.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);
  const hit=ray.intersectObjects(chairMeshes)[0];
  if(hit){const chair=model.chairs[hit.instanceId];selectSection(chair.section);picked=chair;onPick(chair.section,chair);audience(chair);return;}
  const text=ray.intersectObjects(labels.filter(l=>l.visible&&l.userData.section))[0];if(text){selectSection(text.object.userData.section);onPick(selected);near();}
 }
 const observer=new ResizeObserver(render);observer.observe(canvas);canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointerup',up);
 return {getView,restoreView,zoom:cameraRig.zoomBy,setZoom:cameraRig.setZoom,setModel,selectSection,selectReference,overview,near,audience,stage,render,
  togglePhoneFrame(value){phoneFraming=Boolean(value);render();},toggleRoof(value){shell.toggleRoof(value);},toggleEventFloor(value){eventFloorVisible=Boolean(value);render();},
  dispose(){disposed=true;shell.dispose();observer.disconnect();cameraRig.dispose();controls.dispose();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerup',up);clean();v2Assets?.dispose();renderer.dispose();}};
}
