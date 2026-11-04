// One seated interaction contract: gestures change gaze/FOV, never the eye.
export const VENUE_CAMERA_POLICY=Object.freeze({version:'v2',minZoom:1,maxZoom:10,zoomStep:.1,eyeHeight:1.18,audienceFov:50,stageElevation:8*Math.PI/180,minFov:2*Math.atan(Math.tan(25*Math.PI/180)/10)*180/Math.PI,maxFov:75,radiansPerPixel:.0025,maxPitch:85*Math.PI/180});
export function venueZoomToFov(value){return 2*Math.atan(Math.tan(VENUE_CAMERA_POLICY.audienceFov*Math.PI/360)/Math.max(VENUE_CAMERA_POLICY.minZoom,Math.min(VENUE_CAMERA_POLICY.maxZoom,value)))*180/Math.PI;}
export function venueFovToZoom(fov){return Math.tan(VENUE_CAMERA_POLICY.audienceFov*Math.PI/360)/Math.tan(fov*Math.PI/360);}
export function scaleVenueFov(fov,factor){return Math.max(VENUE_CAMERA_POLICY.minFov,Math.min(VENUE_CAMERA_POLICY.maxFov,fov/factor));}

export function bindAudienceGestures(canvas,{active,onStart=()=>{},onLook,onZoom,onCommit=()=>{}}){
 const pointers=new Map();
 function down(event){if(!active()||event.button!==0)return;pointers.set(event.pointerId,[event.clientX,event.clientY]);onStart();canvas.setPointerCapture(event.pointerId);}
 function move(event){
  if(!active()||!pointers.has(event.pointerId))return;
  const before=[...pointers.values()],previous=pointers.get(event.pointerId);pointers.set(event.pointerId,[event.clientX,event.clientY]);
  if(pointers.size===2){const after=[...pointers.values()],oldDistance=Math.hypot(before[0][0]-before[1][0],before[0][1]-before[1][1]),distance=Math.hypot(after[0][0]-after[1][0],after[0][1]-after[1][1]);if(oldDistance>0&&distance>0)onZoom(distance/oldDistance);return;}
  if(pointers.size===1)onLook((event.clientX-previous[0])*VENUE_CAMERA_POLICY.radiansPerPixel,(event.clientY-previous[1])*VENUE_CAMERA_POLICY.radiansPerPixel);
 }
 function up(event){if(pointers.delete(event.pointerId))onCommit();}
 function wheel(event){if(!active())return;event.preventDefault();onZoom(Math.exp(-event.deltaY*(event.deltaMode===1?.03:.001)));onCommit();}
 const listeners=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['lostpointercapture',up],['wheel',wheel]];
 for(const [type,listener]of listeners)canvas.addEventListener(type,listener,{capture:true,passive:false});
 return {clear(){pointers.clear();},dispose(){pointers.clear();for(const [type,listener]of listeners)canvas.removeEventListener(type,listener,{capture:true});}};
}
