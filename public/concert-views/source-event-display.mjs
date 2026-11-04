const cache=new WeakMap();
const seatedEvents=new Set(['kia-forum-don-omar-20261106','unc-katseye-20261105','ubs-anuel-aa-20261106','pru-xg-20261114','sfa-doja-cat-20261117']);

export function eventPointInside([x,z],polygon){
 let inside=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];
  if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }
 return inside;
}

// Concave stages and standing areas need an interior anchor, rather than a
// vertex average that can put the performer or label outside the polygon.
export function eventInteriorAnchor(shape){
 const xs=shape.polygon.map(p=>p[0]),zs=shape.polygon.map(p=>p[1]);
 const bounds=[Math.min(...xs),Math.max(...xs),Math.min(...zs),Math.max(...zs)];
 const candidates=[];
 for(let i=1;i<24;i++)for(let j=1;j<24;j++){
  const p=[bounds[0]+(bounds[1]-bounds[0])*i/24,bounds[2]+(bounds[3]-bounds[2])*j/24];
  if(!eventPointInside(p,shape.polygon)||(shape.holes||[]).some(h=>eventPointInside(p,h)))continue;
  const clearance=Math.min(...[shape.polygon,...shape.holes||[]].flatMap(poly=>poly.map((a,k)=>{
   const b=poly[(k+1)%poly.length],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz)));
   return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dz);
  })));
  candidates.push({p,clearance});
 }
 return candidates.sort((a,b)=>b.clearance-a.clearance)[0]?.p||shape.polygon[0];
}

export function eventChairFootprint(chair){
 return [[-.23,-.215],[.23,-.215],[.23,.215],[-.23,.215]].map(([x,z])=>[
  chair.p[0]+x*Math.cos(chair.angle)+z*Math.sin(chair.angle),
  chair.p[2]-x*Math.sin(chair.angle)+z*Math.cos(chair.angle)
 ]);
}

function crosses(a,b,c,d){
 const cross=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
 return cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0;
}
const edgesCross=(a,b)=>a.some((p,i)=>b.some((q,j)=>crosses(p,a[(i+1)%a.length],q,b[(j+1)%b.length])));

export function sourceEventDisplayDraft(venue,draft){
 if(!draft||venue.geometry?.displayBasis!=='source-row-ribbons')return draft;
 if(!cache.has(venue))cache.set(venue,new WeakMap());
 if(cache.get(venue).has(draft))return cache.get(venue).get(draft);
 const anchored=items=>items.map(shape=>({...shape,labelPosition:eventInteriorAnchor(shape)}));
 const result={...draft,stage:anchored(draft.stage),zones:anchored(draft.zones),equipment:anchored(draft.equipment),floorChairs:[]};
 const zones=seatedEvents.has(draft.id)?result.zones.filter(z=>z.kind==='price-zone'):[];
 if(!zones.length){cache.get(venue).set(draft,result);return result;}
 const points=zones.flatMap(z=>z.polygon),origin=[points.reduce((n,p)=>n+p[0],0)/points.length,points.reduce((n,p)=>n+p[1],0)/points.length];
 const target=result.stage[0].labelPosition;
 // Fit one orthogonal frame to the traced block edges, then choose the axis
 // facing the stage. Independent look-at headings fan adjacent blocks apart.
 const axes=zones.flatMap(z=>z.polygon.map((p,i)=>{
  const next=z.polygon[(i+1)%z.polygon.length],dx=next[0]-p[0],dz=next[1]-p[1],length=Math.hypot(dx,dz),a=Math.atan2(dz,dx);
  return [length*Math.cos(4*a),length*Math.sin(4*a)];
 }));
 const base=-Math.atan2(axes.reduce((n,p)=>n+p[1],0),axes.reduce((n,p)=>n+p[0],0))/4;
 const angle=[0,1,2,3].map(k=>base+k*Math.PI/2).sort((a,b)=>
  Math.sin(b)*(target[0]-origin[0])+Math.cos(b)*(target[1]-origin[1])-Math.sin(a)*(target[0]-origin[0])-Math.cos(a)*(target[1]-origin[1]))[0];
 result.seatingFrame={angle,origin,columnPitch:.66,rowPitch:.95,basis:'estimated-shared-event-grid'};
 // These retained event maps explicitly have seated floor blocks. Price-zone
 // alone is not enough to infer seating for an arbitrary future event.
 for(const zone of zones){
  const center=origin;
  const local=zone.polygon.map(([x,z])=>[(x-center[0])*Math.cos(angle)-(z-center[1])*Math.sin(angle),(x-center[0])*Math.sin(angle)+(z-center[1])*Math.cos(angle)]);
  const minX=Math.min(...local.map(p=>p[0])),maxX=Math.max(...local.map(p=>p[0])),minZ=Math.min(...local.map(p=>p[1])),maxZ=Math.max(...local.map(p=>p[1]));
  for(let row=Math.ceil((minZ+.5)/.95);row<=Math.floor((maxZ-.5)/.95);row++)for(let col=Math.ceil((minX+.5)/.66);col<=Math.floor((maxX-.5)/.66);col++){
   const x=col*.66,z=row*.95;
   if(maxX-minX>10&&Math.abs(x)<.7||maxZ-minZ>14&&Math.abs(z)<.9)continue;
   const chair={zoneId:zone.id,label:zone.label,p:[center[0]+x*Math.cos(angle)+z*Math.sin(angle),zone.height,center[1]-x*Math.sin(angle)+z*Math.cos(angle)],angle,visualOnly:true,displayBasis:'illustrative-event-seating'};
   const footprint=eventChairFootprint(chair);
   if(!footprint.every(p=>eventPointInside(p,zone.polygon))||edgesCross(footprint,zone.polygon))continue;
   if([...(zone.holes||[]),...result.stage.map(s=>s.polygon),...result.equipment.map(s=>s.polygon)].some(poly=>footprint.some(p=>eventPointInside(p,poly))||poly.some(p=>eventPointInside(p,footprint))||edgesCross(footprint,poly)))continue;
   result.floorChairs.push(chair);
  }
 }
 cache.get(venue).set(draft,result);return result;
}
