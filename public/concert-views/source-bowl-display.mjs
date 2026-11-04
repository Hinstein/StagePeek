import {baseSeatRecords} from './geometry.mjs';
import {chairParts} from './spatial.mjs';
import {sourceBankShell} from './source-bank-shell.mjs';

const cache=new WeakMap();
// Ticket records stay fixed; the estimated structural banks are separate from
// source row gaps. Supporting concrete never creates another ticket or chair.
export function sourceBowlDisplay(venue){
 if(venue?.geometry?.displayBasis!=='source-row-ribbons'||!venue.sourceSeats?.length)return null;
 if(cache.has(venue))return cache.get(venue);
 const records=baseSeatRecords(venue).map(r=>({...r,chairParts}));
 const groups=new Map();
 for(const seat of venue.sourceSeats){
  const key=JSON.stringify([seat.section,seat.level,seat.row,seat.position[1]]);
  if(!groups.has(key))groups.set(key,[]);groups.get(key).push(seat);
 }
 const headings=new Map();
 for(const row of groups.values()){
  row.sort((a,b)=>a.seat.localeCompare(b.seat,undefined,{numeric:true}));
  for(const [i,seat]of row.entries()){
   const connected=other=>other&&Math.hypot(other.position[0]-seat.position[0],other.position[2]-seat.position[2])<=seat.chairWidth*1.8;
   const a=connected(row[i-1])?row[i-1].position:seat.position,b=connected(row[i+1])?row[i+1].position:seat.position;
   const dx=b[0]-a[0],dz=b[2]-a[2],sign=dz*seat.position[0]-dx*seat.position[2]>0?1:-1;
   headings.set(seat,Math.hypot(dx,dz)>1e-6?Math.atan2(-dz*sign,dx*sign):Math.atan2(Math.sin(seat.yaw),-Math.cos(seat.yaw)));
  }
 }
 records.forEach((r,i)=>{r.angle=headings.get(venue.sourceSeats[i]);});
 const rows=[...groups.values()].map(seats=>({section:seats[0].section,level:seats[0].level,row:seats[0].row,y:seats[0].position[1],seats}));
 const footprints=records.map(r=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>[r.p[0]+a*.23*r.width*Math.cos(r.angle)+b*.215*Math.sin(r.angle),r.p[1]+.01,r.p[2]-a*.23*r.width*Math.sin(r.angle)+b*.215*Math.cos(r.angle)]));
 const shell=sourceBankShell(rows);
 const result={basis:'source-row-ribbons',records,renderRecords:records,footprints,sectionCenters:new Map(venue.sections.map(s=>[s.id,s.center])),supplements:[],referenceRecords:[],...shell,rows:shell.banks.flatMap(b=>b.rows),shellBasis:'estimated-continuous-bank'};
 cache.set(venue,result);return result;
}
export function sourceRowLabelAnchors(venue,section){
 const display=sourceBowlDisplay(venue);if(!display)return [];
 const rows=new Map();
 for(const guide of display.guides.filter(g=>g.section===section)){
  const key=JSON.stringify([guide.level,guide.row]);
  if(!rows.has(key))rows.set(key,{label:guide.row,row:guide.row,level:guide.level,p:[guide.front[0][0],guide.y,guide.front[0][2]]});
 }
 return [...rows.values()];
}
