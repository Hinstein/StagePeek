import {readFileSync,writeFileSync,renameSync,mkdirSync,unlinkSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
const artist=JSON.parse(readFileSync(join(root,'data/artist-events/the-weeknd-after-hours-til-dawn-2026.json'),'utf8'));
const candidateIds=new Set(artist.venues.map(item=>item.id));
const venuesFile=join(root,'data/venues.json'),eventsFile=join(root,'data/events.json');
const venuesData=JSON.parse(readFileSync(venuesFile,'utf8')),eventsData=JSON.parse(readFileSync(eventsFile,'utf8'));
const removedVenues=Object.values(venuesData.venues).filter(v=>candidateIds.has(v.id)&&v.accuracy?.catalogStatus==='identity-only-candidate');
const removedEvents=Object.values(eventsData.venues||{}).flatMap(entry=>entry.events||[]).filter(event=>event.artist==='The Weeknd'||String(event.id||'').startsWith('weeknd-2026-'));
if(!removedVenues.length&&!removedEvents.length){console.log('Already separated; formal files and migration evidence unchanged.');process.exit(0);}
const archive=join(root,'data/research-events/quarantine',new Date().toISOString().replaceAll(':','-'));
mkdirSync(join(archive,'manual-venues'),{recursive:true});
// Persist a recoverable snapshot before any removal. Evidence never enters the product catalog.
writeFileSync(join(archive,'venues-before.json'),readFileSync(venuesFile),{flag:'wx',mode:0o600});
writeFileSync(join(archive,'events-before.json'),readFileSync(eventsFile),{flag:'wx',mode:0o600});
for(const venue of removedVenues){const manual=join(root,'data/manual-venues',`${venue.id}.json`);if(existsSync(manual))writeFileSync(join(archive,'manual-venues',`${venue.id}.json`),readFileSync(manual),{flag:'wx',mode:0o600});}
for(const venue of removedVenues){delete venuesData.venues[venue.id];const manual=join(root,'data/manual-venues',`${venue.id}.json`);if(existsSync(manual))unlinkSync(manual);}
const removedIds=new Set(removedEvents.map(event=>event.id));
for(const [venueId,entry] of Object.entries(eventsData.venues||{})){
  entry.events=(entry.events||[]).filter(event=>!removedIds.has(event.id));
  if(!entry.events.length&&entry.status==='candidate-import')delete eventsData.venues[venueId];
}
const write=(file,value)=>{const tmp=file+'.tmp';writeFileSync(tmp,JSON.stringify(value,null,2)+'\n',{mode:0o600});renameSync(tmp,file);};
venuesData.builtAt=new Date().toISOString();eventsData.builtAt=new Date().toISOString();
write(venuesFile,venuesData);write(eventsFile,eventsData);
const report={schemaVersion:1,migratedAt:new Date().toISOString(),archive,source:'the-weeknd-after-hours-til-dawn-2026',removedVenueIds:removedVenues.map(v=>v.id),removedEventIds:removedEvents.map(e=>e.id),removedVenues:removedVenues.length,removedEvents:removedEvents.length,remainingVenueCount:Object.keys(venuesData.venues).length};
mkdirSync(join(root,'docs/operations'),{recursive:true});write(join(root,'docs/operations/weeknd-candidate-separation-2026-10-25.json'),report);
console.log(JSON.stringify(report,null,2));
