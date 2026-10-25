import {readFileSync,writeFileSync,renameSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {normalizeVenueManifest,writeVenueManifest} from '../server/venue-import.mjs';

const root=new URL('..',import.meta.url).pathname;
const artistFile=join(root,'data/artist-events/the-weeknd-after-hours-til-dawn-2026.json');
const artist=JSON.parse(readFileSync(artistFile,'utf8'));
const venuesFile=join(root,'data/venues.json');
const eventsFile=join(root,'data/events.json');
const venuesData=JSON.parse(readFileSync(venuesFile,'utf8'));
const eventsData=JSON.parse(readFileSync(eventsFile,'utf8'));

function writeJson(file,value){const tmp=file+'.tmp';writeFileSync(tmp,JSON.stringify(value,null,2)+'\n',{mode:0o600});renameSync(tmp,file);}
const COUNTRY_LABELS={
  Brazil:'巴西',Denmark:'丹麦',France:'法国',Germany:'德国','Hong Kong':'中国香港',
  Indonesia:'印度尼西亚',Ireland:'爱尔兰',Italy:'意大利',Japan:'日本',Netherlands:'荷兰',
  Poland:'波兰',Portugal:'葡萄牙',Singapore:'新加坡','South Korea':'韩国',Spain:'西班牙',
  Sweden:'瑞典',Thailand:'泰国','United Kingdom':'英国'
};
const countryLabel=country=>COUNTRY_LABELS[country]||country;
function eventLayoutFor(item){
  if(item.seating?.eventSpecificMap==='official-admission-notice-linked-map')return {
    status:'reference-only',source:item.seating.mapSources?.[0]||item.sourceUrls?.[0]||null,image:null,model:null,
    eventVerification:'official-page',mapVerification:'reference',stageVerification:'unverified'
  };
  return {status:'unconfirmed',source:null,image:null,model:null,eventVerification:'official-tour-list',mapVerification:item.seating?.publicSeatMapStatus||'unavailable',stageVerification:'unverified'};
}
function manifestFor(item){
  const tiers=[[50,36,2,18,10],[70,52,16,18,12],[88,68,31,22,14]];
  const sections=[];
  for(let tier=0;tier<tiers.length;tier++)for(let i=0;i<12;i++)sections.push({
    id:`L${tier+1}-${String(i+1).padStart(2,'0')}`,
    ticketLabels:[`L${tier+1}-${String(i+1).padStart(2,'0')}`],
    sourceLabel:`${item.name} · Level ${tier+1} · reference block ${i+1}`,
    levelName:`Level ${tier+1} · reference`,tier,angle:-Math.PI/2+i*Math.PI/6,halfAngle:.17,samples:[],
    positionBasis:{kind:'identity-only-candidate',coordinateSystem:'estimated-metre-frame',sourceGeometry:'venue-reference-only'}
  });
  const source=item.publicSeatMap.sources[0];
  return {id:item.id,name:item.name,city:`${countryLabel(item.country)} · ${item.city}`,capacity:'未从本次公开事件资料确认',source,sourceTitle:'公开场馆/票务座位参考；仅身份和分区候选',sourceLinks:[...item.publicSeatMap.sources],accuracy:{sectionLabels:'identity-only-candidate',completeSeatInventory:false,metricCalibrated:false,stage:'generic',position:'estimated',geometryBasis:'identity-only-parametric',catalogStatus:'identity-only-candidate',seatDataStatus:'section-only',sourceLayout:'end',coverage:'仅导入场馆身份和示意分区；0 条逐座采样。The Weeknd 事件舞台和最终封区尚未核验。',reuse:'公开来源可访问；未建立商业图形、模型或座位数据库再分发许可。'},tiers,geometry:{shape:'oval',coordinateSystem:'profile-inner-radius',power:1,oneSided:false,floor:[100,150],tiers:[{id:'lower',name:'Level 1',steps:24},{id:'middle',name:'Level 2',steps:26},{id:'upper',name:'Level 3',steps:30}]},sections};
}

let addedVenues=0;
for(const item of artist.venues){
  if(!venuesData.venues[item.id]){
    const manifest=manifestFor(item);
    venuesData.venues[item.id]=normalizeVenueManifest(manifest);
    writeVenueManifest(join(root,'data/manual-venues'),manifest);
    addedVenues++;
  } else if(venuesData.venues[item.id].accuracy?.catalogStatus==='identity-only-candidate') {
    // Normalize generated candidate labels without touching any manually
    // calibrated venue. This keeps the country picker grouped consistently.
    const manifest=manifestFor(item);
    venuesData.venues[item.id].city=manifest.city;
    venuesData.venues[item.id].source=manifest.source;
    venuesData.venues[item.id].sourceTitle=manifest.sourceTitle;
    venuesData.venues[item.id].sourceLinks=[...manifest.sourceLinks];
    writeVenueManifest(join(root,'data/manual-venues'),manifest);
  }
}
venuesData.builtAt=new Date().toISOString();
writeJson(venuesFile,venuesData);

let addedEvents=0;
for(const item of artist.events){
  const list=eventsData.venues[item.venueId]||(eventsData.venues[item.venueId]={events:[],refreshedAt:null,attemptedAt:null,status:'candidate-import',sources:[{url:item.sourceUrls[0],parsedEvents:item.date}],failedSources:[],failures:[]});
  const existing=list.events.find(event=>event.id===item.id);
  if(existing){
    // Refresh research metadata while preserving any manually reviewed layout.
    existing.sourceUrls=[...item.sourceUrls];
    existing.seatReference=item.seating;
    if(existing.layout?.status==='unconfirmed'&&item.seating?.eventSpecificMap==='official-admission-notice-linked-map')existing.layout=eventLayoutFor(item);
    existing.artist=item.artist;existing.tour=item.tour;existing.venueName=item.venue;existing.city=item.city;existing.country=item.country;
    continue;
  }
  list.events.push({category:'music',id:item.id,venueId:item.venueId,name:'The Weeknd · After Hours Til Dawn',startDate:item.date,endDate:null,localDate:item.date,endLocalDate:item.date,datePrecision:'day',timezone:'venue-local-time',status:'scheduled',source:item.sourceUrls[0],layout:eventLayoutFor(item),artist:item.artist,tour:item.tour,venueName:item.venue,city:item.city,country:item.country,seatReference:item.seating});
  list.events.sort((a,b)=>a.localDate.localeCompare(b.localDate));
  list.refreshedAt=new Date().toISOString();
  list.attemptedAt=list.refreshedAt;
  addedEvents++;
}
eventsData.builtAt=new Date().toISOString();
writeJson(eventsFile,eventsData);
console.log(JSON.stringify({artist:artist.artist,events:artist.events.length,addedEvents,venues:artist.venues.length,addedVenues,venuesFile,eventsFile},null,2));
