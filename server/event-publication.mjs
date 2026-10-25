import {readFileSync,writeFileSync,mkdirSync,renameSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {baseSeatRecords,standSurfaces,stageOutsideParts} from '../public/geometry.mjs';
import {stageBoxesFromRects,seatIntersectsBox,polygonIntersectsBox} from '../public/spatial.mjs';

const hash=data=>createHash('sha256').update(data).digest('hex');
const https=value=>{try{return new URL(value).protocol==='https:';}catch{return false;}};
const date=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
const evidence=source=>source&&https(source.url)&&date(source.retrievedAt)&&/^[a-f0-9]{64}$/.test(source.sha256||'')&&!!source.kind&&!!source.rights;
const pointInPolygon=(point,polygon)=>{
  let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const [x,y]=polygon[i],[u,v]=polygon[j];
    if(((y>point[1])!==(v>point[1]))&&(point[0]<(u-x)*(point[1]-y)/(v-y)+x))inside=!inside;
  }
  return inside;
};
// A reviewed boundary must be convex. This deliberately rejects shapes we cannot
// validate completely, rather than accepting a rig across a concave notch.
function convexPolygon(poly){
  if(!Array.isArray(poly)||poly.length<3||poly.some(p=>!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)))return false;
  let sign=0;
  for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length],c=poly[(i+2)%poly.length];
    const cross=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);
    if(Math.abs(cross)<1e-8)return false;
    if(sign&&Math.sign(cross)!==sign)return false;sign=Math.sign(cross);
  }
  // Reject self-intersecting stars even if all local turns share a sign.
  for(let i=0;i<poly.length;i++)for(let j=i+2;j<poly.length;j++){
    if(i===0&&j===poly.length-1)continue;
    const a=poly[i],b=poly[(i+1)%poly.length],c=poly[j],d=poly[(j+1)%poly.length];
    const side=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
    if(side(a,b,c)*side(a,b,d)<=0&&side(c,d,a)*side(c,d,b)<=0)return false;
  }
  return true;
}
export function validateEventPublication(event,venue){
  const errors=[];
  if(!event||typeof event!=='object')return {valid:false,errors:['event is required']};
  if(!venue||event.venueId!==venue.id)errors.push('event must match an existing permanent venue');
  if(typeof event.id!=='string'||!event.id||!event.name||!https(event.source)||!event.identity?.eventSpecificUrl||event.source!==event.identity.eventSpecificUrl)errors.push('stable event identity and event-specific HTTPS URL required');
  if(!event.identity?.providerEventId||!event.identity?.providerVenueId||!evidence(event.identity?.source))errors.push('provider identities and retained source evidence required');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(event.localDate||'')||!date(event.localDate)||new Date(event.localDate).toISOString().slice(0,10)!==event.localDate)errors.push('valid local event date required');
  try{new Intl.DateTimeFormat('en',{timeZone:event.timezone||'INVALID'});}catch{errors.push('IANA event timezone required');}
  if(event.category!=='music'||event.verificationStatus!=='reviewed')errors.push('event must be reviewed music metadata');
  const trail=Array.isArray(event.verificationHistory)?event.verificationHistory:[];
  const history=trail.map(x=>x?.status);
  if(JSON.stringify(history)!==JSON.stringify(['candidate','source-matched','geometry-checked','reviewed'])||trail.some((x,i)=>!x?.actor||!date(x.at)||(i>0&&Date.parse(x.at)<Date.parse(trail[i-1].at))))errors.push('ordered verification history with actor and timestamp required');
  const layout=event.layout?.model;
  if(venue?.seatLayout&&layout?.seatLayoutId!==venue.seatLayout.id)errors.push('explicit matching source seat layout id required');
  if(venue?.sections?.some(s=>s.polygonStatus==='source')&&!venue.sourceSeats)errors.push('projection-only source maps need a reviewed shared metre coordinate frame before publication');
  if(!layout||layout.eventId!==event.id||layout.venueId!==event.venueId||layout.coordinateFrame!=='venue-metres')errors.push('event and venue bound layout in venue-metres required');
  if(!evidence(layout?.source)||layout?.source?.eventId!==event.id)errors.push('event-specific layout source with retrieval date, hash and rights required');
  const rects=layout?.stageRects;
  if(!Array.isArray(rects)||!rects.length||rects.some(r=>!r||![r.x,r.z,r.w,r.d,r.h,r.angle??0,r.base??0].every(Number.isFinite)||r.w<=0||r.d<=0||r.h<=0))errors.push('finite positive stage and equipment geometry required');
  if(!Array.isArray(layout?.closedSections)||layout.closedSections.some(id=>!venue?.sections?.some(s=>s.id===id)))errors.push('explicit known closed section ids required');
  const review=event.review;
  if(!review?.reviewer||!date(review?.reviewedAt)||(trail.length>0&&Date.parse(review?.reviewedAt)<Date.parse(trail.at(-1)?.at))||!review?.holdout?.independent||!evidence(review?.holdout?.source)||!Number.isFinite(review?.holdout?.error)||!Number.isFinite(review?.holdout?.tolerance)||review.holdout.tolerance<=0||review.holdout.error<0||review.holdout.error>review.holdout.tolerance)errors.push('independent holdout review with measured error and tolerance required');
  for(const key of ['stageOrientation','sectionLabels','closedSections','floorBoundary','mapOverlay','browser2d3d','mobile'])if(review?.checks?.[key]!==true)errors.push(`review check missing: ${key}`);
  const boundary=layout?.boundary;
  if(!convexPolygon(boundary?.polygon)||!evidence(boundary?.source)||boundary.coordinateFrame!=='venue-metres')errors.push('reviewed convex venue boundary and retained evidence required');
  if(!errors.length){
    if(stageOutsideParts(venue,'event',rects).length)errors.push('stage/equipment outside the model footprint');
    const boxes=stageBoxesFromRects('event',venue,rects);
    for(const box of boxes){
      const c=Math.cos(box.angle||0),s=Math.sin(box.angle||0);
      for(const a of [-1,1])for(const b of [-1,1]){
        const x=a*box.size[0]/2,z=b*box.size[2]/2;
        if(!pointInPolygon([box.center[0]+x*c+z*s,box.center[2]-x*s+z*c],boundary.polygon))errors.push('stage/equipment outside the reviewed venue boundary');
      }
    }
    const closed=new Set(layout.closedSections);
    const seats=baseSeatRecords(venue).filter(s=>!closed.has(s.section));
    if(boxes.some(box=>seats.some(seat=>seatIntersectsBox(seat,box))))errors.push('stage/equipment intersects retained seats');
    if(boxes.some(box=>standSurfaces(venue).some(surface=>polygonIntersectsBox(surface.points,box))))errors.push('stage/equipment intersects stand surfaces');
  }
  return {valid:errors.length===0,errors:[...new Set(errors)]};
}
export class PublishedEventRepository {
  constructor(directory,venues){this.directory=directory;this.venues=venues;}
  list(venueId){
    let index;try{index=JSON.parse(readFileSync(join(this.directory,'index.json'),'utf8'));}catch{return [];}
    const result=[];
    for(const entry of index.events||[]){
      if(entry.venueId!==venueId||!/^v-[a-f0-9]{64}\.json$/.test(entry.file||''))continue;
      try{
        const bytes=readFileSync(join(this.directory,entry.file));if(hash(bytes)!==entry.sha256)continue;
        const event=JSON.parse(bytes);if(event.id!==entry.eventId||event.venueId!==venueId)continue;
        const venue=this.venues.get(venueId,event.layout?.model?.seatLayoutId);
        if(!validateEventPublication(event,venue).valid)continue;
        result.push({...event,verificationStatus:'preview-published',version:entry.sha256,layout:{...event.layout,status:'preview-published',model:{...event.layout.model,id:`${event.id}:${entry.sha256}`}}});
      }catch{/* Invalid or changed data never enters the public scene. */}
    }
    return result;
  }
  publish(event){
    const report=validateEventPublication(event,this.venues.get(event.venueId,event.layout?.model?.seatLayoutId));
    if(!report.valid)throw new Error(report.errors.join('; '));
    mkdirSync(this.directory,{recursive:true});
    const bytes=JSON.stringify(event,null,2)+'\n',sha256=hash(bytes),file=`v-${sha256}.json`;
    if(!existsSync(join(this.directory,file)))writeFileSync(join(this.directory,file),bytes,{flag:'wx',mode:0o600});
    let index={schemaVersion:1,events:[]};try{index=JSON.parse(readFileSync(join(this.directory,'index.json'),'utf8'));}catch{}
    const old=index.events.find(item=>item.eventId===event.id);
    if(old?.sha256===sha256)return {eventId:event.id,sha256,file};
    index.events=index.events.filter(item=>item.eventId!==event.id);
    index.events.push({eventId:event.id,venueId:event.venueId,file,sha256,previousVersion:old?.sha256||null});
    index.publishedAt=new Date().toISOString();
    const temporary=join(this.directory,'index.json.tmp');writeFileSync(temporary,JSON.stringify(index,null,2)+'\n',{mode:0o600});renameSync(temporary,join(this.directory,'index.json'));
    return {eventId:event.id,sha256,file};
  }
}
