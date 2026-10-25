import {EventRepository,FEEDS} from '../server/events.mjs';
import {fileURLToPath} from 'node:url';

const repo=new EventRepository({file:fileURLToPath(new URL('../data/events.json',import.meta.url))});
const ids=process.argv[2]?[process.argv[2]]:Object.keys(FEEDS);
for(const id of ids){
  console.log('Refreshing official event metadata:',id);
  const result=await repo.refresh(id);
  console.log(JSON.stringify({venue:id,status:result.status,upcoming:result.events.length,lastSuccess:result.refreshedAt,failedSources:result.failedSources?.length||0}));
}
