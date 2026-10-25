import {loadVenues} from '../server/venues.mjs';
import {seatRecords,sceneCollisions} from '../public/scene-geometry.mjs';
import {stageRects,standSurfaces} from '../public/geometry.mjs';
import {stageBoxes} from '../public/scene-geometry.mjs';
import {polygonIntersectsBox} from '../public/spatial.mjs';
import {writeFileSync} from 'node:fs';
const store=loadVenues(),rows=[];
for(const id of store.ids()){
 const base=store.get(id),layouts=base.seatLayouts?.length?base.seatLayouts.map(s=>s.id):['end','runway','center'];
 for(const layout of layouts){const v=store.get(id,layout),records=seatRecords(v,layout),hits=sceneCollisions(v,layout,records),surfaces=standSurfaces(v),boxes=stageBoxes(layout,v),surfaceHits=surfaces.filter(s=>boxes.some(b=>polygonIntersectsBox(s.points,b)));rows.push({id,name:v.name,layout,sourceSeats:!!v.sourceSeats,chairs:records.length,previewScale:stageRects(layout,v)[0]?.previewScale??1,surfaceCollisions:surfaceHits.length,surfaceExamples:surfaceHits.slice(0,2),nonFinite:records.filter(s=>!s.p.every(Number.isFinite)||!Number.isFinite(s.angle)).length,collisions:hits.length,parts:Object.fromEntries([...new Set(hits.map(s=>s.part))].map(p=>[p,hits.filter(s=>s.part===p).length])),examples:hits.slice(0,4)});}
}
const result={createdAt:new Date().toISOString(),venues:store.ids().length,layouts:rows.length,failed:rows.filter(r=>r.collisions||r.nonFinite||r.surfaceCollisions).length,rows};
writeFileSync(process.argv[2]||'docs/audits/scenes.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,rows:rows.filter(r=>r.collisions||r.nonFinite||r.surfaceCollisions).map(({id,layout,collisions,parts})=>({id,layout,collisions,parts}))},null,2));
