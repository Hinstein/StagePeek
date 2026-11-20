import * as THREE from '../vendor/three.module.min.js';

export function sceneBoxCorners(box){
 if(box.isEmpty())return [];
 return [box.min.x,box.max.x].flatMap(x=>[box.min.y,box.max.y].flatMap(y=>[box.min.z,box.max.z].map(z=>new THREE.Vector3(x,y,z))));
}

// Fit the actual geometry in the viewer's current aspect, including portrait
// and full-screen layouts. Decorative floors and roof diagrams stay outside.
export function fitSceneView(points,direction,aspect,fov=43){
 const target=new THREE.Box3().setFromPoints(points).getCenter(new THREE.Vector3());
 const orbit=direction.clone().normalize(),view=new THREE.PerspectiveCamera(fov);
 view.position.copy(target).add(orbit);view.lookAt(target);
 const inverse=view.quaternion.clone().invert(),tanV=Math.tan(fov*Math.PI/360),tanH=tanV*aspect;
 const local=new THREE.Vector3();
 let distance=6;
 for(const point of points){
  local.copy(point).sub(target).applyQuaternion(inverse);
  distance=Math.max(distance,local.z+Math.abs(local.x)/tanH*1.12,local.z+Math.abs(local.y)/tanV*1.16);
 }
 return {p:target.clone().addScaledVector(orbit,distance),q:view.quaternion.clone(),target,fov};
}
