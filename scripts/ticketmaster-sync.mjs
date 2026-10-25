import {mkdirSync,readFileSync,writeFileSync,renameSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {loadVenues} from '../server/venues.mjs';
import {TicketmasterProvider} from '../server/ticketing.mjs';

const args=process.argv.slice(2);
const value=name=>{const i=args.indexOf(name);return i<0?null:args[i+1]||null;};
const key=process.env.TICKETMASTER_API_KEY||'';
if(!key)throw new Error('TICKETMASTER_API_KEY is required; it is read only by this server-side script');
const provider=new TicketmasterProvider({apiKey:key});
const venues=loadVenues();
const selected=value('--venue');
const limit=Math.max(1,Math.min(197,Number(value('--limit')||197)));
const catalog=venues.catalog().filter(item=>!selected||item.id===selected).slice(0,limit);
const out=fileURLToPath(new URL('../data/ticketing/ticketmaster-events.json',import.meta.url));
let previous={schemaVersion:1,provider:'ticketmaster',generatedAt:null,venues:{}};
try{previous=JSON.parse(readFileSync(out,'utf8'));}catch{}
const started=new Date().toISOString();
let completed=0,failed=0;
for(let i=0;i<catalog.length;i+=3){
  await Promise.all(catalog.slice(i,i+3).map(async venue=>{
    try{
      const cityParts=String(venue.city||'').split(/[·,，/]/).map(part=>part.trim()).filter(part=>/^[\x00-\x7F]+$/.test(part));
      const result=await provider.search({keyword:venue.name,city:cityParts.at(-1)||'',classificationName:'music',size:50});
      const target=venue.name.toLowerCase().replace(/[^a-z0-9]+/g,'');
      const events=result.events.filter(event=>{
        const name=event.venue?.name?.toLowerCase().replace(/[^a-z0-9]+/g,'')||'';
        const city=event.venue?.city?.toLowerCase().replace(/[^a-z0-9]+/g,'')||'';
        const cityTarget=(cityParts.at(-1)||'').toLowerCase().replace(/[^a-z0-9]+/g,'');
        return (name===target||name.includes(target)||target.includes(name))&&(!cityTarget||!city||city===cityTarget||city.includes(cityTarget)||cityTarget.includes(city));
      }).map(event=>({...event,seatScopeVenueId:venue.id,matchStatus:'venue-name-candidate',layout:{status:'unconfirmed',source:event.url||null,image:event.seatmap?.staticUrl||null,model:null,eventVerification:'ticketing-api',mapVerification:event.seatmap?'reference':'unavailable',stageVerification:'unverified'}}));
      previous.venues[venue.id]={venueId:venue.id,venueName:venue.name,events,refreshedAt:new Date().toISOString(),status:'candidate'};
      completed++;
    }catch(error){
      previous.venues[venue.id]={...(previous.venues[venue.id]||{}),venueId:venue.id,venueName:venue.name,events:previous.venues[venue.id]?.events||[],attemptedAt:new Date().toISOString(),status:'failed',error:String(error.code||error.message).slice(0,180)};
      failed++;console.error(`Ticketmaster sync failed for ${venue.id}: ${error.code||error.message}`);
    }
  }));
  console.log(`Ticketmaster sync ${Math.min(i+3,catalog.length)}/${catalog.length}`);
}
previous.generatedAt=started;previous.completedAt=new Date().toISOString();previous.summary={requested:catalog.length,completed,failed};
mkdirSync(dirname(out),{recursive:true});const tmp=out+'.tmp';writeFileSync(tmp,JSON.stringify(previous,null,2)+'\n',{mode:0o600});renameSync(tmp,out);
console.log(JSON.stringify({output:resolve(out),requested:catalog.length,completed,failed}));
