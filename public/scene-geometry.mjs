// Renderer and catalog validation consume the same scene descriptors.
import {baseSeatRecords,stageRects,stageReservesPosition,venueShape} from './geometry.mjs';
import {stageBoxesFromRects,seatIntersectsBox} from './spatial.mjs';
export {chairParts,boxesIntersect,seatIntersectsBox} from './spatial.mjs';
export function stageBoxes(layout,venue){return stageBoxesFromRects(layout,venue,stageRects(layout,venue));}
export function seatRecords(venue,layout='end'){
 const records=baseSeatRecords(venue);if(venue.sourceSeats)return records;
 const floorIds=new Set(venue.sections.filter(s=>s.block).map(s=>s.id));
 return records.filter(s=>!floorIds.has(s.section)||!stageReservesPosition(venue,layout,s.p));
}
export function sceneCollisions(venue,layout,records=seatRecords(venue,layout)){
 const boxes=stageBoxes(layout,venue),hits=[];
 for(const seat of records)for(const box of boxes)if(seatIntersectsBox(seat,box))hits.push({section:seat.section,row:seat.row,seat:seat.seat,part:box.kind,position:seat.p});
 return hits;
}
// An optional structural diagram, never an as-built roof or sightline obstacle.
export function roofStructure(venue,records){
 if(!records.length)return {basis:'illustrative',segments:[]};
 let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity,top=0;
 for(const {p:[x,y,z]} of records){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minZ=Math.min(minZ,z);maxZ=Math.max(maxZ,z);top=Math.max(top,y+1);}
 const cx=(minX+maxX)/2,cz=(minZ+maxZ)/2,rx=(maxX-minX)/2+4,rz=(maxZ-minZ)/2+4;
 const height=Math.max(top+6,Number(venue.geometry?.roofHeight)||0),segments=[];
 const line=(a,b)=>segments.push(a,b);
 const rectangular=['rectangle','fan','rear'].includes(venueShape(venue));
 if(rectangular){
  for(let i=0;i<=12;i++){
   const z=cz-rz+i*rz/6;line([cx-rx,height,z],[cx,height+rz*.12,z]);line([cx,height+rz*.12,z],[cx+rx,height,z]);
  }
  for(const x of [cx-rx,cx,cx+rx])line([x,height+(x===cx?rz*.12:0),cz-rz],[x,height+(x===cx?rz*.12:0),cz+rz]);
 }else{
  for(const scale of [1,.78,.5])for(let i=0;i<64;i++){
   const point=a=>[cx+Math.cos(a)*rx*scale,height+(1-scale)*rz*.25,cz+Math.sin(a)*rz*scale];
   line(point(i*Math.PI/32),point((i+1)*Math.PI/32));
  }
  for(let i=0;i<24;i++){const a=i*Math.PI/12;line([cx+Math.cos(a)*rx,height,cz+Math.sin(a)*rz],[cx+Math.cos(a)*rx*.5,height+rz*.125,cz+Math.sin(a)*rz*.5]);}
 }
 return {basis:'illustrative',segments};
}
