import {loadVenues} from '../../../server/concert-views/venues.mjs';
import {sourceBowlDisplay} from '../../../public/concert-views/source-bowl-display.mjs';
import {stageBoxes} from '../../../public/concert-views/scene-geometry.mjs';
import {surfaceOutsideBoxes} from '../../../public/concert-views/spatial.mjs';

const id='twcv-ziggo-dome-amsterdam';
const venue=loadVenues(undefined,{localDrafts:true,includeResearch:true}).get(id,'zgd');
const boxes=stageBoxes('zgd',venue);
const {banks}=sourceBowlDisplay(venue);
const supports=[],balconies=[];
for(const bank of banks){
  if(bank.rows.length<2||bank.level==='-1')continue;
  const front=bank.rows[0].front,back=bank.rows.at(-1).back;
  if(front[0][1]>10)balconies.push(front.filter((_,index)=>index%2===0||index===front.length-1));
  for(let i=0;i<front.length-1;i+=2){
    const end=Math.min(i+2,front.length-1);
    // The stepped seating stays above a level underside. Interpolating the
    // slope between terrace endpoints can run through a retained chair.
    const face=[front[i],front[end],back[end],back[i]].map(([x,,z])=>[x,front[0][1]-.42,z]);
    supports.push(...surfaceOutsideBoxes(face,boxes));
  }
}
process.stdout.write(JSON.stringify({supports,balconies}));
