// Bounded live experiment. No keys or raw API URLs containing keys are logged.
// Run from the repository root. Does not write the published event catalog.
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const output = 'data/research-pipelines/jayz-sofi-2026-10-24';
mkdirSync(output, {recursive:true});
const hash = body => createHash('sha256').update(body).digest('hex');
const report = {schemaVersion:1, startedAt:new Date().toISOString(), requests:[]};
const write = (name, data) => writeFileSync(`${output}/${name}.json`, JSON.stringify(data,null,2)+'\n');
async function request(id, url, {headers={}, binary=false}={}) {
  const startedAt = new Date().toISOString();
  const safe = new URL(url); for(const name of ['apikey','key']) safe.searchParams.delete(name);
  try {
    const response = await fetch(url, {headers:{'User-Agent':'SeatPeepResearch/0.1', ...headers}, signal:AbortSignal.timeout(18000)});
    const body = Buffer.from(await response.arrayBuffer());
    const record = {id, url:safe.href, finalOrigin:new URL(response.url).origin, startedAt,
      status:response.status, ok:response.ok, bytes:body.length, sha256:hash(body), contentType:response.headers.get('content-type')};
    report.requests.push(record);
    if (!response.ok) return null;
    return binary ? body : body.toString('utf8');
  } catch(error) {
    report.requests.push({id, url:safe.href, startedAt, ok:false, status:null, error:error.cause?.code||error.name});
    return null;
  }
}
const appendKey = (url, name, key) => {if(!key)return url;const u=new URL(url);u.searchParams.set(name,key);return u.href;};
const tmKey = process.env.TICKETMASTER_API_KEY;
const braveKey = process.env.BRAVE_SEARCH_API_KEY || process.env.BRAVE_API_KEY;
const youtubeKey = process.env.YOUTUBE_API_KEY;
report.credentials = {ticketmaster:Boolean(tmKey),brave:Boolean(braveKey),youtube:Boolean(youtubeKey)};

// One bounded event search per provider, not an unrestricted crawler.
const tm = await request('ticketmaster-discovery',appendKey('https://app.ticketmaster.com/discovery/v2/events.json?keyword=JAY-Z&venueId=KovZ917ACh0&size=5','apikey',tmKey));
if(tm) {const data=JSON.parse(tm);write('ticketmaster-live-events', {retrievedAt:new Date().toISOString(),events:(data._embedded?.events||[]).map(x=>({id:x.id,name:x.name,url:x.url,dates:x.dates,venues:x._embedded?.venues?.map(v=>({id:v.id,name:v.name,city:v.city,country:v.country})),seatmap:x.seatmap})),page:data.page});}
const brave = await request('brave-search','https://api.search.brave.com/res/v1/web/search?q=JAY-Z%20SoFi%20Stadium%20October%2024%202026%20entrance%20seat%20view&count=5',{headers:braveKey?{'X-Subscription-Token':braveKey}:{}});
if(brave) {const data=JSON.parse(brave);write('brave-live-results',{retrievedAt:new Date().toISOString(),results:(data.web?.results||[]).map(x=>({title:x.title,url:x.url,description:x.description}))});}
const youtube = await request('youtube-data-search',appendKey('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=JAY-Z%20SoFi%20October%2024%202026%20seat%20view','key',youtubeKey));
if(youtube) {const data=JSON.parse(youtube);write('youtube-live-results',{retrievedAt:new Date().toISOString(),items:(data.items||[]).map(x=>({videoId:x.id?.videoId,title:x.snippet?.title,channelTitle:x.snippet?.channelTitle,publishedAt:x.snippet?.publishedAt}))});}

const official = 'https://www.sofistadium.com/events/detail/jay-z-october-24-2026';
const pages = {};
for(const [id,url] of Object.entries({event:official,guide:'https://www.sofistadium.com/a-z-guide',maps:'https://www.sofistadium.com/plan-your-visit/maps'})) {
  pages[id] = await request(`official-${id}`,url);
}
const blocks = [...(pages.event||'').matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap(match=>{try{return [JSON.parse(match[1])];}catch{return [];}});
const event = blocks.find(x=>['MusicEvent','Event'].includes(x['@type']));
const venue = blocks.find(x=>x['@type']==='StadiumOrArena');
write('official-facts', {retrievedAt:new Date().toISOString(), event:event?{name:event.name.trim(),startDate:event.startDate,endDate:event.endDate,url:event.url,location:event.location,ticketUrl:event.offers?.url}:null,
  venue:venue?{name:venue.name,url:venue.url,address:venue.address,geo:venue.geo}:null,
  entranceDirections:[...(pages.guide||'').matchAll(/<li[^>]*>\s*Entry\s+(\d+):\s*([^<]+)<\/li>/gi)].map(x=>({entry:x[1],description:x[2].trim(),scope:'venue-general-not-event-gate-assignment'})),
  guideLinks:[...(pages.event||'').matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].filter(x=>/plan-your-visit\/(?:maps|stadium-policies|accessibility|parking-and-transportation)/.test(x[1])).map(x=>({url:new URL(x[1].replaceAll('&amp;','&'),official).href,label:x[2].replace(/<[^>]*>/g,'').replaceAll('&amp;','&').trim()})).filter(x=>x.label).filter((x,i,a)=>a.findIndex(y=>y.url===x.url)===i),
  mapLinks:[...(pages.maps||'').matchAll(/(?:href|src)=["']([^"']+\.(?:pdf|png|jpg|jpeg)(?:\?[^"']*)?)["']/gi)].map(x=>new URL(x[1],official).href).filter(x=>!/(?:logo|favicon|touch-icon)/i.test(x))});

const cacheFile='data/ticketing/ticketmaster-events.json';
const cache=JSON.parse(readFileSync(cacheFile,'utf8'));
const cachedEvent=cache.venues.sofi.events.find(x=>x.date==='2026-10-24'&&x.url.includes('0A0064C8E971D777'));
write('ticketmaster-cache-reference',{mode:'existing-local-cache-not-live-api',cacheFile,cacheHash:hash(readFileSync(cacheFile)),retrievedAt:cache.venues.sofi.refreshedAt,event:cachedEvent});
if(cachedEvent?.seatmap?.staticUrl) {
  const image = await request('ticketmaster-public-seatmap',cachedEvent.seatmap.staticUrl,{binary:true});
  if(image) writeFileSync('/tmp/seatpeep-pilot-seatmap.png',image); // analysis only; never bundled into preview
}
const videos=[];
for(const id of ['NKs2ljKPGkk','pREUi_c7bUQ']) {
  const url = 'https://www.youtube.com/watch?v='+id;
  const data = await request('youtube-oembed-'+id,'https://www.youtube.com/oembed?format=json&url='+encodeURIComponent(url));
  if(data) {const meta=JSON.parse(data);videos.push({videoId:id,url,title:meta.title,author:meta.author_name,authorUrl:meta.author_url,provider:'youtube-oembed',discovery:'manual-web-search-fallback-not-Brave-or-YouTube-Data-API',scope:'same-venue-different-event',eventMatch:false,exactSeatMatch:false,position:null,rights:'original-link-only'});}
}
write('video-references',{retrievedAt:new Date().toISOString(),videos});
report.completedAt=new Date().toISOString();
report.authenticatedCombinationPassed=['ticketmaster-discovery','brave-search','youtube-data-search'].every(id=>report.requests.find(r=>r.id===id)?.ok);
write('fetch-report',report);
console.log(JSON.stringify({output,authenticatedCombinationPassed:report.authenticatedCombinationPassed,requests:report.requests.map(({id,status,error})=>({id,status,...(error?{error}:{})}))},null,2));
