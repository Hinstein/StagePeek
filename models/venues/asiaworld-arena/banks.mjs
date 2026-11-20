import {sourceBowlDisplay} from '../../../public/concert-views/source-bowl-display.mjs';
import {loadVenues} from '../../../server/concert-views/venues.mjs';

const venue=loadVenues(undefined,{localDrafts:true,includeResearch:true}).get('asiaworld-arena','standing');
const {banks}=sourceBowlDisplay(venue);
// Treat the retained flat-floor and standing configurations as removable fit-out.
const banksGeometry=banks.filter(bank=>bank.level!=='-1').map(bank=>{
  const front=bank.rows[0].front;
  const back=bank.rows.at(-1).back;
  // The wall closes the rear of the stand beyond the last-row aisle edges.
  // Front and back points give a local outward direction even at the rounded corners.
  const rear=back.map((point,index)=>{
    const dx=point[0]-front[index][0],dz=point[2]-front[index][2];
    const length=Math.hypot(dx,dz);
    return [point[0]+dx/length*.52,point[1]-.10,point[2]+dz/length*.52];
  });
  return {front,back,rear};
});
process.stdout.write(JSON.stringify(banksGeometry));
