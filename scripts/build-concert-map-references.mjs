import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {buildTicketMapReference,buildTicketMapDraft,digest} from '../server/concert-views/ticket-map-draft.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const manifest=JSON.parse(readFileSync(resolve(root,process.argv[2]),'utf8'));
if(manifest.schemaVersion!==1||!Array.isArray(manifest.references))throw Error('Invalid reference manifest');
const views=loadConcertViews({localDrafts:true});
const directory=resolve(root,'data/research-events/ticket-map-pipeline');
const index=JSON.parse(readFileSync(resolve(directory,'index.json'),'utf8'));
for(const recipe of manifest.references){
  const venue=views.venues.get(recipe.venueId,recipe.seatLayoutId);
  const draft=(recipe.registration?buildTicketMapDraft:buildTicketMapReference)(recipe,{venue,readSource:path=>readFileSync(resolve(root,path))});
  const bytes=JSON.stringify(draft,null,2)+'\n',sha256=digest(bytes);
  writeFileSync(resolve(directory,sha256+'.json'),bytes);
  const previous=index.layouts.find(entry=>entry.id===draft.id);
  if(previous&&!previous.localOnly)throw Error('Cannot replace a released event');
  const entry={id:draft.id,venueId:draft.venueId,seatLayoutId:draft.seatLayoutId,label:draft.event.name,dates:draft.event.dates,sha256,localOnly:true};
  if(previous)Object.assign(previous,entry);
  if(!previous)index.layouts.push(entry);
}
writeFileSync(resolve(directory,'index.json'),JSON.stringify(index,null,2)+'\n');
console.log(`Retained ${manifest.references.length} local concert seating-chart references`);
