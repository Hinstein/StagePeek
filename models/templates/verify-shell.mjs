import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {GLTFLoader} from '../../public/vendor/GLTFLoader.js';
import {Box3,Vector3} from '../../public/vendor/three.module.min.js';
import {loadVenues} from '../../server/concert-views/venues.mjs';
import {stageBoxes} from '../../public/concert-views/scene-geometry.mjs';
import {polygonIntersectsBox} from '../../public/concert-views/spatial.mjs';

const store=loadVenues(undefined,{localDrafts:true,includeResearch:true});
const input=fileURLToPath(new URL('./venue-input.mjs',import.meta.url));

export async function verifyHallShell(id){
  const dir=new URL('../venues/'+id+'/',import.meta.url);
  const bytes=await readFile(new URL('shell.glb',dir));
  const manifest=JSON.parse(await readFile(new URL('manifest.json',dir),'utf8'));
  const config=JSON.parse(await readFile(new URL('shell-config.json',dir),'utf8'));
  const catalog=JSON.parse(execFileSync(process.execPath,[input,id],{maxBuffer:8_000_000}));
  assert.equal(manifest.venueId,id);
  assert.equal(manifest.generator,'blender-bpy');
  assert.equal(manifest.precision,'illustrative');
  assert.equal(manifest.assetBytes,bytes.length);
  assert.ok(bytes.length<=3_000_000);
  // Stage outlines can change at runtime. Validate the current stage below and
  // compare the retained seating contract independently of the stage topology.
  const seatEnvelope=layout=>[layout.id,layout.sourceSeats,layout.renderedSeats,layout.topSeat];
  assert.deepEqual(manifest.sourceLayouts.map(seatEnvelope),catalog.layouts.map(seatEnvelope));
  const {scene}=await new GLTFLoader().parseAsync(Uint8Array.from(bytes).buffer,'');
  scene.updateMatrixWorld(true);
  const hall=new Box3().setFromObject(scene,true);
  const occupied=new Box3(new Vector3(...catalog.bounds.min),new Vector3(...catalog.bounds.max));
  assert.ok(hall.containsBox(occupied),id+' occupied envelope');
  assert.ok(!hall.isEmpty());
  for(const edge of ['min','max']){
    assert.ok(hall[edge].toArray().every((value,axis)=>Math.abs(value-manifest.bounds[edge][axis])<.002),id+' GLB bounds');
  }
  const roof=new Box3();
  const rows=[];
  for(const name of [...manifest.roofNodeNames,...manifest.ribbonNodeNames]){
    const node=scene.getObjectByName(name);
    assert.ok(node,name);
    if(name.startsWith('shell_roof_truss'))roof.expandByObject(node,true);
  }
  assert.ok(!roof.isEmpty(),id+' truss mesh');
  const hips=manifest.roofNodeNames.filter(name=>name.startsWith('shell_roof_canopy_hip_'));
  assert.equal(hips.length,config.roofRises?.length??0,id+' roof tiers');
  const roofBase=new Box3().setFromObject(scene.getObjectByName('shell_roof_canopy'),true).max.y;
  let previousTop=roofBase;
  for(const [index,rise] of (config.roofRises??[]).entries()){
    const hip=new Box3().setFromObject(scene.getObjectByName('shell_roof_canopy_hip_'+(index+1)),true);
    assert.ok(!hip.isEmpty()&&hip.min.y>=previousTop-.002,id+' stepped roof tier');
    assert.ok(Math.abs(hip.max.y-hip.min.y-rise)<.002,id+' roof tier height');
    previousTop=hip.max.y;
  }
  const rigCeiling=scene.getObjectByName('shell_roof_truss').userData.stageRigCeiling;
  assert.ok(Number.isFinite(rigCeiling)&&rigCeiling<=roof.min.y+.002&&rigCeiling>roof.min.y-.8,id+' rig ceiling');
  const floor=new Box3().setFromObject(scene.getObjectByName('shell_field_floor_deck'),true);
  assert.ok(floor.max.y<occupied.min.y,id+' event floor is below source geometry');
  const stages=catalog.layouts.flatMap(layout=>
    stageBoxes(layout.id,store.get(id,layout.id)).map(part=>({layout:layout.id,part})));
  const inset=occupied.clone().expandByScalar(.7);
  const p=new Vector3();
  scene.traverse(node=>{
    if(!node.isMesh)return;
    assert.ok(node.name.startsWith('shell_'),node.name);
    if(node.name.startsWith('shell_illustrative_')){
      assert.equal(node.userData.precision,'illustrative');
      assert.ok(catalog.layouts.every(layout=>!layout.sourceSeats),id+' illustrative geometry only where source seats are absent');
      rows.push(node.name);
    }
    if(node.name.startsWith('shell_bowl_mass_')||node.name.startsWith('shell_ribbon_led')){
      const positions=node.geometry.getAttribute('position');
      for(let i=0;i<positions.count;i++){
        p.fromBufferAttribute(positions,i).applyMatrix4(node.matrixWorld);
        assert.ok(!inset.containsPoint(p),id+' '+node.name+' intersects occupied seating or aisle envelope');
      }
    }
    const positions=node.geometry.getAttribute('position');
    const indices=node.geometry.index;
    const triangle=[new Vector3(),new Vector3(),new Vector3()];
    for(let i=0;i<(indices?.count??positions.count);i+=3){
      const points=triangle.map((point,j)=>point.fromBufferAttribute(positions,indices?indices.getX(i+j):i+j)
        .applyMatrix4(node.matrixWorld).toArray());
      assert.ok(stages.every(stage=>!polygonIntersectsBox(points,stage.part)),id+' '+node.name+' stage collision');
    }
  });
  const layouts=catalog.layouts.map(layout=>{
    const standing=store.get(id,layout.id).sections
      .filter(section=>section.kind==='standing')
      .flatMap(section=>section.polygon?.map(point=>point[1])??[]);
    const topAudience=Math.max(layout.topSeat,...standing);
    const roofClearance=roof.min.y-topAudience;
    assert.ok(roofClearance>3,id+'/'+layout.id+' roof clearance');
    return {...layout,...(topAudience>layout.topSeat?{topStanding:topAudience}:{}),
      roofClearance:+roofClearance.toFixed(3),hits:[]};
  });
  return {venue:id,bytes:bytes.length,illustrativeNodes:rows.length,bounds:manifest.bounds,layouts};
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
  console.log(JSON.stringify(await verifyHallShell(process.argv[2]),null,2));
}
