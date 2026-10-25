import {readFileSync,writeFileSync,renameSync,mkdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root=fileURLToPath(new URL('..',import.meta.url));
const artistFile=join(root,'data/artist-events/the-weeknd-after-hours-til-dawn-2026.json');
const artist=JSON.parse(readFileSync(artistFile,'utf8'));
const researchDir=join(root,'data/research-events');
const candidateDir=join(root,'data/events-candidates');
const publishedDir=join(root,'data/events-published');

function writeJson(file,value){const tmp=file+'.tmp';writeFileSync(tmp,JSON.stringify(value,null,2)+'\n',{mode:0o600});renameSync(tmp,file);}
function candidateEvent(item){return {
  category:'music',id:item.id,venueId:item.venueId,name:'The Weeknd · After Hours Til Dawn',
  startDate:item.date,endDate:null,localDate:item.date,endLocalDate:item.date,datePrecision:'day',
  timezone:null,status:'candidate',verificationStatus:'candidate',source:item.sourceUrls[0],
  sourceUrls:[...item.sourceUrls],artist:item.artist,tour:item.tour,venueName:item.venue,city:item.city,country:item.country,
  identity:{providerEventId:null,providerVenueId:null,eventSpecificUrl:null},
  verificationNotes:['Retained research claims; individual event identity, IANA timezone, source capture and stage remain unverified.'],
  seatReference:item.seating,eventLayout:{status:'unconfirmed',eventId:item.id,stageRects:[],closedSections:[],
    sourceKind:item.seating?.eventSpecificMap==='official-admission-notice-linked-map'?'official-event-map-reference':'venue-reference',
    stageVerification:'unverified',mapVerification:item.seating?.eventSpecificMap==='official-admission-notice-linked-map'?'reference':'unavailable'}
};}

mkdirSync(researchDir,{recursive:true,mode:0o700});
mkdirSync(candidateDir,{recursive:true,mode:0o700});
mkdirSync(publishedDir,{recursive:true,mode:0o700});
const bytes=readFileSync(artistFile);
const packageHash=createHash('sha256').update(bytes).digest('hex');
const researchFile=`the-weeknd-${packageHash}.json`;
if(!existsSync(join(researchDir,researchFile)))writeFileSync(join(researchDir,researchFile),bytes,{flag:'wx',mode:0o600});
const candidateFile=join(candidateDir,'the-weeknd-after-hours-til-dawn-2026.json');
let previous=null;try{previous=JSON.parse(readFileSync(candidateFile,'utf8'));}catch{}
const now=new Date().toISOString();
const candidate={schemaVersion:1,status:'candidate',artist:artist.artist,tour:artist.tour||'After Hours Til Dawn Stadium Tour',
  window:artist.window||{start:'2026-04-25',end:'2026-10-25',timezone:'venue-local'},generatedAt:now,
  sourcePackage:`../research-events/${researchFile}`,sourcePackageSha256:packageHash,sourceRetrievedAt:null,
  verificationNotes:['Hash describes the retained local research JSON, not a freshly captured official page.'],
  venues:artist.venues.map(v=>({...v,verificationStatus:'candidate',catalogGeometry:'not-created'})),
  events:artist.events.map(item=>(previous?.sourcePackageSha256===packageHash?previous.events?.find(event=>event.id===item.id):null)||candidateEvent(item))};
if(previous?.sourcePackageSha256!==packageHash||!previous?.sourcePackage?.includes(packageHash))writeJson(candidateFile,candidate);
let index={schemaVersion:1,sets:[]};try{index=JSON.parse(readFileSync(join(candidateDir,'index.json'),'utf8'));}catch{}
if(!index.sets.some(set=>set.id==='the-weeknd-after-hours-til-dawn-2026')){index.sets.push({id:'the-weeknd-after-hours-til-dawn-2026',file:'the-weeknd-after-hours-til-dawn-2026.json',status:'candidate',events:candidate.events.length,venues:candidate.venues.length});writeJson(join(candidateDir,'index.json'),index);}
if(!existsSync(join(publishedDir,'index.json')))writeJson(join(publishedDir,'index.json'),{schemaVersion:1,publishedAt:null,events:[]});
console.log(JSON.stringify({artist:artist.artist,events:candidate.events.length,venues:candidate.venues.length,researchDir,candidateDir,publishedDir,productDataChanged:false},null,2));
