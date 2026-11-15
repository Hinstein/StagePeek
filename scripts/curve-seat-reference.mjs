// Interpret retained numbering/curve fields only; no third-party viewer code is executed.
export function curveSeatReference(data){
 const frames=new Map(Object.entries(data.frames).map(([id,frame])=>[id,curveFrame(frame)]));
 const tiers=data.tiers.map(t=>{
  const depths=t.depth||Array(t.rows[1]-t.rows[0]+1).fill(t.pitch),backs=[];
  let v=t.vBack;
  for(let row=t.rows[1];row>=t.rows[0];row--){backs[row-t.rows[0]]=v;v+=depths[row-t.rows[0]];}
  return {...t,depths,backs,sections:t.sections.map(s=>({...s,r0:s.r0??t.rows[0],r1:s.r1??t.rows[1],numbers:seatRanges(s.seats)}))};
 });
 const seats=[],excludedParts=[],clipped=[];
 for(const tier of tiers)for(const section of tier.sections){
  if(!section.numbers.size){excludedParts.push({tier:tier.id,section:section.id,part:section.part});continue;}
  const frame=frames.get(tier.frame),rowIndex=n=>Math.max(tier.rows[0],Math.min(tier.rows[1],n))-tier.rows[0];
  const widest=[...section.numbers].map(([row,ranges])=>({row,lo:Math.min(...ranges.map(r=>r[0])),hi:Math.max(...ranges.map(r=>r[1]))})).sort((a,b)=>(b.hi-b.lo)-(a.hi-a.lo))[0];
  for(let row=section.r0;row<=section.r1;row++){
   const ranges=section.numbers.get(row);if(!ranges)continue;
   const v=tier.backs[rowIndex(row)]+.1,points=[];
   for(let u=section.u0+(section.aisle??.6);u<=section.u1-(section.aisle??.6)+1e-6;u+=.1)points.push({u,p:frame.at(u,v)});
   if(points.length<2)throw Error('Reference section has no usable curve: '+section.id);
   const lengths=[0];
   for(let i=1;i<points.length;i++)lengths.push(lengths.at(-1)+Math.hypot(points[i].p[0]-points[i-1].p[0],points[i].p[1]-points[i-1].p[1]));
   const lo=Math.min(...ranges.map(r=>r[0])),hi=Math.max(...ranges.map(r=>r[1]));
   const trimmed=row>widest.row&&((lo===widest.lo&&hi<widest.hi)||(hi===widest.hi&&lo>widest.lo));
   const first=trimmed?widest.lo:lo,slots=(trimmed?widest.hi:hi)-first+1;
   const pitch=Math.min(lengths.at(-1)/slots,(section.seatW??.5)*1.12),pad=(lengths.at(-1)-slots*pitch)/2;
   for(const [a,b] of ranges)for(let number=a;number<=b;number++){
    const distance=pad+pitch*(number-first+.5);
    let index=0;while(index<lengths.length-2&&lengths[index+1]<distance)index++;
    const u=points[index].u+(points[index+1].u-points[index].u)*(distance-lengths[index])/Math.max(1e-6,lengths[index+1]-lengths[index]);
    const front=tier.vFront?interpolate(tier.vFront.v,u/tier.vFront.step):Infinity;
    const owner=tier.sections.find(s=>u>=s.u0&&u<s.u1&&row>=s.r0&&row<=s.r1);
    if(u<tier.uRange[0]||u>tier.uRange[1]||tier.backs[rowIndex(row)]+tier.depths[rowIndex(row)]>front+(tier.frontTol??.1)||(tier.clipBySection&&!owner)||tier.voids?.some(w=>u>=w.u0&&u<=w.u1&&row<w.rMin)){
     clipped.push([section.id,String(row),number]);continue;
    }
    const p=frame.at(u,v),normal=frame.normal(u),yaw=Math.atan2(normal[0],normal[1]);
    const join=tiers.find(other=>other!==tier&&other.kind==='deck'&&tier.kind==='deck'&&other.frame===tier.frame&&
     (Math.abs(tier.uRange[1]-other.uRange[0])<=.1&&Math.abs(u-(tier.uRange[1]+other.uRange[0])/2)<14||Math.abs(other.uRange[1]-tier.uRange[0])<=.1&&Math.abs(u-(other.uRange[1]+tier.uRange[0])/2)<14));
    const joint=join?(Math.abs(tier.uRange[1]-join.uRange[0])<=.1?(tier.uRange[1]+join.uRange[0])/2:(join.uRange[1]+tier.uRange[0])/2):null;
    const k=join?1-Math.abs(u-joint)/14:0;
    const y=tier.tread[rowIndex(row)]+(join?(join.tread[Math.max(join.rows[0],Math.min(join.rows[1],row))-join.rows[0]]-tier.tread[rowIndex(row)])*.5*k*k*(3-2*k):0);
    seats.push([section.id,String(row),number,p[0],y,p[1],-Math.sin(yaw),-Math.cos(yaw),tier.id,0,section.seatW??.5,tier.depths[rowIndex(row)],-Math.sin(yaw),-Math.cos(yaw)]);
   }
  }
 }
 if(seats.some(s=>s.slice(3,8).some(n=>!Number.isFinite(n))))throw Error('Invalid derived curve position');
 return {seats,excludedParts,clipped};
}

export function seatRanges(spec){
 const result=new Map();if(!spec)return result;
 for(const group of spec.split(';')){
  const [rows,seats]=group.split(':');
  if(!/^\d+(?:-\d+)?$/.test(rows)||!/^\d+-\d+(?:,\d+-\d+)*$/.test(seats))throw Error('Invalid retained seat range: '+group);
  const [first,last=first]=rows.split('-').map(Number);
  const ranges=seats.split(',').map(range=>range.split('-').map(Number).sort((a,b)=>a-b));
  if(first>last||ranges.some((r,i)=>ranges.some((other,j)=>j<i&&r[0]<=other[1]&&other[0]<=r[1])))throw Error('Overlapping retained range');
  for(let row=first;row<=last;row++){if(result.has(row))throw Error('Duplicate retained row');result.set(row,ranges);}
 }
 return result;
}

function curveFrame(frame){
 const normals=frame.pts.map((p,i)=>{
  const previous=frame.pts[Math.max(0,i-1)],next=frame.pts[Math.min(frame.pts.length-1,i+1)];
  const n=[previous[1]-next[1],next[0]-previous[0]],length=Math.hypot(...n);
  const sign=n[0]*(frame.inward[0]-p[0])+n[1]*(frame.inward[1]-p[1])<0?-1:1;
  return n.map(v=>v/length*sign);
 });
 const xs=frame.pts.map(p=>p[0]),zs=frame.pts.map(p=>p[1]),nx=normals.map(n=>n[0]),nz=normals.map(n=>n[1]);
 const normal=u=>{
  const x=interpolate(nx,u/frame.step),z=interpolate(nz,u/frame.step),length=Math.hypot(x,z);
  return [x/length,z/length];
 };
 return {normal,at(u,v){const n=normal(u);return [interpolate(xs,u/frame.step)+n[0]*v,interpolate(zs,u/frame.step)+n[1]*v];}};
}
function interpolate(values,fraction){
 const f=Math.max(0,Math.min(values.length-1.0001,fraction)),i=Math.floor(f);
 return values[i]+(values[i+1]-values[i])*(f-i);
}
