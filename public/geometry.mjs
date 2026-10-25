import {stageBoxesFromRects,seatIntersectsBox,polygonIntersectsBox} from './spatial.mjs';
import {sourceSeatDecks} from './seating.mjs';
const seatCache=new WeakMap(),surfaceCache=new WeakMap(),stageCache=new WeakMap();
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function venueShape(venue){return venue?.geometry?.shape||'rounded';}
export function venueFloor(venue){
  const [x,z]=venue?.geometry?.floor||[];
  if(Number.isFinite(x)&&Number.isFinite(z))return [x,z];
  const tiers=venue?.tiers||[];
  return [Math.max(48,...tiers.map(t=>2*(t[0]+Math.abs(t[3]||0)/2)+40)),Math.max(48,...tiers.map(t=>2*(t[1]+Math.abs(t[3]||0)/2)+40))];
}
export function venueRadius(venue){if(venue?.sourceSeats?.length)return venue.sourceSeats.reduce((r,s)=>Math.max(r,Math.hypot(s.position[0],s.position[2])),24);const inner=venue?.geometry?.coordinateSystem==='profile-inner-radius';return Math.max(24,...(venue?.tiers||[]).map(([rx,rz,,depth])=>inner?Math.max(rx,rz)+Math.abs(depth||0):Math.hypot(rx,rz)+Math.abs(depth||0)/2));}
export function venueFootprintContainsPoint(venue,x,z,margin=0){
  if(![x,z,margin].every(Number.isFinite))return false;
  const [width,depth]=venueFloor(venue),rx=Math.max(.1,width/2-margin),rz=Math.max(.1,depth/2-margin);
  if(['rectangle','fan','rear'].includes(venueShape(venue)))return Math.abs(x)<=rx&&Math.abs(z)<=rz;
  return (x/rx)**2+(z/rz)**2<=1;
}
export function stageOutsideParts(venue,layout,rects){
  return stageBoxesFromRects(layout,venue,rects).filter(box=>{
    if(![...box.center,...box.size,box.angle??0].every(Number.isFinite)||box.size.some(n=>n<=0))return true;
    const c=Math.cos(box.angle||0),s=Math.sin(box.angle||0);
    return [-1,1].some(a=>[-1,1].some(b=>{
      const x=a*box.size[0]/2,z=b*box.size[2]/2;
      return !venueFootprintContainsPoint(venue,box.center[0]+x*c+z*s,box.center[2]-x*s+z*c);
    }));
  });
}
function fitGenericStageRig(venue,rects){
  if(!rects.length)return rects;
  const [width,depth]=venueFloor(venue),rx=Math.max(.1,width/2-1),rz=Math.max(.1,depth/2-1),oval=!['rectangle','fan','rear'].includes(venueShape(venue));
  let required=0;
  for(const rect of rects){
    const corners=[[-rect.w/2,-rect.d/2],[-rect.w/2,rect.d/2],[rect.w/2,-rect.d/2],[rect.w/2,rect.d/2]];
    for(const [dx,dz] of corners){const x=rect.x+dx,z=rect.z+dz;required=Math.max(required,oval?Math.sqrt((x/rx)**2+(z/rz)**2):Math.max(Math.abs(x)/rx,Math.abs(z)/rz));}
  }
  if(required<=.98)return rects;
  const scale=.94/required;
  return rects.map(rect=>({...rect,x:rect.x*scale,z:rect.z*scale,w:rect.w*scale,d:rect.d*scale,previewScale:scale}));
}
export function proposedStageRects(layout,venue){
  if(layout==='none')return [];
  // A dated exhibition layout owns both temporary seating and its stage rig.
  // Never combine these seats with a generic centre/end-stage preset.
  if(venue?.geometry?.referenceLayout)return venue.geometry.referenceLayout.stageRects.map(r=>({...r}));
  // A selected concert may provide a normalized trace of the public ticket
  // map. Resolve it against this venue's floor frame before considering the
  // venue's fixed/source stage or the generic preview profiles.
  if(layout==='event'&&venue?.eventLayout?.stageRects?.length){
    const [floorX,floorZ]=venueFloor(venue);
    const metres=venue.eventLayout.coordinateFrame==='venue-metres';
    return venue.eventLayout.stageRects.map(rect=>({...rect,
      x:rect.x*(metres?1:floorX),z:rect.z*(metres?1:floorZ),w:rect.w*(metres?1:floorX),d:rect.d*(metres?1:floorZ),h:rect.h??1.5,
      source:'event-seat-map',confidence:venue.eventLayout.confidence||'operator-traced'
    }));
  }
  if(venue?.seatLayout){const s=venue.sourceStage;return s?[{x:s.x,z:s.z,w:s.width,d:s.depth,h:s.height}]:[];}
  const profile=venue?.geometry?.stage;
  if(profile&&layout!=='center'){
    const main={x:profile.x??0,z:profile.z??0,w:profile.width,d:profile.depth,h:profile.height??1.5};
    const structures=(profile.structures||[]).map(structure=>({...structure,h:structure.h??structure.height??1.5}));
    const rig=layout==='runway'?[main,...structures,{x:main.x,z:main.z+(profile.facing??(main.z>=0?-1:1))*(main.d/2+5),w:Math.min(4,main.w*.2),d:10,h:main.h}]:[main,...structures];
    return rig;
  }
  if(venue?.geometry?.coordinateSystem==='profile-inner-radius'){
    // This is a generic preview, bounded by the front of the bowl. The outer
    // venue radius includes seating and can put the whole stage under a tier.
    const [rx,rz]=venue.tiers[0],exponent=2/(venue.geometry.power||1);
    const fit=rect=>{
      const extent=((Math.abs(rect.x)+rect.w/2)/rx)**exponent+((Math.abs(rect.z)+rect.d/2)/rz)**exponent;
      const scale=Math.min(1,.9/extent**(1/exponent));
      return {x:rect.x*scale,z:rect.z*scale,w:rect.w*scale,d:rect.d*scale,h:1.5};
    };
    if(layout==='center')return fitGenericStageRig(venue,[fit({x:0,z:0,w:Math.min(24,rx*.7),d:Math.min(24,rz*.7)})]);
    const main=fit({x:rx*.4,z:0,w:Math.min(22,rx*.55),d:Math.min(32,rz*.85)});
    return fitGenericStageRig(venue,layout==='runway'?[main,fit({x:rx*.12,z:0,w:rx*.55,d:Math.min(5,rz*.14)})]:[main]);
  }
  const [floorX,floorZ]=venueFloor(venue),r=venueRadius(venue);
  const width=Math.max(12,Math.min(32,floorX*.15)),depth=Math.max(16,Math.min(48,floorZ*.42));
  const edge=['rectangle','fan','rear'].includes(venueShape(venue))?Math.max(0,floorX/2-width/2-1):Math.max(r*.72,floorX*.32);
  if(layout==='center')return fitGenericStageRig(venue,[{x:0,z:0,w:Math.max(18,Math.min(32,floorX*.18)),d:Math.max(18,Math.min(32,floorZ*.18))}]);
  if(layout==='runway')return fitGenericStageRig(venue,[{x:edge,z:0,w:width,d:depth},{x:edge*.58,z:0,w:Math.max(24,width*1.9),d:Math.max(4,width*.23)},{x:edge*.28,z:0,w:Math.max(12,width*.75),d:Math.max(12,width*.38)}]);
  return fitGenericStageRig(venue,[{x:edge,z:0,w:width,d:depth}]);
}
export const performer=(layout,venue)=>{const s=stageRects(layout,venue)[0];if(!s)return null;if(venue?.geometry?.referenceLayout?.performer)return [...venue.geometry.referenceLayout.performer];return [s.x,s.h??2.2,s.z];};
const tau=Math.PI*2;
const wrapGap=value=>(value+tau)%tau||tau;
export function sectionRenderHalfAngle(venue,section){
  if(section.block)return 0;
  const peers=(venue?.sections||[]).filter(s=>s.tier===section.tier&&(s.radialStart??0)===(section.radialStart??0)&&(s.radialEnd??1)===(section.radialEnd??1)).sort((a,b)=>a.angle-b.angle);
  if(peers.length<2)return section.halfAngle;
  const index=peers.indexOf(section);
  if(index<0)return section.halfAngle;
  const previous=peers[(index+peers.length-1)%peers.length];
  const next=peers[(index+1)%peers.length];
  const previousGap=wrapGap(section.angle-previous.angle);
  const nextGap=wrapGap(next.angle-section.angle);
  const basis=section.positionBasis?.kind;
  // Reference-only and synthetic venues have no measured aisle width. Extend
  // their render span to the midpoint between adjacent section anchors so the
  // generic bowl reads as one continuous structure. Source-observed layouts
  // retain their measured spans and visible aisles.
  if(basis==='source-layout-reference'||basis==='synthetic-geometry'||basis==='operator-curated-anchor'){
    return Math.min(Math.PI*.45,Math.max(section.halfAngle,Math.min(previousGap,nextGap)*.48));
  }
  return section.halfAngle;
}
export function sectionRowCount(venue,section){if(section.block)return Math.max(1,Math.min(80,section.block.risers?.steps??Math.floor(section.block.depth/.85)));return Math.max(1,Math.round(tierRowCount(venue,section.tier)*((section.radialEnd??1)-(section.radialStart??0))));}
export function tierRowCount(venue,tier){
  const value=Number(venue?.geometry?.tiers?.[tier]?.steps);
  return Number.isFinite(value)?Math.max(8,Math.min(40,Math.round(value))):12;
}
// Synthetic rows are rendered as a shallow stair.  Keeping the pitch in one
// place makes the seat backs, tread surfaces and overview camera agree about
// the same slope without changing any source seat XYZ values.
export function tierPitch(venue,tier){
  const data=venue?.tiers?.[tier]||[];
  const depth=Math.max(.1,Math.abs(Number(data[3])||0));
  const rise=Math.max(0,Number(data[4])||0);
  return {depth,rise,pitch:Math.atan2(rise,depth)};
}
export function sectionSeatCount(venue,section,halfAngle,rowCount=12){
  let length=0,previous=sectionPoint(venue,section,.5,-.9,halfAngle);
  for(let i=1;i<=12;i++){const p=sectionPoint(venue,section,.5,-.9+i*1.8/12,halfAngle);length+=Math.hypot(p[0]-previous[0],p[2]-previous[2]);previous=p;}
  return Math.max(3,Math.min(100,Math.floor(length/.58)));
}
export function estimateSeatPosition(venue,section,row,seat){
  const rows=sectionRowCount(venue,section);
  const renderHalfAngle=sectionRenderHalfAngle(venue,section);
  const seats=sectionSeatCount(venue,section,renderHalfAngle,rows);
  const rowText=String(row).trim().toUpperCase();
  const alpha=rowText.match(/^[A-Z]+$/);
  const alphaNumber=alpha?[...alpha[0]].reduce((value,char)=>value*26+char.charCodeAt(0)-64,0):0;
  const seatText=String(seat).trim();
  const rowNumber=/^\d+$/.test(rowText)?Number(rowText):alphaNumber;
  const seatNumber=/^\d+$/.test(seatText)?Number(seatText):0;
  if(!Number.isSafeInteger(rowNumber)||!Number.isSafeInteger(seatNumber)||rowNumber<1||rowNumber>rows||seatNumber<1||seatNumber>seats)return null;
  const t=(rowNumber-.5)/rows;
  const lateral=(-.5+(seatNumber-.5)/seats)*1.8;
  return sectionPoint(venue,section,t,lateral,renderHalfAngle);
}
// Horizontal slices retain slanted edges and runway notches. These diagrams
// have one contiguous span per scanline; a bounding rectangle loses that shape.
export function blockSpan(block,z){
  if(!block.polygon)return [block.x-block.width/2,block.x+block.width/2];
  const zs=block.polygon.map(p=>p[1]),scan=clamp(z,Math.min(...zs)+1e-8,Math.max(...zs)-1e-8),xs=[];
  for(let i=0;i<block.polygon.length;i++){
    const a=block.polygon[i],b=block.polygon[(i+1)%block.polygon.length];
    if((a[1]>scan)!==(b[1]>scan))xs.push(a[0]+(b[0]-a[0])*(scan-a[1])/(b[1]-a[1]));
  }
  return [Math.min(...xs),Math.max(...xs)];
}
export function sectionPoint(v,s,t=.5,lateral=0,halfAngle=s.halfAngle){
  if(s.block){const b=s.block,f=b.facing??-1,z=b.z+f*(t-.5)*b.depth,[left,right]=blockSpan(b,z);return [(left+right)/2+lateral*(right-left)/2,(b.base??0)+(b.risers?(b.risers.base??0)+t*(b.risers.rise??0):0),z];}
  const [rx,rz,y,depth,rise]=v.tiers[s.tier],a=s.angle+lateral*halfAngle;
  const shape=venueShape(v),ca=Math.cos(a),sa=Math.sin(a);
  if(v.geometry?.coordinateSystem==='profile-inner-radius'){
    const start=s.radialStart??0,end=s.radialEnd??1,u=start+(end-start)*t;
    const ax=Math.max(.1,rx+u*depth),az=Math.max(.1,rz+u*depth),power=Math.max(.1,v.geometry.power??1),n=2/power;
    let radius=1/(Math.abs(sa/ax)**n+Math.abs(ca/az)**n)**(1/n),x=sa*radius,z=ca*radius;
    const radial=v.geometry.radial;
    if(Array.isArray(radial)&&radial.length>=5){const degrees=Math.abs(Math.atan2(sa,ca))*180/Math.PI,i=Math.min(3,Math.floor(degrees/45));radius=radial[i]+(radial[i+1]-radial[i])*(degrees-i*45)/45+rx-v.tiers[0][0]+depth*u;x=sa*radius;z=ca*radius;}
    if(shape==='rear'){x=-Math.atan2(Math.sin(a-Math.PI),Math.cos(a-Math.PI))/(Math.PI*.5)*rx;z=-az;}
    return [x,(y+u*rise)*(1-(v.geometry.saddle??0)*sa**2),z];
  }
  if(shape==='rectangle'){
    const edge=Math.min(rx/Math.max(.001,Math.abs(ca)),rz/Math.max(.001,Math.abs(sa)));
    const radius=Math.max(1,edge+(t-.5)*depth);
    return [radius*ca,y+t*rise,radius*sa];
  }
  return [(rx+(t-.5)*depth)*ca,y+t*rise,(rz+(t-.5)*depth)*sa];
}
export function displaySectionLabel(section){
  if(section?.block?.label)return section.block.label;
  const id=String(section?.id||'');
  const match=id.match(/^base-(lower|upper)-(\d+)$/i);
  if(match)return `${match[1].toLowerCase()==='lower'?'下层':'上层'} ${Number(match[2])}`;
  const generic=id.match(/^L(\d+)-(\d+)$/i);
  if(generic)return `L${generic[1]}-${generic[2]}`;
  return id.length>18?`${id.slice(0,16)}…`:id;
}
export const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
// Share the exact sightline between the distance readout and audience camera.
// This is internal model consistency, not a metric survey of the venue.
export function audienceSightline(venue,layout,position){
  if(!venue)throw new TypeError('Current venue is required');
  const person=performer(layout,venue);if(!person)return null;
  const eye=position.map((value,index)=>value+(index===1?1.2:0));
  const target=person.map((value,index)=>value+(index===1?.875:0));
  return {eye,target,distance:distance(eye,target)};
}
export function zoomToFov(value){
  const zoom=Math.max(1,Math.min(8,Number(value)||1));
  return 2*Math.atan(Math.tan(Math.PI/6)/zoom)*180/Math.PI;
}
export const fovToZoom=fov=>Math.tan(Math.PI/6)/Math.tan(fov*Math.PI/360);
// Audience view follows the user's finger: dragging right turns right and
// dragging down looks down on touch screens.
export const seatDragDelta=(dx,dy)=>({yaw:dx*.004,pitch:dy*.003});

// Treads and one-row risers share the rendered seats' local height. A saddle
// varies across the width, while ordinary venue treads remain horizontal.
export function sectionSteps(venue,section){
  const rows=sectionRowCount(venue,section),half=sectionRenderHalfAngle(venue,section),treads=[],risers=[],walls=[];
  const slices=Math.max(4,Math.ceil(half*32));
  for(let row=0;row<rows;row++){
    const inner=row/rows,outer=(row+1)/rows,mid=(row+.5)/rows,previous=row?(row-.5)/rows:mid;
    const p=(t,l,heightRow,offset=0)=>{const a=sectionPoint(venue,section,t,l,half);a[1]=sectionPoint(venue,section,heightRow,l,half)[1]-.035+offset;return a;};
    const cuts=[...new Set([inner,outer,...(section.block?.polygon||[]).map(([,z])=>.5+(z-section.block.z)/((section.block.facing??-1)*section.block.depth)).filter(t=>t>inner+1e-8&&t<outer-1e-8)])].sort((a,b)=>a-b);
    for(let cut=0;cut<cuts.length-1;cut++)for(let i=0;i<slices;i++){
      const a=-1+i*2/slices,b=-1+(i+1)*2/slices;
      const lo=cuts[cut]+(section.block?.polygon?1e-8:0),hi=cuts[cut+1]-(section.block?.polygon?1e-8:0);
      treads.push([p(lo,a,mid),p(lo,b,mid),p(hi,b,mid),p(hi,a,mid)]);
      if(cut===0)risers.push([p(lo,a,previous,row?0:-.18),p(lo,b,previous,row?0:-.18),p(lo,b,mid),p(lo,a,mid)]);
      if(section.block?.risers){
        const wall=(a,b)=>walls.push([a,b,[b[0],-.035,b[2]],[a[0],-.035,a[2]]]);
        if(i===0)wall(p(lo,-1,mid),p(hi,-1,mid));
        if(i===slices-1)wall(p(hi,1,mid),p(lo,1,mid));
        if(row===0&&cut===0)wall(p(lo,b,mid),p(lo,a,mid));
        if(row===rows-1&&cut===cuts.length-2)wall(p(hi,a,mid),p(hi,b,mid));
      }
    }
  }
  return {treads,risers,walls};
}

export function baseSeatRecords(venue){
  if(seatCache.has(venue))return seatCache.get(venue);
  if(venue.sourceSeats)return venue.sourceSeats.map(s=>({...s,p:s.position,width:s.chairWidth/.52,tier:venue.sections.find(section=>section.id===s.section)?.tier||0,angle:s.yaw,sourceSeat:true}));
  const records=[],halves=new Map(venue.sections.map(s=>[s,sectionRenderHalfAngle(venue,s)]));
  for(const section of venue.sections){
    const half=halves.get(section),rows=sectionRowCount(venue,section),seats=sectionSeatCount(venue,section,half,rows);
    for(let r=0;r<rows;r++)for(let s=0;s<seats;s++){
      const t=(r+.5)/rows,lateral=(-.5+(s+.5)/seats)*1.8,p=sectionPoint(venue,section,t,lateral,half);
      const next=sectionPoint(venue,section,t,lateral+1.8/seats,half),spacing=Math.hypot(p[0]-next[0],p[2]-next[2]);
      const inward=sectionPoint(venue,section,Math.max(0,t-.01),lateral,half),outward=sectionPoint(venue,section,Math.min(1,t+.01),lateral,half);
      records.push({section:section.id,p,width:clamp(spacing*.78/.52,.45,1.15),tier:section.tier,row:String(r+1),seat:String(s+1),angle:section.block?((section.block.facing??-1)===-1?Math.PI:0):Math.atan2(outward[0]-inward[0],outward[2]-inward[2])});
    }
  }
  for(let tier=0;tier<venue.tiers.length;tier++){
    if(venue.geometry?.openBowl||venue.geometry?.oneSided||['fan','rear'].includes(venueShape(venue)))continue;
    const sections=venue.sections.filter(s=>s.tier===tier&&!s.block),coverage=sections.reduce((n,s)=>n+halves.get(s)*2,0);
    if(!sections.length)continue;
    const rows=tierRowCount(venue,tier),segments=Math.max(128,Math.min(224,Math.round(coverage<Math.PI?192:160)));
    for(let r=0;r<rows;r++)for(let i=0;i<segments;i++){
      const angle=-Math.PI+i/segments*Math.PI*2;
      if(sections.some(s=>Math.abs(Math.atan2(Math.sin(angle-s.angle),Math.cos(angle-s.angle)))<=halves.get(s)))continue;
      const p=sectionPoint(venue,{tier,angle,halfAngle:0},(r+.5)/rows,0,0),radial=Math.hypot(p[0],p[2]);
      records.push({section:null,p,width:clamp(radial*.04/.46,.65,1.15),tier,angle:Math.atan2(p[0],p[2])});
    }
  }
  seatCache.set(venue,records);return records;
}

export function standSurfaces(venue){
  if(surfaceCache.has(venue))return surfaceCache.get(venue);
  const result=[];
  if(venue.sourceSeats){for(const q of sourceSeatDecks(venue.sourceSeats))result.push({kind:'source-tread',points:q});}
  else {
    for(const section of venue.sections){const steps=sectionSteps(venue,section);for(const q of steps.treads)result.push({kind:'tread',section:section.id,points:q});for(const q of [...steps.risers,...steps.walls])result.push({kind:'riser',section:section.id,points:q});}
    if(!venue.geometry?.openBowl&&!venue.geometry?.oneSided&&!['fan','rear'].includes(venueShape(venue)))for(let tier=0;tier<venue.tiers.length;tier++){
      if(!venue.sections.some(s=>s.tier===tier&&!s.block))continue;
      const steps=sectionSteps(venue,{tier,angle:0,halfAngle:Math.PI});
      for(const q of [...steps.treads,...steps.risers])result.push({kind:'shell',points:q.map(p=>[p[0],p[1]-.1,p[2]])});
    }
  }
  surfaceCache.set(venue,result);return result;
}
export function stageRects(layout,venue){
  const proposed=proposedStageRects(layout,venue);
  // Source geometry is immutable. An invalid placement is hidden, never fitted.
  if(layout==='none')return [];
  if(venue.seatLayout||venue.geometry?.referenceLayout||venue.geometry?.stage||layout==='event')return stageOutsideParts(venue,layout,proposed).length?[]:proposed;
  if(!venue?.sections?.length)return stageOutsideParts(venue,layout,proposed).length?[]:proposed;
  let cache=stageCache.get(venue);if(!cache){cache=new Map();stageCache.set(venue,cache);}if(cache.has(layout))return cache.get(layout);
  const floorIds=new Set(venue.sections.filter(s=>s.block).map(s=>s.id));
  const fixed=baseSeatRecords(venue).filter(r=>!floorIds.has(r.section)),surfaces=standSurfaces(venue).filter(s=>!floorIds.has(s.section));
  // Only estimated preview stages are fitted. Retained source stages/seats are
  // returned verbatim above. Scale the whole connected rig, never individual
  // chairs or detached runway pieces, and leave a physical clearance margin.
  let result=proposed;
  for(let step=0;step<100;step++){
    const scale=1-step*.01;
    const rects=proposed.map(r=>({...r,x:r.x*scale,z:r.z*scale,w:r.w*scale,d:r.d*scale,...scale<1?{previewScale:scale}:{}}));
    const boxes=stageBoxesFromRects(layout,venue,rects).map(b=>({...b,size:[b.size[0]+.6,b.size[1]+.1,b.size[2]+.6]}));
    if(!stageOutsideParts(venue,layout,rects).length&&!boxes.some(b=>fixed.some(r=>seatIntersectsBox(r,b))||surfaces.some(s=>polygonIntersectsBox(s.points,b)))){result=rects;break;}
    if(step===99)throw new Error(`No clear preview stage for ${venue.id}/${layout}`);
  }
  cache.set(layout,result);return result;
}
export function stageReservesPosition(venue,layout,position){
  if(venue.seatLayout)return false;
  // Flat temporary seating is omitted only where this preview layout reserves
  // floor for the stage. The source seat database is never filtered or moved.
  return stageRects(layout,venue).some(r=>Math.abs(position[0]-r.x)<r.w/2+.65&&Math.abs(position[2]-r.z)<r.d/2+.65&&position[1]< (r.h??2.2)+.2);
}
