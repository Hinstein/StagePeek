const TM_ORIGIN='https://app.ticketmaster.com';
const ID=/^[A-Za-z0-9_-]{4,80}$/;
const bounded=(value,max)=>typeof value==='string'?value.trim().slice(0,max):'';

function ticketmasterUrl(path,params,key){
  const url=new URL(path,TM_ORIGIN);for(const [name,value] of Object.entries(params||{}))if(value!==undefined&&value!=='')url.searchParams.set(name,String(value));
  url.searchParams.set('apikey',key);return url;
}

function normalizeEvent(raw){
  const venue=raw?._embedded?.venues?.[0]||{};
  const image=raw?.seatmap?.staticUrl||null;
  return {
    provider:'ticketmaster',providerEventId:typeof raw?.id==='string'?raw.id:null,
    name:bounded(raw?.name,240),url:typeof raw?.url==='string'?raw.url:null,
    date:raw?.dates?.start?.localDate||null,localDate:raw?.dates?.start?.localDate||null,endLocalDate:raw?.dates?.end?.localDate||raw?.dates?.start?.localDate||null,time:raw?.dates?.start?.localTime||null,localTime:raw?.dates?.start?.localTime||null,
    timezone:raw?.dates?.timezone||venue?.timezone||null,status:raw?.dates?.status?.code||null,
    venue:{providerId:bounded(venue?.id,120),name:bounded(venue?.name,180),city:bounded(venue?.city?.name,100),countryCode:bounded(venue?.country?.countryCode,3)},
    seatmap:image?{staticUrl:image,source:'ticketmaster-public-seatmap'}:null,
    classification:(raw?.classifications||[]).map(x=>x?.segment?.name).filter(Boolean).slice(0,4)
  };
}

export class TicketmasterProvider {
  constructor({apiKey='',fetch:fetcher=fetch,clock=Date.now}={}){this.apiKey=String(apiKey||'');this.fetch=fetcher;this.clock=clock;}
  get ready(){return /^[A-Za-z0-9_-]{8,200}$/.test(this.apiKey);}
  #assertReady(){if(!this.ready)throw Object.assign(new Error('Ticketmaster API is not configured'),{code:'TICKETMASTER_NOT_CONFIGURED',status:503});}
  async #get(path,params={}){
    this.#assertReady();const url=ticketmasterUrl(path,params,this.apiKey);
    const response=await this.fetch(url.href,{headers:{Accept:'application/json','User-Agent':'StagePeek/0.1 (server ticketing adapter)'},signal:AbortSignal.timeout(15_000)});
    if(!response.ok)throw Object.assign(new Error(`Ticketmaster returned ${response.status}`),{code:'TICKETMASTER_HTTP_ERROR',status:response.status});
    const payload=await response.json();if(!payload||typeof payload!=='object')throw new Error('Ticketmaster response was not an object');return payload;
  }
  async event(id){if(!ID.test(String(id||'')))throw Object.assign(new Error('Invalid Ticketmaster event id'),{code:'INVALID_TICKETMASTER_EVENT'});return normalizeEvent(await this.#get(`/discovery/v2/events/${encodeURIComponent(id)}.json`));}
  async search({keyword='',city='',countryCode='',venueId='',classificationName='',startDateTime='',endDateTime='',size=20}={}){
    const result=await this.#get('/discovery/v2/events.json',{keyword:bounded(keyword,120),city:bounded(city,80),countryCode:bounded(countryCode,3).toUpperCase(),venueId:bounded(venueId,80),classificationName:bounded(classificationName,80),startDateTime:bounded(startDateTime,40),endDateTime:bounded(endDateTime,40),size:Math.max(1,Math.min(50,Number(size)||20)),sort:'date,asc'});
    return {provider:'ticketmaster',retrievedAt:new Date(this.clock()).toISOString(),events:(result?._embedded?.events||[]).map(normalizeEvent),page:result?.page||null};
  }
  async searchVenues({keyword='',city='',countryCode='',size=20}={}){
    const result=await this.#get('/discovery/v2/venues.json',{keyword:bounded(keyword,120),city:bounded(city,80),countryCode:bounded(countryCode,3).toUpperCase(),size:Math.max(1,Math.min(50,Number(size)||20)),sort:'relevance,desc'});
    return {provider:'ticketmaster',retrievedAt:new Date(this.clock()).toISOString(),venues:(result?._embedded?.venues||[]).map(venue=>({providerId:bounded(venue?.id,120),name:bounded(venue?.name,180),city:bounded(venue?.city?.name,100),state:bounded(venue?.state?.stateCode||venue?.state?.name,100),countryCode:bounded(venue?.country?.countryCode,3),url:typeof venue?.url==='string'?venue.url:null})),page:result?.page||null};
  }
}

export function ticketingStatus(config){return {ticketmaster:{enabled:Boolean(config?.ticketmasterApiKey),mode:config?.ticketmasterApiKey?'server-adapter':'cached-only',scope:'event-metadata-and-public-seatmap-reference'}};}
