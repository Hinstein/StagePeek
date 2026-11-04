import {VENUE_CAMERA_POLICY,bindAudienceGestures,venueZoomToFov,scaleVenueFov} from '../venue-view/venue-camera-policy.mjs';
export {VENUE_CAMERA_POLICY as HYDRO_CAMERA_POLICY} from '../venue-view/venue-camera-policy.mjs';
const HYDRO_CAMERA_POLICY=VENUE_CAMERA_POLICY;

export function createHydroCamera(camera,controls,canvas,onChange,onCommit){
 let mode='overview';

 controls.enableDamping=false;controls.rotateSpeed=.55;controls.zoomSpeed=.65;controls.panSpeed=.65;
 function state(){return {mode,position:camera.position.toArray(),target:controls.target.toArray(),fov:camera.userData.baseFov||43};}
 function setView(next){
  gestures.clear();mode=next.mode;controls.enabled=mode!=='audience';
  camera.position.set(...next.position);controls.target.set(...next.target);camera.userData.baseFov=next.fov;
  if(controls.enabled)controls.update();
  camera.lookAt(controls.target);onChange();onCommit();
 }
 function zoom(factor){camera.userData.baseFov=scaleVenueFov(camera.userData.baseFov||HYDRO_CAMERA_POLICY.audienceFov,1/factor);onChange();}
 function zoomBy(factor){
  if(mode==='audience')zoom(1/factor);
  if(mode!=='audience'){camera.position.sub(controls.target).multiplyScalar(1/factor).add(controls.target);controls.update();onChange();}
  onCommit();
 }
 const gestures=bindAudienceGestures(canvas,{active:()=>mode==='audience',onLook(dx,dy){
  const direction=controls.target.clone().sub(camera.position),distance=direction.length();
  const yaw=Math.atan2(direction.x,direction.z)+dx;
  const pitch=Math.max(-HYDRO_CAMERA_POLICY.maxPitch,Math.min(HYDRO_CAMERA_POLICY.maxPitch,Math.asin(direction.y/distance)+dy));
  controls.target.set(camera.position.x+distance*Math.sin(yaw)*Math.cos(pitch),camera.position.y+distance*Math.sin(pitch),camera.position.z+distance*Math.cos(yaw)*Math.cos(pitch));
  camera.lookAt(controls.target);onChange();
 },onZoom:factor=>zoom(1/factor),onCommit});

 controls.addEventListener('change',onChange);controls.addEventListener('end',onCommit);
 return {state,setView,zoomBy,setZoom(value){
  if(mode!=='audience')return;
  camera.userData.baseFov=venueZoomToFov(value);onChange();onCommit();
 },dispose(){
  gestures.dispose();controls.removeEventListener('change',onChange);controls.removeEventListener('end',onCommit);
 }};
}

export function encodeHydroView(view,key){
 return [HYDRO_CAMERA_POLICY.version,key,view.mode,...view.position,...view.target,view.fov].join('~');
}

// URL state is untrusted; validate here once before passing it into the camera.
export function decodeHydroView(value,key){
 if(!value)return null;const parts=value.split('~'),numbers=parts.slice(3).map(Number);
 if(parts.length!==10||!['v1',HYDRO_CAMERA_POLICY.version].includes(parts[0])||parts[1]!==key||!['overview','near','audience','stage'].includes(parts[2])||numbers.some(n=>!Number.isFinite(n)||Math.abs(n)>1000)||numbers[6]<5||numbers[6]>90||Math.hypot(...numbers.slice(0,3).map((n,i)=>n-numbers[i+3]))<.01)return null;
 return {mode:parts[2],position:numbers.slice(0,3),target:numbers.slice(3,6),fov:numbers[6]};
}
