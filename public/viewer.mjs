import {seatRecords,stageBoxes,roofStructure} from './scene-geometry.mjs';
import {phoneFrameRect} from './explorer-state.mjs';
import {sourceSeatDecks} from './seating.mjs';
import * as THREE from './vendor/three.module.min.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {sectionPoint,sectionRenderHalfAngle,tierRowCount,sectionRowCount,sectionSteps,sectionSeatCount,displaySectionLabel,stageRects,performer,audienceSightline,zoomToFov,fovToZoom,seatDragDelta,venueShape,venueFloor,venueRadius} from './geometry.mjs';

export function createViewer(canvas,{onSection,onSample,onSeat=()=>{},onMode=()=>{},onFailure=()=>{}}) {
  const arenaTheme=document.body.classList.contains('theme-arena');
  const palette=arenaTheme?{background:'#0b1118',clear:'#0b1118',floor:'#111a22',field:'#1b2c26',tread:'#202d32',riser:'#162329',deck:'#1d2b31',seat:'#ffffff',selected:'#c9ff51',sample:'#e4c66f',marker:'#c9ff51',ring:'#f2d278',roof:'#9ac38d',stage:'#182b31',frame:'#101a21',top:'#334b41',screen:'#5e9b98',skin:'#d9b18b',clothes:'#d7e1d5'}:{background:'#e8ede6',clear:'#1b2c26',floor:'#c7cdb5',field:'#8c9d78',tread:'#c8d0c5',riser:'#a9b8a8',deck:'#c3cbbb',seat:'#ffffff',selected:'#d88045',sample:'#ddbd62',marker:'#e98742',ring:'#f4c06e',roof:'#637d70',stage:'#293b31',frame:'#203b35',top:'#53654a',screen:'#427b77',skin:'#be9978',clothes:'#d4c6a8'};
  const scene=new THREE.Scene();scene.background=new THREE.Color(palette.background);scene.fog=new THREE.Fog(palette.background,500,1000);
  scene.add(new THREE.HemisphereLight(arenaTheme?0xd6e7ff:0xffffff,arenaTheme?0x101820:0x93a49a,arenaTheme?1.45:1.8));const light=new THREE.DirectionalLight(arenaTheme?0xc9e6ff:0xfffaf1,arenaTheme?1.8:2.1);light.position.set(-90,180,100);scene.add(light);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  const camera=new THREE.PerspectiveCamera(43,1,.12,1400);camera.position.set(185,155,210);
  const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=6;controls.maxDistance=650;controls.maxPolarAngle=Math.PI/2.04;controls.rotateSpeed=.8;controls.zoomSpeed=.8;controls.target.set(0,8,0);controls.update();
  const world=new THREE.Group(),stage=new THREE.Group(),roofGroup=new THREE.Group();scene.add(world,stage,roofGroup);roofGroup.visible=false;
  let venue=null,sectionId='',position=null,layout='',matched=false,mode='3d',cameraMode='overview',tween=null,pending=false,dirty=true,last=performance.now(),chairs=[],farSeatMeshes=[],nearSeatMeshes=[],records=[],labels=[],picks=[],sampleMesh=null,sampleRecords=[],marker=null,markerRing=null;
  const dummy=new THREE.Object3D(),raycaster=new THREE.Raycaster(),cursor=new THREE.Vector2(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const look={yaw:0,pitch:0,targetYaw:0,targetPitch:0,fov:60,targetFov:60};let overviewPose=null,phoneFraming=false;
  const vec=a=>new THREE.Vector3(...a),clamp=THREE.MathUtils.clamp;
  function material(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.86,metalness:0,...extra});}
  function mesh(geometry,mat,parent=world){const object=new THREE.Mesh(geometry,mat);parent.add(object);return object;}
  function clean(group){const gs=new Set(),ms=new Set(),ts=new Set();group.traverse(o=>{if(o.geometry)gs.add(o.geometry);for(const m of [o.material].flat().filter(Boolean)){ms.add(m);if(m.map)ts.add(m.map);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());group.clear();}
  function quads(list){const points=[];for(const q of list)for(const i of [0,1,2,0,2,3])points.push(...q[i]);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.computeVertexNormals();return g;}
  function textLabel(text,p,compact=false){const c=document.createElement('canvas');c.width=128;c.height=56;const x=c.getContext('2d');x.fillStyle=arenaTheme?'#111a22e8':'#f9fcf0ed';x.beginPath();x.roundRect(0,0,128,56,10);x.fill();x.fillStyle=arenaTheme?'#dfd7ff':'#425d3c';x.font='600 26px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText(text,64,29);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,transparent:true}));sprite.position.copy(vec(p)).add(new THREE.Vector3(0,compact?.65:3,0));sprite.scale.set(compact?2.6:9,compact?1.1:2.65,1);world.add(sprite);labels.push(sprite);}
  function buildBowlShell(){
    // A fan/theatre ends where its labelled sections end. Filling the missing
    // angles closes the stage opening and invents a circular auditorium.
    if(venue.geometry?.openBowl||venue.geometry?.oneSided||['fan','rear'].includes(venueShape(venue)))return;
    const treads=[],risers=[];
    for(let tier=0;tier<venue.tiers.length;tier++){
      if(!venue.sections.some(s=>s.tier===tier&&!s.block))continue;
      const steps=sectionSteps(venue,{tier,angle:0,halfAngle:Math.PI});
      for(const q of steps.treads)treads.push(q.map(p=>[p[0],p[1]-.1,p[2]]));
      for(const q of steps.risers)risers.push(q.map(p=>[p[0],p[1]-.1,p[2]]));
    }
    mesh(quads(treads),material(palette.tread,{side:THREE.DoubleSide}));
    mesh(quads(risers),material(palette.riser,{side:THREE.DoubleSide}));
  }
  function buildVenue(){
    clean(world);chairs=[];farSeatMeshes=[];nearSeatMeshes=[];records=[];labels=[];picks=[];const decks=[];records=seatRecords(venue,layout);
    const [floorX,floorZ]=venueFloor(venue),radius=venueRadius(venue);
    const floorShape=venueShape(venue)==='rectangle'?new THREE.BoxGeometry(Math.max(floorX,radius*2.2),.3,Math.max(floorZ,radius*1.65)):new THREE.CylinderGeometry(1,1,.3,96);
    const floor=mesh(floorShape,material(palette.floor));floor.position.y=-.35;floor.userData.excludeFit=true;if(venueShape(venue)!=='rectangle')floor.scale.set(Math.max(floorX,radius*2.2)/2,.999,Math.max(floorZ,radius*1.65)/2);
    const fieldIsRect=['rectangle','fan','rear'].includes(venueShape(venue));
    const fieldShape=fieldIsRect?new THREE.BoxGeometry(floorX,.12,floorZ):new THREE.CylinderGeometry(1,1,.12,96);
    const field=mesh(fieldShape,material(palette.field));field.position.y=-.12;field.userData.excludeFit=true;if(!fieldIsRect)field.scale.set(Math.min(floorX*.82,radius*1.65)/2,.999,Math.min(floorZ*.66,radius*1.2)/2);
    if(venue.sourceSeats){
      decks.push(...sourceSeatDecks(venue.sourceSeats));
      for(const section of venue.sections){const hit=mesh(quads(section.polygon.length===4?[section.polygon]:section.polygon.slice(1,-1).map((p,i)=>[section.polygon[0],p,section.polygon[i+2],section.polygon[i+2]])),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));hit.visible=false;hit.userData.section=section.id;picks.push(hit);textLabel(displaySectionLabel(section),section.center);}
    }else{
    const risers=[];
    for(const section of venue.sections){
      const renderHalfAngle=sectionRenderHalfAngle(venue,section),rows=sectionRowCount(venue,section),steps=sectionSteps(venue,section);
      if(venue.geometry?.referenceLayout){
        mesh(quads(steps.treads),material(section.block.color,{side:THREE.DoubleSide}));
        mesh(quads([...steps.risers,...steps.walls]),material(section.block.color,{side:THREE.DoubleSide}));
      }else{decks.push(...steps.treads);risers.push(...steps.risers,...steps.walls);}
      const polygon=[[0,-1],[0,1],[1,1],[1,-1]].map(([t,l])=>sectionPoint(venue,section,t,l,renderHalfAngle));
      const hit=mesh(quads(section.block?.polygon?steps.treads:[polygon]),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));hit.visible=false;hit.userData.section=section.id;picks.push(hit);
      textLabel(displaySectionLabel(section),sectionPoint(venue,section,.55,0,renderHalfAngle),!!section.block?.polygon);
    }
    mesh(quads(risers),material(palette.riser,{side:THREE.DoubleSide}));
    buildBowlShell();
    }
    mesh(quads(decks),material(palette.deck,{side:THREE.DoubleSide}));
    const placeInstances=(geometries,target)=>{
      for(const geometry of geometries){
        const seats=new THREE.InstancedMesh(geometry,material(palette.seat),records.length);
        seats.frustumCulled=false;
        records.forEach((r,i)=>{dummy.position.copy(vec(r.p));dummy.rotation.order='YXZ';dummy.rotation.set(0,r.angle,0);dummy.scale.set(r.width,1,1);dummy.updateMatrix();seats.setMatrixAt(i,dummy.matrix);});
        seats.instanceMatrix.needsUpdate=true;world.add(seats);target.push(seats);
      }
    };
    // Far LOD keeps the overview light and readable. Near LOD adds a deeper
    // back, seat pan, and arm rests for a believable selected-seat scale.
    placeInstances([
      new THREE.BoxGeometry(.52,.12,.5).translate(0,.44,0),
      new THREE.BoxGeometry(.52,.34,.11).translate(0,.69,.24)
    ],farSeatMeshes);
    placeInstances([
      new THREE.BoxGeometry(.52,.14,.54).translate(0,.44,0),
      new THREE.BoxGeometry(.52,.52,.12).translate(0,.78,.27),
      new THREE.BoxGeometry(.06,.24,.48).translate(-.27,.59,.03),
      new THREE.BoxGeometry(.06,.24,.48).translate(.27,.59,.03)
    ],nearSeatMeshes);
    setSeatLod('overview');
    sampleMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(.32,8,6),new THREE.MeshBasicMaterial({color:'#d6ba65'}),1);world.add(sampleMesh);
    marker=mesh(new THREE.SphereGeometry(.18,12,8),new THREE.MeshBasicMaterial({color:palette.marker,transparent:true,opacity:.92}));
    markerRing=new THREE.Mesh(new THREE.TorusGeometry(.38,.045,8,24),new THREE.MeshBasicMaterial({color:palette.ring,transparent:true,opacity:.95}));
    markerRing.rotation.x=Math.PI/2;markerRing.position.y=-.72;marker.add(markerRing);
    buildRoof();canvas.dataset.coordinateBasis=venue.sourceSeats?'source-model-xyz':'synthetic-geometry';canvas.dataset.layout=venue.seatLayout?.id||layout;canvas.dataset.sections=String(venue.sections.length);canvas.dataset.chairs=String(records.length);updateSelection();
  }
  function updateSelection(){
    const colors=arenaTheme?['#a58bd7','#937ac6','#8169b7','#705da5','#60548e']:['#3d6d57','#3c675c','#385d57','#33554e','#304e48'],selected=new THREE.Color(palette.selected);
    const sectionColors=new Map(venue.sections.map(s=>[s.id,s.block?.color||colors[s.tier%5]]));
    for(const seats of [...farSeatMeshes,...nearSeatMeshes]){records.forEach((r,i)=>seats.setColorAt(i,r.section===sectionId?selected:new THREE.Color(sectionColors.get(r.section)||colors[r.tier%5])));seats.instanceColor.needsUpdate=true;}
    if(sampleMesh){world.remove(sampleMesh);sampleMesh.geometry.dispose();sampleMesh.material.dispose();}
    sampleRecords=venue.sourceSeats?[]:(venue.sections.find(s=>s.id===sectionId)?.samples||[]).filter(s=>Array.isArray(s.position));
    sampleMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(.33,8,6),new THREE.MeshBasicMaterial({color:palette.sample}),Math.max(1,sampleRecords.length));
    sampleMesh.count=sampleRecords.length;sampleRecords.forEach((s,i)=>{dummy.position.copy(vec(s.position)).add(new THREE.Vector3(0,1.05,0));dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();sampleMesh.setMatrixAt(i,dummy.matrix);});sampleMesh.instanceMatrix.needsUpdate=true;world.add(sampleMesh);
    if(marker&&position)marker.position.copy(vec(position)).add(new THREE.Vector3(0,1.6,0));
    if(marker)marker.visible=Boolean(position&&matched);
    wake();
  }
  function setSeatLod(value){
    const nearMode=value==='seat'||value==='near';
    farSeatMeshes.forEach(mesh=>{mesh.visible=!nearMode;});
    nearSeatMeshes.forEach(mesh=>{mesh.visible=nearMode;});
    chairs=nearMode?nearSeatMeshes:farSeatMeshes;
    wake();
  }
  function buildStage(){
    clean(stage);
    for(const box of stageBoxes(layout,venue)){
      const screen=box.kind==='screen',color=screen?palette.screen:box.kind==='frame'?palette.frame:box.kind==='top'?palette.top:palette.stage;
      const object=mesh(new THREE.BoxGeometry(...box.size),material(color,screen?{emissive:'#315c68',emissiveIntensity:.7,roughness:.6}:{}),stage);
      object.position.copy(vec(box.center));object.rotation.y=box.angle||0;
    }
    if(!performer(layout,venue))return;
    const person=new THREE.Group();person.position.copy(vec(performer(layout,venue)));stage.add(person);
    const torso=mesh(new THREE.CylinderGeometry(.21,.16,.62,10),material(palette.clothes),person);torso.position.y=1.08;
    const head=mesh(new THREE.SphereGeometry(.13,12,8),material(palette.skin),person);head.position.y=1.61;
    for(const side of [-1,1]){const leg=mesh(new THREE.CylinderGeometry(.065,.06,.78,8),material('#303b34'),person);leg.position.set(side*.1,.42,0);const arm=mesh(new THREE.CylinderGeometry(.05,.05,.62,8),material(palette.clothes),person);arm.position.set(side*.25,1.02,0);arm.rotation.z=side*.15;}
  }
  function buildRoof(){
    clean(roofGroup);
    roofGroup.visible=false;
    const geometry=new THREE.BufferGeometry().setFromPoints(roofStructure(venue,records).segments.map(vec));
    roofGroup.add(new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:palette.roof,transparent:true,opacity:.6})));
    roofGroup.userData.illustrative=true;
  }
  function pose(p,target,fov=43){const end=new THREE.PerspectiveCamera();end.position.copy(p);end.lookAt(target);return {p,q:end.quaternion.clone(),target,fov};}
  function initial(){
    const bounds=new THREE.Box3();
    for(const r of records)bounds.expandByPoint(vec(r.p).add(new THREE.Vector3(0,.9,0)));
    bounds.expandByObject(stage);
    if(bounds.isEmpty())return pose(new THREE.Vector3(90,85,100),new THREE.Vector3(0,5,0));
    const center=bounds.getCenter(new THREE.Vector3());
    const fans=venue.geometry?.oneSided||['fan','rear'].includes(venueShape(venue));
    const stageList=stageRects(layout,venue),main=stageList[0];
    const direction=new THREE.Vector3(fans?.45:.75,.95,1);
    if(venue.geometry?.referenceLayout)direction.set(.45,1.2,-1);
    if(!fans&&main&&Math.abs(main.x)>Math.abs(main.z))direction.set(-1,1.15,.6);
    direction.normalize();
    const orientation=new THREE.PerspectiveCamera();orientation.position.copy(center).add(direction);orientation.lookAt(center);
    const inverse=orientation.quaternion.clone().invert(),tanV=Math.tan(43*Math.PI/360),tanH=tanV*Math.max(.3,camera.aspect);
    let distance=10;
    const fitPoints=records.map(r=>vec(r.p).add(new THREE.Vector3(0,.9,0))),stageBounds=new THREE.Box3().setFromObject(stage);
    if(!stageBounds.isEmpty())for(const x of [stageBounds.min.x,stageBounds.max.x])for(const y of [stageBounds.min.y,stageBounds.max.y])for(const z of [stageBounds.min.z,stageBounds.max.z])fitPoints.push(new THREE.Vector3(x,y,z));
    for(const point of fitPoints){const p=point.sub(center).applyQuaternion(inverse);distance=Math.max(distance,p.z+Math.abs(p.x)/tanH*1.12,p.z+Math.abs(p.y)/tanV*1.16);}
    return pose(center.clone().addScaledVector(direction,distance),center,43);
  }
  function fly(to){tween={start:performance.now(),from:camera.position.clone(),fromQ:camera.quaternion.clone(),fromFov:camera.fov,...to};controls.enabled=false;wake();}
  function setCameraMode(value){cameraMode=value;setSeatLod(value);resize();onMode(value,{zoom:fovToZoom(look.targetFov)});if(marker)marker.visible=Boolean(position&&matched);}
  function overview(reset=false){if(reset||!overviewPose)overviewPose=initial();setCameraMode('overview');fly(overviewPose);}
  function near(){
    const selected=records.filter(r=>r.section===sectionId);if(!selected.length)return;
    const bounds=new THREE.Box3();selected.forEach(r=>bounds.expandByPoint(vec(r.p)));
    const target=bounds.getCenter(new THREE.Vector3()).add(new THREE.Vector3(0,.5,0)),size=bounds.getSize(new THREE.Vector3()),out=new THREE.Vector3(target.x,0,target.z);
    if(out.lengthSq()<.01)out.set(0,0,1);else out.normalize();
    // Approach from the inner bowl. Approaching from outside placed the camera
    // inside the rows/balcony behind the selection and filled the screen with
    // the backs of unrelated chairs.
    const distance=Math.max(10,Math.min(70,Math.max(size.x,size.z,size.y)*1.65));
    const nearPose=pose(target.clone().addScaledVector(out,-distance).add(new THREE.Vector3(0,distance*.85,0)),target);
    setCameraMode('overview');setSeatLod('near');fly(nearPose);
  }
  function seatView(){if(!matched||!position)return;if(!overviewPose)overviewPose=initial();
    const line=audienceSightline(venue,layout,position),eye=vec(line?.eye||position.map((v,i)=>v+(i===1?1.2:0))),target=vec(line?.target||[0,eye.y,0]),dir=target.clone().sub(eye).normalize();
    look.yaw=look.targetYaw=Math.atan2(dir.x,dir.z);look.pitch=look.targetPitch=Math.asin(dir.y);look.fov=look.targetFov=60;
    setCameraMode('seat');fly(pose(eye,target,60));
  }
  function setZoom(value){
    const zoom=clamp(Number(value)||1,1,8);
    look.targetFov=zoomToFov(zoom);
    if(tween&&cameraMode==='seat')tween.fov=look.fov=look.targetFov;
    onMode(cameraMode,{zoom,fov:look.targetFov});wake();
  }
  function resize(){
    const rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
    const frame=phoneFrameRect(rect.width,rect.height),aspect=phoneFraming&&cameraMode==='seat'?frame.width/frame.height:rect.width/rect.height,changed=Math.abs(camera.aspect-aspect)>.0001;
    for(const [key,value]of Object.entries({x:frame.x,y:frame.y,width:frame.width,height:frame.height}))canvas.parentElement.style.setProperty('--frame-'+key,value+'px');
    renderer.setSize(Math.round(rect.width),Math.round(rect.height),false);camera.aspect=aspect;camera.updateProjectionMatrix();
    if(changed&&venue&&records.length){overviewPose=initial();if(cameraMode==='overview')fly(overviewPose);}
    wake();
  }
  function labelsForView(){const rect=canvas.getBoundingClientRect(),occupied=[];
    for(const label of labels){label.visible=false;if(cameraMode!=='overview')continue;const p=label.position.clone().project(camera);if(Math.abs(p.x)>1||Math.abs(p.y)>1||p.z<-1||p.z>1)continue;
      const x=(p.x+1)*rect.width/2,y=(1-p.y)*rect.height/2;if(occupied.some(q=>Math.abs(q.x-x)<70&&Math.abs(q.y-y)<27))continue;occupied.push({x,y});label.visible=true;
      const h=2*camera.position.distanceTo(label.position)*Math.tan(camera.fov*Math.PI/360)*20/Math.max(1,rect.height);label.scale.set(h*2.28,h,1);
    }
  }
  function wake(){dirty=true;if(!pending){pending=true;requestAnimationFrame(animate);}}
  function animate(now){pending=false;if(document.hidden||mode!=='3d'||!venue)return;
    const dt=Math.min(.05,(now-last)/1000);last=now;let moving=false;
    if(tween){const t=clamp((now-tween.start)/(reduced?1:750),0,1),u=1-(1-t)**3;camera.position.lerpVectors(tween.from,tween.p,u);camera.quaternion.slerpQuaternions(tween.fromQ,tween.q,u);camera.fov=THREE.MathUtils.lerp(tween.fromFov,tween.fov,u);controls.target.copy(tween.target);camera.updateProjectionMatrix();moving=t<1;if(!moving){tween=null;controls.enabled=cameraMode==='overview';}}
    else if(cameraMode==='overview'){controls.enabled=true;moving=controls.update();}
    else{
      const a=1-Math.exp(-dt*16),delta=Math.atan2(Math.sin(look.targetYaw-look.yaw),Math.cos(look.targetYaw-look.yaw));
      look.yaw+=delta*a;look.pitch+=(look.targetPitch-look.pitch)*a;look.fov+=(look.targetFov-look.fov)*a;
      moving=Math.abs(delta)+Math.abs(look.targetPitch-look.pitch)+Math.abs(look.targetFov-look.fov)>.0001;
      camera.position.copy(vec(audienceSightline(venue,layout,position)?.eye||position.map((v,i)=>v+(i===1?1.2:0))));camera.lookAt(camera.position.clone().add(new THREE.Vector3(Math.sin(look.yaw)*Math.cos(look.pitch),Math.sin(look.pitch),Math.cos(look.yaw)*Math.cos(look.pitch))));camera.fov=look.fov;camera.updateProjectionMatrix();
    }
    if(dirty||moving){
      labelsForView();const width=canvas.clientWidth,height=canvas.clientHeight;
      renderer.setScissorTest(false);renderer.setViewport(0,0,width,height);renderer.setClearColor(palette.clear);renderer.clear();
      if(phoneFraming&&cameraMode==='seat'){const r=phoneFrameRect(width,height);renderer.setViewport(r.x,height-r.y-r.height,r.width,r.height);renderer.setScissor(r.x,height-r.y-r.height,r.width,r.height);renderer.setScissorTest(true);}
      renderer.render(scene,camera);renderer.setScissorTest(false);
      dirty=false;canvas.dataset.engine='Three.js '+THREE.REVISION;canvas.dataset.camera=cameraMode;canvas.dataset.phoneFrame=String(phoneFraming&&cameraMode==='seat');canvas.dataset.roof=String(roofGroup.visible);canvas.dataset.fov=camera.fov.toFixed(2);canvas.dataset.frame=String(Number(canvas.dataset.frame||0)+1);canvas.dataset.drawCalls=String(renderer.info.render.calls);canvas.dataset.geometries=String(renderer.info.memory.geometries);canvas.dataset.cameraPosition=camera.position.toArray().map(x=>x.toFixed(3)).join(',');}
    if(moving||tween)wake();
  }
  const pointers=new Map();let down=null,lastPinch=0;
  canvas.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});down={x:e.clientX,y:e.clientY};if(cameraMode==='seat'){tween=null;canvas.setPointerCapture(e.pointerId);}wake();},{capture:true});
  canvas.addEventListener('pointermove',e=>{const previous=pointers.get(e.pointerId);if(!previous)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(cameraMode!=='seat')return;
    if(pointers.size===2){const [a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(lastPinch&&d)setZoom(fovToZoom(look.targetFov)*d/lastPinch);lastPinch=d;}
    else{const delta=seatDragDelta(e.clientX-previous.x,e.clientY-previous.y);look.targetYaw+=delta.yaw;look.targetPitch=clamp(look.targetPitch+delta.pitch,-1.15,1.15);}wake();},{capture:true});
  function up(e){const click=down&&pointers.size===1&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<5&&e.type==='pointerup';pointers.delete(e.pointerId);lastPinch=0;down=null;
    if(!click||cameraMode!=='overview')return;const b=canvas.getBoundingClientRect();cursor.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);raycaster.setFromCamera(cursor,camera);
    const sample=sampleMesh?.count?raycaster.intersectObject(sampleMesh,false)[0]:null;if(sample){onSample(sampleRecords[sample.instanceId]);return;}
    const seat=raycaster.intersectObjects(chairs,false)[0];
    if(seat?.instanceId!==undefined){const record=records[seat.instanceId];if(record?.section){onSeat(record);return;}}
    const hit=raycaster.intersectObjects(picks,false)[0];if(hit)onSection(hit.object.userData.section);
  }
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
  canvas.addEventListener('wheel',e=>{if(cameraMode==='seat'){e.preventDefault();setZoom(fovToZoom(look.targetFov)*Math.exp(-e.deltaY*.001));}},{passive:false,capture:true});
  controls.addEventListener('change',wake);controls.addEventListener('start',()=>{if(cameraMode==='overview')tween=null;wake();});
  canvas.style.touchAction='none';canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();onFailure('三维画面暂时中断，可先切换二维图，或刷新后重试。');});
  canvas.addEventListener('webglcontextrestored',wake);document.addEventListener('visibilitychange',()=>{last=performance.now();if(!document.hidden)wake();});
  new ResizeObserver(resize).observe(canvas.parentElement);
  return {
    setData(nextVenue,nextSection,nextPosition,nextLayout,nextMatched){
      const changed=venue?.id!==nextVenue.id||venue?.seatLayout?.id!==nextVenue.seatLayout?.id||venue?.eventLayout?.id!==nextVenue.eventLayout?.id,sectionChanged=sectionId!==nextSection,positionChanged=String(position)!==String(nextPosition),layoutChanged=layout!==nextLayout;
      venue=nextVenue;sectionId=nextSection;position=nextPosition;layout=nextLayout;matched=nextMatched;if(changed)phoneFraming=false;
      if(changed||layoutChanged&&!venue.sourceSeats)buildVenue();else if(sectionChanged||positionChanged)updateSelection();
      if(changed||layoutChanged)buildStage();if(changed){overviewPose=initial();overview(true);}else if(cameraMode==='seat'&&(positionChanged||layoutChanged)){if(matched)seatView();else near();}
      resize();if(changed)overview(true);wake();
    },
    setMode(value){mode=value;if(value==='3d'){resize();wake();}},overview,near,seatView,setZoom,
    toggleRoof(value){roofGroup.visible=Boolean(value);wake();},
    togglePhoneFrame(value){if(phoneFraming===Boolean(value))return;phoneFraming=Boolean(value);resize();wake();},
    dispose(){controls.dispose();clean(world);clean(stage);clean(roofGroup);renderer.dispose();}
  };
}
