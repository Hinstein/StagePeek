import {readFileSync,writeFileSync,renameSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';

export const FEEDS={
  tottenham:{host:'www.tottenhamhotspurstadium.com',urls:['https://www.tottenhamhotspurstadium.com/events/','https://www.tottenhamhotspurstadium.com/events/1021367/karol-g'],timezone:'Europe/London'},
  metlife:{host:'www.metlifestadium.com',urls:['https://www.metlifestadium.com/events','https://www.metlifestadium.com/','https://www.metlifestadium.com/events/detail/zach-bryan'],timezone:'America/New_York'},
  sofi:{host:'www.sofistadium.com',urls:['https://www.sofistadium.com/events','https://www.sofistadium.com/events/detail/chris-brown-usher-november-15','https://www.sofistadium.com/events/detail/jay-z-october-24-2026'],timezone:'America/Los_Angeles'},
  wembley:{host:'www.wembleystadium.com',urls:['https://www.wembleystadium.com/experiences/events/2026/The-Weeknd'],timezone:'Europe/London'}
};
// Public ticketing seat-map references are attached only when the exact event
// has been matched. We link to the provider's image/page and do not copy the
// image into the product or treat it as a complete seat inventory.
const LAYOUT_REFERENCES=[
  // Ticketmaster publishes the public seat-map image. The normalized stage
  // rectangles below are operator-traced from that reference image; they are
  // deliberately kept separate from the permanent venue model and carry an
  // explicit confidence/source label in the API response.
  {venueId:'tottenham',source:'https://www.tottenhamhotspurstadium.com/events/1021367/karol-g',sourcePage:'https://www.ticketmaster.co.uk/tottenham-hotspur-stadium-tickets-london/venue/434396',image:'https://s1.ticketm.net/uk/tmimages/venue/maps/uk1/32451s.gif',provider:'Ticketmaster UK',mapVerification:'reference',model:{id:'event:tottenham:karol-g',label:'Karol G · 公开座位图舞台',provider:'Ticketmaster UK',basis:'ticketmaster-seat-map',confidence:'operator-traced',mapStage:{x:.32,y:.50,w:.13,h:.24},stageRects:[{x:-.32,z:0,w:.14,d:.28},{x:-.18,z:0,w:.28,d:.07}]}},
  {venueId:'sofi',source:'https://www.sofistadium.com/events/detail/jay-z-october-24-2026',sourcePage:'https://www.ticketmaster.com/jayz30-inglewood-california-10-24-2026/event/0A0064C8E971D777',image:'https://mapsapi.tmol.io/maps/geometry/3/event/0A0064C8E971D777/staticImage?type=png&systemId=HOST',provider:'Ticketmaster',mapVerification:'reference',model:{id:'event:sofi:jay-z-30',label:'JAŸ-Z 30 · 公开座位图舞台',provider:'Ticketmaster',basis:'ticketmaster-seat-map',confidence:'operator-traced',mapStage:{x:.32,y:.50,w:.13,h:.24},stageRects:[{x:-.30,z:0,w:.13,d:.28},{x:-.16,z:0,w:.25,d:.07}]}},
  {venueId:'sofi',source:'https://www.sofistadium.com/events/detail/chris-brown-usher-november-15',sourcePage:'https://www.ticketmaster.com/the-r-b-tour-starring-usher-raymond-chris-brown-inglewood-11-15-2026/event/0A006494C5CE878D',image:'https://mapsapi.tmol.io/maps/geometry/3/event/0A006494C5CE878D/staticImage?type=png&systemId=HOST',provider:'Ticketmaster',mapVerification:'reference',model:{id:'event:sofi:rnb-tour',label:'The R&B Tour · 公开座位图舞台',provider:'Ticketmaster',basis:'ticketmaster-seat-map',confidence:'operator-traced',mapStage:{x:.32,y:.50,w:.13,h:.24},stageRects:[{x:-.29,z:0,w:.14,d:.27},{x:-.15,z:0,w:.26,d:.07}]}},
  {venueId:'metlife',source:'https://www.metlifestadium.com/events/detail/zach-bryan',sourcePage:'https://www.ticketmaster.com/zach-bryan-east-rutherford-new-jersey-05-14-2027/event/0000654CE2BEAC96',image:'https://mapsapi.tmol.io/maps/geometry/3/event/0000654CE2BEAC96/staticImage?sectionColor=c9c9c9&sectionLevel=true&systemId=HOST',provider:'Ticketmaster',mapVerification:'reference',model:{id:'event:metlife:zach-bryan',label:'Zach Bryan · 公开座位图舞台',provider:'Ticketmaster',basis:'ticketmaster-seat-map',confidence:'operator-traced',mapStage:{x:.32,y:.50,w:.13,h:.24},stageRects:[{x:-.31,z:0,w:.14,d:.28},{x:-.17,z:0,w:.27,d:.07}]}},
  {venueId:'metlife',source:'https://www.metlifestadium.com/events/detail/bon-jovi',sourcePage:'https://www.ticketmaster.com/bon-jovi-forever-tour-east-rutherford-new-jersey-07-15-2027/event/00006550B4D5AF70',image:null,provider:'Ticketmaster',mapVerification:'unavailable'}
];
function layoutReference(venueId,source){
  const match=LAYOUT_REFERENCES.find(x=>x.venueId===venueId&&canonical(source,venueId)===canonical(x.source,venueId));
  return match?{status:match.mapVerification==='reference'?'reference-only':'unconfirmed',source:match.mapVerification==='reference'?match.sourcePage:null,image:match.image,provider:match.provider,model:match.model||null,eventVerification:'official-page',mapVerification:match.mapVerification,stageVerification:match.model?'operator-traced':'unverified'}: {status:'unconfirmed',source:null,image:null,model:null,eventVerification:'official-page',mapVerification:'unavailable',stageVerification:'unverified'};
}
const decode=value=>String(value).replace(/&(?:quot|#34);/g,'"').replace(/&(?:apos|#39);/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(_,n)=>{const c=Number(n);return c<=0x10ffff?String.fromCodePoint(c):'';});
function attrs(tag){const out={};for(const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))out[m[1].toLowerCase()]=decode(m[2]??m[3]);return out;}
function official(url,venueId){const u=new URL(url);if(u.protocol!=='https:'||u.hostname!==FEEDS[venueId]?.host||u.port||u.username||u.password)throw new Error('Only the official venue HTTPS host is allowed');return u;}
function canonical(url,venueId){const u=official(url,venueId);u.hash='';u.search='';if(u.pathname!=='/')u.pathname=u.pathname.replace(/\/+$/,'');return u.href;}
const hasOffset=value=>/(?:Z|[+-]\d\d:?\d\d)$/i.test(value);
function localDay(value,venueId){return !hasOffset(value)?value.slice(0,10):new Intl.DateTimeFormat('en-CA',{timeZone:FEEDS[venueId].timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));}

export async function fetchOfficial(url,venueId,fetcher=fetch) {
  let current=official(url,venueId);
  for(let i=0;i<4;i++){
    const response=await fetcher(current.href,{redirect:'manual',headers:{'User-Agent':'SeatPeepResearch/0.1 (public event metadata)','Accept':'text/html'},signal:AbortSignal.timeout(15_000)});
    if([301,302,303,307,308].includes(response.status)){current=official(new URL(response.headers.get('location'),current).href,venueId);continue;}
    if(!response.ok)throw new Error('Official event page returned '+response.status);
    if(Number(response.headers.get('content-length')||0)>3_000_000)throw new Error('Official page too large');
    const reader=response.body?.getReader();if(!reader)return '';
    const chunks=[];let count=0;
    try{for(;;){const part=await reader.read();if(part.done)break;count+=part.value.length;if(count>3_000_000)throw new Error('Official page too large');chunks.push(Buffer.from(part.value));}}
    finally{await reader.cancel();}
    return Buffer.concat(chunks).toString('utf8');
  }
  throw new Error('Too many official redirects');
}

export function parseEvents(html,source,venueId) {
  official(source,venueId);const candidates=[];let title='';
  for(const tag of html.matchAll(/<meta\b[^>]*>/gi)){const a=attrs(tag[0]);if(a.property==='og:title')title=a.content||'';}
  const walk=value=>{if(Array.isArray(value))return value.forEach(walk);if(!value||typeof value!=='object')return;
    const types=[value['@type']].flat();if(types.some(t=>typeof t==='string'&&/(?:^|\/)(?:MusicEvent|Event|Festival)$/.test(t)))candidates.push(value);
    for(const [key,child] of Object.entries(value))if(key!=='@context'&&child&&typeof child==='object')walk(child);
  };
  for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
    if(attrs(match[1]).type!=='application/ld+json')continue;try{walk(JSON.parse(match[2]));}catch{/* Preserve other valid structured blocks. */}
  }
  if(!candidates.some(x=>x.startDate))for(const tag of html.matchAll(/<[^>]+\bdata-config=(?:"[^"]*"|'[^']*')[^>]*>/gi)){
    try{const config=JSON.parse(attrs(tag[0])['data-config']);if(config.EventStartDate)candidates.push({'@type':'Event',name:title,startDate:config.EventStartDate,endDate:config.EventEndDate,url:source,eventStatus:config.EventStatus});}catch{}
  }
  const events=[];
  for(const event of candidates){
    const name=typeof event.name==='string'?decode(event.name).replace(/<[^>]+>/g,'').trim():'';
    if(!name||name.length>250||/\bvs\.?\s|\bNFL\b|\bArmy.?Navy\b|\bSupercross\b|\bMonster Jam\b|\bWorld Cup\b|\bStadium Tours?\b|\bFootball\b|\bUSBands Championships\b/i.test(name))continue;
    const start=typeof event.startDate==='string'?event.startDate:'';if(!/^\d{4}-\d\d-\d\d(?:T.*)?$/.test(start)||!Number.isFinite(Date.parse(start)))continue;
    let url;try{url=canonical(new URL(event.url||source,source).href,venueId);}catch{continue;}
    // Date-only values remain local dates. Offset timestamps are formatted in the venue timezone.
    const localDate=localDay(start,venueId);
    const end=typeof event.endDate==='string'&&Number.isFinite(Date.parse(event.endDate))&&Date.parse(event.endDate)>=Date.parse(start)?event.endDate:null;
    const endLocalDate=end?localDay(end,venueId):localDate;
    const status=/cancel/i.test(event.eventStatus||'')?'canceled':/postpon/i.test(event.eventStatus||'')?'postponed':/reschedul/i.test(event.eventStatus||'')?'rescheduled':'scheduled';
    const category=[event['@type']].flat().some(t=>String(t).endsWith('MusicEvent'))||/\b(?:concert|music|singer|rapper|band|tour)\b/i.test(event.description||'')?'music':'unconfirmed';
    events.push({category,id:createHash('sha256').update(venueId+'|'+url+'|'+start).digest('hex').slice(0,24),venueId,name,startDate:start,endDate:end,localDate,endLocalDate,datePrecision:start.length===10?'day':hasOffset(start)?'source-timestamp':'venue-local-time',timezone:FEEDS[venueId].timezone,status,source:url,layout:layoutReference(venueId,url)});
  }
  return [...new Map(events.map(x=>[x.id,x])).values()];
}

function discover(html,base,venueId){const result=[];for(const match of html.matchAll(/<a\b[^>]*>/gi)){
  const href=attrs(match[0]).href;if(!href)continue;try{const u=official(new URL(href,base).href,venueId);u.hash='';u.search='';
    if((venueId==='tottenham'?/^\/events\/\d+\/[^/]+\/?$/:venueId==='metlife'?/^\/events\/detail\/[^/]+\/?$/:/^\/events\/(?:detail\/)?[^/]+\/?$/).test(u.pathname))result.push(u.href);
  }catch{}
}return [...new Set(result.map(x=>canonical(x,venueId)))];}

export class EventRepository {
  constructor({file,fetch:fetcher=fetch,clock=Date.now}){this.file=file;this.fetch=fetcher;this.clock=clock;try{this.data=JSON.parse(readFileSync(file,'utf8'));}catch{this.data={schemaVersion:1,venues:{}};}this.running=new Map();}
  list(id){const entry=this.data.venues[id]||{events:[],refreshedAt:null,status:'not-fetched'};
    const today=new Intl.DateTimeFormat('en-CA',{timeZone:FEEDS[id]?.timezone||'UTC',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(this.clock()));
    const events=entry.events.map(x=>({...x,layout:(x.layout?.status==='reference-only'&&x.layout?.mapVerification==='reference')?x.layout:layoutReference(id,x.source)}));
    // Research-package imports are intentionally browsable after the event
    // date: they are the historical catalog the operator asked us to retain,
    // rather than a live venue calendar. Official venue feeds keep the normal
    // upcoming-only behavior and report past items through archiveCount.
    const archived=events.filter(x=>(x.endLocalDate||x.localDate)<today);
    const visible=entry.status==='candidate-import'?events:events.filter(x=>(x.endLocalDate||x.localDate)>=today);
    return {...entry,events:visible.sort((a,b)=>a.localDate.localeCompare(b.localDate)),archiveCount:archived.length};}
  persist(){mkdirSync(dirname(this.file),{recursive:true});const temporary=this.file+'.tmp';writeFileSync(temporary,JSON.stringify(this.data,null,2)+'\n');renameSync(temporary,this.file);}
  async refresh(id,urls=FEEDS[id]?.urls){
    if(this.running.has(id))return this.running.get(id);
    const job=this.performRefresh(id,urls);this.running.set(id,job);try{return await job;}finally{this.running.delete(id);}
  }
  async performRefresh(id,urls){
    if(!FEEDS[id]||!Array.isArray(urls))throw new Error('Unknown official event feed');
    const queue=[...urls],seen=new Set(),events=[],sources=[],failed=[],failures=[];
    const previous=this.data.venues[id];
    while(queue.length&&seen.size<30){const url=queue.shift();if(seen.has(url))continue;seen.add(url);
      try{const html=await fetchOfficial(url,id,this.fetch);const parsed=parseEvents(html,url,id);
        if(!parsed.length&&previous?.events.some(x=>canonical(x.source,id)===canonical(url,id)))throw new Error('Cached event detail no longer parses; retained for review');
        events.push(...parsed);sources.push({url,parsedEvents:parsed.length});queue.push(...discover(html,url,id).filter(u=>!seen.has(u)));}
      catch(error){failed.push(url);failures.push({url,reason:error.name==='TimeoutError'?'timeout':String(error.message).slice(0,180)});}
    }
    const incomplete=failed.length>0||queue.some(u=>!seen.has(u));
    const now=new Date(this.clock()).toISOString();
    if(events.length){
      const retained=incomplete?(previous?.events||[]).map(x=>({...x,retainedFromCache:true})):[];
      this.data.venues[id]={events:[...new Map([...retained,...events.map(x=>({...x,verifiedAt:now,retainedFromCache:false}))].map(x=>[x.id,x])).values()],refreshedAt:now,attemptedAt:now,status:incomplete?'partial':'current',sources,failedSources:failed,failures,crawlLimitReached:queue.some(u=>!seen.has(u))};
    }
    else{this.data.venues[id]={...(previous||{events:[],refreshedAt:null}),attemptedAt:now,status:previous?.events?.length?'stale':failed.length?'unavailable':'needs-review',failedSources:failed,failures};}
    this.persist();return this.list(id);
  }
}
