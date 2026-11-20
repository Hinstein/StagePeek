import {loadVenues} from '../../server/concert-views/venues.mjs';
import {sourceBowlDisplay} from '../../public/concert-views/source-bowl-display.mjs';
import {seatRecords,stageBoxes} from '../../public/concert-views/scene-geometry.mjs';
import {sectionSteps} from '../../public/concert-views/geometry.mjs';
import {polygonIntersectsBox} from '../../public/concert-views/spatial.mjs';

const id=process.argv[2];
const store=loadVenues(undefined,{localDrafts:true,includeResearch:true});
const venue=store.get(id);
if(!venue)throw Error('Unknown venue '+id);
const layoutIds=venue.seatLayouts?.map(layout=>layout.id)??
  (venue.geometry?.referenceLayout?['end']:['end','runway','center']);
const points=[];
const stage=[];
const layouts=[];
let draftTreads=[];
for(const layout of layoutIds){
  const model=store.get(id,layout);
  if(!model)throw Error(id+' missing '+layout);
  const display=sourceBowlDisplay(model);
  const chairs=seatRecords(model,layout);
  const sections=model.sections.flatMap(section=>section.polygon??[]);
  const bays=display?.treads??model.sections.filter(section=>section.kind!=='standing'&&!section.block)
    .flatMap(section=>sectionSteps(model,section).treads);
  const parts=stageBoxes(layout,model);
  stage.push(...parts);
  points.push(...sections,...bays.flat(),...chairs.map(chair=>chair.p));
  for(const box of parts){
    const c=Math.cos(box.angle||0),s=Math.sin(box.angle||0);
    for(const sx of [-1,1])for(const sz of [-1,1]){
      const x=sx*box.size[0]/2,z=sz*box.size[2]/2;
      points.push([box.center[0]+c*x+s*z,box.center[1]-box.size[1]/2,box.center[2]-s*x+c*z],
        [box.center[0]+c*x+s*z,box.center[1]+box.size[1]/2,box.center[2]-s*x+c*z]);
    }
  }
  const exact=chairs.filter(chair=>chair.sourceSeat).length;
  if(!exact&&!draftTreads.length)draftTreads=bays;
  layouts.push({id:layout,sourceSeats:exact,renderedSeats:chairs.length,stageParts:parts.length,
    topSeat:chairs.reduce((max,chair)=>Math.max(max,chair.p[1]),0)});
}
if(points.length===0||points.some(point=>!point?.every(Number.isFinite)))throw Error(id+' has invalid geometry');
const bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
for(const point of points)for(let axis=0;axis<3;axis++){
  bounds.min[axis]=Math.min(bounds.min[axis],point[axis]);
  bounds.max[axis]=Math.max(bounds.max[axis],point[axis]);
}
const rows=layouts.some(layout=>layout.sourceSeats)?[]:draftTreads
  .filter((tread,index)=>index%2===0&&tread.length===4&&
   stage.every(part=>!polygonIntersectsBox(tread.map(([x,y,z])=>[x,y+.2,z]),part)));
const raisedStanding=venue.sections.filter(section=>section.kind==='standing'&&
  section.polygon?.length===4&&section.polygon.every(point=>point[1]>1&&point[1]===section.polygon[0][1]))
  .map(section=>section.polygon);
process.stdout.write(JSON.stringify({id,bounds,layouts,rows,raisedStanding,venueSource:venue.source}));
