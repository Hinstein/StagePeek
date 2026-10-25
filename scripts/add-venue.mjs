import {readVenueManifest,validateVenueManifest,normalizeVenueManifest,writeVenueManifest} from '../server/venue-import.mjs';
import {loadVenues} from '../server/venues.mjs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';

const file=process.argv[2],publish=process.argv.includes('--publish');
if(!file){console.error('Usage: node scripts/add-venue.mjs <manifest.json> [--publish]');process.exit(2);}
let manifest;try{manifest=readVenueManifest(file);}catch(error){console.error('Cannot read manifest:',error.message);process.exit(2);}
const report=validateVenueManifest(manifest);console.log(JSON.stringify(report,null,2));
if(!report.valid)process.exit(1);
if(!publish){console.log('Dry run only. Add --publish to write data/venues.json and data/manual-venues/.');process.exit(0);}
try{
  const venue=loadVenues().publish(manifest);
  console.log(`Published ${venue.id}: ${venue.sections.length} sections, ${venue.ticketLabelCount} ticket labels, ${venue.sections.reduce((n,s)=>n+s.samples.length,0)} samples.`);
  console.log('Restart the service if it does not expose the new catalog immediately.');
}catch(error){console.error(error.message);process.exit(1);}
