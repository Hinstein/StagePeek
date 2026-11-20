import {loadVenues} from '../../../server/concert-views/venues.mjs';
import {sourceBowlDisplay} from '../../../public/concert-views/source-bowl-display.mjs';

const venue=loadVenues(undefined,{localDrafts:true,includeResearch:true}).get('twcv-prudential-center-newark','pru');
const {gallery,aisleSteps,banks}=sourceBowlDisplay(venue);
// A partition follows a lower walkable gallery edge only at actual fascia
// panels. Broad holes in the source-derived terraces stay open.
const galleries=gallery.fascias.filter(f=>f[0][1]-f[3][1]<12).map(([a,b,,floor])=>[a,b,floor[1]]);
const portals=[];
for(const bank of banks){
  if(bank.level!=='M'||bank.rows.length<4)continue;
  const edge=bank.rows.at(-1).back;
  const center=edge[Math.floor(edge.length/2)];
  if(aisleSteps.some(step=>step.tread.some(([x,y,z])=>Math.hypot(x-center[0],z-center[2])<2.1&&Math.abs(y-center[1])<.4)))continue;
  if(portals.some(p=>Math.hypot(p[0]-center[0],p[2]-center[2])<6.7))continue;
  portals.push(center);
}
process.stdout.write(JSON.stringify({galleries,portals}));
