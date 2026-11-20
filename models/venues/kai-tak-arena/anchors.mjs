import {loadVenues} from '../../../server/concert-views/venues.mjs';
import {sectionPoint,sectionRowCount,sectionSteps} from '../../../public/concert-views/geometry.mjs';
import {chairParts,seatRecords,stageBoxes} from '../../../public/concert-views/scene-geometry.mjs';

const id='kai-tak-arena';
const store=loadVenues(undefined,{localDrafts:true,includeResearch:true});
const venue=store.get(id,'end');
const count=96;
const rims=venue.tiers.map((_,tier)=>[0,1].map(depth=>Array.from({length:count},(_sample,index)=>
  sectionPoint(venue,{tier,angle:index*2*Math.PI/count},depth,0,0))));
const banks=venue.sections.filter(section=>!section.block&&section.kind!=='standing').map(section=>({
  tier:section.tier,rows:sectionRowCount(venue,section),treads:sectionSteps(venue,section).treads
}));
const aisleTreads=[];
for(const tier of venue.tiers.keys()){
  const group=banks.filter(bank=>bank.tier===tier);
  for(const [index,bank] of group.entries()){
    const adjacent=group[(index+1)%group.length];
    const slices=bank.treads.length/bank.rows,nextSlices=adjacent.treads.length/adjacent.rows;
    for(let row=0;row<bank.rows;row++){
      const left=bank.treads[(row+1)*slices-1],right=adjacent.treads[row*nextSlices];
      aisleTreads.push([left[1],right[0],right[3],left[2]]);
    }
  }
}
const layouts=Object.fromEntries(['end','runway','center'].map(layout=>{
  const configured=store.get(id,layout);
  const position=seatRecords(configured,layout).map(seat=>seat.p);
  return [layout,{
    sourceSeats:configured.sourceSeats?.length??0,
    illustrativePositions:position.length,
    seatBounds:{
      min:[0,1,2].map(axis=>Math.min(...position.map(point=>point[axis]))),
      max:[0,1,2].map(axis=>Math.max(...position.map(point=>point[axis])))
    },
    stage:stageBoxes(layout,configured)
  }];
}));
const chairs=seatRecords(venue,'end').map(seat=>({p:seat.p,width:seat.width,angle:seat.angle}));
process.stdout.write(JSON.stringify({rims,banks,layouts,aisleTreads,chairs,chairParts}));
