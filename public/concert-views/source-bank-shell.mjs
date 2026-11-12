// The display shell is estimated independently of ticket inventory. Missing
// points shorten a source row; they do not automatically cut a hole in concrete.
export function sourceBankShell(rows,{closedBowl=false,rectangular=false}={}){
 const groups=Map.groupBy(rows,row=>JSON.stringify([row.section,row.level]));
 const banks=[],treads=[],risers=[],walls=[],guides=[],treadLevels=[];
 for(const group of groups.values()){
  const flat=Math.max(...group.map(r=>r.y))-Math.min(...group.map(r=>r.y))<.05;
  const all=group.flatMap(row=>row.seats),cx=all.reduce((n,s)=>n+s.position[0],0)/all.length,cz=all.reduce((n,s)=>n+s.position[2],0)/all.length;
  const widest=group.toSorted((a,b)=>b.seats.length-a.seats.length)[0].seats;
  const radialAngle=Math.atan2(cx,cz);
  // Theatre rows can straddle the origin. Their floor follows the row curve,
  // rather than rays from the arena centre, which can miss the outer chairs.
  const cartesian=rectangular||flat||group.some(row=>{const angles=row.seats.map(s=>offset(s.position,radialAngle));return Math.max(...angles)-Math.min(...angles)>Math.PI/2;});
  const mx=widest.reduce((n,s)=>n+s.position[0],0)/widest.length,mz=widest.reduce((n,s)=>n+s.position[2],0)/widest.length;
  const xx=widest.reduce((n,s)=>n+(s.position[0]-mx)**2,0),zz=widest.reduce((n,s)=>n+(s.position[2]-mz)**2,0),xz=widest.reduce((n,s)=>n+(s.position[0]-mx)*(s.position[2]-mz),0);
  const angle=cartesian?-.5*Math.atan2(2*xz,xx-zz):radialAngle,side=[Math.cos(angle),-Math.sin(angle)],normal=[Math.sin(angle),Math.cos(angle)];
  const distance=row=>row.seats.reduce((n,s)=>n+s.position[0]*normal[0]+s.position[2]*normal[1],0)/row.seats.length;
  const ordered=group.toSorted((a,b)=>flat?distance(a)-distance(b):a.y-b.y);
  const profiles=ordered.map(row=>{
   const points=row.seats.map(s=>s.position).toSorted((a,b)=>cartesian?(a[0]-b[0])*side[0]+(a[2]-b[2])*side[1]:offset(a,angle)-offset(b,angle));
   const across=points.map(p=>p[0]*side[0]+p[2]*side[1]);
   return {row,points,d:points.reduce((n,p)=>n+p[0]*normal[0]+p[2]*normal[1],0)/points.length,lo:Math.min(...across)-.45,hi:Math.max(...across)+.45};
  });
  // Fit the complete rows, then enclose every retained chair. Short first/last
  // rows no longer dictate a jagged structural edge. This adds floor, not seats.
  const complete=profiles.toSorted((a,b)=>(b.hi-b.lo)-(a.hi-a.lo)).slice(0,Math.max(2,Math.ceil(profiles.length*.6)));
  const edge=key=>{
   const mean=complete.reduce((n,r)=>n+r.d,0)/complete.length,value=complete.reduce((n,r)=>n+r[key],0)/complete.length;
   const denominator=complete.reduce((n,r)=>n+(r.d-mean)**2,0);
   const slope=denominator>1e-6?complete.reduce((n,r)=>n+(r.d-mean)*(r[key]-value),0)/denominator:0;
   const shift=(key==='lo'?Math.min:Math.max)(...all.map(s=>s.position[0]*side[0]+s.position[2]*side[1]+(key==='lo'?-.45:.45)*Math.hypot(1,slope)-value-slope*(s.position[0]*normal[0]+s.position[2]*normal[1]-mean)));
   return d=>value+slope*(d-mean)+shift;
  };
  const left=edge('lo'),right=edge('hi');
  const count=Math.max(8,Math.ceil(Math.max(...profiles.map(r=>r.hi-r.lo))/.65));
  const centres=profiles.map(profile=>Array.from({length:count+1},(_,i)=>{
   if(cartesian){
    const across=left(profile.d)+(right(profile.d)-left(profile.d))*i/count;
    const at=profile.points.findIndex(p=>p[0]*side[0]+p[2]*side[1]>=across);
    const k=at<1?(at===0?1:profile.points.length-1):at;
    const a=profile.points[Math.max(0,k-1)],b=profile.points[k]||a;
    const start=a[0]*side[0]+a[2]*side[1],span=(b[0]-a[0])*side[0]+(b[2]-a[2])*side[1];
    const d=span>1e-6?(a[0]+(b[0]-a[0])*(across-start)/span)*normal[0]+(a[2]+(b[2]-a[2])*(across-start)/span)*normal[1]:profile.d;
    return [side[0]*across+normal[0]*d,profile.row.y-.025,side[1]*across+normal[1]*d];
   }
   const start=Math.min(angle+Math.atan2(left(profile.d),profile.d),angle+offset(profile.points[0],angle)-.32/Math.hypot(profile.points[0][0],profile.points[0][2]));
   const end=Math.max(angle+Math.atan2(right(profile.d),profile.d),angle+offset(profile.points.at(-1),angle)+.32/Math.hypot(profile.points.at(-1)[0],profile.points.at(-1)[2]));
   const a=start+(end-start)*i/count;
   return rayPoint(profile.points,a,angle,profile.row.y-.025);
  }));
  const bank={section:ordered[0].section,level:ordered[0].level,rows:[],basis:'estimated-continuous-bank',cartesian};
  for(const [j,profile]of profiles.entries()){
   const y=profile.row.y-.025,depth=Math.max(.55,profile.row.seats[0].rowDepth/2);
   const boundaries=[-1,1].map(direction=>{
    if(cartesian)return centres[j].map(p=>[p[0]+normal[0]*direction*depth,y,p[2]+normal[1]*direction*depth]);
    const path=centres[j].map(p=>{const r=Math.hypot(p[0],p[2]);return [p[0]*(1+direction*depth/r),y,p[2]*(1+direction*depth/r)];});
    const a=boundaryPoint(path,left,side,normal),b=boundaryPoint(path,right,side,normal);
    const start=angle+offset(a,angle),end=angle+offset(b,angle);
    return Array.from({length:count+1},(_,i)=>i===0?a:i===count?b:rayPoint(path,start+(end-start)*i/count,angle,y));
   });
   const front=boundaries[0],back=boundaries[1];
   const quads=front.slice(1).map((p,i)=>[front[i],p,back[i+1],back[i]]);
   const bottom=j?profiles[j-1].row.y-.025:Math.max(-.3,y-.6);
   treads.push(...quads);treadLevels.push(...quads.map(()=>bank.level));
   for(let i=0;i<count;i++){
    const previous=bank.rows.at(-1)?.back;
    risers.push([front[i],front[i+1],previous?.[i+1]||[front[i+1][0],bottom,front[i+1][2]],previous?.[i]||[front[i][0],bottom,front[i][2]]]);
   }
   // Side and rear closures go to the tier base, so an upper tier is a volume
   // rather than floating paper strips. Open inter-section aisles stay separate.
   const base=Math.max(-.3,profiles[0].row.y-1.2);
   for(const i of [0,count])walls.push([front[i],back[i],[back[i][0],base,back[i][2]],[front[i][0],base,front[i][2]]]);
   if(j===profiles.length-1)for(let i=0;i<count;i++)walls.push([back[i],back[i+1],[back[i+1][0],base,back[i+1][2]],[back[i][0],base,back[i][2]]]);
   const guide={section:bank.section,level:bank.level,row:profile.row.row,y:profile.row.y,front,back,polygon:[...front,...back.toReversed()],edges:[[front[0],back[0]],[front.at(-1),back.at(-1)]]};
   guides.push(guide);bank.rows.push({...guide,treads:quads});
  }
  bank.outline=[...bank.rows[0].front,...bank.rows.flatMap(r=>[r.front.at(-1),r.back.at(-1)]),...bank.rows.at(-1).back.toReversed(),...bank.rows.toReversed().flatMap(r=>[r.back[0],r.front[0]])];
  banks.push(bank);
 }
 const aisleSteps=[];
 // Join neighbouring structural banks with walking surfaces. A wide opening
 // remains open; no stair is inferred across a service bay or stage end.
 for(const levelBanks of Map.groupBy(banks.filter(b=>!b.cartesian),b=>b.level).values()){
  const ordered=levelBanks.toSorted((a,b)=>Math.atan2(a.rows[0].front[0][0],a.rows[0].front[0][2])-Math.atan2(b.rows[0].front[0][0],b.rows[0].front[0][2]));
  for(const [i,left]of ordered.entries()){
   const right=ordered[(i+1)%ordered.length];if(right===left)continue;
   let previous=null;
   for(const row of left.rows){
    const match=right.rows.toSorted((a,b)=>Math.abs(a.y-row.y)-Math.abs(b.y-row.y))[0];
    if(Math.abs(match.y-row.y)>.2){previous=null;continue;}
    const a=row.front.at(-1),b=match.front[0],c=match.back[0],d=row.back.at(-1);
    const width=Math.max(Math.hypot(a[0]-b[0],a[2]-b[2]),Math.hypot(c[0]-d[0],c[2]-d[2]));
    const turn=Math.atan2(Math.sin(Math.atan2(b[0],b[2])-Math.atan2(a[0],a[2])),Math.cos(Math.atan2(b[0],b[2])-Math.atan2(a[0],a[2])));
    if(width<.3||width>5||turn<=0){previous=null;continue;}
    const y=Math.min(a[1],b[1]),tread=[a,b,c,d].map(p=>[p[0],y,p[2]]);
    // Fitted bank edges can meet before both row edges do. Such a pinched or
    // crossing gap has no rectangular walking surface; never emit a bow-tie.
    const turns=tread.map((p,i)=>{const q=tread[(i+1)%4],r=tread[(i+2)%4];return (q[0]-p[0])*(r[2]-q[2])-(q[2]-p[2])*(r[0]-q[0]);});
    if(!turns.every(v=>v>1e-6)&&!turns.every(v=>v< -1e-6)){previous=null;continue;}
    const step={level:row.level,sections:[left.section,right.section],tread,risers:previous?[[tread[0],tread[1],previous[2],previous[3]]]:[]};
    aisleSteps.push(step);previous=tread;
   }
  }
 }
 const gallery={decks:[],fascias:[],recesses:[],dividers:[]};
 // Only bridge radial tier gaps where a lower stand exists at the same azimuth.
 // No lower stand means no inferred bridge (in particular the stage opening).
 for(const upper of banks.filter(b=>!b.cartesian)){
  const front=upper.rows[0].front;
  for(let i=0;i<front.length-1;i++){
   const a=front[i],b=front[i+1],angle=Math.atan2(a[0]+b[0],a[2]+b[2]);
   const candidates=banks.filter(lower=>!lower.cartesian&&lower.level!==upper.level&&lower.rows.at(-1).y<upper.rows[0].y-1);
   const matches=candidates.map(lower=>({lower,point:rayOnPath(lower.rows.at(-1).back,angle)})).filter(v=>v.point&&Math.hypot(...[a[0]-v.point[0],a[2]-v.point[2]])>.3&&Math.hypot(v.point[0],v.point[2])<Math.hypot(a[0],a[2]));
   const match=matches.sort((x,y)=>y.lower.rows.at(-1).y-x.lower.rows.at(-1).y)[0];
   if(!match)continue;
   const left=rayOnPath(match.lower.rows.at(-1).back,Math.atan2(a[0],a[2])),right=rayOnPath(match.lower.rows.at(-1).back,Math.atan2(b[0],b[2]));
   if(!left||!right)continue;
   const y=match.lower.rows.at(-1).back[0][1],gap=Math.max(Math.hypot(a[0]-left[0],a[2]-left[2]),Math.hypot(b[0]-right[0],b[2]-right[2]));
   if(gap>18)continue;
   gallery.decks.push([[left[0],y,left[2]],[right[0],y,right[2]],[b[0],y,b[2]],[a[0],y,a[2]]]);
   gallery.fascias.push([a,b,[b[0],y,b[2]],[a[0],y,a[2]]]);
  }
 }
 const foundation=closedBowl?closedTierFoundation(rows):{decks:[],walls:[]};
 walls.push(...foundation.walls);
 return {banks,treads,risers,walls,guides,treadLevels,gallery,aisleSteps,concourse:foundation.decks};
}
function offset(p,angle){return Math.atan2(Math.sin(Math.atan2(p[0],p[2])-angle),Math.cos(Math.atan2(p[0],p[2])-angle));}
function boundaryPoint(path,edge,side,normal){
 const value=p=>p[0]*side[0]+p[2]*side[1]-edge(p[0]*normal[0]+p[2]*normal[1]);
 const crossing=path.findIndex((p,i)=>i&&value(p)*value(path[i-1])<=0);
 const index=crossing>0?crossing:Math.abs(value(path[0]))<Math.abs(value(path.at(-1)))?1:path.length-1;
 const a=path[index-1],b=path[index],t=-value(a)/(value(b)-value(a));
 return [a[0]+(b[0]-a[0])*t,a[1],a[2]+(b[2]-a[2])*t];
}
function rayOnPath(points,angle){
 const dx=Math.sin(angle),dz=Math.cos(angle);
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],ex=b[0]-a[0],ez=b[2]-a[2],det=dx*ez-dz*ex;
  if(Math.abs(det)<1e-9)continue;
  const r=(a[0]*ez-a[2]*ex)/det,t=(a[0]*dz-a[2]*dx)/det;
  if(r>0&&t>=-1e-6&&t<=1+1e-6)return [dx*r,a[1],dz*r];
 }
 return null;
}
function rayPoint(points,angle,centre,y){
 const hit=rayOnPath(points,angle);if(hit)return [hit[0],y,hit[2]];
 const atStart=offset([Math.sin(angle),0,Math.cos(angle)],centre)<offset(points[0],centre);
 const a=atStart?points[0]:points.at(-2)||points[0],b=atStart?points[1]||points[0]:points.at(-1);
 const dx=Math.sin(angle),dz=Math.cos(angle),ex=b[0]-a[0],ez=b[2]-a[2],det=dx*ez-dz*ex;
 const r=Math.abs(det)>1e-6?(a[0]*ez-a[2]*ex)/det:Math.hypot(a[0],a[2]);
 return [dx*r,y,dz*r];
}

// A reviewed closed bowl keeps its structural terraces across sparse ticket
// blocks. Only the supporting shell is interpolated; no seats or IDs are added.
function closedTierFoundation(rows){
 const decks=[],walls=[],count=192;
 // Floor blocks have no enclosing bowl terrace, even in a closed arena.
 const bands=[...Map.groupBy(rows.filter(r=>r.level!=='-1'),r=>r.y).values()].toSorted((a,b)=>a[0].y-b[0].y);
 let previous=null;
 for(const band of bands){
  const points=band.flatMap(r=>r.seats.map(s=>s.position)).sort((a,b)=>Math.atan2(a[0],a[2])-Math.atan2(b[0],b[2]));
  const depth=Math.max(.55,...band.map(r=>r.seats[0].rowDepth/2)),y=band[0].y-.075;
  const radius=angle=>{
   const next=points.findIndex(p=>Math.atan2(p[0],p[2])>angle),a=points[(next<0?points.length-1:next-1+points.length)%points.length],b=points[next<0?0:next];
   const start=Math.atan2(a[0],a[2]),end=Math.atan2(b[0],b[2]),span=(end-start+Math.PI*2)%(Math.PI*2),t=span>1e-8?((angle-start+Math.PI*2)%(Math.PI*2))/span:0;
   return Math.hypot(a[0],a[2])*(1-t)+Math.hypot(b[0],b[2])*t;
  };
  const edges=[-1,1].map(sign=>Array.from({length:count+1},(_,i)=>{const a=-Math.PI+i*Math.PI*2/count,r=radius(a===Math.PI?-Math.PI:a)+sign*depth;return [Math.sin(a)*r,y,Math.cos(a)*r];}));
  for(let i=0;i<count;i++){
   decks.push([edges[0][i],edges[0][i+1],edges[1][i+1],edges[1][i]]);
   if(previous){
    const lower=previous.back[i],upper=edges[0][i],gap=Math.hypot(upper[0],upper[2])-Math.hypot(lower[0],lower[2]);
    const nextGap=Math.hypot(edges[0][i+1][0],edges[0][i+1][2])-Math.hypot(previous.back[i+1][0],previous.back[i+1][2]);
    if(Math.max(gap,nextGap)>depth*2){
     const a=[upper[0],previous.y,upper[2]],b=[edges[0][i+1][0],previous.y,edges[0][i+1][2]];
     if(gap>0&&nextGap>0)decks.push([lower,previous.back[i+1],b,a]);
     if(gap*nextGap<=0){
      const t=gap/(gap-nextGap),cross=lower.map((v,k)=>v+(previous.back[i+1][k]-v)*t);
      decks.push(gap>0?[lower,cross,a]:[cross,previous.back[i+1],b]);
     }
     walls.push([a,b,edges[0][i+1],upper]);
    }else walls.push([previous.back[i],previous.back[i+1],edges[0][i+1],edges[0][i]]);
   }
  }
  previous={back:edges[1],y};
 }
 return {decks,walls};
}
