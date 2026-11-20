import {loadVenues} from '../../../server/concert-views/venues.mjs';
import {sourceBowlDisplay} from '../../../public/concert-views/source-bowl-display.mjs';
import {stageBoxes} from '../../../public/concert-views/scene-geometry.mjs';

const venueId='hong-kong-coliseum';
const store=loadVenues(undefined,{localDrafts:true,includeResearch:true});
const layouts=['center','end'].map(id=>{
  const venue=store.get(venueId,id);
  const display=sourceBowlDisplay(venue);
  return {
    id,
    chairs:display.records.map(({p,angle,width})=>({p,angle,width})),
    stage:stageBoxes(id,venue),
    aisles:display.aisleSteps.map(step=>step.tread),
    rear:display.banks.filter(bank=>bank.level==='2').flatMap(bank=>bank.rows.at(-1).back),
    galleries:display.gallery.fascias.map(face=>face.slice(0,2))
  };
});

// The portable lower stands and arena chairs differ with the stage layout.
// Permanent glazing can follow the common gallery edges in both layouts.
const edgeKey=edge=>JSON.stringify(edge.map(point=>point.map(n=>Math.round(n*10000))));
const endEdges=new Set(layouts[1].galleries.map(edgeKey));
const sharedGalleries=layouts[0].galleries.filter(edge=>endEdges.has(edgeKey(edge)));
const rear=layouts[0].rear.map(point=>point.map(n=>Number(n.toFixed(4))));
process.stdout.write(JSON.stringify({
  venueId, rear, sharedGalleries,
  layouts:layouts.map(({id,chairs,stage,aisles})=>({id,chairs,stage,aisles}))
}));
