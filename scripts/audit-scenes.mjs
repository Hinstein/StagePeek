import {loadVenues} from '../server/venues.mjs';
import {seatRecords,sceneCollisions,stageBoxes} from '../public/scene-geometry.mjs';
import {stageRects,proposedStageRects,standSurfaces,stageOutsideParts} from '../public/geometry.mjs';
import {polygonIntersectsBox} from '../public/spatial.mjs';
import {writeFileSync} from 'node:fs';

const store=loadVenues(),rows=[];
for(const id of store.ids()){
  const base=store.get(id),layouts=base.seatLayouts?.length?base.seatLayouts.map(s=>s.id):['end','runway','center'];
  for(const layout of layouts){
    const v=store.get(id,layout),records=seatRecords(v,layout),hits=sceneCollisions(v,layout,records);
    const surfaces=standSurfaces(v),boxes=stageBoxes(layout,v),rects=stageRects(layout,v),proposed=proposedStageRects(layout,v);
    const surfaceHits=surfaces.filter(s=>boxes.some(b=>polygonIntersectsBox(s.points,b)));
    const outside=stageOutsideParts(v,layout,rects),blocked=proposed.length>0&&rects.length===0;
    rows.push({id,name:v.name,layout,sourceSeats:!!v.sourceSeats,chairs:records.length,
      boundaryBasis:v.sourceSeats?'seat-derived-display-extent':'estimated-model-footprint',
      physicalBoundaryVerified:false,stageStatus:blocked?'blocked-outside-model-footprint':rects.length?'model-preview':'no-stage',
      blockedSourceStage:blocked,blockedParts:blocked?stageOutsideParts(v,layout,proposed):[],
      previewScale:rects[0]?.previewScale??1,outsideStageParts:outside.length,outsideStageExamples:outside.slice(0,2),
      surfaceCollisions:surfaceHits.length,surfaceExamples:surfaceHits.slice(0,2),
      nonFinite:records.filter(s=>!s.p.every(Number.isFinite)||!Number.isFinite(s.angle)).length,
      collisions:hits.length,parts:Object.fromEntries([...new Set(hits.map(s=>s.part))].map(p=>[p,hits.filter(s=>s.part===p).length])),examples:hits.slice(0,4)});
  }
}
const failed=rows.filter(r=>r.collisions||r.nonFinite||r.surfaceCollisions||r.outsideStageParts);
const result={createdAt:new Date().toISOString(),venues:store.ids().length,layouts:rows.length,
  scope:'Rendered model checks only; estimated footprints and source seat extents do not prove physical building boundaries or event accuracy.',
  failed:failed.length,blockedSourceLayouts:rows.filter(r=>r.blockedSourceStage).length,physicalBoundaryVerified:0,rows};
writeFileSync(process.argv[2]||'docs/audits/scenes.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,rows:failed.map(({id,layout,collisions,outsideStageParts,parts})=>({id,layout,collisions,outsideStageParts,parts}))},null,2));
if(failed.length)process.exitCode=1;
