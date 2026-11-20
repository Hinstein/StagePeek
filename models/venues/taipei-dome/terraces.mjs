import {loadVenues} from '../../../server/concert-views/venues.mjs';
import {sectionRowCount,sectionSteps} from '../../../public/concert-views/geometry.mjs';

const venue=loadVenues(undefined,{localDrafts:true}).get('taipei-dome');
const banks=venue.sections.map(section=>({
  tier:section.tier,
  rows:sectionRowCount(venue,section),
  treads:sectionSteps(venue,section).treads
}));
process.stdout.write(JSON.stringify({tiers:venue.tiers,radial:venue.geometry.radial,banks}));
