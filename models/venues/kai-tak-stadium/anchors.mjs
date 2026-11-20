import {loadVenues} from '../../../server/concert-views/venues.mjs';
import {sourceBowlDisplay} from '../../../public/concert-views/source-bowl-display.mjs';
import {stageBoxes} from '../../../public/concert-views/scene-geometry.mjs';

const venue=loadVenues(undefined,{localDrafts:true,includeResearch:true}).get('kai-tak-stadium','bowl');
const display=sourceBowlDisplay(venue);
process.stdout.write(JSON.stringify({
  chairs:display.records.map(({p,angle,width})=>({p,angle,width})),
  aisles:display.aisleSteps.map(step=>step.tread),
  stage:stageBoxes('bowl',venue),
  upperRear:display.banks.filter(bank=>bank.level==='L5U').map(bank=>bank.rows.at(-1).back),
  middleFront:display.banks.filter(bank=>bank.level==='L5L').map(bank=>bank.rows[0].front)
}));
