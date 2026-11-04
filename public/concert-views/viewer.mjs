import {VENUE_CAMERA_POLICY,bindAudienceGestures,venueZoomToFov as zoomToFov,venueFovToZoom as fovToZoom,scaleVenueFov} from '../venue-view/venue-camera-policy.mjs';
import {copy} from '../locales.mjs';
import {venuePalette,venueScenePalette} from '../venue-view/venue-palette.mjs';
import {seatRecords,stageBoxes,roofStructure} from './scene-geometry.mjs';
import {phoneFrameRect} from './explorer-state.mjs';
import {sourceSeatDecks} from './seating.mjs';
import {o2DisplayModel,o2RowLabelAnchors} from './o2-display.mjs';
import {chairParts} from './spatial.mjs';
import {sourceBowlDisplay,sourceRowLabelAnchors} from './source-bowl-display.mjs';
import {chairGeometry} from './chair-geometry.mjs';
import {ticketSeatKey,ticketMapConflictIndex,ticketConflictColor} from './ticket-map-conflicts.mjs';
import * as THREE from '../vendor/three.module.min.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {sectionPoint,sectionRenderHalfAngle,tierRowCount,sectionRowCount,sectionSteps,sectionSeatCount,displaySectionLabel,stageRects,performer,audienceSightline,venueShape,venueFloor,venueRadius} from './geometry.mjs';

export function createViewer(canvas,{onSection,onSample,onSeat=()=>{},onMode=()=>{},onFailure=()=>{},onResearchShape=()=>{},onFloorView=()=>{}}) {
  const arenaTheme=document.body.classList.contains('theme-arena');
  const themePalette=venueScenePalette(),palette={...themePalette};
  const scene=new THREE.Scene();scene.background=new THREE.Color(palette.background);scene.fog=new THREE.Fog(palette.background,500,1000);
  const ambient=new THREE.HemisphereLight(arenaTheme?0xd6e7ff:0xffffff,arenaTheme?0x101820:0x93a49a,arenaTheme?1.45:1.8);scene.add(ambient);const light=new THREE.DirectionalLight(arenaTheme?0xc9e6ff:0xfffaf1,arenaTheme?1.8:2.1);light.position.set(-90,180,100);scene.add(light);
  // A single key light flattens the far side of a bowl. The fill is cool and
  // weak, so curvature reads without introducing a second highlight.
  const fill=new THREE.DirectionalLight(0xdfe9ff,0.55);fill.position.set(120,70,-110);scene.add(fill);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  const camera=new THREE.PerspectiveCamera(43,1,.12,1400);camera.position.set(185,155,210);
  const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=6;controls.maxDistance=650;controls.maxPolarAngle=Math.PI/2.04;controls.rotateSpeed=.8;controls.zoomSpeed=.8;controls.target.set(0,8,0);controls.update();
  const world=new THREE.Group(),stage=new THREE.Group(),roofGroup=new THREE.Group(),researchOverlay=new THREE.Group();scene.add(world,stage,roofGroup,researchOverlay);roofGroup.visible=false;
  const sectionSelection=new THREE.Group(),rowLabelGroup=new THREE.Group();let sectionGuides=[];
  let venue=null,sectionId='',position=null,layout='',matched=false,eventSelected=false,floorView=false,mode='3d',cameraMode='overview',tween=null,pending=false,dirty=true,last=performance.now(),chairs=[],farSeatMeshes=[],nearSeatMeshes=[],records=[],labels=[],rowLabels=[],picks=[],sampleMesh=null,sampleRecords=[],marker=null,markerRing=null;
  const dummy=new THREE.Object3D(),raycaster=new THREE.Raycaster(),cursor=new THREE.Vector2(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const look={yaw:0,pitch:0,targetYaw:0,targetPitch:0,fov:VENUE_CAMERA_POLICY.audienceFov,targetFov:VENUE_CAMERA_POLICY.audienceFov};let overviewPose=null,sectionFocus=false,stageFocused=false,phoneFraming=false,researchTarget=null,researchConflicts=new Map(),referenceZonesVisible=false;
  const vec=a=>new THREE.Vector3(...a),clamp=THREE.MathUtils.clamp;
  function material(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.86,metalness:0,...extra});}
  function mesh(geometry,mat,parent=world){const object=new THREE.Mesh(geometry,mat);parent.add(object);return object;}
  function clean(group){const gs=new Set(),ms=new Set(),ts=new Set();group.traverse(o=>{if(o.geometry)gs.add(o.geometry);for(const m of [o.material].flat().filter(Boolean)){ms.add(m);if(m.map)ts.add(m.map);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());group.clear();}
  function quads(list){
    const points=[],normals=[];
    for(const q of list)for(let triangle=1;triangle<q.length-1;triangle++)for(const i of [0,triangle,triangle+1]){
      if(q.normals)normals.push([points.length/3,q.normals[i]]);
      points.push(...q[i]);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.computeVertexNormals();
    // Curved risers share analytic normals along a row. Tread/riser creases
    // remain hard; triangle diagonals must not become visible faceting.
    for(const [index,normal]of normals)g.attributes.normal.setXYZ(index,...normal);
    return g;
  }
  function textLabel(text,p,compact=false,parent=world){
    text=copy(text);
    const o2=venue.researchRenderBatch?.layout==='o2a',event=parent===researchOverlay,c=document.createElement('canvas');c.width=256;c.height=112;
    const x=c.getContext('2d'),lines=event&&text.length>16?text.split(' '):[text];
    if(event){x.font='700 70px system-ui';c.width=Math.max(112,Math.ceil(Math.max(...lines.map(line=>x.measureText(line).width))+40));c.height=lines.length*90+22;}
    x.textAlign='center';x.textBaseline='middle';
    if(o2||event||venue.geometry?.displayBasis==='source-row-ribbons'){
      x.font='700 70px system-ui';x.lineJoin='round';x.lineWidth=event?9:14;x.strokeStyle=venuePalette.labelOutline;for(const [i,line]of lines.entries())x.strokeText(line,c.width/2,event?56+i*90:58);x.fillStyle=venuePalette.label;
    }else{
      x.fillStyle=arenaTheme?'#111a22e8':'#f9fcf0ed';x.beginPath();x.roundRect(0,0,256,112,20);x.fill();x.fillStyle=arenaTheme?'#dfd7ff':'#425d3c';x.font='600 52px system-ui';
    }
    for(const [i,line]of lines.entries())x.fillText(line,c.width/2,event?56+i*90:58);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,depthWrite:false,transparent:true}));sprite.position.copy(vec(p)).add(new THREE.Vector3(0,event?.35:compact?.65:3,0));sprite.scale.set(compact?3.6:10.5,compact?1.5:3.1,1);if(event){sprite.userData.labelAspect=c.width/c.height;sprite.userData.labelHeight=lines.length>1?30:20;}parent.add(sprite);if(parent===world)labels.push(sprite);return sprite;
  }
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
    const display=o2DisplayModel(venue)||sourceBowlDisplay(venue),o2=Boolean(display);
    Object.assign(palette,themePalette,o2?{...venuePalette,clear:venuePalette.background,field:venuePalette.floor,infield:venuePalette.floor,seat:'#ffffff',seatBack:'#ffffff',top:venuePalette.stageTop}:{});
    scene.background.set(palette.background);scene.fog.color.set(palette.background);
    ambient.color.set(o2||arenaTheme?0xd6e7ff:0xffffff);ambient.groundColor.set(o2||arenaTheme?0x101820:0x93a49a);ambient.intensity=o2||arenaTheme?1.45:1.8;
    light.color.set(o2||arenaTheme?0xc9e6ff:0xfffaf1);light.intensity=o2||arenaTheme?1.8:2.1;
    clean(world);world.add(sectionSelection,rowLabelGroup);chairs=[];farSeatMeshes=[];nearSeatMeshes=[];records=[];labels=[];rowLabels=[];picks=[];const decks=[];records=display?.renderRecords||seatRecords(venue,layout);
    sectionGuides=display?.guides||[];
    const [floorX,floorZ]=venueFloor(venue),radius=venueRadius(venue);
    const floorShape=venueShape(venue)==='rectangle'?new THREE.BoxGeometry(Math.max(floorX,radius*2.2),.3,Math.max(floorZ,radius*1.65)):new THREE.CylinderGeometry(1,1,.3,96);
    const floor=mesh(floorShape,material(palette.floor));floor.position.y=-.35;floor.userData.excludeFit=true;if(venueShape(venue)!=='rectangle')floor.scale.set(Math.max(floorX,radius*2.2)/2,.999,Math.max(floorZ,radius*1.65)/2);
    const retained=venue.researchRenderBatch?.standGeometry;
    let fieldMesh=null;
    if(retained){
      const shape=new THREE.Shape(retained.floor.map(([x,z])=>new THREE.Vector2(x,z)));
      const field=mesh(new THREE.ShapeGeometry(shape),material(palette.field,{side:THREE.DoubleSide}));field.rotation.x=Math.PI/2;field.position.y=-.12;field.userData.excludeFit=true;fieldMesh=field;
    }else{
      const fieldIsRect=['rectangle','fan','rear'].includes(venueShape(venue));
      const fieldShape=fieldIsRect?new THREE.BoxGeometry(floorX,.12,floorZ):new THREE.CylinderGeometry(1,1,.12,96);
      const field=mesh(fieldShape,material(palette.field));field.position.y=-.12;field.userData.excludeFit=true;if(!fieldIsRect)field.scale.set(Math.min(floorX*.82,radius*1.65)/2,.999,Math.min(floorZ*.66,radius*1.2)/2);fieldMesh=field;
    }
    if(venue.sourceSeats){
      const footprints=display?.footprints||sourceSeatDecks(venue.sourceSeats,venue.researchRenderBatch?.layout);
      if(display){
        decks.push(...display.treads);
        decks.push(...display.concourse);
        canvas.dataset.standBasis=display.shellBasis||display.basis;canvas.dataset.standRows=String(display.rows.length);
        mesh(quads(display.risers),material(palette.riser,{side:THREE.DoubleSide,roughness:.95}));
        mesh(quads(display.walls),material(palette.apron,{side:THREE.DoubleSide,roughness:.92}));
        mesh(quads(display.gallery.decks),material(palette.deck,{side:THREE.DoubleSide}));
        mesh(quads(display.gallery.fascias),material(palette.apron,{side:THREE.DoubleSide}));
        mesh(quads(display.gallery.recesses),material(palette.floor,{side:THREE.DoubleSide}));
        mesh(quads(display.gallery.dividers),material(palette.deck,{side:THREE.DoubleSide}));
        fieldMesh.visible=!o2DisplayModel(venue);
        floor.material.color.set(palette.infield);
      }else decks.push(...footprints);
      const sectionDecks=new Map();(display?.renderRecords||venue.sourceSeats).forEach((s,i)=>{const list=sectionDecks.get(s.section)||[];list.push(footprints[i]);sectionDecks.set(s.section,list);});
      for(const section of venue.sections){
        const hit=mesh(quads(sectionDecks.get(section.id)||[]),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));hit.visible=false;hit.userData.section=section.id;picks.push(hit);textLabel(displaySectionLabel(section),display?.sectionCenters.get(section.id)||section.center);
      }
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
    if(display){
      mesh(quads(display.aisleSteps.map(s=>s.tread)),material(venuePalette.stairs,{side:THREE.DoubleSide}));
      mesh(quads(display.aisleSteps.flatMap(s=>s.risers)),material(palette.riser,{side:THREE.DoubleSide}));
      canvas.dataset.aisleHalfSteps=String(display.aisleSteps.length);
    }else delete canvas.dataset.aisleHalfSteps;
    const placeInstances=(geometries,target)=>{
      for(const [index,geometry] of geometries.entries()){
        const seats=new THREE.InstancedMesh(geometry,material(index===1?palette.seatBack:palette.seat),records.length);
        seats.frustumCulled=false;
        records.forEach((r,i)=>{dummy.position.copy(vec(r.p));dummy.rotation.order='YXZ';dummy.rotation.set(0,r.angle,0);dummy.scale.set(r.width,1,1);dummy.updateMatrix();seats.setMatrixAt(i,dummy.matrix);});
        seats.instanceMatrix.needsUpdate=true;world.add(seats);target.push(seats);
      }
    };
    // O2 keeps the same dimensions and support at both detail levels.
    // Zooming the orbit camera also enables the rounded close-up geometry.
    const parts=display?display.records[0].chairParts:chairParts;
    placeInstances((o2?parts:parts.slice(0,2)).map(part=>chairGeometry(part)),farSeatMeshes);
    placeInstances(parts.map((part,i)=>chairGeometry(part,o2&&i<2)),nearSeatMeshes);
    setSeatLod('overview');
    sampleMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(.32,8,6),new THREE.MeshBasicMaterial({color:'#d6ba65'}),1);world.add(sampleMesh);
    marker=mesh(new THREE.SphereGeometry(.18,12,8),new THREE.MeshBasicMaterial({color:palette.marker,transparent:true,opacity:.92}));
    markerRing=new THREE.Mesh(new THREE.TorusGeometry(.38,.045,8,24),new THREE.MeshBasicMaterial({color:palette.ring,transparent:true,opacity:.95}));
    markerRing.rotation.x=Math.PI/2;markerRing.position.y=-.72;marker.add(markerRing);
    buildRoof();canvas.dataset.coordinateBasis=display?.basis==='source-row-ribbons'?'source-model-xyz':display?'estimated-parametric':venue.sourceSeats?'source-model-xyz':'synthetic-geometry';canvas.dataset.layout=venue.seatLayout?.id||layout;canvas.dataset.sections=String(venue.sections.length);canvas.dataset.chairs=String(records.length);canvas.dataset.sourceChairs=String(venue.sourceSeats?.length||0);canvas.dataset.illustrativeChairs=String(display?.supplements.length||0);canvas.dataset.referenceChairs=String(display?.referenceRecords.length||0);updateSelection();
  }
  function renderLayout(){return layout==='none'&&!eventSelected&&venue?.researchRenderBatch?.layout==='o2a'?'event':layout;}
  function updateRowLabels(){
    clean(rowLabelGroup);rowLabels=[];
    if(!sectionFocus){canvas.dataset.rowLabels='0';return;}
    for(const anchor of [...o2RowLabelAnchors(venue,sectionId),...sourceRowLabelAnchors(venue,sectionId)]){
      const sprite=textLabel(anchor.label,anchor.p,true,rowLabelGroup);
      sprite.userData.rowLabel=true;sprite.userData.section=sectionId;sprite.userData.compact=true;
      rowLabels.push(sprite);
    }
    canvas.dataset.rowLabels=String(rowLabels.length);
  }
  function updateSelection(){
    const colors=[venuePalette.seat],selected=new THREE.Color(palette.selected);
    const sectionColors=new Map(venue.sections.map(s=>[s.id,venuePalette.seat]));
    for(const seats of [...farSeatMeshes,...nearSeatMeshes]){records.forEach((r,i)=>seats.setColorAt(i,researchConflicts.has(ticketSeatKey(r))?new THREE.Color(ticketConflictColor):r.section===sectionId?selected:new THREE.Color(sectionColors.get(r.section)||colors[r.tier%5])));seats.instanceColor.needsUpdate=true;}
    updateRowLabels();clean(sectionSelection);
    const selectedGuides=sectionGuides.filter(g=>g.section===sectionId),points=[],fillPoints=[];
    for(const guide of selectedGuides){
      const contour=guide.polygon.map(([x,,z])=>new THREE.Vector2(x,z));
      for(const triangle of THREE.ShapeUtils.triangulateShape(contour,[]))for(const index of triangle){const p=guide.polygon[index];fillPoints.push(p[0],guide.y+.012,p[2]);}
      for(const edge of guide.edges)for(let i=1;i<edge.length;i++){
        const a=edge[i-1],b=edge[i],length=Math.hypot(b[0]-a[0],b[2]-a[2]);
        if(length<1e-6)continue;
        const dx=-(b[2]-a[2])/length*.045,dz=(b[0]-a[0])/length*.045;
        points.push([[a[0]+dx,a[1]+.008,a[2]+dz],[b[0]+dx,b[1]+.008,b[2]+dz],[b[0]-dx,b[1]+.008,b[2]-dz],[a[0]-dx,a[1]+.008,a[2]-dz]]);
      }
    }
    if(fillPoints.length){
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(fillPoints,3));
      // One batched selection wash on existing treads, never a new wall or
      // a replacement for the source's physical aisle/seat geometry.
      mesh(geometry,new THREE.MeshBasicMaterial({color:'#d6bd7c',transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),sectionSelection);
    }
    if(points.length)mesh(quads(points),new THREE.MeshBasicMaterial({color:'#ba8f41',side:THREE.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),sectionSelection);
    canvas.dataset.selectedSectionGuides=String(selectedGuides.length);
    canvas.dataset.researchConflictSeats=String(records.filter(r=>researchConflicts.has(ticketSeatKey(r))).length);
    if(sampleMesh){world.remove(sampleMesh);sampleMesh.geometry.dispose();sampleMesh.material.dispose();}
    sampleRecords=venue.sourceSeats?[]:(venue.sections.find(s=>s.id===sectionId)?.samples||[]).filter(s=>Array.isArray(s.position));
    sampleMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(.33,8,6),new THREE.MeshBasicMaterial({color:palette.sample}),Math.max(1,sampleRecords.length));
    sampleMesh.count=sampleRecords.length;sampleRecords.forEach((s,i)=>{dummy.position.copy(vec(s.position)).add(new THREE.Vector3(0,1.05,0));dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();sampleMesh.setMatrixAt(i,dummy.matrix);});sampleMesh.instanceMatrix.needsUpdate=true;world.add(sampleMesh);
    if(marker&&position)marker.position.copy(vec(position)).add(new THREE.Vector3(0,1.6,0));
    if(marker)marker.visible=Boolean(position&&matched&&cameraMode!=='seat');
    wake();
  }
  function setSeatLod(value){
    const seatPixels=canvas.clientHeight*.46/(2*Math.tan(camera.fov*Math.PI/360)*Math.max(1,camera.position.distanceTo(controls.target)));
    const nearMode=value==='seat'||value==='near'||(venue?.researchRenderBatch?.layout==='o2a'||venue?.geometry?.displayBasis==='source-row-ribbons')&&seatPixels>=5;
    farSeatMeshes.forEach(mesh=>{mesh.visible=!nearMode;});
    nearSeatMeshes.forEach(mesh=>{mesh.visible=nearMode;});
    chairs=nearMode?nearSeatMeshes:farSeatMeshes;
    canvas.dataset.chairDetail=nearMode?'rounded':'simple';
  }
  function buildStage(){
    clean(stage);
    canvas.dataset.stageBoxes=String(stageBoxes(renderLayout(),venue).length);
    const stageLayout=renderLayout();
    const zones=stageLayout===venue.seatLayout?.id&&(!venue.researchRenderBatch||referenceZonesVisible)?venue.sourceZones||[]:[];
    for(const zone of zones){
      const geometry=new THREE.ShapeGeometry(new THREE.Shape(zone.polygon.map(([x,z])=>new THREE.Vector2(x,-z))));geometry.rotateX(-Math.PI/2);
      const object=mesh(geometry,material('#829b9c',{side:THREE.DoubleSide,transparent:true,opacity:.4}),stage);object.position.y=.02;
    }
    canvas.dataset.referenceZones=String(zones.length);
    for(const box of stageBoxes(stageLayout,venue)){
      const screen=box.kind==='screen',color=screen?palette.screen:box.kind==='frame'?palette.frame:box.kind==='top'?palette.top:palette.stage;
      const object=mesh(new THREE.BoxGeometry(...box.size),material(color,screen?{emissive:'#315c68',emissiveIntensity:.7,roughness:.6}:{}),stage);
      object.position.copy(vec(box.center));object.rotation.y=box.angle||0;
    }
    const p=performer(stageLayout,venue);if(p)addPerformer(p,stage);
  }
  function addPerformer(p,parent){
    const person=new THREE.Group();person.position.copy(vec(p));person.rotation.y=Math.atan2(-p[0],-p[2]);person.userData.illustrative=true;parent.add(person);
    const clothes=parent===researchOverlay?'#b53255':palette.clothes;
    const torso=mesh(new THREE.CylinderGeometry(.21,.16,.62,10),material(clothes),person);torso.position.y=1.08;
    const neck=mesh(new THREE.CylinderGeometry(.06,.06,.14,8),material(palette.skin),person);neck.position.y=1.43;
    const head=mesh(new THREE.SphereGeometry(.13,12,8),material(palette.skin),person);head.position.y=1.61;
    for(const side of [-1,1]){const leg=mesh(new THREE.CylinderGeometry(.065,.06,.78,8),material('#303b34'),person);leg.position.set(side*.1,.42,0);const arm=mesh(new THREE.CylinderGeometry(.05,.05,.62,8),material(clothes),person);arm.position.set(side*.25,1.02,0);arm.rotation.z=side*.15;}
    if(parent===researchOverlay){
      const mic=mesh(new THREE.CylinderGeometry(.018,.018,1.35,8),material('#263234'),person);mic.position.set(.28,.675,.35);
      const head=mesh(new THREE.SphereGeometry(.06,8,6),material('#202728'),person);head.position.set(.28,1.4,.35);
    }
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
    const stageList=stageRects(renderLayout(),venue),main=stageList[0];
    const direction=new THREE.Vector3(fans?.45:.75,.95,1);
    if(venue.geometry?.referenceLayout)direction.set(.45,1.2,-1);
    // Kai Tak's fixed bowl uses the public end-stage orientation at +Z.
    // Looking from +Z put the stage in the foreground and made the bowl look
    // rotated; keep the overview on the opposite end so the stage reads as
    // the far end of the venue, like the reference viewer.
    if(venue.id==='kai-tak-stadium')direction.set(.45,1.05,-1);
    else if(!fans&&main&&Math.abs(main.x)>Math.abs(main.z))direction.set(-1,1.15,.6);
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
  function setCameraMode(value){audienceGestures.clear();cameraMode=value;setSeatLod(value);resize();onMode(value,{viewMode:value==='seat'?'audience':stageFocused?'stage':sectionFocus?'near':'overview',zoom:fovToZoom(look.targetFov)});if(marker)marker.visible=Boolean(position&&matched&&value!=='seat');}
  function overview(reset=false){if(reset||!overviewPose)overviewPose=initial();sectionFocus=false;stageFocused=false;setCameraMode('overview');fly(overviewPose);}
  function stageView(){
    if(!researchTarget)return;
    const target=vec(researchTarget);
    sectionFocus=true;stageFocused=true;setCameraMode('overview');
    fly(pose(target.clone().add(new THREE.Vector3(4,3,9)),target,40));
  }
  function near(){
    const selected=records.filter(r=>r.section===sectionId);if(!selected.length)return;
    stageFocused=false;
    const bounds=new THREE.Box3();selected.forEach(r=>bounds.expandByPoint(vec(r.p)));
    const target=bounds.getCenter(new THREE.Vector3()).add(new THREE.Vector3(0,.5,0)),size=bounds.getSize(new THREE.Vector3()),out=new THREE.Vector3(target.x,0,target.z);
    if(out.lengthSq()<.01)out.set(0,0,1);else out.normalize();
    // Approach from the inner bowl. Approaching from outside placed the camera
    // inside the rows/balcony behind the selection and filled the screen with
    // the backs of unrelated chairs.
    const distance=Math.max(10,Math.min(70,Math.max(size.x,size.z,size.y)*1.65));
    const nearPose=pose(target.clone().addScaledVector(out,-distance).add(new THREE.Vector3(0,distance*.85,0)),target);
    sectionFocus=true;setCameraMode('overview');setSeatLod('near');updateRowLabels();fly(nearPose);
  }
  function seatView(){if(!matched||!position)return;if(!overviewPose)overviewPose=initial();
    stageFocused=false;
    const line=floorView?null:audienceSightline(venue,renderLayout(),position),eye=vec(position.map((v,i)=>v+(i===1?VENUE_CAMERA_POLICY.eyeHeight:0))),target=vec(line?.target||researchTarget||[0,eye.y,0]),dir=target.clone().sub(eye).normalize();
    look.yaw=look.targetYaw=Math.atan2(dir.x,dir.z);look.pitch=look.targetPitch=Math.asin(dir.y);look.fov=look.targetFov=VENUE_CAMERA_POLICY.audienceFov;
    setCameraMode('seat');fly(pose(eye,target,VENUE_CAMERA_POLICY.audienceFov));
  }
  function setZoom(value){
    setFov(zoomToFov(Number(value)||1));
  }
  function setFov(value){
    look.targetFov=value;
    if(tween&&cameraMode==='seat')tween.fov=look.fov=look.targetFov;
    onMode(cameraMode,{zoom:fovToZoom(value),fov:value});wake();
  }
  function getView(){
    const target=cameraMode==='seat'?camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3())):controls.target;
    return {mode:cameraMode==='seat'?'seat':stageFocused?'stage':sectionFocus?'near':'overview',position:camera.position.toArray(),target:target.toArray(),fov:camera.fov,phone:phoneFraming,roof:roofGroup.visible};
  }
  function restoreView(view){
    if(view.mode==='seat'&&(!matched||!position||vec(view.position).distanceTo(vec(position).add(new THREE.Vector3(0,VENUE_CAMERA_POLICY.eyeHeight,0)))>.01))return false;
    sectionFocus=view.mode==='near'||view.mode==='stage';stageFocused=view.mode==='stage';phoneFraming=view.phone;roofGroup.visible=view.roof;
    setCameraMode(view.mode==='seat'?'seat':'overview');tween=null;
    if(view.mode==='near'){setSeatLod('near');updateRowLabels();}
    camera.position.fromArray(view.position);controls.target.fromArray(view.target);camera.lookAt(controls.target);camera.fov=view.fov;camera.updateProjectionMatrix();
    const direction=vec(view.target).sub(camera.position).normalize();
    look.yaw=look.targetYaw=Math.atan2(direction.x,direction.z);look.pitch=look.targetPitch=Math.asin(direction.y);look.fov=look.targetFov=view.fov;
    controls.enabled=cameraMode==='overview';onMode(cameraMode,{zoom:fovToZoom(view.fov)});wake();return true;
  }
  function resize(){
    const rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
    const frame=phoneFrameRect(rect.width,rect.height),aspect=phoneFraming&&cameraMode==='seat'?frame.width/frame.height:rect.width/rect.height,changed=Math.abs(camera.aspect-aspect)>.0001;
    for(const [key,value]of Object.entries({x:frame.x,y:frame.y,width:frame.width,height:frame.height}))canvas.parentElement.style.setProperty('--frame-'+key,value+'px');
    renderer.setSize(Math.round(rect.width),Math.round(rect.height),false);camera.aspect=aspect;camera.updateProjectionMatrix();
    if(changed&&venue&&records.length){
      overviewPose=initial();
      // Near views also use orbit controls; resizing must preserve their
      // position instead of silently flying back to the whole venue.
      if(cameraMode==='overview'&&!sectionFocus)fly(overviewPose);
    }
    wake();
  }
  function labelsForView(){const rect=canvas.getBoundingClientRect(),occupied=[];
    // Projection runs before renderer.render(), which normally updates the
    // camera matrix. A one-frame jump must not cull labels using the old pose.
    camera.updateMatrixWorld();
    for(const label of [...researchOverlay.children.filter(object=>object.isSprite),...labels,...rowLabels]){label.visible=false;if(cameraMode!=='overview'||stageFocused||label.userData.rowLabel&&!sectionFocus)continue;const p=label.position.clone().project(camera);if(Math.abs(p.x)>1||Math.abs(p.y)>1||p.z<-1||p.z>1)continue;
      const x=(p.x+1)*rect.width/2,y=(1-p.y)*rect.height/2,compact=Boolean(label.userData.compact),event=Boolean(label.userData.researchShape),height=label.userData.labelHeight||(compact?26:venue.researchRenderBatch?.layout==='o2a'?24:20),aspect=label.userData.labelAspect||2.28,width=height*aspect;
      if(occupied.some(q=>Math.abs(q.x-x)<(event||q.event?(q.width+width)/2+3:compact?45:70)&&Math.abs(q.y-y)<(event||q.event?(q.height+height)/2+3:compact?18:27)))continue;occupied.push({x,y,width,height,event});label.visible=true;
      const h=2*camera.position.distanceTo(label.position)*Math.tan(camera.fov*Math.PI/360)*height/Math.max(1,rect.height);label.scale.set(h*aspect,h,1);
    }
    canvas.dataset.researchLabels=JSON.stringify(researchOverlay.children.filter(object=>object.isSprite&&object.visible).map(object=>object.userData.researchShape.label));
    canvas.dataset.stageFocus=String(stageFocused);
  }
  function wake(){dirty=true;if(!pending){pending=true;requestAnimationFrame(animate);}}
  function animate(now){pending=false;if(document.hidden||mode!=='3d'||!venue)return;
    const dt=Math.min(.05,(now-last)/1000),finishingTween=Boolean(tween);last=now;let moving=false;
    if(tween){const t=clamp((now-tween.start)/(reduced?1:750),0,1),u=1-(1-t)**3;camera.position.lerpVectors(tween.from,tween.p,u);camera.quaternion.slerpQuaternions(tween.fromQ,tween.q,u);camera.fov=THREE.MathUtils.lerp(tween.fromFov,tween.fov,u);controls.target.copy(tween.target);camera.updateProjectionMatrix();moving=t<1;if(!moving){tween=null;controls.enabled=cameraMode==='overview';}}
    else if(cameraMode==='overview'){controls.enabled=true;moving=controls.update();}
    else{
      const a=1-Math.exp(-dt*16),delta=Math.atan2(Math.sin(look.targetYaw-look.yaw),Math.cos(look.targetYaw-look.yaw));
      look.yaw+=delta*a;look.pitch+=(look.targetPitch-look.pitch)*a;look.fov+=(look.targetFov-look.fov)*a;
      moving=Math.abs(delta)+Math.abs(look.targetPitch-look.pitch)+Math.abs(look.targetFov-look.fov)>.0001;
      camera.position.copy(vec(position.map((v,i)=>v+(i===1?VENUE_CAMERA_POLICY.eyeHeight:0))));camera.lookAt(camera.position.clone().add(new THREE.Vector3(Math.sin(look.yaw)*Math.cos(look.pitch),Math.sin(look.pitch),Math.cos(look.yaw)*Math.cos(look.pitch))));camera.fov=look.fov;camera.updateProjectionMatrix();
    }
    if(dirty||moving||finishingTween){
      if(venue.researchRenderBatch?.layout==='o2a')setSeatLod(cameraMode);
      labelsForView();const width=canvas.clientWidth,height=canvas.clientHeight;
      renderer.setScissorTest(false);renderer.setViewport(0,0,width,height);renderer.setClearColor(palette.clear);renderer.clear();
      if(phoneFraming&&cameraMode==='seat'){const r=phoneFrameRect(width,height);renderer.setViewport(r.x,height-r.y-r.height,r.width,r.height);renderer.setScissor(r.x,height-r.y-r.height,r.width,r.height);renderer.setScissorTest(true);}
      renderer.render(scene,camera);renderer.setScissorTest(false);
      dirty=false;canvas.dataset.engine='Three.js '+THREE.REVISION;canvas.dataset.camera=cameraMode;canvas.dataset.illustrativeView=String(floorView);canvas.dataset.phoneFrame=String(phoneFraming&&cameraMode==='seat');canvas.dataset.roof=String(roofGroup.visible);canvas.dataset.fov=camera.fov.toFixed(2);canvas.dataset.frame=String(Number(canvas.dataset.frame||0)+1);canvas.dataset.drawCalls=String(renderer.info.render.calls);canvas.dataset.geometries=String(renderer.info.memory.geometries);canvas.dataset.cameraDirection=camera.getWorldDirection(new THREE.Vector3()).toArray().map(x=>x.toFixed(6)).join(',');canvas.dataset.cameraPosition=camera.position.toArray().map(x=>x.toFixed(3)).join(',');}
    if(moving||tween)wake();
  }
  let down=null;
  canvas.addEventListener('pointerdown',e=>{
    // The capture phase hands off before OrbitControls checks enabled. A
    // flight must not swallow the first drag back out of a seated view.
    if(cameraMode==='overview'){tween=null;controls.enabled=true;}
    down={x:e.clientX,y:e.clientY};wake();
  },{capture:true});
  const audienceGestures=bindAudienceGestures(canvas,{active:()=>cameraMode==='seat',onStart(){tween=null;},onLook(dx,dy){look.targetYaw+=dx;look.targetPitch=clamp(look.targetPitch+dy,-VENUE_CAMERA_POLICY.maxPitch,VENUE_CAMERA_POLICY.maxPitch);wake();},onZoom:factor=>setFov(scaleVenueFov(look.targetFov,factor))});
  function up(e){const click=down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<5&&e.type==='pointerup';down=null;
    if(!click||cameraMode!=='overview')return;const b=canvas.getBoundingClientRect();cursor.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);raycaster.setFromCamera(cursor,camera);
    const researchHit=raycaster.intersectObjects(researchOverlay.children.filter(object=>object.isMesh),false)[0];if(researchHit){
      const chair=researchHit.object.userData.researchChairs?.[researchHit.instanceId];
      if(chair){onFloorView(chair);return;}
      onResearchShape(researchHit.object.userData.researchShape);return;
    }
    const sample=sampleMesh?.count?raycaster.intersectObject(sampleMesh,false)[0]:null;if(sample){onSample(sampleRecords[sample.instanceId]);return;}
    const seat=raycaster.intersectObjects(chairs,false)[0];
    if(seat?.instanceId!==undefined){const record=records[seat.instanceId];if(record?.section){if(record.visualOnly)onSection(record.section,true,{previewOnly:true});else onSeat(record);return;}}
    const hit=raycaster.intersectObjects(picks,false)[0];if(hit)onSection(hit.object.userData.section);
  }
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);

  controls.addEventListener('change',wake);controls.addEventListener('start',()=>{if(cameraMode==='overview')tween=null;wake();});
  canvas.style.touchAction='none';canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();onFailure(copy("三维画面暂时中断，可先切换二维图，或刷新后重试。"));});
  canvas.addEventListener('webglcontextrestored',wake);document.addEventListener('visibilitychange',()=>{last=performance.now();if(!document.hidden)wake();});
  new ResizeObserver(resize).observe(canvas.parentElement);
  return {
    setData(nextVenue,nextSection,nextPosition,nextLayout,nextMatched,nextEventSelected=false,nextFloorView=false){
      const changed=venue?.id!==nextVenue.id||venue?.seatLayout?.id!==nextVenue.seatLayout?.id||venue?.eventLayout?.id!==nextVenue.eventLayout?.id,sectionChanged=sectionId!==nextSection,positionChanged=String(position)!==String(nextPosition),layoutChanged=layout!==nextLayout||eventSelected!==nextEventSelected;
      venue=nextVenue;sectionId=nextSection;position=nextPosition;layout=nextLayout;matched=nextMatched;eventSelected=nextEventSelected;floorView=nextFloorView;if(changed){phoneFraming=false;researchTarget=null;researchConflicts=new Map();clean(researchOverlay);canvas.dataset.researchShapes='0';delete canvas.dataset.researchTarget;}
      if(changed||layoutChanged&&!venue.sourceSeats)buildVenue();else if(sectionChanged||positionChanged)updateSelection();
      if(changed||layoutChanged)buildStage();if(changed){overviewPose=initial();overview(true);}else if(cameraMode==='seat'&&(positionChanged||layoutChanged)){if(matched)seatView();else near();}
      resize();if(changed)overview(true);wake();
    },
    zoom(factor){if(cameraMode==='seat'){setFov(scaleVenueFov(look.targetFov,factor));return;}camera.position.sub(controls.target).multiplyScalar(1/factor).add(controls.target);controls.update();wake();},
    getView,restoreView,
    setMode(value){mode=value;if(value==='3d'){resize();wake();}},overview,near,seatView,stageView,setZoom,
    // Explicit opt-in for local/admin previews. Drafts never become
    // eventLayout, stageBoxes, seat filtering, sightlines or distance inputs.
    setResearchOverlay(draft){
      clean(researchOverlay);researchTarget=null;researchConflicts=new Map();canvas.dataset.researchShapes='0';canvas.dataset.eventFloorChairs='0';canvas.dataset.eventPerformer='0';delete canvas.dataset.researchTarget;delete canvas.dataset.eventPerformerPosition;
      if(!draft){if(stageFocused)overview();updateSelection();return;}
      const shellEvent=draft.status==='shell-event-preview';
      if(shellEvent){
        if(draft.venueId!==venue?.id)throw Error('Research overlay binding mismatch');
      }else if(draft.status!=='research-preview'||draft.venueId!==venue?.id||draft.seatLayoutId!==venue?.seatLayout?.id||draft.fixedSeats.assetSha256!==venue?.seatLayout?.assetSha256)throw Error('Research overlay binding mismatch');
      researchConflicts=shellEvent?new Map():ticketMapConflictIndex(draft);
      const shapes=shellEvent?draft.shapes:[...draft.zones,...draft.stage,...draft.equipment];
      for(const o of shapes){
        const shape=new THREE.Shape(o.polygon.map(([x,z])=>new THREE.Vector2(x,-z)));
        for(const points of o.holes||[])shape.holes.push(new THREE.Path(points.map(([x,z])=>new THREE.Vector2(x,-z))));
        const geometry=new THREE.ExtrudeGeometry(shape,{depth:o.height,bevelEnabled:false});geometry.rotateX(-Math.PI/2);
        const object=new THREE.Mesh(geometry,material(o.color,{side:THREE.DoubleSide}));object.userData.researchShape={id:o.id,label:o.label,kind:o.kind};researchOverlay.add(object);
        {
          const border=new THREE.BufferGeometry().setFromPoints(o.polygon.map(([x,z])=>new THREE.Vector3(x,o.height+.025,z)));
          const line=new THREE.LineLoop(border,new THREE.LineBasicMaterial({color:o.kind==='stage'?'#c96927':'#355565'}));line.userData.researchShape=object.userData.researchShape;researchOverlay.add(line);
          const anchor=o.labelPosition||o.polygon.reduce((a,p)=>[a[0]+p[0]/o.polygon.length,a[1]+p[1]/o.polygon.length],[0,0]);
          const center=[anchor[0],o.height+.2,anchor[1]];
          const label=textLabel(o.label,center,false,researchOverlay);label.userData.researchShape=object.userData.researchShape;
        }
      }
      const floorChairs=draft.floorChairs||[];
      if(floorChairs.length){
        const parts=(o2DisplayModel(venue)||sourceBowlDisplay(venue))?.records[0].chairParts||chairParts;
        for(const [i,part]of parts.entries()){
          const seats=new THREE.InstancedMesh(chairGeometry(part,i<2),material(venuePalette.seat),floorChairs.length);
          for(const [index,chair]of floorChairs.entries()){
            dummy.position.copy(vec(chair.p));dummy.rotation.set(0,chair.angle,0);dummy.scale.set(1,1,1);dummy.updateMatrix();seats.setMatrixAt(index,dummy.matrix);
          }
          seats.instanceMatrix.needsUpdate=true;seats.userData.illustrative=true;seats.userData.researchChairs=floorChairs;researchOverlay.add(seats);
        }
      }
      canvas.dataset.eventFloorChairs=String(floorChairs.length);
      // Orient the reference camera only; no draft enters distance calculations.
      const main=shellEvent?shapes.find(shape=>shape.kind==='stage'):draft.stage?.[0];
      if(main){
        researchTarget=main.labelPosition?[main.labelPosition[0],main.height,main.labelPosition[1]]:[main.polygon.reduce((sum,p)=>sum+p[0],0)/main.polygon.length,main.height,main.polygon.reduce((sum,p)=>sum+p[1],0)/main.polygon.length];
        {
          addPerformer(researchTarget,researchOverlay);canvas.dataset.eventPerformer='1';canvas.dataset.eventPerformerPosition=researchTarget.join(',');
          // Frame the illustrative person's torso rather than the stage floor.
          researchTarget=[researchTarget[0],researchTarget[1]+.875,researchTarget[2]];
        }
        canvas.dataset.researchTarget=researchTarget.join(',');
      }
      canvas.dataset.researchShapes=String(shapes.length);if(stageFocused)stageView();updateSelection();
    },
    toggleReferenceZones(value){if(referenceZonesVisible===Boolean(value))return;referenceZonesVisible=Boolean(value);buildStage();wake();},
    toggleRoof(value){roofGroup.visible=Boolean(value);wake();},
    togglePhoneFrame(value){if(phoneFraming===Boolean(value))return;phoneFraming=Boolean(value);resize();wake();},
    dispose(){audienceGestures.dispose();controls.dispose();clean(world);clean(stage);clean(roofGroup);clean(researchOverlay);renderer.dispose();}
  };
}
