import {loadVenues} from '../../../server/concert-views/venues.mjs';
import {sourceBowlDisplay} from '../../../public/concert-views/source-bowl-display.mjs';
import {stageBoxes} from '../../../public/concert-views/scene-geometry.mjs';

const layout='uba';
const venue=loadVenues(undefined,{localDrafts:true,includeResearch:true}).get('twcv-uber-arena-berlin',layout);
const display=sourceBowlDisplay(venue);
process.stdout.write(JSON.stringify({
  chairs:display.records.map(({p,angle,width,chairParts})=>({p,angle,width,chairParts})),
  aisles:display.aisleSteps.map(step=>step.tread),
  stage:stageBoxes(layout,venue),
  banks:display.banks.map(bank=>({
    level:bank.level,
    front:bank.rows[0].front,
    rear:bank.rows.at(-1).back
  }))
}));
