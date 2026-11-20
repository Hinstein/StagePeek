import {loadVenues} from '../../../server/concert-views/venues.mjs';
import {sourceBowlDisplay} from '../../../public/concert-views/source-bowl-display.mjs';
import {stageBoxes} from '../../../public/concert-views/scene-geometry.mjs';

const venueId='taipei-arena';
const store=loadVenues(undefined,{localDrafts:true,includeResearch:true});
const layouts=store.get(venueId).seatLayouts.map(({id})=>{
  const venue=store.get(venueId,id);
  const display=sourceBowlDisplay(venue);
  return {
    id,
    chairs:display.records.map(({p,angle,width})=>({p,angle,width})),
    stage:stageBoxes(id,venue),
    aisles:display.aisleSteps.map(step=>step.tread),
    backs:display.banks.filter(bank=>bank.level==='4').map(bank=>bank.rows.at(-1).back),
    galleries:display.gallery.fascias.map(face=>face.slice(0,2)),
    architecture:[...display.treads,...display.risers,...display.walls,...display.gallery.decks,...display.gallery.fascias]
  };
});

// Moveable seating changes with the stage. Glazing follows the permanent edges
// where both plans share the same first-row profile.
const edgeKey=edge=>JSON.stringify(edge.map(p=>p.map(n=>Math.round(n*10000))));
const galleryKeys=new Set(layouts[1].galleries.map(edgeKey));
const galleries=layouts[0].galleries.filter(edge=>galleryKeys.has(edgeKey(edge)));
const backs=layouts[0].backs;
const facadeAnchors=layouts.flatMap(layout=>layout.architecture.flat());
process.stdout.write(JSON.stringify({
  venueId, backs, galleries, facadeAnchors,
  layouts:layouts.map(({id,chairs,stage,aisles})=>({id,chairs,stage,aisles}))
}));
