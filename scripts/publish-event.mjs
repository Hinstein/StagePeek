import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {loadVenues} from '../server/venues.mjs';
import {PublishedEventRepository,validateEventPublication} from '../server/event-publication.mjs';
const [file,...options]=process.argv.slice(2);
if(!file)throw new Error('Usage: node scripts/publish-event.mjs <reviewed-event.json> [--publish]');
const event=JSON.parse(readFileSync(file,'utf8')),venues=loadVenues();
const report=validateEventPublication(event,venues.get(event.venueId,event.layout?.model?.seatLayoutId));
console.log(JSON.stringify(report,null,2));
if(!report.valid)process.exitCode=1;
else if(options.includes('--publish')){
  const repository=new PublishedEventRepository(fileURLToPath(new URL('../data/events-published',import.meta.url)),venues);
  console.log(JSON.stringify(repository.publish(event),null,2));
}
