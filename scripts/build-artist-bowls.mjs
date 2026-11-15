import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {sectionPoint} from '../public/concert-views/geometry.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const inputPath='data/concert-views/artist-models/bangkok-kl-anchors.json';
const bytes=readFileSync(resolve(root,inputPath));
const input=JSON.parse(bytes);
if(input.schemaVersion!==1)throw Error('Invalid artist bowl input');
for(const source of input.models){
  if(!['rajamangala','bukit-jalil'].includes(source.id))throw Error('Unknown artist bowl');
  if(createHash('sha256').update(readFileSync(resolve(root,source.source.path))).digest('hex')!==source.source.sha256)throw Error('Chart changed');
  const geometry={shape:'oval',coordinateSystem:'profile-inner-radius',power:1,oneSided:false,floor:source.floor,tiers:source.steps.map((steps,i)=>({id:String(i),name:String(i+1),steps}))};
  const model={schemaVersion:1,id:source.id,source:source.source,transcription:{path:inputPath,sha256:createHash('sha256').update(bytes).digest('hex')},method:'Codex AI visual transcription of chart section labels and pixel anchors. All radii, heights, rows and chair counts are illustrative, not surveyed; no ticket inventory is created.',geometry,tiers:source.tiers,sections:[]};
  for(const [tier,anchors] of source.anchors.entries())for(const [id,x,y] of anchors){
    const angle=Math.atan2((x-source.origin[0])*source.pixelScale[0],(y-source.origin[1])*source.pixelScale[1]);
    const peers=anchors.map(a=>Math.atan2((a[1]-source.origin[0])*source.pixelScale[0],(a[2]-source.origin[1])*source.pixelScale[1]));
    const gap=Math.min(...peers.filter(a=>a!==angle).map(a=>Math.abs(Math.atan2(Math.sin(a-angle),Math.cos(a-angle)))));
    const section={id,ticketLabels:[id],sourceLabel:id,levelName:String(tier+1),tier,angle,halfAngle:gap*.48,sourcePixel:[x,y],polygonStatus:'estimated',positionBasis:{kind:'operator-curated-anchor',coordinateSystem:'estimated-model-frame',source:source.eventUrl},samples:[]};
    section.center=sectionPoint(model,section,.5);
    section.polygon=[[0,-1],[0,1],[1,1],[1,-1]].map(([u,v])=>sectionPoint(model,section,u,v));
    model.sections.push(section);
  }
  if(new Set(model.sections.map(s=>s.id)).size!==model.sections.length)throw Error('Duplicate section');
  model.ticketLabelCount=model.sections.length;
  model.venueSource=source.eventUrl;
  model.accuracy={sectionLabels:'source-layout-reference',seatDataStatus:'section-only',geometryBasis:'source-screen-plus-parametric',position:'estimated',stage:'event-only',metricCalibrated:false,completeSeatInventory:false,coverage:`${model.sections.length} chart-labelled sections; illustrative positions and chairs, without a source seat manifest.`};
  writeFileSync(resolve(root,`data/concert-views/artist-models/${source.id}.json`),JSON.stringify(model,null,2)+'\n');
  console.log(`${source.id}: ${model.sections.length} chart-labelled sections`);
}
