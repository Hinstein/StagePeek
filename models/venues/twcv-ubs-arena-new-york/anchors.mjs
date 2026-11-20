import {sourceBowlDisplay} from '../../../public/concert-views/source-bowl-display.mjs';
import {stageBoxes} from '../../../public/concert-views/scene-geometry.mjs';
import {loadVenues} from '../../../server/concert-views/venues.mjs';

const venue=loadVenues(undefined,{localDrafts:true,includeResearch:true}).get('twcv-ubs-arena-new-york','ubs');
const display=sourceBowlDisplay(venue);

process.stdout.write(JSON.stringify({
  seats:display.records.map(seat=>({p:seat.p,angle:seat.angle,width:seat.width})),
  chairParts:display.records[0].chairParts,
  aisles:display.aisleSteps.map(step=>step.tread),
  banks:display.banks.map(bank=>({level:bank.level,rows:bank.rows.map(row=>({front:row.front,back:row.back}))})),
  stages:stageBoxes('ubs',venue),
}));
