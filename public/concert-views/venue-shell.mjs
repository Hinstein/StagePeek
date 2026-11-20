import {Box3,Color,Group,Plane,SRGBColorSpace,Vector3} from '../vendor/three.module.min.js';
import {styleShellSurfaces} from './venue-shell-surfaces.mjs';

export function createVenueShell(scene,canvas,render,concrete){
  const root=new Group();
  scene.add(root);
  let request=null,venueId,model=null,roofNodes=[],floorNodes=[],replacements=new Set(),fallback={},roof=false;
  const shellPoints=[],roofPoints=[];
  let clippingPlanes=null,stageRigCeiling=null,stageDecorations=null,hasRibbon=false,enabled=true,clock=null,eventName=null;
  const motion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  const light={baseY:{value:0},phase:{value:0},themed:{value:0},tint:{value:new Color()}};
  const syncAnimation=()=>{
    clearInterval(clock);
    clock=null;
    if(!hasRibbon||!enabled||motion?.matches)return;
    clock=setInterval(()=>{
      if(document.hidden||!canvas.clientWidth||!canvas.clientHeight)return;
      light.phase.value=performance.now()*.00105%(2*Math.PI);
      render();
    },50);
  };
  motion?.addEventListener('change',syncAnimation);
  function sync(){
    const hasRoof=roofNodes.length>0;
    if(fallback.roof)fallback.roof.visible=roof&&!hasRoof;
    for(const node of roofNodes)node.visible=roof;
    for(const node of fallback.floor||[])node.visible=!floorNodes.length;
    for(const group of [fallback.decorations,stageDecorations]){
      for(const node of group?.children||[]){
        if(node.userData.shellNode)node.visible=!replacements.has(node.userData.shellNode);
      }
    }
    for(const mesh of fallback.architecture||[]){
      mesh.material.clippingPlanes=clippingPlanes;
      mesh.material.clipShadows=Boolean(clippingPlanes);
    }
    canvas.dataset.venueShell=model?'blender':'procedural';
  }
  return {
    bind(nodes){fallback=nodes;sync();},
    setActive(value){if(enabled===value)return;enabled=value;syncAnimation();},
    setEventTheme(event){
      const name=event?.name||event?.id||null;
      if(eventName===name)return;
      eventName=name;
      light.themed.value=name?1:0;
      if(name){
        // The retained catalog has no lighting cues. FNV-1a gives each show a stable illustrative hue.
        const hue=([...name].reduce((hash,c)=>Math.imul(hash^c.codePointAt(0),16777619),2166136261)>>>0)/0x100000000;
        light.tint.value.setHSL(hue,.79,.67,SRGBColorSpace);
      }
      if(hasRibbon)render();
    },
    bindStageDecorations(group){stageDecorations=group;sync();},
    toggleRoof(value){if(roof===Boolean(value))return;roof=Boolean(value);sync();render();},
    get roofVisible(){return roof;},
    get hasRoof(){return roofNodes.length>0;},
    get stageRigCeiling(){return stageRigCeiling;},
    get fitPoints(){return roof?[...shellPoints,...roofPoints]:shellPoints;},
    setVenue(id){
      if(venueId===id)return;
      venueId=id;request?.abort();
      if(model)disposeShell(model);
      hasRibbon=false;light.phase.value=0;syncAnimation();
      model=null;roofNodes=[];floorNodes=[];replacements.clear();shellPoints.length=0;roofPoints.length=0;clippingPlanes=null;stageRigCeiling=null;sync();
      const controller=new AbortController();
      request=controller;
      loadVenueShell(id,controller.signal)
        .then(asset=>{
          if(!asset)return;
          if(controller.signal.aborted){disposeShell(asset);return;}
          asset.updateMatrixWorld(true);
          light.baseY.value=new Box3().setFromObject(asset).min.y;
          const replaced=new Set(),live=new Set();
          asset.traverse(node=>{
            if(!node.isMesh)return;
            const surface=styleShellSurfaces(node,concrete,light);
            hasRibbon||=surface.hasRibbon;
            for(const material of surface.replaced)replaced.add(material);
            for(const material of [node.material].flat())live.add(material);
            node.receiveShadow=node.userData.unshadowed!==true;
            node.castShadow=node.userData.castsShadow===true;
            const clip=node.userData.interiorClip;
            if(Array.isArray(clip)&&clip.length===3&&clip.every(Number.isFinite)){
              const [baseY,radius,slope]=clip;
              clippingPlanes=[[1,slope,0],[-1,slope,0],[0,slope,1],[0,slope,-1]].map(
                normal=>new Plane(new Vector3(...normal),radius-slope*baseY).normalize()
              );
            }
            const isRoof=/^shell_roof_(truss|canopy)(?:_|$)/.test(node.name);
            if(isRoof){
              roofNodes.push(node);
              const ceiling=node.userData.stageRigCeiling;
              if(Number.isFinite(ceiling))stageRigCeiling=Math.min(stageRigCeiling??Infinity,ceiling);
            }
            if(/^shell_field_floor(?:_|$)/.test(node.name))floorNodes.push(node);
            if(!node.name.startsWith('shell_illustrative_')){
              const positions=node.geometry.attributes.position;
              const points=isRoof?roofPoints:shellPoints;
              // Sample the actual surfaces so a round roof is not framed
              // against the empty corners of its rectangular AABB.
              for(let i=0;i<positions.count;i+=Math.max(1,Math.floor(positions.count/400))){
                points.push(new Vector3().fromBufferAttribute(positions,i).applyMatrix4(node.matrixWorld));
              }
            }
            for(const prefix of ['shell_balustrades','shell_vomitories','shell_ribbon_led','shell_bowl_mass_proscenium']){
              if(node.name===prefix||node.name.startsWith(prefix+'_'))replacements.add(prefix);
            }
          });
          for(const material of replaced)if(!live.has(material))material.dispose();
          model=asset;root.add(asset);sync();syncAnimation();render(true);
        })
        .catch(()=>{if(!controller.signal.aborted){canvas.dataset.venueShell='fallback-error';render();}});
    },
    dispose(){request?.abort();clearInterval(clock);motion?.removeEventListener('change',syncAnimation);if(model)disposeShell(model);root.removeFromParent();}
  };
}

let meshopt;
async function loadVenueShell(id,signal){
  const url='/models/venues/'+encodeURIComponent(id)+'/shell.glb';
  meshopt??=import('../vendor/meshopt-decoder-1.3.0.mjs').then(async ({MeshoptDecoder})=>{
    if(!MeshoptDecoder.supported)return null;
    await MeshoptDecoder.ready;
    return MeshoptDecoder;
  }).catch(()=>null);
  const decoder=await meshopt;
  const get=async suffix=>{
    const response=await fetch(url+suffix,{signal});
    if(response.status===204)return null;
    if(!response.ok)throw Error('Venue shell HTTP '+response.status);
    const {GLTFLoader}=await import('../vendor/GLTFLoader.js');
    const loader=new GLTFLoader();
    if(decoder)loader.setMeshoptDecoder(decoder);
    const {scene}=await loader.parseAsync(await response.arrayBuffer(),'');
    return scene;
  };
  if(!decoder)return get('');
  return get('?format=meshopt').catch(error=>{
    if(signal.aborted)throw error;
    return get('');
  });
}

function disposeShell(model){
  const geometries=new Set(),materials=new Set(),textures=new Set();
  model.traverse(node=>{
    if(!node.isMesh)return;
    geometries.add(node.geometry);
    for(const material of [node.material].flat()){
      materials.add(material);
      for(const value of Object.values(material))if(value?.isTexture)textures.add(value);
    }
  });
  for(const geometry of geometries)geometry.dispose();
  for(const material of materials)material.dispose();
  for(const texture of textures){texture.source.data?.close?.();texture.dispose();}
  model.removeFromParent();
}
