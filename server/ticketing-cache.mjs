import {readFileSync} from 'node:fs';

function future(event,today){return !event.localDate||event.localDate>=today;}

/**
 * Read-only cache written by scripts/ticketmaster-sync.mjs.  A cache entry is
 * deliberately separate from the venue geometry: a provider event can have a
 * static seat map without having a verified SeatPeep stage model yet.
 */
export class TicketingEventCache {
  constructor({file,clock=Date.now}={}) {
    this.file=file;this.clock=clock;
    try { this.data=JSON.parse(readFileSync(file,'utf8')); }
    catch { this.data={schemaVersion:1,provider:'ticketmaster',venues:{}}; }
  }
  list(venueId) {
    const entry=this.data.venues?.[venueId]||{events:[],refreshedAt:null,status:'not-fetched'};
    const today=new Intl.DateTimeFormat('en-CA',{timeZone:'UTC',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(this.clock()));
    const events=(entry.events||[]).map(event=>({...event,localDate:event.localDate||event.date||null,endLocalDate:event.endLocalDate||event.date||event.localDate||null,localTime:event.localTime||event.time||null})).filter(event=>future(event,today)).sort((a,b)=>String(a.localDate||'').localeCompare(String(b.localDate||'')));
    return {...entry,events};
  }
}
