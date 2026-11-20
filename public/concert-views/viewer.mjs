import {createVenueShell} from './venue-shell.mjs';
import {VENUE_CAMERA_POLICY,bindAudienceGestures,venueZoomToFov as zoomToFov,venueFovToZoom as fovToZoom,scaleVenueFov} from '../venue-view/venue-camera-policy.mjs';
import {copy} from '../locales.mjs';
import {venuePalette,venueScenePalette} from '../venue-view/venue-palette.mjs';
import {seatRecords,stageBoxes,roofStructure} from './scene-geometry.mjs';
import {phoneFrameRect} from './explorer-state.mjs';
import {sourceSeatDecks} from './seating.mjs';
import {o2DisplayModel,o2RowLabelAnchors} from './o2-display.mjs';
import {chairParts,stageBoxesFromRects,surfaceOutsideBoxes} from './spatial.mjs';
import {sourceBowlDisplay,sourceRowLabelAnchors} from './source-bowl-display.mjs';
import {chairGeometry} from './chair-geometry.mjs';
import {fitSceneView,sceneBoxCorners} from './scene-camera.mjs';
import {ticketSeatKey,ticketMapConflictIndex,ticketConflictColor} from './ticket-map-conflicts.mjs';
import {createSceneV2Assets,buildSilhouettePerformer,addStageLightingAndTruss,addTheatreProscenium,decorateBowlDisplay,decorateParametricBowl,decorateEquipmentShape} from './scene-v2-kit.mjs';
import * as THREE from '../vendor/three.module.min.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {sectionPoint,sectionRenderHalfAngle,sectionRowCount,sectionSteps,displaySectionLabel,stageFootprint,stageRects,performer,audienceSightline,venueShape,venueFloor,venueRadius} from './geometry.mjs';

export function createViewer(canvas,{onSection,onSample,onSeat=()=>{},onMode=()=>{},onFailure=()=>{},onResearchShape=()=>{},onFloorView=()=>{},onShellLoaded=()=>{}}) {
  const arenaTheme=document.body.classList.contains('theme-arena');
  const themePalette=venueScenePalette(),palette={...themePalette};
  const scene=new THREE.Scene();scene.background=new THREE.Color(palette.background);scene.fog=new THREE.FogExp2(palette.background,.0024);
  const ambient=new THREE.HemisphereLight(arenaTheme?0x9ec4f5:0xffffff,arenaTheme?0x0d131c:0x93a49a,arenaTheme?.85:1.55);scene.add(ambient);const light=new THREE.DirectionalLight(arenaTheme?0xfff1dc:0xfffaf1,arenaTheme?2.1:2.1);light.position.set(-70,120,60);light.castShadow=true;light.shadow.mapSize.set(2048,2048);light.shadow.bias=-0.0006;scene.add(light);
  // A single key light flattens the far side of a bowl. The fill is cool and
  // weak, so curvature reads without introducing a second highlight.
  const fill=new THREE.DirectionalLight(0x7ca6e8,0.75);fill.position.set(110,70,-95);scene.add(fill);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.localClippingEnabled=true;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  const v2Assets=createSceneV2Assets(renderer);if(v2Assets.envTexture){scene.environment=v2Assets.envTexture;scene.environmentIntensity=.65;}
  const camera=new THREE.PerspectiveCamera(43,1,.12,1400);camera.position.set(185,155,210);
  const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=6;controls.maxDistance=650;controls.maxPolarAngle=Math.PI/2.04;controls.rotateSpeed=.8;controls.zoomSpeed=.8;controls.target.set(0,8,0);controls.update();
  const world=new THREE.Group(),stage=new THREE.Group(),roofGroup=new THREE.Group(),researchOverlay=new THREE.Group();scene.add(world,stage,roofGroup,researchOverlay);roofGroup.visible=false;
  const shell=createVenueShell(scene,canvas,loaded=>{
    if(loaded){
      if(shell.stageRigCeiling!==null)buildStage();
      onShellLoaded();
    }
    if(loaded&&cameraMode==='overview'&&!sectionFocus&&!restoredOrbit)overview(true,false);else wake();
  },v2Assets.concreteTex);
  const crowdMesh=new THREE.InstancedMesh(v2Assets.crowdGeo,new THREE.MeshStandardMaterial({color:'#282c37',vertexColors:true,roughness:.98}),80);crowdMesh.count=0;crowdMesh.visible=false;crowdMesh.frustumCulled=false;scene.add(crowdMesh);
  const stageBounds=new THREE.Box3(),researchStageBounds=new THREE.Box3();
  const sectionSelection=new THREE.Group(),rowLabelGroup=new THREE.Group(),sectionSurfaces=new Map();let sectionGuides=[];
  let venue=null,sectionId='',position=null,layout='',matched=false,eventSelected=false,floorView=false,mode='3d',cameraMode='overview',tween=null,pending=false,dirty=true,last=performance.now(),chairs=[],farSeatMeshes=[],nearSeatMeshes=[],records=[],labels=[],rowLabels=[],picks=[],sampleMesh=null,sampleRecords=[],marker=null,markerRing=null;
  const dummy=new THREE.Object3D(),raycaster=new THREE.Raycaster(),cursor=new THREE.Vector2(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const look={yaw:0,pitch:0,targetYaw:0,targetPitch:0,fov:VENUE_CAMERA_POLICY.audienceFov,targetFov:VENUE_CAMERA_POLICY.audienceFov};let overviewPose=null,restoredOrbit=false,sectionFocus=false,stageFocused=false,phoneFraming=false,researchTarget=null,researchConflicts=new Map(),referenceZonesVisible=false;
  const vec=a=>new THREE.Vector3(...a),clamp=THREE.MathUtils.clamp;
  function material(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.86,metalness:0,...extra});}
  function mesh(geometry,mat,parent=world){const object=new THREE.Mesh(geometry,mat);parent.add(object);return object;}
  function clean(group){const gs=new Set(),ms=new Set(),ts=new Set();group.traverse(o=>{if(o.geometry&&!o.geometry.userData?.shared)gs.add(o.geometry);for(const m of [o.material].flat().filter(Boolean)){ms.add(m);if(m.map&&!m.map.userData?.shared)ts.add(m.map);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());group.clear();}
  function quads(list){
    const points=[],uvs=[],normals=[];
    for(const q of list)for(let triangle=1;triangle<q.length-1;triangle++)for(const i of [0,triangle,triangle+1]){
      const p=q[i];
      if(q.normals)normals.push([points.length/3,q.normals[i]]);
      points.push(...p);
      uvs.push((p[0]+p[2])*.18,(p[1]+p[2]*.35)*.18);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.computeVertexNormals();
    // Curved risers share analytic normals along a row. Tread/riser creases
    // remain hard; triangle diagonals must not become visible faceting.
    for(const [index,normal]of normals)g.attributes.normal.setXYZ(index,...normal);
    return g;
  }
  function textLabel(text,p,compact=false,parent=world){
    text=copy(text);
    const o2=venue.researchRenderBatch?.layout==='o2a',event=parent===researchOverlay,c=document.createElement('canvas');
    const x=c.getContext('2d'),lines=event&&text.length>16?text.split(' '):[text],outlined=o2||event||venue.geometry?.displayBasis==='source-row-ribbons';
    x.font=outlined?'700 70px system-ui':'600 52px system-ui';
    c.width=Math.max(112,Math.ceil(Math.max(...lines.map(line=>x.measureText(line).width))+40));c.height=event?lines.length*90+22:112;
    x.textAlign='center';x.textBaseline='middle';
    if(outlined){
      x.font='700 70px system-ui';x.lineJoin='round';x.lineWidth=event?9:14;x.strokeStyle=venuePalette.labelOutline;for(const [i,line]of lines.entries())x.strokeText(line,c.width/2,event?56+i*90:58);x.fillStyle=venuePalette.label;
    }else{
      x.fillStyle=arenaTheme?'#111a22e8':'#f9fcf0ed';x.beginPath();x.roundRect(0,0,c.width,c.height,20);x.fill();x.fillStyle=arenaTheme?'#dfd7ff':'#425d3c';x.font='600 52px system-ui';
    }
    for(const [i,line]of lines.entries())x.fillText(line,c.width/2,event?56+i*90:58);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,depthWrite:false,transparent:true}));sprite.position.copy(vec(p)).add(new THREE.Vector3(0,event?.35:compact?.65:3,0));sprite.scale.set(compact?3.6:10.5,compact?1.5:3.1,1);sprite.userData.labelAspect=c.width/c.height;if(event)sprite.userData.labelHeight=lines.length>1?30:20;parent.add(sprite);if(parent===world)labels.push(sprite);return sprite;
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
    const shellBoxes=display?stageBoxes(renderLayout(),venue):[],clearShell=list=>list.flatMap(face=>surfaceOutsideBoxes(face,shellBoxes));
    Object.assign(palette,themePalette,o2?{...venuePalette,clear:venuePalette.background,field:venuePalette.floor,infield:venuePalette.floor,seat:'#ffffff',seatBack:'#ffffff',top:venuePalette.stageTop}:{});
    scene.background.set(palette.background);scene.fog.color.set(palette.background);
    const shadowRadius=Math.max(52,venueRadius(venue)*1.15);
    light.shadow.camera.left=-shadowRadius;light.shadow.camera.right=shadowRadius;light.shadow.camera.top=shadowRadius;light.shadow.camera.bottom=-shadowRadius;light.shadow.camera.near=10;light.shadow.camera.far=shadowRadius*4.5;light.shadow.camera.updateProjectionMatrix();
    ambient.color.set(o2||arenaTheme?0x9ec4f5:0xffffff);ambient.groundColor.set(o2||arenaTheme?0x0d131c:0x93a49a);ambient.intensity=o2||arenaTheme?.85:1.55;
    light.color.set(o2||arenaTheme?0xfff1dc:0xfffaf1);light.intensity=o2||arenaTheme?2.1:2.1;
    clean(world);const decorations=new THREE.Group();world.add(decorations);world.add(sectionSelection,rowLabelGroup);sectionSurfaces.clear();chairs=[];farSeatMeshes=[];nearSeatMeshes=[];labels=[];rowLabels=[];picks=[];const decks=[],architecture=[];
    records=display?.renderRecords||(venue.sourceSeats||venue.calendarVenue?seatRecords(venue,layout):[]);
    sectionGuides=display?.guides||[];
    if(venue.sourceSeats){
      const footprints=display?.footprints||sourceSeatDecks(venue.sourceSeats,venue.researchRenderBatch?.layout);
      if(display){
        decks.push(...clearShell(display.treads));
        decks.push(...clearShell(display.concourse));
        canvas.dataset.standBasis=display.shellBasis||display.basis;canvas.dataset.standRows=String(display.rows.length);
        const riserMesh=mesh(quads(clearShell(display.risers)),material(palette.riser,{side:THREE.DoubleSide,roughness:.95}));riserMesh.receiveShadow=true;architecture.push(riserMesh);
        const wallMesh=mesh(quads(clearShell(display.walls)),material(palette.apron,{side:THREE.DoubleSide,roughness:.92}));wallMesh.receiveShadow=true;architecture.push(wallMesh);
        const gDeck=mesh(quads(clearShell(display.gallery.decks)),material(palette.deck,{map:v2Assets.concreteTex,side:THREE.DoubleSide}));gDeck.receiveShadow=true;architecture.push(gDeck);
        for(const [faces,color] of [[display.gallery.fascias,palette.apron],[display.gallery.recesses,palette.floor],[display.gallery.dividers,palette.deck]]){
          const wall=mesh(quads(clearShell(faces)),material(color,{side:THREE.DoubleSide}));
          wall.receiveShadow=true;architecture.push(wall);
        }
      }else decks.push(...footprints);
      const sectionDecks=new Map();(display?.renderRecords||venue.sourceSeats).forEach((s,i)=>{const list=sectionDecks.get(s.section)||[];list.push(footprints[i]);sectionDecks.set(s.section,list);});
      for(const section of venue.sections){
        if(section.kind==='standing')decks.push(section.polygon);
        const hit=mesh(quads(section.kind==='standing'?[section.polygon]:sectionDecks.get(section.id)||[]),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));hit.visible=false;hit.userData.section=section.id;picks.push(hit);textLabel(displaySectionLabel(section),display?.sectionCenters.get(section.id)||section.center).userData.section=section.id;
      }
    }else{
    const risers=[];
    for(const section of venue.sections){
      const renderHalfAngle=sectionRenderHalfAngle(venue,section),steps=sectionSteps(venue,section);
      decks.push(...steps.treads);risers.push(...steps.risers,...steps.walls);
      // A section model has no individual seat positions. Pick and highlight
      // the rendered terraces directly instead of drawing a simulated seat grid.
      const surface=quads(steps.treads);surface.computeBoundingBox();sectionSurfaces.set(section.id,surface);
      const hit=mesh(surface,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));hit.visible=false;hit.userData.section=section.id;picks.push(hit);
      const anchor=sectionPoint(venue,section,.55,0,renderHalfAngle);
      const label=textLabel(displaySectionLabel(section),anchor,!!section.block?.polygon);
      label.userData.section=section.id;
      if(venueShape(venue)==='baseball'&&!section.block)label.userData.treadAnchor=vec(anchor);
    }
    mesh(quads(risers),material(palette.riser,{side:THREE.DoubleSide})).receiveShadow=true;
    buildBowlShell();
    decorateParametricBowl(decorations,venue,sectionPoint,sectionRenderHalfAngle,sectionRowCount);
    }
    const ground=buildVenueGround();
    const turf=!stageRects(renderLayout(),venue).length&&(venueShape(venue)==='baseball'||Math.min(...venueFloor(venue))>=135);
    if(ground?.material){ground.material.map=turf?v2Assets.turfTex:v2Assets.floorTex;if(turf)ground.material.color.set('#e1e9dc');ground.material.roughness=.78;ground.material.metalness=.06;ground.material.needsUpdate=true;ground.receiveShadow=true;}
    const deckMesh=mesh(quads(decks),material(palette.deck,{map:v2Assets.concreteTex,roughness:.88,metalness:.04,side:THREE.DoubleSide}));deckMesh.receiveShadow=true;deckMesh.castShadow=true;architecture.push(deckMesh);
    if(display){
      mesh(quads(clearShell(display.aisleSteps.map(s=>s.tread))),material(venuePalette.stairs,{side:THREE.DoubleSide})).receiveShadow=true;
      mesh(quads(clearShell(display.aisleSteps.flatMap(s=>s.risers))),material(palette.riser,{side:THREE.DoubleSide})).receiveShadow=true;
      decorateBowlDisplay(decorations,display,v2Assets);
      canvas.dataset.aisleHalfSteps=String(display.aisleSteps.length);
    }else delete canvas.dataset.aisleHalfSteps;
    const placeInstances=(geometries,target)=>{
      if(!records.length)return;
      for(const [index,geometry] of geometries.entries()){
        const seats=new THREE.InstancedMesh(geometry,material(index===1?palette.seatBack:palette.seat,{roughness:.79,metalness:.03}),records.length);
        if(geometry.attributes.color)seats.material.vertexColors=true;
        seats.castShadow=true;seats.receiveShadow=true;
        seats.frustumCulled=false;
        records.forEach((r,i)=>{dummy.position.copy(vec(r.p));dummy.rotation.order='YXZ';dummy.rotation.set(0,r.angle,0);dummy.scale.set(r.width,1,1);dummy.updateMatrix();seats.setMatrixAt(i,dummy.matrix);});
        seats.instanceMatrix.needsUpdate=true;world.add(seats);target.push(seats);
      }
    };
    // O2 keeps the same dimensions and support at both detail levels.
    // Zooming the orbit camera also enables the rounded close-up geometry.
    placeInstances([o2?v2Assets.o2FarChairGeo:v2Assets.farChairGeo],farSeatMeshes);
    placeInstances([o2?v2Assets.o2NearChairGeo:v2Assets.nearChairGeo],nearSeatMeshes);
    setSeatLod('overview');
    sampleMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(.32,8,6),new THREE.MeshBasicMaterial({color:'#d6ba65'}),1);world.add(sampleMesh);
    marker=mesh(new THREE.SphereGeometry(.18,12,8),new THREE.MeshBasicMaterial({color:palette.marker,transparent:true,opacity:.92}));
    markerRing=new THREE.Mesh(new THREE.TorusGeometry(.38,.045,8,24),new THREE.MeshBasicMaterial({color:palette.ring,transparent:true,opacity:.95}));
    markerRing.rotation.x=Math.PI/2;markerRing.position.y=-.72;marker.add(markerRing);
    buildRoof();shell.bind({roof:roofGroup,floor:[ground],decorations,architecture});shell.setVenue(venue.id);canvas.dataset.coordinateBasis=venue.accuracy?.position==='reference-model-estimate'?'reference-model-estimate':display?.basis==='source-row-ribbons'?'source-model-xyz':display?'estimated-parametric':venue.sourceSeats?'source-model-xyz':'synthetic-geometry';canvas.dataset.layout=venue.seatLayout?.id||layout;canvas.dataset.sections=String(venue.sections.length);canvas.dataset.chairs=String(records.length);canvas.dataset.sourceChairs=String(venue.sourceSeats?.length||0);canvas.dataset.illustrativeChairs=String(records.filter(r=>r.visualOnly&&!r.referenceSeat).length);canvas.dataset.referenceChairs=String(display?.referenceRecords.length||0);updateSelection();
  }
  function buildVenueGround(){
    const footprint=new THREE.Box3(),point=new THREE.Vector3();
    for(const record of records)footprint.expandByPoint(point.fromArray(record.p));
    for(const surface of sectionSurfaces.values())footprint.union(surface.boundingBox);
    for(const section of venue.sections)if(section.kind==='standing')for(const p of section.polygon)footprint.expandByPoint(point.fromArray(p));
    for(const deck of stageRects(renderLayout(),venue))for(const [x,z] of stageFootprint(deck))footprint.expandByPoint(point.set(x,deck.base??0,z));
    const floorY=Math.min(footprint.min.y,0)-.35,rectangular=['rectangle','fan','rear'].includes(venueShape(venue));
    if(rectangular&&!footprint.isEmpty()){
      const size=footprint.getSize(new THREE.Vector3()),center=footprint.getCenter(new THREE.Vector3());
      const border=clamp(Math.max(size.x,size.z)*.08,1.5,5);
      const floor=mesh(new THREE.BoxGeometry(size.x+2*border,.3,size.z+2*border),material(palette.floor));
      floor.position.set(center.x,floorY,center.z);
      return floor;
    }
    const [floorX,floorZ]=venueFloor(venue),radius=venueRadius(venue);
    const floor=mesh(new THREE.CylinderGeometry(1,1,.3,96),material(palette.floor));
    floor.scale.set(Math.max(floorX,radius*2.2)/2,1,Math.max(floorZ,radius*1.65)/2);floor.position.y=floorY;
    return floor;
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
    const colors=[venuePalette.seat],selected=new THREE.Color(palette.selected).lerp(new THREE.Color(palette.seat==='#ffffff'?'#858551':palette.seat),.64);
    const sectionColors=new Map(venue.sections.map(s=>[s.id,venuePalette.seat]));
    for(const seats of [...farSeatMeshes,...nearSeatMeshes]){records.forEach((r,i)=>seats.setColorAt(i,researchConflicts.has(ticketSeatKey(r))?new THREE.Color(ticketConflictColor):r.section===sectionId?selected:new THREE.Color(sectionColors.get(r.section)||colors[r.tier%5])));seats.instanceColor.needsUpdate=true;}
    updateRowLabels();clean(sectionSelection);
    const sectionSurface=sectionSurfaces.get(sectionId);
    if(sectionSurface)mesh(sectionSurface.clone(),new THREE.MeshBasicMaterial({color:palette.selected,transparent:true,opacity:.52,side:THREE.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),sectionSelection);
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
    updateCrowdOcclusion();
    wake();
  }
  function updateCrowdOcclusion(){
    if(!position||!matched||!records.length){crowdMesh.count=0;crowdMesh.visible=false;return;}
    const nearest=records.reduce((best,r)=>{const d=Math.hypot(r.p[0]-position[0],r.p[1]-position[1],r.p[2]-position[2]);return d<best.d?{d,r}:best;},{d:Infinity,r:null}).r;
    if(!nearest){crowdMesh.count=0;crowdMesh.visible=false;return;}
    const fwd=new THREE.Vector3(Math.sin(nearest.angle),0,Math.cos(nearest.angle)),right=new THREE.Vector3(Math.cos(nearest.angle),0,-Math.sin(nearest.angle));
    let count=0;
    for(let i=0;i<records.length&&count<80;i++){
      const other=records[i];if(other===nearest)continue;
      const dx=other.p[0]-nearest.p[0],dz=other.p[2]-nearest.p[2],along=dx*fwd.x+dz*fwd.z,lat=Math.abs(dx*right.x+dz*right.z);
      if(along>.42&&along<5.0&&lat<3.2&&Math.abs(other.p[1]-nearest.p[1])<2.5){
        dummy.position.set(other.p[0],other.p[1]+.03,other.p[2]);dummy.rotation.set(0,other.angle,0);dummy.scale.set(1,.95+((i*17)%9)*.012,1);dummy.updateMatrix();
        crowdMesh.setMatrixAt(count++,dummy.matrix);
      }
    }
    crowdMesh.count=count;crowdMesh.instanceMatrix.needsUpdate=true;
    crowdMesh.visible=Boolean(cameraMode==='seat'&&count>0);
  }
  function setSeatLod(value){
    const seatPixels=canvas.clientHeight*.46/(2*Math.tan(camera.fov*Math.PI/360)*Math.max(1,camera.position.distanceTo(controls.target)));
    const nearMode=value==='seat'||value==='near'||seatPixels>=5;
    farSeatMeshes.forEach(mesh=>{mesh.visible=!nearMode;});
    nearSeatMeshes.forEach(mesh=>{mesh.visible=nearMode;});
    chairs=nearMode?nearSeatMeshes:farSeatMeshes;
    canvas.dataset.chairDetail=nearMode?'rounded':'simple';
  }
  function buildStage(){
    clean(stage);
    const stageLayout=renderLayout(),rects=stageRects(stageLayout,venue),boxes=stageBoxesFromRects(stageLayout,venue,rects);
    canvas.dataset.stageBoxes=String(boxes.length);
    const zones=stageLayout===venue.seatLayout?.id&&(!venue.researchRenderBatch||referenceZonesVisible)?venue.sourceZones||[]:[];
    for(const zone of zones){
      const geometry=new THREE.ShapeGeometry(new THREE.Shape(zone.polygon.map(([x,z])=>new THREE.Vector2(x,-z))));geometry.rotateX(-Math.PI/2);
      const object=mesh(geometry,material('#4c6b78',{side:THREE.DoubleSide,transparent:true,opacity:.32}),stage);object.position.y=.02;object.receiveShadow=true;
    }
    canvas.dataset.referenceZones=String(zones.length);
    const rig=new THREE.Group();stage.add(rig);
    for(const box of boxes){
      const rect=rects[box.index];
      if(box.kind==='platform'&&(rect.outline||rect.finish)){
        const footprint=stageFootprint(rect),base=rect.base??0,top=base+box.size[1];
        const shape=new THREE.Shape(footprint.map(([x,z])=>new THREE.Vector2(x,-z)));
        const geometry=new THREE.ExtrudeGeometry(shape,{depth:box.size[1],bevelEnabled:false}).rotateX(-Math.PI/2);
        const wood=rect.finish==='oak';
        const object=mesh(geometry,material(wood?'#c3a47d':'#1f242d',{roughness:wood?.68:.52,metalness:wood?.05:.2}),rig);object.position.y=base;object.castShadow=true;object.receiveShadow=true;
        const rim=new THREE.BufferGeometry().setFromPoints(footprint.map(([x,z])=>new THREE.Vector3(x,top+.01,z)));
        rig.add(new THREE.LineLoop(rim,new THREE.LineBasicMaterial({color:wood?'#a98559':'#79808d'})));
        if(rect.finish==='oak'||rect.finish==='black-wood')addTheatreProscenium(rig,footprint,base,top,wood,v2Assets,shell.stageRigCeiling);
        continue;
      }
      const screen=box.kind==='screen',frame=box.kind==='frame',top=box.kind==='top';
      const color=screen?'#ffffff':frame?'#181d26':top?'#232934':'#181d25';
      const extra=screen?{map:v2Assets.screenTex,emissiveMap:v2Assets.screenTex,emissive:'#ffffff',emissiveIntensity:1.05,roughness:.35}:frame?{metalness:.82,roughness:.42}:top?{roughness:.48,metalness:.18}:{roughness:.58,metalness:.22};
      const object=mesh(new THREE.BoxGeometry(...box.size),material(color,extra),rig);
      object.position.copy(vec(box.center));object.rotation.y=box.angle||0;object.castShadow=!screen;object.receiveShadow=true;
      if(box.kind==='platform'&&box.index===0&&stageLayout!=='none'){
        const sourceEnd=stageLayout===venue.seatLayout?.id&&venue.sourceStage&&
          venue.geometry?.displayBasis==='source-row-ribbons'&&venueShape(venue)==='rectangle'&&records.length;
        addStageLightingAndTruss(rig,rect,box.center,box.size,v2Assets,{
          centerStage:stageLayout==='center',hasScreenBox:boxes.some(b=>b.kind==='screen'),
          audienceCenter:sourceEnd?audienceCenter():null,ceilingY:shell.stageRigCeiling
        });
      }
    }
    const p=performer(stageLayout,venue);if(p)addPerformer(p,rig);
    shell.bindStageDecorations(rig);
    stageBounds.setFromObject(rig);
  }
  function addPerformer(p,parent){
    return buildSilhouettePerformer(p,parent,{isEventOverlay:parent===researchOverlay});
  }
  function buildRoof(){
    clean(roofGroup);
    const supports=records.length?records:[...sectionSurfaces.values()].flatMap(surface=>sceneBoxCorners(surface.boundingBox).map(point=>({p:point.toArray()})));
    const geometry=new THREE.BufferGeometry().setFromPoints(roofStructure(venue,supports).segments.map(vec));
    roofGroup.add(new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:palette.roof,transparent:true,opacity:.6})));
    roofGroup.userData.illustrative=true;
  }
  function pose(p,target,fov=43){const end=new THREE.PerspectiveCamera();end.position.copy(p);end.lookAt(target);return {p,q:end.quaternion.clone(),target,fov};}
  function initial(shellPoints=[]){
    const fitPoints=[...records.flatMap(r=>[vec(r.p),vec(r.p).add(new THREE.Vector3(0,.9,0))]),
      ...venue.sections.filter(s=>s.kind==='standing').flatMap(s=>s.polygon.map(vec)),...sceneBoxCorners(stageBounds)];
    fitPoints.push(...shellPoints);
    for(const surface of sectionSurfaces.values())fitPoints.push(...sceneBoxCorners(surface.boundingBox));
    if(!fitPoints.length)return pose(new THREE.Vector3(90,85,100),new THREE.Vector3(0,5,0));
    const fans=venue.geometry?.oneSided||['fan','rear'].includes(venueShape(venue));
    const stageList=stageRects(renderLayout(),venue),main=stageList[0];
    const direction=new THREE.Vector3(fans?.45:.75,.95,1);
    // One-sided source theatres open towards the chairs. A rear arena orbit
    // hides their raked rows behind balcony backs and an oversized floor.
    if(venue.geometry?.displayBasis==='source-row-ribbons'&&venueShape(venue)==='rectangle'&&records.length){
      const facing=records.reduce((sum,r)=>sum.add(new THREE.Vector3(Math.sin(r.angle),0,Math.cos(r.angle))),new THREE.Vector3()).divideScalar(records.length);
      if(facing.length()>.65){facing.normalize();direction.set(facing.x+facing.z*.3,.65,facing.z-facing.x*.3);}
    }
    if(venue.geometry?.referenceLayout)direction.set(.45,1.2,-1);
    // Kai Tak's fixed bowl uses the public end-stage orientation at +Z.
    // Looking from +Z put the stage in the foreground and made the bowl look
    // rotated; keep the overview on the opposite end so the stage reads as
    // the far end of the venue, like the reference viewer.
    if(venue.id==='kai-tak-stadium')direction.set(.45,1.05,-1);
    else if(!fans&&main&&Math.abs(main.x)>Math.abs(main.z))direction.set(-1,1.15,.6);
    return fitSceneView(fitPoints,direction,camera.aspect);
  }
  function fly(to,animate=true){tween={start:performance.now(),duration:animate&&!reduced?750:0,from:camera.position.clone(),fromQ:camera.quaternion.clone(),fromFov:camera.fov,...to};controls.enabled=false;wake();}
  function setCameraMode(value){audienceGestures.clear();cameraMode=value;setSeatLod(value);resize();onMode(value,{viewMode:value==='seat'?'audience':stageFocused?'stage':sectionFocus?'near':'overview',zoom:fovToZoom(look.targetFov)});if(marker)marker.visible=Boolean(position&&matched&&value!=='seat');if(typeof crowdMesh!=='undefined')crowdMesh.visible=Boolean(value==='seat'&&position&&matched&&crowdMesh.count>0);}
  function overview(reset=false,animate=true){restoredOrbit=false;if(reset||!overviewPose)overviewPose=initial(shell.fitPoints);sectionFocus=false;stageFocused=false;setCameraMode('overview');fly(overviewPose,animate);}
  function audienceCenter(){
    return records.reduce((sum,r)=>sum.add(vec(r.p)),new THREE.Vector3()).multiplyScalar(1/Math.max(1,records.length));
  }
  function stageView(){
    const bounds=researchTarget?researchStageBounds:stageBounds;
    if(bounds.isEmpty())return;
    sectionFocus=true;stageFocused=true;setCameraMode('overview');
    const center=bounds.getCenter(new THREE.Vector3()),towardSeats=audienceCenter().sub(center);
    towardSeats.y=0;
    if(towardSeats.lengthSq()<1)towardSeats.set(.45,0,1);
    fly(fitSceneView(sceneBoxCorners(bounds),towardSeats.normalize().setY(.62),camera.aspect,40));
  }
  function near(){
    const section=venue.sections.find(s=>s.id===sectionId);
    const surface=sectionSurfaces.get(sectionId);
    const selected=section?.kind==='standing'?section.polygon.map(p=>({p})):records.filter(r=>r.section===sectionId);
    const points=surface?sceneBoxCorners(surface.boundingBox):selected.flatMap(r=>[vec(r.p),vec(r.p).add(new THREE.Vector3(0,.9,0))]);
    if(!points.length)return;
    stageFocused=false;
    const target=new THREE.Box3().setFromPoints(points).getCenter(new THREE.Vector3()),main=stageRects(renderLayout(),venue)[0];
    const towardStage=new THREE.Vector3((main?.x??0)-target.x,0,(main?.z??0)-target.z);
    if(towardStage.lengthSq()<.01)towardStage.set(0,0,1);
    // Approach from the inner bowl. Approaching from outside placed the camera
    // inside the rows/balcony behind the selection and filled the screen with
    // the backs of unrelated chairs.
    sectionFocus=true;setCameraMode('overview');setSeatLod('near');updateRowLabels();
    fly(fitSceneView(points,towardStage.normalize().setY(.85),camera.aspect));
  }
  function seatView(){if(!matched||!position)return;if(!overviewPose)overviewPose=initial(shell.fitPoints);
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
    return {mode:cameraMode==='seat'?'seat':stageFocused?'stage':sectionFocus?'near':'overview',position:camera.position.toArray(),target:target.toArray(),fov:camera.fov,phone:phoneFraming,roof:shell.roofVisible};
  }
  function restoreView(view){
    if(view.mode==='seat'&&(!matched||!position||vec(view.position).distanceTo(vec(position).add(new THREE.Vector3(0,VENUE_CAMERA_POLICY.eyeHeight,0)))>.01))return false;
    sectionFocus=view.mode==='near'||view.mode==='stage';stageFocused=view.mode==='stage';phoneFraming=view.phone;shell.toggleRoof(view.roof);
    setCameraMode(view.mode==='seat'?'seat':'overview');tween=null;restoredOrbit=view.mode==='overview';
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
    if(changed&&venue){
      overviewPose=initial(shell.fitPoints);
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
    for(const label of [...researchOverlay.children.filter(object=>object.isSprite),...labels.toSorted((a,b)=>Number(b.userData.section===sectionId)-Number(a.userData.section===sectionId)),...rowLabels]){label.visible=false;label.material.depthTest=canvas.dataset.venueShell==='blender';if(cameraMode!=='overview'||stageFocused||shell.roofVisible&&shell.hasRoof||label.userData.rowLabel&&!sectionFocus)continue;
      // A full-height lift puts neighboring labels over the infield from a close seat view.
      const anchor=label.userData.treadAnchor;
      if(anchor)label.position.y=anchor.y+Math.min(3,anchor.distanceTo(camera.position)*.20);
      const p=label.position.clone().project(camera);if(Math.abs(p.x)>1||Math.abs(p.y)>1||p.z<-1||p.z>1)continue;
      const x=(p.x+1)*rect.width/2,y=(1-p.y)*rect.height/2,compact=Boolean(label.userData.compact),event=Boolean(label.userData.researchShape),height=label.userData.labelHeight||(compact?26:venue.researchRenderBatch?.layout==='o2a'?24:20),aspect=label.userData.labelAspect||2.28,width=height*aspect;
      if(x-width/2<0||x+width/2>rect.width||y-height/2<0||y+height/2>rect.height||occupied.some(q=>Math.abs(q.x-x)<(q.width+width)/2+6&&Math.abs(q.y-y)<(q.height+height)/2+5))continue;occupied.push({x,y,width,height,event});label.visible=true;
      const h=2*camera.position.distanceTo(label.position)*Math.tan(camera.fov*Math.PI/360)*height/Math.max(1,rect.height);label.scale.set(h*aspect,h,1);
    }
    canvas.dataset.researchLabels=JSON.stringify(researchOverlay.children.filter(object=>object.isSprite&&object.visible).map(object=>object.userData.researchShape.label));
    canvas.dataset.stageFocus=String(stageFocused);
  }
  function wake(){dirty=true;if(!pending){pending=true;requestAnimationFrame(animate);}}
  function animate(now){pending=false;if(document.hidden||mode!=='3d'||!venue)return;
    const dt=Math.min(.05,(now-last)/1000),finishingTween=Boolean(tween);last=now;let moving=false;
    if(tween){const t=tween.duration?clamp((now-tween.start)/tween.duration,0,1):1,u=1-(1-t)**3;camera.position.lerpVectors(tween.from,tween.p,u);camera.quaternion.slerpQuaternions(tween.fromQ,tween.q,u);camera.fov=THREE.MathUtils.lerp(tween.fromFov,tween.fov,u);controls.target.copy(tween.target);camera.updateProjectionMatrix();moving=t<1;if(!moving){tween=null;controls.enabled=cameraMode==='overview';}}
    else if(cameraMode==='overview'){controls.enabled=true;moving=controls.update();}
    else{
      const a=1-Math.exp(-dt*16),delta=Math.atan2(Math.sin(look.targetYaw-look.yaw),Math.cos(look.targetYaw-look.yaw));
      look.yaw+=delta*a;look.pitch+=(look.targetPitch-look.pitch)*a;look.fov+=(look.targetFov-look.fov)*a;
      moving=Math.abs(delta)+Math.abs(look.targetPitch-look.pitch)+Math.abs(look.targetFov-look.fov)>.0001;
      camera.position.copy(vec(position.map((v,i)=>v+(i===1?VENUE_CAMERA_POLICY.eyeHeight:0))));camera.lookAt(camera.position.clone().add(new THREE.Vector3(Math.sin(look.yaw)*Math.cos(look.pitch),Math.sin(look.pitch),Math.cos(look.yaw)*Math.cos(look.pitch))));camera.fov=look.fov;camera.updateProjectionMatrix();
    }
    if(dirty||moving||finishingTween){
      if(typeof setSeatLod==='function')setSeatLod(cameraMode);
      labelsForView();const width=canvas.clientWidth,height=canvas.clientHeight;
      renderer.setScissorTest(false);renderer.setViewport(0,0,width,height);renderer.setClearColor(palette.clear);renderer.clear();
      if(phoneFraming&&cameraMode==='seat'){const r=phoneFrameRect(width,height);renderer.setViewport(r.x,height-r.y-r.height,r.width,r.height);renderer.setScissor(r.x,height-r.y-r.height,r.width,r.height);renderer.setScissorTest(true);}
      renderer.render(scene,camera);renderer.setScissorTest(false);
      dirty=false;canvas.dataset.engine='Three.js '+THREE.REVISION;canvas.dataset.camera=cameraMode;canvas.dataset.illustrativeView=String(floorView);canvas.dataset.phoneFrame=String(phoneFraming&&cameraMode==='seat');canvas.dataset.roof=String(shell.roofVisible);canvas.dataset.fov=camera.fov.toFixed(2);canvas.dataset.frame=String(Number(canvas.dataset.frame||0)+1);canvas.dataset.drawCalls=String(renderer.info.render.calls);canvas.dataset.geometries=String(renderer.info.memory.geometries);canvas.dataset.cameraDirection=camera.getWorldDirection(new THREE.Vector3()).toArray().map(x=>x.toFixed(6)).join(',');canvas.dataset.cameraPosition=camera.position.toArray().map(x=>x.toFixed(3)).join(',');}
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
    setEventTheme:shell.setEventTheme,
    hasRoof:()=>shell.hasRoof,
    hasStage:()=>Boolean(researchTarget)||!stageBounds.isEmpty(),
    setData(nextVenue,nextSection,nextPosition,nextLayout,nextMatched,nextEventSelected=false,nextFloorView=false){
      const changed=venue?.id!==nextVenue.id||venue?.seatLayout?.id!==nextVenue.seatLayout?.id||venue?.eventLayout?.id!==nextVenue.eventLayout?.id,sectionChanged=sectionId!==nextSection,positionChanged=String(position)!==String(nextPosition),layoutChanged=layout!==nextLayout||eventSelected!==nextEventSelected;
      venue=nextVenue;sectionId=nextSection;position=nextPosition;layout=nextLayout;matched=nextMatched;eventSelected=nextEventSelected;floorView=nextFloorView;if(changed){phoneFraming=false;researchTarget=null;researchConflicts=new Map();clean(researchOverlay);canvas.dataset.researchShapes='0';delete canvas.dataset.researchTarget;}
      if(changed||layoutChanged)buildVenue();else if(sectionChanged||positionChanged)updateSelection();
      if(changed||layoutChanged){buildStage();overviewPose=null;}
      resize();
      if(changed)overview(true,false);
      else if(layoutChanged&&cameraMode==='overview')overview(true);
      else if(cameraMode==='seat'&&(positionChanged||layoutChanged)){if(matched)seatView();else near();}
      wake();
    },
    zoom(factor){if(cameraMode==='seat'){setFov(scaleVenueFov(look.targetFov,factor));return;}camera.position.sub(controls.target).multiplyScalar(1/factor).add(controls.target);controls.update();wake();},
    getView,restoreView,
    setMode(value){mode=value;shell.setActive(value==='3d');if(value==='3d'){resize();wake();}},overview,near,seatView,stageView,setZoom,
    // Explicit opt-in for local/admin previews. Drafts never become
    // eventLayout, stageBoxes, seat filtering, sightlines or distance inputs.
    setResearchOverlay(draft){
      clean(researchOverlay);researchStageBounds.makeEmpty();researchOverlay.userData.floorViews=[];researchTarget=null;researchConflicts=new Map();canvas.dataset.researchShapes='0';canvas.dataset.eventFloorChairs='0';canvas.dataset.eventPerformer='0';delete canvas.dataset.researchTarget;delete canvas.dataset.eventPerformerPosition;
      if(!draft){if(stageFocused)overview();updateSelection();return;}
      const shellEvent=draft.status==='shell-event-preview';
      if(shellEvent){
        if(draft.venueId!==venue?.id)throw Error('Research overlay binding mismatch');
      }else if(draft.status!=='research-preview'||draft.venueId!==venue?.id||draft.seatLayoutId!==venue?.seatLayout?.id||draft.fixedSeats.assetSha256!==venue?.seatLayout?.assetSha256)throw Error('Research overlay binding mismatch');
      researchConflicts=shellEvent?new Map():ticketMapConflictIndex(draft);
      const shapes=shellEvent?draft.shapes:[...draft.zones,...draft.stage,...draft.equipment];
      const mainStage=shellEvent?shapes.find(shape=>shape.kind==='stage'):draft.stage?.[0];
      researchOverlay.userData.floorViews=draft.floorViews||[];
      for(const o of shapes){
        const shape=new THREE.Shape(o.polygon.map(([x,z])=>new THREE.Vector2(x,-z)));
        for(const points of o.holes||[])shape.holes.push(new THREE.Path(points.map(([x,z])=>new THREE.Vector2(x,-z))));
        const geometry=new THREE.ExtrudeGeometry(shape,{depth:o.height,bevelEnabled:false});geometry.rotateX(-Math.PI/2);
        const isStage=o.kind==='stage',isEquip=o.kind==='equipment';
        const mat=material(isStage?'#1c222d':isEquip?'#232c38':o.color,{side:THREE.DoubleSide,roughness:isStage?.52:isEquip?.55:.82,metalness:isStage?.22:isEquip?.45:0});
        const object=new THREE.Mesh(geometry,mat);object.castShadow=isStage||isEquip;object.receiveShadow=true;object.userData.researchShape={id:o.id,label:o.label,kind:o.kind};researchOverlay.add(object);
        if(isEquip)decorateEquipmentShape(o,researchOverlay);
        if(isStage){
          researchStageBounds.expandByObject(object);
          if(o===mainStage){
            const sBox=new THREE.Box3().setFromObject(object),sCenter=sBox.getCenter(new THREE.Vector3()).toArray(),sSize=sBox.getSize(new THREE.Vector3()).toArray();
            if(sSize[0]>=6&&sSize[2]>=4)addStageLightingAndTruss(researchOverlay,{angle:0},sCenter,sSize,v2Assets,{ceilingY:shell.stageRigCeiling});
          }
        }
        {
          const border=new THREE.BufferGeometry().setFromPoints(o.polygon.map(([x,z])=>new THREE.Vector3(x,o.height+.025,z)));
          const line=new THREE.LineLoop(border,new THREE.LineBasicMaterial({color:isStage?'#7dd3fc':isEquip?'#94a3b8':'#355565'}));line.userData.researchShape=object.userData.researchShape;researchOverlay.add(line);
          const anchor=o.labelPosition||o.polygon.reduce((a,p)=>[a[0]+p[0]/o.polygon.length,a[1]+p[1]/o.polygon.length],[0,0]);
          const center=[anchor[0],o.height+.2,anchor[1]];
          const label=textLabel(o.label,center,false,researchOverlay);label.userData.researchShape=object.userData.researchShape;
        }
      }
      const floorChairs=draft.floorChairs||[];
      if(floorChairs.length){
        const seats=new THREE.InstancedMesh(v2Assets.nearChairGeo,material(venuePalette.seat,{vertexColors:true,roughness:.6,metalness:.1}),floorChairs.length);
        seats.castShadow=true;seats.receiveShadow=true;
        for(const [index,chair]of floorChairs.entries()){
          dummy.position.copy(vec(chair.p));dummy.rotation.set(0,chair.angle,0);dummy.scale.set(1,1,1);dummy.updateMatrix();seats.setMatrixAt(index,dummy.matrix);
        }
        seats.instanceMatrix.needsUpdate=true;seats.userData.illustrative=true;seats.userData.researchChairs=floorChairs;researchOverlay.add(seats);
      }
      canvas.dataset.eventFloorChairs=String(floorChairs.length);
      // Orient the reference camera only; no draft enters distance calculations.
      const main=shellEvent?shapes.find(shape=>shape.kind==='stage'):draft.stage?.[0];
      if(main){
        researchTarget=main.labelPosition?[main.labelPosition[0],main.height,main.labelPosition[1]]:[main.polygon.reduce((sum,p)=>sum+p[0],0)/main.polygon.length,main.height,main.polygon.reduce((sum,p)=>sum+p[1],0)/main.polygon.length];
        addPerformer(researchTarget,researchOverlay);
        researchStageBounds.expandByPoint(vec(researchTarget).add(new THREE.Vector3(0,1.74,0)));
        canvas.dataset.eventPerformer='1';canvas.dataset.eventPerformerPosition=researchTarget.join(',');
        // Keep the seated sightline aimed at the performer.
        researchTarget=[researchTarget[0],researchTarget[1]+.875,researchTarget[2]];
        canvas.dataset.researchTarget=researchTarget.join(',');
      }
      canvas.dataset.researchShapes=String(shapes.length);if(stageFocused)stageView();updateSelection();
    },
    toggleReferenceZones(value){if(referenceZonesVisible===Boolean(value))return;referenceZonesVisible=Boolean(value);buildStage();wake();},
    toggleRoof(value){const changed=shell.roofVisible!==Boolean(value);shell.toggleRoof(value);if(changed&&shell.hasRoof&&cameraMode==='overview'&&!sectionFocus)overview(true);},
    togglePhoneFrame(value){if(phoneFraming===Boolean(value))return;phoneFraming=Boolean(value);resize();wake();},
    dispose(){shell.dispose();audienceGestures.dispose();controls.dispose();clean(world);clean(stage);clean(roofGroup);clean(researchOverlay);crowdMesh.material.dispose();v2Assets.dispose();renderer.dispose();}
  };
}
