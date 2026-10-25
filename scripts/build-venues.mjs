import {sectionPoint} from '../public/geometry.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {listVenueManifests,readVenueManifest,normalizeVenueManifest} from '../server/venue-import.mjs';

const root=new URL('../../',import.meta.url),out=new URL('../data/venues.json',import.meta.url);
const read=path=>JSON.parse(readFileSync(new URL(path,root),'utf8'));
const prototype=read('venue-view-prototype/venue-data.json').venues;
const reference=read('western-market-research/tottenham/virtual-venue-sections-normalized.json');
const map=read('western-market-research/tottenham/virtual-venue-map-polygons-normalized.json').polygons;
const average=xs=>xs.reduce((a,b)=>a+b,0)/xs.length;
function sourceScreenPolygons(polygons,items,layer){
  const byView=new Map();for(const p of polygons)if(p.layer===layer&&p.camera==='Aerial_Camera_Overview'){
    if(!byView.has(p.viewId))byView.set(p.viewId,[]);byView.get(p.viewId).push(p);
  }
  return items.flatMap(item=>item.views.filter(view=>!view.interiorView).flatMap(view=>(byView.get(view.viewId)||[]).map(p=>({viewId:view.viewId,points:p.points}))));
}
const coord=(v,s,t=.5,lateral=0)=>sectionPoint(v,s,t,lateral).map(x=>Math.round(x*1000)/1000);
const built={schemaVersion:1,builtAt:new Date().toISOString(),venues:{}};
for(const [id,old] of Object.entries(prototype)){
  const v={id,name:old.name,city:old.city,capacity:old.capacity,tiers:old.tiers,source:old.source,sourceTitle:old.sourceTitle,
    accuracy:{sectionLabels:'source-observed',completeSeatInventory:false,metricCalibrated:false,stage:'generic',position:'estimated',geometryBasis:'source-screen-plus-parametric',coverage:old.coverage},
    sections:old.sections.map(s=>({...s,ticketLabels:[s.id],levelName:`Level ${s.tier+1}`,samples:[]})),ticketLabelCount:old.sections.length};
  built.venues[id]=v;
}
const v=built.venues.tottenham;
v.tiers=[[81,55,3,18,10],[99,68,16,10,5],[106,75,16,24,20],[121,84,28,9,5],[140,102,33,25,17]];
v.source=reference.source;v.sourceTitle='官方关联 Virtual Venue 的分区及采样排座';
v.accuracy.coverage='217 个来源分区标识，含 WC 变体；187 个基础标识；仅部分排座有采样记录，几何尺度未校准。';
v.accuracy.sourceDate=reference.retrieved;v.accuracy.sourceCurrency=reference.currency;
v.accuracy.reuse=reference.reuse;
const viewPoints=new Map();
for(const p of map.filter(x=>x.layer==='FullStadium'&&x.camera==='Aerial_Camera_Overview')){
  const points=p.points;viewPoints.set(p.viewId,[average(points.map(x=>x[0])),average(points.map(x=>x[1]))]);
}
const grouped=new Map();
for(const section of reference.sections){if(!grouped.has(section.baseId))grouped.set(section.baseId,[]);grouped.get(section.baseId).push(section);}
const centers=new Map(),positionBases=new Map();
for(const [id,items] of grouped){const points=items.flatMap(s=>s.views.map(x=>viewPoints.get(x.viewId)).filter(Boolean));if(points.length){
  centers.set(id,[average(points.map(p=>p[0])),average(points.map(p=>p[1]))]);
  positionBases.set(id,{kind:'source-full-overview',layer:'FullStadium',camera:'Aerial_Camera_Overview',sampledViewsUsed:points.length,coordinateSystem:'screen-pixel-projection'});
}}
const points=[...centers.values()],cx=(Math.min(...points.map(p=>p[0]))+Math.max(...points.map(p=>p[0])))/2,cy=(Math.min(...points.map(p=>p[1]))+Math.max(...points.map(p=>p[1])))/2;
const scaleX=(Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])))/2,scaleY=(Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1])))/2;
const rawAngle=id=>{const p=centers.get(id);if(!p)throw new Error(`Missing source direction for Tottenham/${id}`);return Math.atan2((p[1]-cy)/scaleY,(p[0]-cx)/scaleX);};
const offsets=prototype.tottenham.sections.filter(x=>centers.has(x.id)).map(x=>x.angle-rawAngle(x.id));
const rotation=Math.atan2(average(offsets.map(Math.sin)),average(offsets.map(Math.cos)));
// The full overview omits some suites and accessible platforms. Use their own
// tier overview only where shared view IDs establish the same screen reference.
// Keep the full overview origin/scale above fixed, and never substitute angle zero.
for(const layer of ['Level100','Level200','Level300','Level400','Level500','LevelTunnel']){
  const layerPoints=new Map();
  for(const p of map.filter(x=>x.layer===layer&&x.camera==='Aerial_Camera_Overview'))
    layerPoints.set(p.viewId,[average(p.points.map(x=>x[0])),average(p.points.map(x=>x[1]))]);
  const shared=[...layerPoints.keys()].filter(key=>viewPoints.has(key));
  const coincident=shared.filter(key=>Math.hypot(...layerPoints.get(key).map((n,i)=>n-viewPoints.get(key)[i]))<.01);
  if(coincident.length<3)continue;
  for(const [id,items] of grouped){
    if(centers.has(id))continue;
    const views=items.flatMap(s=>s.views),outdoor=views.filter(v=>!v.interiorView);
    const points=outdoor.map(v=>layerPoints.get(v.viewId)).filter(Boolean);
    if(!points.length)continue;
    centers.set(id,[average(points.map(p=>p[0])),average(points.map(p=>p[1]))]);
    positionBases.set(id,{kind:'source-tier-overview',layer,camera:'Aerial_Camera_Overview',sampledViewsUsed:points.length,
      sharedReferenceViews:shared.length,coincidentReferenceViews:coincident.length,coordinateSystem:'screen-pixel-projection'});
  }
}
v.sections=[];
for(const [id,items] of grouped){
  const levelNames=[...new Set(items.flatMap(x=>x.levelNames))],level=levelNames.join(' / ');
  const tier=/South Upper Lower/.test(level)?2:/Upper|Stratus|Broadcast Booths/.test(level)?4:/Level 4|Four/.test(level)?3:/North Mid|Level 2|Premium|H Club/.test(level)?1:0;
  const sec={id,ticketLabels:items.map(x=>x.id),levelName:level,angle:rawAngle(id)+rotation,halfAngle:.025,tier,positionBasis:positionBases.get(id),samples:[]};
  sec.sourcePolygons=sourceScreenPolygons(map,items,sec.positionBasis.layer);
  sec.polygonStatus=sec.sourcePolygons.length?'source':'estimated';
  const seen=new Set();
  for(const item of items)for(const view of item.views){
    if(view.interiorView||!view.rowToken||!view.seatToken)continue;
    const key=JSON.stringify([view.section,view.rowToken,view.seatToken]);if(seen.has(key))continue;seen.add(key);
    sec.samples.push({section:view.section,row:view.rowToken,seat:view.seatToken,source:view.source,viewId:view.viewId,identityStatus:'source-sampled',positionStatus:'estimated'});
  }
  v.sections.push(sec);
}
// Original indicative geometry: source screen coordinates establish relative orientation only.
// They are not copied polygons, metric XYZ, a complete row inventory, or an as-built model.
for(let tier=0;tier<v.tiers.length;tier++){
  const sections=v.sections.filter(s=>s.tier===tier).sort((a,b)=>a.angle-b.angle),tau=2*Math.PI;
  sections.forEach((s,i)=>{
    if(sections.length>1){const prev=sections[(i+sections.length-1)%sections.length],next=sections[(i+1)%sections.length];
      const gapA=(s.angle-prev.angle+tau)%tau,gapB=(next.angle-s.angle+tau)%tau;
      s.halfAngle=Math.min(.17,Math.max(.008,Math.min(gapA,gapB)*.44));}
  });
}
// NFL sources expose sampled view identities and screen-space hit areas, not seat XYZ.
// Keep all source prefixes and WC ticket aliases; infer neither intervening seats nor floor numbers.
function importNflSamples(id,prefix,tiers){
  const ref=read(`western-market-research/${id}/${prefix}-sections-normalized.json`);
  const polygons=read(`western-market-research/${id}/${prefix}-map-polygons-normalized.json`).polygons;
  const venue=built.venues[id];venue.tiers=tiers;venue.source=ref.source;
  venue.sourceTitle='官方球队关联 Virtual Venue 的分区及采样排座';
  venue.accuracy.sourceDate=ref.retrieved;venue.accuracy.sourceCurrency=ref.currency;
  venue.accuracy.reuse=ref.reuse;venue.accuracy.sourceLayout='football';
  const groups=new Map();
  for(const s of ref.sections){if(!groups.has(s.baseId))groups.set(s.baseId,[]);groups.get(s.baseId).push(s);}
  const viewCenters=new Map();
  // Use one camera and layer consistently; separate layer maps need not share projection.
  for(const p of polygons.filter(p=>p.camera==='Aerial_Camera_Overview'&&p.layer==='FullStadium')){
    if(!viewCenters.has(p.viewId))viewCenters.set(p.viewId,[average(p.points.map(x=>x[0])),average(p.points.map(x=>x[1]))]);
  }
  const centers=new Map();
  for(const [section,items] of groups){const ps=items.flatMap(s=>s.views.map(x=>viewCenters.get(x.viewId)).filter(Boolean));
    if(!ps.length)throw new Error(`Missing official overview hit area for ${id}/${section}`);
    centers.set(section,[average(ps.map(p=>p[0])),average(ps.map(p=>p[1]))]);
  }
  const ps=[...centers.values()],xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]);
  const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
  const sx=(Math.max(...xs)-Math.min(...xs))/2,sy=(Math.max(...ys)-Math.min(...ys))/2;
  venue.sections=[];
  for(const [section,items] of groups){
    const series=Number(section.match(/\d/)[0]),tier=series-1;
    if(!tiers[tier])throw new Error(`Unknown seating tier ${id}/${section}`);
    const p=centers.get(section),sec={id:section,ticketLabels:items.map(s=>s.id),
      levelName:[...new Set(items.flatMap(s=>s.levelNames))].join(' / '),
      angle:Math.atan2((p[1]-cy)/sy,(p[0]-cx)/sx),halfAngle:.025,tier,samples:[],
      positionBasis:{kind:'source-full-overview',layer:'FullStadium',camera:'Aerial_Camera_Overview',coordinateSystem:'screen-pixel-projection'}};
    sec.sourcePolygons=sourceScreenPolygons(polygons,items,'FullStadium');
    sec.polygonStatus=sec.sourcePolygons.length?'source':'estimated';
    const seen=new Set();
    for(const item of items)for(const sample of item.views){
      if(sample.interiorView||!sample.rowToken||!sample.seatToken)continue;
      const key=JSON.stringify([sample.section,sample.rowToken,sample.seatToken]);if(seen.has(key))continue;seen.add(key);
      sec.samples.push({section:sample.section,row:sample.rowToken,seat:sample.seatToken,source:sample.source,
        viewId:sample.viewId,identityStatus:'source-sampled',positionStatus:'estimated'});
    }
    venue.sections.push(sec);
  }
  for(let tier=0;tier<tiers.length;tier++){
    const items=venue.sections.filter(s=>s.tier===tier).sort((a,b)=>a.angle-b.angle),tau=2*Math.PI;
    items.forEach((s,i)=>{if(items.length<2)return;
      const prev=items[(i+items.length-1)%items.length],next=items[(i+1)%items.length];
      s.halfAngle=Math.min(.17,Math.max(.003,Math.min((s.angle-prev.angle+tau)%tau,(next.angle-s.angle+tau)%tau)*.44));
    });
  }
  venue.ticketLabelCount=ref.sections.length;
  venue.accuracy.coverage=`${ref.sections.length} 个来源分区标识（含 WC 变体），${groups.size} 个基础标识；仅采样排座可核对。来源为橄榄球布局，演唱会封区、米制尺度及逐座清单未核实。`;
}
importNflSamples('metlife','virtual-venue',prototype.metlife.tiers);
importNflSamples('sofi','rams',[[91,63,3,21,12],[109,79,16,16,9],[125,94,27,18,10],[144,110,39,16,10],[161,125,51,20,13]]);
// Hand-curated imports are source manifests, not edits hidden inside the
// generated file. They are validated and merged on every rebuild.
for(const file of listVenueManifests(new URL('../data/manual-venues/',import.meta.url))){
  const manifest=readVenueManifest(file),venue=normalizeVenueManifest(manifest);
  if(built.venues[venue.id])throw new Error(`Manual venue conflicts with generated venue: ${venue.id}`);
  built.venues[venue.id]=venue;
}
for(const venue of Object.values(built.venues))for(const sec of venue.sections){
  sec.center=coord(venue,sec);sec.polygon=[coord(venue,sec,0,-1),coord(venue,sec,0,1),coord(venue,sec,1,1),coord(venue,sec,1,-1)];
  for(const sample of sec.samples){
    // A photo/viewpoint identity is not a seat coordinate. Do not distribute
    // sparse samples by rank: adding one record must never move another seat.
    if(sample.positionStatus==='source-coordinate'&&Array.isArray(sample.position))continue;
    sample.position=null;sample.positionStatus='unavailable';
  }
}
v.ticketLabelCount=reference.sections.length;
writeFileSync(out,JSON.stringify(built,null,2)+'\n');
console.log('Wrote',fileURLToPath(out));
console.log(JSON.stringify(Object.fromEntries(Object.entries(built.venues).map(([id,x])=>[id,{sections:x.sections.length,ticketLabels:x.ticketLabelCount,sampledSeats:x.sections.reduce((n,s)=>n+s.samples.length,0),metricCalibrated:x.accuracy.metricCalibrated}]))));
