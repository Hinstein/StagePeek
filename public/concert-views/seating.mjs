import {chairParts,o2ChairParts} from './spatial.mjs';

// O2's imported directions use the opposite Z convention from the chair's
// forward axis. Reflect the heading, never the retained seat coordinates.
export const sourceSeatYaw=(yaw,layout)=>layout==='o2a'?Math.atan2(Math.sin(yaw),-Math.cos(yaw)):yaw;

const rowHeadingCache=new WeakMap();
// The retained O2 yaw is constant per section, even on a curved row. Derive
// display normals from nearby seats in that row, across section IDs, without
// changing source yaw/XYZ or aiming fixed seating at an event stage.
export function sourceSeatHeadings(seats,layout){
 if(layout!=='o2a')return new Map(seats.map(s=>[s,s.yaw]));
 if(rowHeadingCache.has(seats))return rowHeadingCache.get(seats);
 const rows=new Map(),headings=new Map();
 for(const seat of seats){
  const key=JSON.stringify([seat.level,seat.row,seat.position[1]]);
  if(!rows.has(key))rows.set(key,[]);rows.get(key).push(seat);
 }
 for(const row of rows.values()){
  row.sort((a,b)=>Number(a.seat)-Number(b.seat));
  const connected=(a,b)=>Math.hypot(a.position[0]-b.position[0],a.position[2]-b.position[2])<1.4;
  for(const [i,seat]of row.entries()){
   let first=i,last=i;
   for(let n=0;n<2&&first>0&&connected(row[first-1],row[first]);n++)first--;
   for(let n=0;n<2&&last<row.length-1&&connected(row[last],row[last+1]);n++)last++;
   if(first===last){headings.set(seat,sourceSeatYaw(seat.yaw,layout));continue;}
   // A stagger between adjacent blocks is not the tangent of either row.
   // Reject an outlying connector, keeping the length-weighted tangent on
   // ordinary curves so their real straight-to-corner transition is retained.
   const edges=[];
   for(let n=first+1;n<=last;n++)edges.push([row[n].position[0]-row[n-1].position[0],row[n].position[2]-row[n-1].position[2]]);
   const origin=Math.atan2(edges[0][1],edges[0][0]),angles=edges.map(([x,z])=>Math.atan2(Math.sin(Math.atan2(z,x)-origin),Math.cos(Math.atan2(z,x)-origin))).sort((a,b)=>a-b);
   const tangent=origin+(angles[Math.floor((angles.length-1)/2)]+angles[Math.floor(angles.length/2)])/2;
   const local=edges.filter(([x,z])=>Math.abs(Math.atan2(Math.sin(Math.atan2(z,x)-tangent),Math.cos(Math.atan2(z,x)-tangent)))<=.35);
   const direction=(local.length?local:edges).reduce((sum,edge)=>[sum[0]+edge[0],sum[1]+edge[1]],[0,0]);
   const dx=direction[0],dz=direction[1];
   const sign=dz*seat.position[0]-dx*seat.position[2]>0?1:-1;
   headings.set(seat,Math.atan2(-dz*sign,dx*sign));
  }
 }
 rowHeadingCache.set(seats,headings);return headings;
}
export function sourceSeatDeck(seat,layout){
   const [x,y,z]=seat.position,w=seat.chairWidth||.46,d=Math.max(.3,Math.min(2,seat.rowDepth||.8)),yaw=sourceSeatYaw(seat.treadYaw,layout);
   const along=[Math.cos(yaw),-Math.sin(yaw)],back=[Math.sin(yaw),Math.cos(yaw)];
   const p=(a,b)=>[x+a*along[0]+b*back[0],y-.025,z+a*along[1]+b*back[1]];
   return [p(-w*.44,-d*.3),p(w*.44,-d*.3),p(w*.44,d*.7),p(-w*.44,d*.7)];
}
export const sourceSeatDecks=(seats,layout)=>seats.map(seat=>sourceSeatDeck(seat,layout));

const sectionGuideCache=new WeakMap();
// Presentation ribbons follow the retained ticket IDs. They are neither new
// inventory nor official architectural boundaries. Split at seat-free gaps;
// a convex section hull would paint over the aisles inside a ticket block.
export function sourceSectionGuides(seats,layout){
 if(layout!=='o2a')return [];
 if(sectionGuideCache.has(seats))return sectionGuideCache.get(seats);
 const headings=sourceSeatHeadings(seats,layout),rows=new Map(),guides=[];
 for(const seat of seats){
  const key=JSON.stringify([seat.level,seat.row,seat.position[1]]);
  if(!rows.has(key))rows.set(key,[]);rows.get(key).push(seat);
 }
 for(const row of rows.values()){
  row.sort((a,b)=>Number(a.seat)-Number(b.seat));
  const connected=(a,b)=>a&&b&&Math.hypot(a.position[0]-b.position[0],a.position[2]-b.position[2])<1.4;
  const edge=(seat,neighbour,sign)=>{
   const yaw=headings.get(seat),half=(seat.chairWidth||.48)/2+.055;
   if(connected(seat,neighbour)){
    const dx=neighbour.position[0]-seat.position[0],dz=neighbour.position[2]-seat.position[2];
    // A lateral stagger is not a shared end cap along this row's tangent.
    if(Math.abs(dx*Math.cos(yaw)-dz*Math.sin(yaw))/Math.hypot(dx,dz)>.75)return [(seat.position[0]+neighbour.position[0])/2,seat.position[1]+.018,(seat.position[2]+neighbour.position[2])/2];
   }
   // Seat numbers follow one winding around the bowl, independent of yaw.
   const index=row.indexOf(seat),previous=row[Math.max(0,index-1)].position,next=row[Math.min(row.length-1,index+1)].position;
   const direction=(next[0]-previous[0])*Math.cos(yaw)-(next[2]-previous[2])*Math.sin(yaw)>=0?1:-1;
   return [seat.position[0]+sign*direction*half*Math.cos(yaw),seat.position[1]+.018,seat.position[2]-sign*direction*half*Math.sin(yaw)];
  };
  for(let first=0;first<row.length;){
   let last=first;
   while(last+1<row.length&&row[last+1].section===row[first].section&&connected(row[last],row[last+1]))last++;
   const a=row[first],b=row[last],left=edge(a,row[first-1],-1),right=edge(b,row[last+1],1);
   const points=[{p:left,yaw:headings.get(a)},...row.slice(first,last+1).map(s=>({p:[s.position[0],s.position[1]+.018,s.position[2]],yaw:headings.get(s)})),{p:right,yaw:headings.get(b)}];
   const offset=(p,yaw,d)=>[p[0]+Math.sin(yaw)*d,p[1],p[2]+Math.cos(yaw)*d];
   const front=points.map(s=>offset(s.p,s.yaw,.35)),back=points.map(s=>offset(s.p,s.yaw,-.43));
   guides.push({section:a.section,level:a.level,row:a.row,y:a.position[1],first:a.seat,last:b.seat,left,right,front,back,polygon:[...front,...back.toReversed()],edges:[]});
   first=last+1;
  }
 }
 // Each lateral border follows its own neighbouring row end. Never connect
 // across a missing row or between separate levels, even for the same ID.
 for(const guide of guides){
  const neighbours=guides.filter(g=>g.section===guide.section&&g.level===guide.level&&Math.abs(Number(g.row)-Number(guide.row))===1&&Math.abs(g.y-guide.y)<1);
  for(const [side,index]of [['left',0],['right',-1]]){
   const front=guide.front.at(index),back=guide.back.at(index);
   const next=neighbours.filter(g=>g.y>guide.y&&Math.hypot(g[side][0]-guide[side][0],g[side][2]-guide[side][2])<2.6).sort((a,b)=>a.y-b.y||Math.hypot(a[side][0]-guide[side][0],a[side][2]-guide[side][2])-Math.hypot(b[side][0]-guide[side][0],b[side][2]-guide[side][2]))[0];
   const end=next?.front.at(index);
   guide.edges.push(end?[front,back,[end[0],back[1],end[2]],end]:[front,back]);
  }
  const prior=neighbours.some(g=>g.y<guide.y&&Math.min(Math.hypot(g.left[0]-guide.left[0],g.left[2]-guide.left[2]),Math.hypot(g.right[0]-guide.right[0],g.right[2]-guide.right[2]))<2.6);
  const next=neighbours.some(g=>g.y>guide.y&&Math.min(Math.hypot(g.left[0]-guide.left[0],g.left[2]-guide.left[2]),Math.hypot(g.right[0]-guide.right[0],g.right[2]-guide.right[2]))<2.6);
  if(!prior)guide.edges.push(guide.front);
  if(!next)guide.edges.push(guide.back);
 }
 sectionGuideCache.set(seats,guides);return guides;
}

const aisleStepCache=new WeakMap();
// Walking half steps are illustrative. Infer them only where consecutive
// rows both retain a narrow seat-free gap; no seats or ticket IDs are added.
export function sourceAisleSteps(seats,layout){
 if(layout!=='o2a')return [];
 if(aisleStepCache.has(seats))return aisleStepCache.get(seats);
 const rows=new Map(),steps=[];
 for(const seat of seats){
  const key=JSON.stringify([seat.level,seat.position[1]]);
  if(!rows.has(key))rows.set(key,{level:seat.level,y:seat.position[1],seats:[],gaps:[]});rows.get(key).seats.push(seat);
 }
 const ordered=[...rows.values()].sort((a,b)=>a.level.localeCompare(b.level)||a.y-b.y);
 for(const row of ordered){
  row.seats.sort((a,b)=>Number(a.seat)-Number(b.seat));
  for(let i=1;i<row.seats.length;i++){
   const a=row.seats[i-1].position,b=row.seats[i].position,distance=Math.hypot(b[0]-a[0],b[2]-a[2]);
   if(distance<1.4||distance>3.4)continue;
   row.gaps.push({x:(a[0]+b[0])/2,z:(a[2]+b[2])/2,width:Math.min(1.35,distance-.85)});
  }
 }
 for(let n=1;n<ordered.length;n++){
  const lower=ordered[n-1],upper=ordered[n];
  if(lower.level!==upper.level||upper.y-lower.y>.6)continue;
  for(const gap of lower.gaps){
   const next=upper.gaps.filter(g=>Math.hypot(g.x-gap.x,g.z-gap.z)<1.6).sort((a,b)=>Math.hypot(a.x-gap.x,a.z-gap.z)-Math.hypot(b.x-gap.x,b.z-gap.z))[0];
   if(!next)continue;
   const distance=Math.hypot(next.x-gap.x,next.z-gap.z);
   if(distance<.5)continue;
   const dx=(next.x-gap.x)/distance,dz=(next.z-gap.z)/distance,width=Math.min(gap.width,next.width)/2;
   const top=(lower.y+upper.y)/2,bottom=lower.y+.004;
   const point=(along,side)=>[gap.x+along*dx-side*dz*width,top,gap.z+along*dz+side*dx*width];
   const tread=[point(distance*.5-.37,-1),point(distance*.5-.37,1),point(distance-.34,1),point(distance-.34,-1)];
   const risers=tread.map((a,i)=>{const b=tread[(i+1)%4];return [a,b,[b[0],bottom,b[2]],[a[0],bottom,a[2]]];});
   steps.push({level:lower.level,top,bottom,tread,risers});
  }
 }
 aisleStepCache.set(seats,steps);return steps;
}

// Join only neighbouring seats in the same row and elevation. Each tread is
// horizontal; the row heights and front risers form the bowl's rising profile.
export function sourceStandGeometry(seats,layout,retained){
 if(layout==='o2a'&&retained?.treads)return sourceRowGeometry(retained);
 const rows=new Map(),heights=new Map(),treads=[],risers=[];
 for(const seat of seats){
  const group=JSON.stringify([seat.section,seat.level]),key=JSON.stringify([seat.section,seat.level,seat.row,seat.position[1]]);
  if(!rows.has(key))rows.set(key,[]);rows.get(key).push(seat);
  if(!heights.has(group))heights.set(group,new Set());heights.get(group).add(seat.position[1]);
 }
 for(const [key,values]of heights)heights.set(key,[...values].sort((a,b)=>a-b));
 for(const row of rows.values()){
  row.sort((a,b)=>String(a.seat).localeCompare(String(b.seat),undefined,{numeric:true}));
  const connected=(a,b)=>a&&b&&Math.hypot(a.position[0]-b.position[0],a.position[2]-b.position[2])<=Math.max(a.chairWidth,b.chairWidth)*1.8;
  for(const [i,seat]of row.entries()){
   const previous=connected(row[i-1],seat)?row[i-1]:null,next=connected(seat,row[i+1])?row[i+1]:null;
   const yaw=sourceSeatYaw(seat.treadYaw,layout),forward=[Math.sin(yaw),Math.cos(yaw)];
   const a=previous?.position||seat.position,b=next?.position||seat.position;
   const length=Math.hypot(b[0]-a[0],b[2]-a[2]);
   const tangent=length?[(b[0]-a[0])/length,(b[2]-a[2])/length]:[Math.cos(yaw),-Math.sin(yaw)];
   const edge=(neighbour,sign)=>neighbour?[(seat.position[0]+neighbour.position[0])/2,(seat.position[2]+neighbour.position[2])/2]:[seat.position[0]+sign*tangent[0]*seat.chairWidth/2,seat.position[2]+sign*tangent[1]*seat.chairWidth/2];
   const left=edge(previous,-1),right=edge(next,1),y=seat.position[1]-.025,depth=seat.rowDepth/2;
   const p=(point,sign)=>[point[0]+sign*forward[0]*depth,y,point[1]+sign*forward[1]*depth];
   const q=[p(left,1),p(right,1),p(right,-1),p(left,-1)];treads.push(q);
   const levels=heights.get(JSON.stringify([seat.section,seat.level])),lower=levels[levels.indexOf(seat.position[1])-1];
   const bottom=lower===undefined?y-.18:Math.max(lower-.025,y-.7);
   risers.push([q[0],q[1],[q[1][0],bottom,q[1][2]],[q[0][0],bottom,q[0][2]]]);
  }
 }
 return {treads,risers};
}

// Source levels are grouping IDs, not independently verified physical floors.
export function sourceSeatLevels(seats){
 return [...new Set(seats.map(s=>s.level))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).map(id=>({id,label:`来源层级 ${id}`}));
}
// Per-chair footprints retain gaps and split rows; a section envelope must not
// become a clickable boundary spanning empty space or different source levels.
export function sourceMapPolygons(seats,level,layout){
 const sections=new Map(),headings=layout==='o2a'?sourceSeatHeadings(seats,layout):null;
 for(const seat of seats){if(seat.level!==level)continue;const polygons=sections.get(seat.section)||[];
  const yaw=headings?.get(seat),halfWidth=chairParts[0].size[0]*seat.chairWidth/.52/2,halfDepth=chairParts[0].size[2]/2;
  const points=headings?[[-1,-1],[1,-1],[1,1],[-1,1]].map(([across,forward])=>[
   seat.position[0]+across*halfWidth*Math.cos(yaw)+forward*halfDepth*Math.sin(yaw),
   seat.position[2]-across*halfWidth*Math.sin(yaw)+forward*halfDepth*Math.cos(yaw)
  ]):sourceSeatDeck(seat,layout).map(([x,,z])=>[x,z]);
  polygons.push({viewId:`source:${seat.section}:${level}:${polygons.length}`,points});sections.set(seat.section,polygons);
 }
 return sections;
}
// Compact transport: repeat venue provenance once instead of once per chair.
export const packSourceSeats=seats=>seats.map(s=>[s.section,s.row,s.seat,...s.position,s.yaw,s.treadYaw,s.chairWidth,s.rowDepth,s.level,s.depth]);
export const unpackSourceSeats=rows=>rows.map(r=>({section:r[0],row:r[1],seat:r[2],position:r.slice(3,6),yaw:r[6],treadYaw:r[7],chairWidth:r[8],rowDepth:r[9],level:r[10],depth:r[11]}));

const rowSkinCache=new WeakMap();
// Reconstruct row contours from the retained structural mesh, independently of
// chairs. Radial sampling preserves straight sides and corners without forcing
// an ellipse. Only short gaps (<= 3.4 source units) become inferred walkway
// surfaces; the end-stage opening remains open. All levels stay independent.
function sourceRowGeometry(retained){
 if(rowSkinCache.has(retained))return rowSkinCache.get(retained);
 const groups=new Map(),tau=Math.PI*2,sourceTreads=new Set(retained.treads);
 const angle=p=>(Math.atan2(p[2],p[0])+tau)%tau;
 for(const [i,q]of retained.treads.entries()){
  const level=retained.treadLevels[i],key=JSON.stringify([level,q[0][1]]);
  if(!groups.has(key))groups.set(key,{level,y:q[0][1],quads:[]});groups.get(key).quads.push(q);
 }
 // Immutable source row guides constrain the skin where the source's mesh
 // omitted supporting surfaces. They are not the current rendered inventory:
 // filtering chairs must never punch new holes in the structural model.
 const guides=(retained.rowGuides||[]).map(r=>({row:r[0],seat:r[1],position:r.slice(2,5),level:r[5],yaw:sourceSeatYaw(r[6],'o2a')}));
 const headings=sourceSeatHeadings(guides,'o2a'),guideRows=new Map();
 for(const seat of guides){
  const key=JSON.stringify([seat.level,seat.position[1]]);
  if(!guideRows.has(key))guideRows.set(key,[]);guideRows.get(key).push(seat);
 }
 for(const [key,list]of guideRows){
  list.sort((a,b)=>Number(a.seat)-Number(b.seat));
  const row=groups.get(key),edges=[];
  for(const [i,seat]of list.entries()){
   const yaw=headings.get(seat),p=seat.position;
   const edge=offset=>[p[0]+offset*Math.sin(yaw),p[1],p[2]+offset*Math.cos(yaw)];
   const current=[edge(.37),edge(-.48)],previous=edges.at(-1);
   if(previous&&Math.hypot(p[0]-list[i-1].position[0],p[2]-list[i-1].position[2])<=3.4)row.quads.push([previous[0],current[0],current[1],previous[1]]);
   // Half a source seat pitch caps the ends without inventing another chair.
   for(const sign of [-1,1]){
    const neighbour=list[i+sign];
    if(neighbour&&Math.hypot(p[0]-neighbour.position[0],p[2]-neighbour.position[2])<=3.4)continue;
    const other=list[i-sign],distance=other?Math.hypot(p[0]-other.position[0],p[2]-other.position[2]):Infinity;
    const dx=distance<=3.4?(p[0]-other.position[0])/distance*.25:sign*Math.cos(yaw)*.25;
    const dz=distance<=3.4?(p[2]-other.position[2])/distance*.25:-sign*Math.sin(yaw)*.25;
    row.quads.push([current[0],current[1],[current[1][0]+dx,p[1],current[1][2]+dz],[current[0][0]+dx,p[1],current[0][2]+dz]]);
   }
   edges.push(current);
  }
 }
 const rows=[...groups.values()].sort((a,b)=>a.level.localeCompare(b.level)||a.y-b.y);
 const anglesByLevel=new Map();
 // Add exact opening endpoints to the common sampling grid. A common grid is
 // what lets one row's rear edge meet the next row's front edge exactly.
 for(const row of rows){
  if(!anglesByLevel.has(row.level))anglesByLevel.set(row.level,new Set(Array.from({length:720},(_,i)=>i*tau/720)));
  const angles=anglesByLevel.get(row.level);
  const intervals=[];
  for(const q of row.quads){
   // Dense source tread vertices preserve discontinuities at real joins;
   // row-guide interiors are already sampled at half-degree spacing.
   if(sourceTreads.has(q))for(const p of q)angles.add(angle(p));
   const origin=angle(q[0]),values=q.map(p=>origin+Math.atan2(Math.sin(angle(p)-origin),Math.cos(angle(p)-origin)));
   for(const shift of [-tau,0,tau]){
    const lo=Math.max(0,Math.min(...values)+shift),hi=Math.min(tau,Math.max(...values)+shift);
    if(hi>lo)intervals.push([lo,hi]);
   }
  }
  intervals.sort((a,b)=>a[0]-b[0]);
  const merged=[];
  for(const interval of intervals){
   const last=merged.at(-1);
   if(last&&interval[0]<=last[1]+1e-7){last[1]=Math.max(last[1],interval[1]);continue;}
   merged.push([...interval]);
  }
  for(const [lo,hi]of merged){angles.add(lo);angles.add(hi%tau);}
 }
 const raysByLevel=new Map([...anglesByLevel].map(([level,angles])=>[level,[...angles].sort((a,b)=>a-b).map(a=>[Math.cos(a),Math.sin(a)])]));
 for(const row of rows){
  const rays=raysByLevel.get(row.level);
  row.samples=rays.map(d=>{
   let front=Infinity,back=-Infinity,guideFront=Infinity,sourceFront=Infinity;
   for(const q of row.quads)for(let i=0;i<4;i++){
    const a=q[i],b=q[(i+1)%4],dx=b[0]-a[0],dz=b[2]-a[2],cross=d[0]*dz-d[1]*dx;
    if(Math.abs(cross)<1e-9)continue;
    const radius=(a[0]*dz-a[2]*dx)/cross,t=(a[0]*d[1]-a[2]*d[0])/cross;
    if(radius<0||t< -1e-7||t>1+1e-7)continue;
    front=Math.min(front,radius);back=Math.max(back,radius);
    if(sourceTreads.has(q))sourceFront=Math.min(sourceFront,radius);
    if(!sourceTreads.has(q))guideFront=Math.min(guideFront,radius);
   }
   // The raw tread approximation sometimes runs through chairs on the row
   // below. Where a retained row guide exists, it owns the seating edge;
   // source-only surfaces still retain the seat-free walkways and openings.
   return Number.isFinite(front)?[Number.isFinite(guideFront)?guideFront:front,back,sourceFront]:null;
  });
  const valid=row.samples.flatMap((sample,i)=>sample?[i]:[]);
  for(const [n,i]of valid.entries()){
   const j=valid[(n+1)%valid.length];
   if((i+1)%rays.length===j)continue;
   const a=row.samples[i],b=row.samples[j];
   if([0,1].some(k=>Math.hypot(a[k]*rays[i][0]-b[k]*rays[j][0],a[k]*rays[i][1]-b[k]*rays[j][1])>3.4))continue;
   for(let k=(i+1)%rays.length;k!==j;k=(k+1)%rays.length){
    row.samples[k]=a.map((radius,index)=>{
     if(!Number.isFinite(radius)||!Number.isFinite(b[index]))return Infinity;
     const x=radius*rays[i][0],z=radius*rays[i][1],dx=b[index]*rays[j][0]-x,dz=b[index]*rays[j][1]-z;
     return (x*dz-z*dx)/(rays[k][0]*dz-rays[k][1]*dx);
    });
   }
  }
  row.samples=smoothRowEdges(row.samples,rays);
 }
 // Keep vertical step fronts outside the cushions and backs of lower rows.
 // Test the same boxes as the chair renderer, not the old tread outline.
 for(const [n,row]of rows.entries()){
  const rays=raysByLevel.get(row.level),bounds=new Map();
  for(let lower=n-1;lower>=0&&rows[lower].level===row.level&&rows[n-1].y-rows[lower].y<.575;lower--){
   for(const seat of guideRows.get(JSON.stringify([row.level,rows[lower].y]))||[]){
    const yaw=headings.get(seat),c=Math.cos(yaw),s=Math.sin(yaw),centreAngle=angle(seat.position);
    for(const part of o2ChairParts.slice(0,2)){
     if(seat.position[1]+part.center[1]-part.size[1]/2>=row.y||seat.position[1]+part.center[1]+part.size[1]/2<=rows[n-1].y)continue;
     const x=seat.position[0]+part.center[2]*s,z=seat.position[2]+part.center[2]*c;
     const half=[part.size[0]*.48/.52/2+.02,part.size[2]/2+.02];
     const radius=Math.hypot(x,z),span=.55/radius;
     const bin=Math.floor(centreAngle/tau*720);
     for(let k=bin-2;k<=bin+2;k++){
      const key=(k+720)%720;if(!bounds.has(key))bounds.set(key,[]);
      bounds.get(key).push({x,z,c,s,half,centreAngle,span});
     }
    }
   }
  }
  row.riserFront=row.samples.map((sample,i)=>{
   if(!sample)return null;
   let front=sample[0];
   const d=rays[i];
   for(const box of bounds.get(Math.floor(angle([d[0],0,d[1]])/tau*720))||[]){
    if(Math.abs(Math.atan2(Math.sin(angle([d[0],0,d[1]])-box.centreAngle),Math.cos(angle([d[0],0,d[1]])-box.centreAngle)))>box.span)continue;
    const origin=[-box.x*box.c+box.z*box.s,-box.x*box.s-box.z*box.c],direction=[d[0]*box.c-d[1]*box.s,d[0]*box.s+d[1]*box.c];
    let entry=-Infinity,exit=Infinity;
    for(let axis=0;axis<2;axis++){
     if(Math.abs(direction[axis])<1e-9){if(Math.abs(origin[axis])>box.half[axis])exit=-Infinity;continue;}
     const a=(-box.half[axis]-origin[axis])/direction[axis],b=(box.half[axis]-origin[axis])/direction[axis];
     entry=Math.max(entry,Math.min(a,b));exit=Math.min(exit,Math.max(a,b));
    }
    if(exit>=entry&&exit>0&&exit>front&&exit<sample[0]+.7)front=exit+.015;
   }
   return front;
  });
 }
 // All visible boundary faces must use the reconstructed contours too. The
 // retained front/cheek walls belong to the old approximation and can pass
 // directly through unchanged source chairs.
 const rearByLevel=new Map();
 for(const row of rows){
  if(!rearByLevel.has(row.level))rearByLevel.set(row.level,row.samples.map(()=>-Infinity));
  const rear=rearByLevel.get(row.level);
  row.samples.forEach((sample,i)=>{if(sample)rear[i]=Math.max(rear[i],sample[1]);});
 }
 for(const [n,row]of rows.entries()){
  const rays=raysByLevel.get(row.level),outer=rows[n+1]?.level===row.level?rows[n+1]:null;
  row.rear=row.samples.map((current,i)=>{
   if(!current)return null;
   if(!outer)return rearByLevel.get(row.level)[i];
   const next=outer?.samples[i],boundary=next?Math.max(next[0],Number.isFinite(next[2])?next[2]:next[0]):null;
   return boundary!==null&&boundary>current[0]+.1&&boundary-current[1]<=1.7?Math.max(boundary,current[1]):current[1];
  });
  row.segments=row.samples.map((a,i)=>{
   const j=(i+1)%rays.length,b=row.samples[j];
   return !!a&&!!b&&[0,1].every(edge=>{
    const ra=edge?row.rear[i]:a[0],rb=edge?row.rear[j]:b[0];
    return Math.hypot(rays[i][0]*ra-rays[j][0]*rb,rays[i][1]*ra-rays[j][1]*rb)<=3.4;
   });
  });
 }
 const treads=[],treadLevels=[],risers=[],walls=[],bases=new Map();
 const face=(a,b,bottom)=>[a,b,[b[0],bottom,b[2]],[a[0],bottom,a[2]]];
 for(const row of rows)if(!bases.has(row.level))bases.set(row.level,row.level==='L1'?-.12:row.y-.2);
 for(const [n,row]of rows.entries()){
  const rays=raysByLevel.get(row.level);
  const outer=rows[n+1]?.level===row.level?rows[n+1]:null;
  const inner=rows[n-1]?.level===row.level?rows[n-1]:null;
  const point=(i,radius,y=row.y)=>[rays[i][0]*radius,y,rays[i][1]*radius];
  for(let i=0;i<rays.length;i++){
   const j=(i+1)%rays.length,a=row.samples[i],b=row.samples[j];
   if(!row.segments[i])continue;
   const q=[point(i,a[0]),point(j,b[0]),point(j,row.rear[j]),point(i,row.rear[i])],base=bases.get(row.level);
   treads.push(q);treadLevels.push(row.level);
   // A staggered source row can overhang the clear vertical support below
   // it. Set back the riser instead of trimming away the upper chair's tread.
   if(inner?.segments[i])risers.push(face(point(i,row.riserFront[i]),point(j,row.riserFront[j]),inner.y));
   if(!inner?.segments[i])walls.push(face(q[0],q[1],inner?row.y-.025:base));
   if(!outer?.segments[i])walls.push(face(q[2],q[3],outer?row.y-.025:base));
   // End each horizontal slab with a thin fascia. Projecting these local
   // row ends down to the level base cuts across the chairs below; the raw
   // mesh does not establish a matching full-height opening wall here.
   const previous=(i+rays.length-1)%rays.length;
   if(!row.segments[previous])walls.push(face(q[3],q[0],row.y-.025));
   if(!row.segments[j])walls.push(face(q[1],q[2],row.y-.025));
  }
 }
 // Original boundaries are already included in the sampling grid. Drawing
 // their old faces again creates coplanar overlap and flickering seams.
 const result={basis:'source-row-segment-skin',treads,treadLevels,risers,walls,floor:retained.floor,rows:rows.map(row=>({level:row.level,y:row.y}))};
 rowSkinCache.set(retained,result);return result;
}

// Filter at uniform distances along each row, rather than averaging the
// irregularly spaced source vertices. Never sample across an opening or a
// long connector. This smooths the illustrative slab, not the source chairs.
function smoothRowEdges(samples,rays){
 const tau=2*Math.PI,angles=rays.map(([x,z])=>(Math.atan2(z,x)+tau)%tau);
 return samples.map((current,i)=>{
  if(!current)return null;
  const sums=[0,0,0];
  for(let n=-12;n<=12;n++){
   const target=(angles[i]+n*.125/current[0]+tau)%tau;
   let lo=0,hi=angles.length;
   while(lo<hi){const mid=(lo+hi)>>>1;if(angles[mid]<=target)lo=mid+1;else hi=mid;}
   const a=(lo+angles.length-1)%angles.length,b=lo%angles.length;
   if(!samples[a]||!samples[b])return current;
   if([0,1].some(edge=>Math.hypot(samples[a][edge]*rays[a][0]-samples[b][edge]*rays[b][0],samples[a][edge]*rays[a][1]-samples[b][edge]*rays[b][1])>3.4))return current;
   const start=angles[a],end=angles[b]+(b===0?tau:0),t=(target+(target<start?tau:0)-start)/(end-start),weight=Math.exp(-.5*(n/5)**2);
   for(let edge=0;edge<2;edge++)sums[edge]+=(samples[a][edge]*(1-t)+samples[b][edge]*t)*weight;
   sums[2]+=weight;
  }
  return [sums[0]/sums[2],sums[1]/sums[2],current[2]];
 });
}

// Row-ribbon skin. Seats are grouped by physical row (level + row label +
// elevation) and the stand surface is generated as a ribbon along each row:
// treads follow the seats, risers drop vertically from the row's front edge to
// the row below. Nothing is paired with a far-away point, which is what turned
// the earlier ring attempt into flat panels.
export function sourceRowRibbon(seats,layout,{bridge=10}={}){
 const centre=[0,0];
 for(const seat of seats){centre[0]+=seat.position[0];centre[1]+=seat.position[2];}
 centre[0]/=seats.length;centre[1]/=seats.length;
 const groups=new Map();
 for(const seat of seats){
  const key=`${seat.level}|${seat.row}|${Math.round(seat.position[1]*20)/20}`;
  if(!groups.has(key))groups.set(key,[]);groups.get(key).push(seat);
 }
 const rows=[];
 for(const [key,list] of groups){
  const yawOf=seat=>Math.atan2(seat.position[0]-centre[0],seat.position[2]-centre[1]);
  list.sort((a,b)=>yawOf(a)-yawOf(b));
  const half=list.map(seat=>Math.max(.3,(seat.rowDepth||.85)/2));
  const forward=list.map(seat=>{const yaw=seat.treadYaw??seat.yaw??0;return [Math.sin(yaw),Math.cos(yaw)];});
  const y=list.reduce((sum,seat)=>sum+seat.position[1],0)/list.length;
  rows.push({key,level:list[0].level,label:list[0].row,y,seats:list,half,forward,centreMean:y});
 }
 rows.sort((a,b)=>a.y-b.y);
 const treads=[],risers=[];
 for(const row of rows){
  const {seats:list,half,forward,y}=row;
  const inner=[],outer=[];
  for(let i=0;i<list.length;i++){
   const seat=list[i],[fx,fz]=forward[i];
   inner.push([seat.position[0]-fx*half[i],y,seat.position[2]-fz*half[i]]);
   outer.push([seat.position[0]+fx*half[i],y,seat.position[2]+fz*half[i]]);
  }
  for(let i=0;i<list.length-1;i++){
   const chord=Math.hypot(outer[i+1][0]-outer[i][0],outer[i+1][2]-outer[i][2]);
   if(chord>bridge)continue;
   treads.push([inner[i],inner[i+1],outer[i+1],outer[i]]);
  }
  const lower=rows[rows.indexOf(row)-1],floorY=lower?lower.y:0;
  if(y-floorY>0.02)for(let i=0;i<list.length-1;i++){
   const chord=Math.hypot(outer[i+1][0]-outer[i][0],outer[i+1][2]-outer[i][2]);
   if(chord>bridge)continue;
   risers.push([[inner[i][0],y,inner[i][2]],[inner[i+1][0],y,inner[i+1][2]],[inner[i+1][0],floorY,inner[i+1][2]],[inner[i][0],floorY,inner[i][2]]]);
  }
 }
 const lowest=rows[0];
 const frontRing=lowest?lowest.seats.map((seat,index)=>[seat.position[0]-lowest.forward[index][0]*lowest.half[index],lowest.y,seat.position[2]-lowest.forward[index][1]*lowest.half[index]]):[];
 return {treads,risers,frontRing,rows:rows.length};
}
