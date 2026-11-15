import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {curveSeatReference} from './curve-seat-reference.mjs';

// Convert retained public reference fields; never execute the reference viewer.
const directory=new URL('../data/concert-views/regional-sources/',import.meta.url);
const index={schemaVersion:1,venues:{}},manifest={schemaVersion:1,venues:{}};
for(const filename of readdirSync(new URL('raw/',directory)).filter(f=>f.endsWith('.json')).sort()){
 const id=filename.slice(0,-5);
 const name=JSON.parse(readFileSync(new URL('raw/'+filename,directory))).name||({'taipei-music-center':'台北流行音乐中心','ntu-sports-center':'台大综合体育馆','ticc-taipei':'台北国际会议中心 TICC'})[id];
 const bytes=readFileSync(new URL('raw/'+id+'.json',directory)),capture=JSON.parse(bytes),data=capture.geometry;
 const seats=[];
 const curve=id==='kaohsiung-national'?curveSeatReference(data):null;
 if(curve)seats.push(...curve.seats);
 if(id==='taipei-music-center'){
  for(const zone of data.zones)for(const [row,flat] of zone.rows)for(let i=0;i<flat.length;i+=4){
   const angle=flat[i+3]*Math.PI/180,y=zone.tier==='2F'?data.H.f2Row1+(row-1)*data.H.f2Rise:data.H.f3Row1+(row-1)*data.H.f3Rise;
   seats.push([zone.id,String(row),flat[i+2],flat[i]/100,y,flat[i+1]/100,-Math.cos(angle),-Math.sin(angle),zone.tier,0,.48,.8,-Math.cos(angle),-Math.sin(angle)]);
  }
 }
 if(id==='ntu-sports-center')for(const [section,row,seat,x,z] of data.seats.rows)seats.push([section,String(row),seat,x,0,z,0,1,'1F',0,.48,.9,0,1]);
 if(data.seats?.cols.includes('yaw')&&id!=='kaohsiung-music-center')for(const [section,row,,seat,x,y,z,yaw] of data.seats.rows){
  const label=data.sections[section];
  seats.push([label.name,row,seat,x,y,z,-Math.sin(yaw),-Math.cos(yaw),label.level,0,.48,.8,-Math.sin(yaw),-Math.cos(yaw)]);
 }
 if(id==='kaohsiung-music-center')for(const [section,row,seat,x,z,y,yaw] of data.seats.rows){
  seats.push(['2'+section,String(row),seat,x,y,z,-Math.sin(yaw),-Math.cos(yaw),'2F',0,.48,.8,-Math.sin(yaw),-Math.cos(yaw)]);
 }
 if(id==='kaohsiung-arena')for(const zone of data.zones)for(const [row,flat] of zone.rows){
  const y=zone.tier==='ret'?data.H.retH1+(row-1)*data.H.retRise
   :zone.tier==='2F'?(['207','208','209'].includes(zone.id)&&row>=26?data.H.f2eH26+(row-26)*data.H.f2eRise:data.H.f2H19+(row-19)*(['216','217','218','219','220','221','222'].includes(zone.id)?data.H.f2wRise:data.H.f2Rise))
   :zone.tier==='4F'?data.H.box4Floor+(row===1?0:data.H.box4Step)
   :zone.side==='E'?data.H.u5eH1+(row-1)*data.H.u5eRise:data.H.u5Floor+.30+(row-1)*data.H.u5Rise;
  for(let i=0;i<flat.length;i+=4){const angle=flat[i+3]*Math.PI/180;seats.push([zone.id,String(row),flat[i+2],flat[i]/100,y,flat[i+1]/100,-Math.cos(angle),-Math.sin(angle),zone.tier==='ret'?'2F':zone.tier,0,.48,.8,-Math.cos(angle),-Math.sin(angle)]);}
 }
 if(['zepp-new-taipei','clapper-studio-taipei'].includes(id))for(const zone of data.zones)for(const row of zone.rows){
  const flat=row.at(-1),label=String(row.length===4?row[1]:row[0]);
  const y=row.length===4?row[2]:data.H.blRow1+(row[0]-1)*data.H.blRise;
  for(let i=0;i<flat.length;i+=4){const angle=flat[i+3]*Math.PI/180;seats.push([zone.id,label,flat[i+2],flat[i]/100,y,flat[i+1]/100,-Math.cos(angle),-Math.sin(angle),zone.tier,0,.48,.8,-Math.cos(angle),-Math.sin(angle)]);}
 }
 // Standing floors have areas, never invented rows, tickets or chair meshes.
 const floorBounds={
  'zepp-new-taipei':[-9.5,1.8,9.5,12.8],
  'clapper-studio-taipei':[-5.3,1.8,5.3,10.8],
  'westar-taipei':[-8.2,1.8,7.8,21.5],
  'legacy-tera-taipei':[-10.7,1.8,10.7,25.5],
  'moondog-taipei':[-7.5,2.1,7.5,13.9],
  'sub-live-taipei':[-5.5,1.8,5.5,13.5]
 }[id];
 const areas=floorBounds?[{id:'GA',label:'GENERAL ADMISSION',level:'1F',polygon:[[floorBounds[0],floorBounds[1]],[floorBounds[2],floorBounds[1]],[floorBounds[2],floorBounds[3]],[floorBounds[0],floorBounds[3]]]}]:[];
 // SUB's rail samples represent standing viewpoints, not numbered chairs.
 if(id==='sub-live-taipei')for(const zone of data.zones){
  const points=zone.rows.flatMap(row=>{const flat=row.at(-1);return Array.from({length:flat.length/4},(_,i)=>[flat[i*4]/100,flat[i*4+1]/100]);});
  const xs=points.map(p=>p[0]),zs=points.map(p=>p[1]);
  areas.push({id:zone.id,label:zone.name,level:zone.tier,height:zone.rows[0][2],polygon:[[Math.min(...xs)-.3,Math.min(...zs)-.3],[Math.max(...xs)+.3,Math.min(...zs)-.3],[Math.max(...xs)+.3,Math.max(...zs)+.3],[Math.min(...xs)-.3,Math.max(...zs)+.3]]});
 }
 const metadata={source:capture.source,assetSha256:createHash('sha256').update(bytes).digest('hex'),schema:'reference-xyz-14',defaultLayout:'end',layouts:[{id:'end',label:'远端舞台',count:seats.length,sectionCount:new Set(seats.map(s=>s[0])).size+areas.length}],conversion:{script:'scripts/build-regional-reference-seats.mjs',input:'raw/'+id+'.json',coordinates:'retained reference model; not independently measured',chairWidth:.48,rowDepth:id==='ntu-sports-center'?.9:.8,dimensionsBasis:'display estimate'}};
 const variants={end:{label:'远端舞台',seats,stage:data.stage,areas,zones:areas}};
 if(curve){
  metadata.conversion={...metadata.conversion,coordinates:'derived from retained seat ranges, reference curves and reconstructed tier heights; not source XYZ',positionBasis:'reference-model-estimate',numberingBasis:'source-range-reference',excludedParts:curve.excludedParts,clippedSeats:curve.clipped};
  metadata.layouts[0].label='场馆布局';variants.end.label='场馆布局';
 }
 if(id==='kaohsiung-arena'){
  for(const [layout,mode] of Object.entries(data.modes)){
   const records=[];
   let offset=0;
   for(const zone of data.zones){
    const count=zone.rows.reduce((n,row)=>n+row[1].length/4,0);
    if(![...mode.closed,...mode.retracted].includes(zone.tier+':'+zone.id))records.push(...seats.slice(offset,offset+count));
    offset+=count;
   }
   const s=mode.stage;
   variants[layout]={label:layout==='center'?'中央舞台':'远端舞台',seats:records,stage:layout==='center'?{x:s.x,z:s.z,width:s.size,depth:s.size,height:s.deckH}:{x:0,z:(s.z+s.back)/2,width:s.width,depth:s.back-s.z,height:s.deckH},areas:[],zones:[]};
  }
  metadata.layouts=Object.entries(variants).map(([id,v])=>({id,label:v.label,count:v.seats.length,sectionCount:new Set(v.seats.map(s=>s[0])).size}));
 }
 if(id==='kaohsiung-music-center'){
  variants.end.stage={x:0,z:data.stage.deck.d/2,width:data.stage.deck.hw*2,depth:data.stage.deck.d,height:data.stage.deck.h};
  variants.end.areas=Object.values(data.floorZones).map(z=>({id:z.id,label:z.name,level:'1F',polygon:z.poly}));
  variants.end.zones=variants.end.areas;
  metadata.layouts[0].sectionCount+=variants.end.areas.length;
 }
 if(id==='taichung-opera-house')variants.end.stage={x:0,z:data.stage.house.back/2,width:data.stage.apronHalf*2,depth:Math.abs(data.stage.house.back),height:data.stage.floorY};
 if(id==='zepp-new-taipei'){
  variants.end={...variants.end,areas:[],zones:[]};
  variants.standing={label:'站席布局',seats:seats.filter(s=>s[8]==='2F'),stage:data.stage,areas,zones:areas};
  metadata.defaultLayout='standing';
  metadata.layouts.push({id:'standing',label:'站席布局',count:variants.standing.seats.length,sectionCount:new Set(variants.standing.seats.map(s=>s[0])).size+areas.length});
  metadata.layouts[0].sectionCount=new Set(seats.map(s=>s[0])).size;
 }
 writeFileSync(new URL(id+'.json',directory),JSON.stringify({metadata,variants})+'\n');
 index.venues[id]=metadata;
 manifest.venues[id]={id,name,city:capture.city||(id==='zepp-new-taipei'?'台湾 · 新北':'台湾 · 台北'),country:'台湾',source:capture.source,sourceLinks:[capture.source],tiers:[],geometry:{shape:'rectangle',floor:[80,120],tiers:[],displayBasis:'source-row-ribbons'},sections:[],accuracy:{metricCalibrated:false,completeSeatInventory:false,seatDataStatus:'full-retained-asset',position:'source-coordinate',reuse:'Reference model; rights undecided; no official event inventory'},researchOnly:true,publicationStatus:'not-published',rightsDecision:'undecided'};
 if(curve)manifest.venues[id].accuracy={...manifest.venues[id].accuracy,position:'reference-model-estimate',seatDataStatus:'source-numbering-derived-positions'};
 console.log(id,seats.length,metadata.layouts[0].sectionCount);
}
writeFileSync(new URL('index.json',directory),JSON.stringify(index,null,2)+'\n');
writeFileSync(new URL('venues.json',directory),JSON.stringify(manifest,null,2)+'\n');
