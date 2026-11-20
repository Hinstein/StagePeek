import {loadVenues} from '../../../server/concert-views/venues.mjs';
import {sourceBowlDisplay} from '../../../public/concert-views/source-bowl-display.mjs';

const venue=loadVenues(undefined,{localDrafts:true,includeResearch:true}).get('twcv-united-center-chicago','unc');
const {gallery}=sourceBowlDisplay(venue);
// The third suite level sits above the bowl. The two lower levels decorate
// the existing estimated fascia without crossing a gap in the source banks.
const suites=gallery.fascias.filter(fascia=>fascia[0][1]-fascia[3][1]<5)
  .map(([a,b,,lower])=>[a,b,lower[1]]);
process.stdout.write(JSON.stringify(suites));
