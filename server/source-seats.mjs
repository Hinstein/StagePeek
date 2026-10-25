import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';

// Import field schemas, never execute the captured third-party application.
// Source-relative coordinates are not independently measured/as-built coordinates.
export function sourceSeatStore(directory){
 const file=join(directory,'index.json'),index=existsSync(file)?JSON.parse(readFileSync(file)).venues:{},assets=new Map(),cache=new Map(),lookups=new WeakMap();
 return {
  metadata:id=>index[id]||null,
  clear(){assets.clear();cache.clear();},
  enhance(base,requested){
   const meta=index[base.id];if(!meta)return base;
   const layout=requested||meta.defaultLayout;if(!meta.layouts.some(x=>x.id===layout))return null;
   const key=JSON.stringify([base.id,layout]);if(cache.has(key))return cache.get(key);
   let data=assets.get(base.id);if(!data){data=JSON.parse(readFileSync(join(directory,base.id+'.json')));assets.set(base.id,data);}
   const variant=data.variants[layout],kai=meta.schema==='kai-cad-14',bySection=new Map(),lookup=new Map();
   const seats=variant.seats.map((r,index)=>{
    const seat={section:String(r[0]),row:String(r[1]),seat:String(r[2]),position:kai?[-r[3],r[11],-r[4]]:r.slice(3,6),
     yaw:kai?Math.atan2(r[7],r[8]):Math.atan2(-r[6],-r[7]),treadYaw:kai?Math.atan2(r[12],r[13]):Math.atan2(-r[12],-r[13]),
     level:String(kai?r[5]:r[8]),depth:kai?r[6]:r[9],chairWidth:kai?.48:r[10],rowDepth:kai?.8:r[11],
     layout,source:meta.source,identityStatus:'source-record',positionStatus:'source-coordinate',sourceRecord:{assetSha256:meta.assetSha256,index}};
    if(seat.position.length!==3||seat.position.some(x=>!Number.isFinite(x)))throw new Error(`Invalid source coordinate: ${base.id}/${index}`);
    const section=bySection.get(seat.section)||[];section.push(seat);bySection.set(seat.section,section);
    const ticket=JSON.stringify([seat.section,seat.row,seat.seat]),matches=lookup.get(ticket)||[];matches.push(seat);lookup.set(ticket,matches);return seat;
   });
   const sections=[...bySection].map(([id,records])=>{
    const center=[0,1,2].map(axis=>records.reduce((sum,r)=>sum+r.position[axis],0)/records.length),tier=Math.min(base.tiers.length-1,Math.max(0,Math.floor(center[1]/12)));
    const points=hull(records.map(r=>[r.position[0],r.position[2]])),samples=records.filter(r=>lookup.get(JSON.stringify([r.section,r.row,r.seat])).length===1).slice(0,3);
    return {id,ticketLabels:[id],tier,levelName:[...new Set(records.map(r=>r.level))].join(' / '),center,angle:Math.atan2(center[2],center[0]),halfAngle:.05,
     samples,polygon:points.map(([x,z])=>[x,center[1],z]),sourcePolygons:[{viewId:`source:${layout}:${id}`,points}],polygonStatus:'source-coordinate',positionBasis:{kind:'source-seat-coordinate',coordinateSystem:'source-model-xyz'}};
   });
   const maxAbs=axis=>seats.reduce((max,r)=>Math.max(max,Math.abs(r.position[axis])),0);
   const venue={...base,sections,ticketLabelCount:sections.length,sourceSeats:seats,seatLayouts:meta.layouts,seatLayout:{id:layout,label:meta.layouts.find(x=>x.id===layout).label,source:meta.source,assetSha256:meta.assetSha256},
    sourceStage:variant.stage||null,sourceZones:variant.zones||[],geometry:{...base.geometry,floor:[2*maxAbs(0)+12,2*maxAbs(2)+12]},
    accuracy:{...base.accuracy,position:'source-coordinate',seatDataStatus:'full-retained-asset',sourceLayout:layout,metricCalibrated:false,completeSeatInventory:false,
     coverage:`当前来源布局 ${layout}：${seats.length.toLocaleString('en-US')} 条逐座坐标，${sections.length} 个来源分区。坐标已按原始记录导入；尚无独立实测校准，亦不代表本场演出完整库存。`}};
   lookups.set(venue,lookup);cache.set(key,venue);return venue;
  },
  find(venue,section,row,seat){return lookups.get(venue)?.get(JSON.stringify([section,row,seat]))||[];}
 };
}
// Projection outlines are derived from the same X/Z as the 3D chairs.
function hull(points){
 const sorted=[...new Map(points.map(p=>[JSON.stringify(p),p])).values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 if(sorted.length<3){const [x,z]=sorted[0]||[0,0];return [[x-.4,z-.4],[x+.4,z-.4],[x+.4,z+.4],[x-.4,z+.4]];}
 const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),build=list=>{const result=[];for(const p of list){while(result.length>1&&cross(result.at(-2),result.at(-1),p)<=0)result.pop();result.push(p);}result.pop();return result;};
 return [...build(sorted),...build([...sorted].reverse())];
}
