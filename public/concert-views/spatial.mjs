export const chairParts=[
  {size:[.46,.085,.43],center:[0,.27,0]},
  {size:[.46,.39,.085],center:[0,.49,-.19]},
  {size:[.065,.23,.24],center:[0,.115,-.06]}
];
// Keep the O2 backrest below its upper-row clearance; the old tall back
// protruded into the next tread at the 409/410 corner. XYZ stays unchanged.
export const o2ChairParts=[chairParts[0],{size:[.46,.28,.085],center:[0,.435,-.19]},chairParts[2]];
export function stageBoxesFromRects(layout,venue,rects){
  const boxes=[];
  rects.forEach((r,index)=>{
    const h=r.h??2.2;
    if(r.kind==='screen'||r.kind==='structure'){
      boxes.push({kind:r.kind,index,size:[r.w,h,r.d],center:[r.x,(r.base??0)+h/2,r.z],angle:r.angle||0});
      return;
    }
    boxes.push({kind:'platform',index,size:[r.w,h,r.d],center:[r.x,(r.base??0)+h/2,r.z],angle:r.angle??0});
    boxes.push({kind:'top',index,size:[Math.max(.1,r.w-.7),.14,Math.max(.1,r.d-.7)],center:[r.x,(r.base??0)+h+.07,r.z],angle:r.angle??0});
    if(layout!=='event'&&!venue.seatLayout&&!venue.geometry?.referenceLayout&&layout!=='center'&&index===0){
      const alongZ=!!venue.geometry?.stage||Math.abs(r.z)>Math.abs(r.x),sign=alongZ&&venue.geometry?.stage?.facing ? -venue.geometry.stage.facing : ((alongZ?r.z:r.x)>=0?1:-1);
      const height=Math.max(4,Math.min(10,Math.max(r.w,r.d)*.38)),width=(alongZ?r.w:r.d)*.93,back=(alongZ?r.z:r.x)+sign*((alongZ?r.d:r.w)/2-.12);
      const center=alongZ?[r.x,h+height/2+.2,back]:[back,h+height/2+.2,r.z];
      boxes.push({kind:'frame',size:alongZ?[width+.45,height+.45,.35]:[.35,height+.45,width+.45],center});
      boxes.push({kind:'screen',size:alongZ?[width,height,.06]:[.06,height,width],center:center.map((x,i)=>x-(i===(alongZ?2:0)?sign*.2:0))});
    }
  });
  return boxes;
}
export function boxesIntersect(a,b){
  if(Math.abs(a.center[1]-b.center[1])>=(a.size[1]+b.size[1])/2-1e-5)return false;
  const axes=o=>[[Math.cos(o.angle||0),-Math.sin(o.angle||0)],[Math.sin(o.angle||0),Math.cos(o.angle||0)]];
  const aa=axes(a),bb=axes(b),delta=[a.center[0]-b.center[0],a.center[2]-b.center[2]],dot=(u,v)=>u[0]*v[0]+u[1]*v[1];
  for(const axis of [...aa,...bb]){
    const radius=(o,ax)=>Math.abs(dot(ax[0],axis))*o.size[0]/2+Math.abs(dot(ax[1],axis))*o.size[2]/2;
    if(Math.abs(dot(delta,axis))>=radius(a,aa)+radius(b,bb)-1e-5)return false;
  }
  return true;
}
export function seatIntersectsBox(record,box){
  const radius=Math.hypot(.3*record.width,.34),bc=Math.cos(box.angle||0),bs=Math.sin(box.angle||0),dx=record.p[0]-box.center[0],dz=record.p[2]-box.center[2];
  if(record.p[1]+.685<=box.center[1]-box.size[1]/2||record.p[1]>=box.center[1]+box.size[1]/2||Math.abs(dx*bc-dz*bs)>box.size[0]/2+radius||Math.abs(dx*bs+dz*bc)>box.size[2]/2+radius)return false;
  const c=Math.cos(record.angle),s=Math.sin(record.angle);
  return (record.chairParts||chairParts).some(part=>boxesIntersect({size:[part.size[0]*record.width,part.size[1],part.size[2]],angle:record.angle,center:[record.p[0]+part.center[0]*record.width*c+part.center[2]*s,record.p[1]+part.center[1],record.p[2]-part.center[0]*record.width*s+part.center[2]*c]},box));
}
// Clip the actual tread/riser polygon against the six box planes. Testing
// bounding boxes alone falsely flags adjacent sloped rows as intersections.
export function polygonIntersectsBox(points,box){
 const c=Math.cos(box.angle||0),s=Math.sin(box.angle||0),half=box.size.map(n=>n/2-1e-5);
 const local=points.map(p=>{const x=p[0]-box.center[0],z=p[2]-box.center[2];return [x*c-z*s,p[1]-box.center[1],x*s+z*c];});
 if([0,1,2].some(i=>Math.min(...local.map(p=>p[i]))>=half[i]||Math.max(...local.map(p=>p[i]))<=-half[i]))return false;
 // Renderer triangulates quads; handle both triangles independently (saddle
 // treads need not be planar).
 for(const indices of [[0,1,2],[0,2,3]]){
  let poly=indices.map(i=>local[i]);
  for(let axis=0;axis<3&&poly.length;axis++)for(const sign of [-1,1]){
   const out=[];
   for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length],da=half[axis]-sign*a[axis],db=half[axis]-sign*b[axis];
    if(da>=0)out.push(a);
    if((da>=0)!==(db>=0)){const t=da/(da-db);out.push(a.map((v,j)=>v+(b[j]-v)*t));}
   }
   poly=out;
  }
  if(poly.length>=3)return true;
 }
 return false;
}
