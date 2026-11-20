import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir, readFile, readdir, rename, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync} from 'node:zlib';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS, EXTMeshoptCompression} from '@gltf-transform/extensions';
import {MeshoptDecoder, MeshoptEncoder} from 'meshoptimizer';
import {GLTFLoader} from '../public/vendor/GLTFLoader.js';
import {Box3} from '../public/vendor/three.module.min.js';
import {venueShellDeliveryRoot} from '../server/venue-shell-delivery.mjs';

const root=fileURLToPath(new URL('../models/venues/',import.meta.url));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
await Promise.all([MeshoptDecoder.ready,MeshoptEncoder.ready]);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

function sceneSignature(scene){
  scene.updateMatrixWorld(true);
  const bounds=new Box3().setFromObject(scene,true);
  const meshes=[];
  scene.traverse(node=>{
    if(!node.isMesh)return;
    const attrs=Object.entries(node.geometry.attributes).sort(([a],[b])=>a.localeCompare(b));
    const materials=[node.material].flat().map(mat=>[
      mat.name,mat.color.toArray(),mat.emissive.toArray(),mat.emissiveIntensity,mat.opacity,
      mat.transparent,mat.side,mat.roughness,mat.metalness
    ]);
    meshes.push([node.name,node.userData,node.matrixWorld.toArray(),materials,
      attrs.map(([name,value])=>[name,value.array.length,value.normalized]),
      node.geometry.index?.count??0]);
  });
  return {meshes,bounds:[bounds.min.toArray(),bounds.max.toArray()]};
}

for(const id of (await readdir(root,{withFileTypes:true})).filter(entry=>entry.isDirectory()).map(entry=>entry.name).sort()){
  const source=await readFile(join(root,id,'shell.glb')).catch(error=>{
    if(error.code!=='ENOENT')throw error;
  });
  if(!source)continue;
  const sourceHash=sha(source);
  const document=await io.readBinary(source);
  document.createExtension(EXTMeshoptCompression).setRequired(true)
    .setEncoderOptions({method:EXTMeshoptCompression.EncoderMethod.QUANTIZE});
  const encoded=await io.writeBinary(document);
  const decoded=await io.readBinary(encoded);
  const inputAccessors=document.getRoot().listAccessors();
  const outputAccessors=decoded.getRoot().listAccessors();
  assert.equal(outputAccessors.length,inputAccessors.length,id);
  const triangleIndices=new Set(document.getRoot().listMeshes().flatMap(mesh=>
    mesh.listPrimitives().filter(primitive=>primitive.getMode()===4).map(primitive=>primitive.getIndices())));
  for(const [index,input] of inputAccessors.entries()){
    const original=input.getArray(),target=outputAccessors[index].getArray();
    const label=id+' accessor '+index;
    if(!triangleIndices.has(input)){assert.deepEqual(target,original,label);continue;}
    assert.equal(target.length,original.length,label);
    // Meshopt may cyclically rotate a triangle without changing its winding.
    for(let i=0;i<original.length;i+=3){
      let rotation=0;
      while(rotation<3&&!(target[i]===original[i+rotation]&&
        target[i+1]===original[i+(rotation+1)%3]&&target[i+2]===original[i+(rotation+2)%3]))rotation++;
      assert.ok(rotation<3,label+' triangle '+i/3);
    }
  }
  const originalScene=(await loader.parseAsync(Uint8Array.from(source).buffer,'')).scene;
  const compressedScene=(await loader.parseAsync(Uint8Array.from(encoded).buffer,'')).scene;
  assert.deepEqual(sceneSignature(compressedScene),sceneSignature(originalScene),id+' rendered mesh contract');

  const identity=encoded.length<source.length?encoded:source;
  const rawGzip=gzipSync(source,{level:9});
  const meshoptGzip=gzipSync(encoded,{level:9});
  const gzip=rawGzip.length<=meshoptGzip.length?rawGzip:meshoptGzip;
  const variants={};
  const dir=join(venueShellDeliveryRoot,id,sourceHash);
  await mkdir(dir,{recursive:true});
  for(const [encoding,bytes] of [['identity',identity],['gzip',gzip]]){
    if(encoding==='identity'&&bytes===source||encoding==='gzip'&&bytes.length>=identity.length)continue;
    const hash=sha(bytes);
    const filename=hash+(encoding==='gzip'?'.glb.gz':'.glb');
    const temporary=join(dir,'.'+filename+'-'+process.pid);
    await writeFile(temporary,bytes);
    await rename(temporary,join(dir,filename));
    variants[encoding]={bytes:bytes.length,sha256:hash};
  }
  const info={sourceBytes:source.length,variants};
  const temporary=join(dir,'.variants-'+process.pid);
  await writeFile(temporary,JSON.stringify(info)+'\n');
  await rename(temporary,join(dir,'variants.json'));
  console.log(id,source.length,variants.identity?.bytes??source.length,variants.gzip?.bytes??0);
}
