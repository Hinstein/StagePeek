import {VENUE_MAP_POLICY} from '../venue-view/venue-view-controls.mjs';
// Work in the SVG viewBox, including its letterboxing and fullscreen/mobile scale.
export function createHydroMapGestures(svg,getView,setView){
 const pointers=new Map();
 let moved=false;
 function point(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
 function transform(before,after,factor,commit){
  const view=getView(),zoom=Math.max(VENUE_MAP_POLICY.minZoom,Math.min(VENUE_MAP_POLICY.maxZoom,view.zoom*factor)),ratio=zoom/view.zoom;
  setView({zoom,pan:[after.x-(before.x-view.pan[0])*ratio,after.y-(before.y-view.pan[1])*ratio]},commit);
 }
 function down(e){
  if(e.button!==0)return;
  if(!pointers.size)moved=false;
  pointers.set(e.pointerId,{point:point(e),start:[e.clientX,e.clientY]});
  if(pointers.size===2){moved=true;for(const id of pointers.keys())svg.setPointerCapture(id);}
 }
 function move(e){
  const previous=pointers.get(e.pointerId);if(!previous)return;
  const before=[...pointers.values()].map(v=>v.point),next=point(e);
  if(!moved&&Math.hypot(e.clientX-previous.start[0],e.clientY-previous.start[1])<5)return;
  moved=true;svg.setPointerCapture(e.pointerId);previous.point=next;
  if(pointers.size===1){transform(before[0],next,1,false);return;}
  if(pointers.size!==2)return;
  const after=[...pointers.values()].map(v=>v.point);
  const oldDistance=Math.hypot(before[0].x-before[1].x,before[0].y-before[1].y),distance=Math.hypot(after[0].x-after[1].x,after[0].y-after[1].y);
  if(oldDistance>0&&distance>0)transform({x:(before[0].x+before[1].x)/2,y:(before[0].y+before[1].y)/2},{x:(after[0].x+after[1].x)/2,y:(after[0].y+after[1].y)/2},distance/oldDistance,false);
 }
 function up(e){if(pointers.delete(e.pointerId)&&moved)setView(getView(),true);}
 function wheel(e){e.preventDefault();const p=point(e);transform(p,p,Math.exp(-e.deltaY*VENUE_MAP_POLICY.wheelSpeed),true);}
 function click(e){if(moved){e.preventDefault();e.stopImmediatePropagation();}}
 const events=[['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['lostpointercapture',up],['wheel',wheel],['click',click]];
 for(const [name,handler]of events)svg.addEventListener(name,handler,{passive:false,capture:name==='click'});
 return {dispose(){for(const [name,handler]of events)svg.removeEventListener(name,handler,{capture:name==='click'});pointers.clear();}};
}
