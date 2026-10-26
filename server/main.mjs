import {openDatabase} from './store.mjs';
import {createApplication} from './app.mjs';
import {loadConfig} from './config.mjs';
import {loadVenues} from './venues.mjs';
import {EventRepository,FEEDS} from './events.mjs';
import {TicketingEventCache} from './ticketing-cache.mjs';
import {CandidateEventRepository} from './event-candidates.mjs';
import {PublishedEventRepository} from './event-publication.mjs';
import {fileURLToPath} from 'node:url';

const config=loadConfig(),db=await openDatabase(config),venues=loadVenues();
if(config.authMode==='supabase'&&(await db.prepare('SELECT version FROM schema_migrations WHERE version=3').get())?.version!==3){await db.close();throw new Error('Shared Auth schema migration 3 is required');}
const events=new EventRepository({file:fileURLToPath(new URL('../data/events.json',import.meta.url))});
const ticketingEvents=new TicketingEventCache({file:fileURLToPath(new URL('../data/ticketing/ticketmaster-events.json',import.meta.url))});
const candidateEvents=new CandidateEventRepository(fileURLToPath(new URL('../data/events-candidates',import.meta.url)));
const publishedEvents=new PublishedEventRepository(fileURLToPath(new URL('../data/events-published',import.meta.url)),venues);
const app=createApplication({db,config,venues,events,ticketingEvents,candidateEvents,publishedEvents,logger:entry=>{if(entry.status>=500)console.error(JSON.stringify(entry));}});
app.server.listen(config.port,config.host,()=>{
  console.log('StagePeek:',config.appUrl);
  console.log('Providers:',JSON.stringify({auth:config.authMode,email:config.authMode==='supabase'?app.auth.ready:app.email.ready,google:config.authMode!=='supabase'&&app.google.ready,billing:app.billing.ready,ticketmaster:Boolean(config.ticketmasterApiKey),localEmail:config.devMailbox}));
  if(config.devMailbox)console.log('Local development inbox is available to loopback clients at /api/dev/mailbox');
});
const cleanup=setInterval(async ()=>{
  try{
  const now=Date.now();
  if(config.authMode==='local'){
  (await db.prepare('DELETE FROM sessions WHERE expires_at<?').run(now));
  (await db.prepare('DELETE FROM login_tokens WHERE expires_at<?').run(now));
  (await db.prepare('DELETE FROM oauth_attempts WHERE expires_at<?').run(now));
  }
  if(config.authMode==='supabase')await db.prepare('DELETE FROM auth_flows WHERE expires_at<?').run(now);
  (await db.prepare('DELETE FROM rate_limits WHERE reset_at<?').run(now));
  }catch{console.error('Database cleanup failed');}
},60*60_000);cleanup.unref();
const refresh=setInterval(async()=>{for(const id of Object.keys(FEEDS)){try{await events.refresh(id);}catch{console.error('Event refresh failed:',id);}}},6*60*60_000);refresh.unref();
let stopping=false;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{if(stopping)return;stopping=true;clearInterval(cleanup);clearInterval(refresh);app.server.close(async()=>{await db.close();process.exit(0);});});
