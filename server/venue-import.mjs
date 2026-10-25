import {sectionPoint} from '../public/geometry.mjs';
import {mkdirSync,readFileSync,writeFileSync,renameSync,readdirSync} from 'node:fs';
import {dirname,basename,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const idPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const round=value=>Math.round(value*1000)/1000;

export function validateVenueManifest(input) {
  const errors=[],warnings=[];
  if(!input||typeof input!=='object'||Array.isArray(input))return {valid:false,errors:['manifest must be an object'],warnings:[],counts:{sections:0,ticketLabels:0,samples:0}};
  if(typeof input.id!=='string'||!idPattern.test(input.id))errors.push('id must use lowercase kebab-case');
  for(const field of ['name','city','capacity','source','sourceTitle'])if(typeof input[field]!=='string'||!input[field].trim())errors.push(`${field} is required`);
  if(typeof input.source==='string'&&!/^https:\/\//.test(input.source))errors.push('source must be an HTTPS URL');
  if(!Array.isArray(input.tiers)||input.tiers.length===0)errors.push('tiers must be a non-empty array');
  else input.tiers.forEach((tier,index)=>{if(!Array.isArray(tier)||tier.length!==5||tier.some(x=>!finite(x)))errors.push(`tiers[${index}] must contain five finite numbers`);});
  if(!Array.isArray(input.sections)||input.sections.length===0)errors.push('sections must be a non-empty array');
  const ids=new Set(),labels=new Set();let samples=0;
  for(const [index,section] of (input.sections||[]).entries()){
    if(!section||typeof section!=='object'){errors.push(`sections[${index}] must be an object`);continue;}
    if(typeof section.id!=='string'||!section.id.trim())errors.push(`sections[${index}].id is required`);
    else if(ids.has(section.id))errors.push(`duplicate section id ${section.id}`);else ids.add(section.id);
    if(!Array.isArray(section.ticketLabels)||!section.ticketLabels.length)errors.push(`sections[${index}].ticketLabels must be non-empty`);
    for(const label of section.ticketLabels||[]){if(typeof label!=='string'||!label.trim())errors.push(`sections[${index}] has an invalid ticket label`);else if(labels.has(label))errors.push(`duplicate ticket label ${label}`);else labels.add(label);}
    if(!Number.isInteger(section.tier)||section.tier<0||section.tier>=(input.tiers?.length||0))errors.push(`sections[${index}].tier is outside tiers`);
    if(!finite(section.angle)||!finite(section.halfAngle)||section.halfAngle<=0||section.halfAngle>.8)errors.push(`sections[${index}] needs finite angle and halfAngle between 0 and .8`);
    if((section.radialStart!==undefined||section.radialEnd!==undefined)&&(!finite(section.radialStart??0)||!finite(section.radialEnd??1)||(section.radialStart??0)<0||(section.radialEnd??1)>1||(section.radialEnd??1)<=(section.radialStart??0)))errors.push(`sections[${index}] has an invalid radial band`);
    if(section.block&&(!['x','z','width','depth','base','facing'].every(k=>finite(section.block[k]))||section.block.width<=0||section.block.depth<=0||![1,-1].includes(section.block.facing)))errors.push(`sections[${index}] has an invalid rectangular block`);
    if(section.block?.polygon){
      const b=section.block,poly=b.polygon;
      if(!Array.isArray(poly)||poly.length<3||poly.some(p=>!Array.isArray(p)||p.length!==2||p.some(x=>!finite(x))))errors.push(`sections[${index}] has an invalid block polygon`);
      else {
        const xs=poly.map(p=>p[0]),zs=poly.map(p=>p[1]);
        if(Math.abs(Math.max(...xs)-Math.min(...xs)-b.width)>.001||Math.abs(Math.max(...zs)-Math.min(...zs)-b.depth)>.001||Math.abs((Math.max(...xs)+Math.min(...xs))/2-b.x)>.001||Math.abs((Math.max(...zs)+Math.min(...zs))/2-b.z)>.001)errors.push(`sections[${index}] block bounds disagree with polygon`);
        const levels=[...new Set(zs)].sort((a,b)=>a-b);
        for(let j=1;j<levels.length;j++){const z=(levels[j]+levels[j-1])/2,crossings=poly.filter((p,i)=>(p[1]>z)!==(poly[(i+1)%poly.length][1]>z)).length;if(crossings!==2){errors.push(`sections[${index}] polygon must have a single span per row`);break;}}
      }
    }
    if(section.samples!==undefined&&!Array.isArray(section.samples))errors.push(`sections[${index}].samples must be an array`);
    for(const sample of section.samples||[]){samples++;if(!sample||typeof sample!=='object'||!String(sample.row||'').trim()||!String(sample.seat||'').trim())errors.push(`sections[${index}] contains an invalid sample`);}
  }
  const accuracy=input.accuracy||{};
  for(const key of ['completeSeatInventory','metricCalibrated'])if(typeof accuracy[key]!=='boolean')errors.push(`accuracy.${key} must be boolean`);
  if(accuracy.completeSeatInventory===true)warnings.push('completeSeatInventory=true requires an independent evidence review before release');
  if(accuracy.metricCalibrated===true)warnings.push('metricCalibrated=true requires retained scale and holdout validation evidence');
  if(!accuracy.geometryBasis)warnings.push('accuracy.geometryBasis is missing; use estimated, source-screen, or calibrated');
  if(!Array.isArray(input.sourceLinks)||input.sourceLinks.length===0)warnings.push('sourceLinks is empty; keep the official map and license references with the import');
  return {valid:errors.length===0,errors,warnings,counts:{sections:ids.size,ticketLabels:labels.size,samples}};
}

function position(tierData,section,t=.5,lateral=0){const [rx,rz,y,depth,rise]=tierData,a=section.angle+lateral*section.halfAngle;return [round((rx+(t-.5)*depth)*Math.cos(a)),round(y+t*rise),round((rz+(t-.5)*depth)*Math.sin(a))];}
function screenPolygon(section){const r=100+section.tier*24,cx=260+r*Math.cos(section.angle),cy=190+r*.65*Math.sin(section.angle),w=Math.max(12,34*section.halfAngle),h=14+section.tier*2;return [[round(cx-w),round(cy-h)],[round(cx+w),round(cy-h*.72)],[round(cx+w),round(cy+h)],[round(cx-w),round(cy+h*.72)]];}

export function normalizeVenueManifest(input) {
  const report=validateVenueManifest(input);if(!report.valid)throw new Error(`Invalid venue manifest: ${report.errors.join('; ')}`);
  const venue={id:input.id,name:input.name.trim(),city:input.city.trim(),capacity:input.capacity.trim(),tiers:input.tiers.map(t=>t.map(round)),geometry:input.geometry||null,source:input.source,sourceTitle:input.sourceTitle,accuracy:{...input.accuracy},sourceLinks:[...(input.sourceLinks||[])],sections:[],ticketLabelCount:report.counts.ticketLabels,importedAt:input.importedAt||new Date().toISOString()};
  for(const section of input.sections){
    const positionBasis=section.positionBasis||{kind:'operator-curated-anchor',coordinateSystem:'estimated-metre-frame',sourceGeometry:'none'};
    const normalized={id:section.id,ticketLabels:[...section.ticketLabels],levelName:section.levelName||`Level ${section.tier+1}`,angle:section.angle,halfAngle:section.halfAngle,tier:section.tier,...section.block?{block:{...section.block}}:{},...section.radialStart!==undefined?{radialStart:section.radialStart}:{},...section.radialEnd!==undefined?{radialEnd:section.radialEnd}:{},positionBasis,samples:[],polygonStatus:section.sourcePolygons?'source':'estimated',sourcePolygons:section.sourcePolygons||[{viewId:`estimated:${section.id}`,points:screenPolygon(section)}]};
    normalized.center=sectionPoint(venue,normalized).map(round);
    normalized.polygon=[[0,-1],[0,1],[1,1],[1,-1]].map(([t,l])=>sectionPoint(venue,normalized,t,l).map(round));
    if(!section.sourcePolygons)normalized.sourcePolygons=[{viewId:`estimated:${section.id}`,points:normalized.polygon.map(p=>[p[0],p[2]])}];
    for(const sample of section.samples||[]){const copy={section:sample.section||section.ticketLabels[0],row:String(sample.row),seat:String(sample.seat),source:sample.source||venue.source,identityStatus:sample.identityStatus||'source-sampled',positionStatus:sample.positionStatus||'estimated'};const hasCoordinate=sample.positionStatus==='source-coordinate'&&Array.isArray(sample.position)&&sample.position.length===3&&sample.position.every(finite);copy.position=hasCoordinate?[...sample.position]:null;copy.positionStatus=hasCoordinate?'source-coordinate':'unavailable';if(sample.sourceRecord)copy.sourceRecord={...sample.sourceRecord};normalized.samples.push(copy);}
    venue.sections.push(normalized);
  }
  venue.accuracy.coverage=venue.accuracy.coverage||`${venue.sections.length} 个导入分区；${venue.sections.reduce((n,s)=>n+s.samples.length,0)} 条排座采样。`;
  return venue;
}

export function readVenueManifest(file){return JSON.parse(readFileSync(file,'utf8'));}
export function listVenueManifests(directory){try{const dir=directory instanceof URL?fileURLToPath(directory):directory;return readdirSync(dir).filter(x=>x.endsWith('.json')).sort().map(x=>join(dir,x));}catch{return [];}}
export function writeVenueManifest(directory,manifest){mkdirSync(directory,{recursive:true,mode:0o700});const file=join(directory,`${manifest.id}.json`),tmp=file+'.tmp';writeFileSync(tmp,JSON.stringify(manifest,null,2)+'\n',{mode:0o600});renameSync(tmp,file);return file;}
