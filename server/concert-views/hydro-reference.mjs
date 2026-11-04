import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';

export function loadHydroReference(root){
 const file=resolve(root,'data/research-global/2026-10-26/hydro-meo-supplement/hydro-numbering-reference.json');
 if(!existsSync(file))return null;
 const ref=JSON.parse(readFileSync(file,'utf8'));
 if(ref.schemaVersion!==1||ref.venueId!=='ovo-hydro'||ref.mapSha256!=='b589255b363f6b0e5500ae8cbb17acff87a0ef93d79022b327712ebbea56d359'||ref.completeSeatInventory!==false||ref.metricCalibrated!==false||ref.rightsDecision!=='undecided')throw Error('Invalid Hydro numbering reference');
 const ids=new Set();
 for(const r of ref.references){
  const id=[r.section,r.row,r.seat].join('/');
  if(!/^\d{3}\/[A-Z]{1,2}\/[1-9]\d*$/.test(id)||ids.has(id)||r.identityBasis!=='reference-model-manifest-match'||r.positionBasis!=='estimated-model-row-fraction'||r.eventAvailability!=='unknown'||!Number.isFinite(r.rowFraction)||r.rowFraction<0||r.rowFraction>1)throw Error('Invalid Hydro reference identity');
  ids.add(id);
 }
 if(ref.modelAnchors.artifact!=='hydro-model-numbering-anchors.json')throw Error('Invalid Hydro model anchors');
 const anchors=readFileSync(resolve(root,'data/research-global/2026-10-26/hydro-meo-supplement',ref.modelAnchors.artifact));
 if(createHash('sha256').update(anchors).digest('hex')!==ref.modelAnchors.sha256)throw Error('Hydro model anchors changed');
 const model=JSON.parse(anchors);
 if(model.sourceSha256!==ref.modelAnchors.sourceSha256||model.sourceUrl!==ref.modelAnchors.sourceUrl)throw Error('Hydro model provenance changed');
 for(const r of ref.references){
  const a=model.objects.find(a=>a.object===r.modelObject);
  if(!a||!['manifest match','regular'].includes(a.mappingStatus)||a.section!==r.section||a.row!==r.row||a.seat!==r.seat||Math.abs(r.rowFraction-(1-a.sourceFraction))>1e-10)throw Error('Hydro reference anchor mismatch');
  const fraction=(Math.atan2(a.modelPosition[1],a.modelPosition[0])-a.sectionAngles[0])/(a.sectionAngles[1]-a.sectionAngles[0]);
  if(!Number.isFinite(fraction)||Math.abs(fraction-a.sourceFraction)>1e-10)throw Error('Hydro model fraction mismatch');
 }
 if(ref.eventRows.eventId!=='hydro-event-noah-kahan-20261105'||ref.eventRows.kind!=='row-capacities-not-seat-numbers')throw Error('Invalid Hydro event row reference');
 if(ref.eventRows.artifact!=='hydro-noah-20261105-row-geometry.json')throw Error('Invalid Hydro row artifact');
 const bytes=readFileSync(resolve(root,'data/research-global/2026-10-26/hydro-meo-supplement',ref.eventRows.artifact));
 if(createHash('sha256').update(bytes).digest('hex')!==ref.eventRows.sha256)throw Error('Hydro row artifact changed');
 const rows=Object.fromEntries(JSON.parse(bytes).pages[0].segments.flatMap(c=>c.segments||[]).filter(s=>s.segmentCategory==='SECTION'&&/^\d{3}$/.test(s.name)).map(s=>[s.name,Object.fromEntries(s.segments.filter(r=>r.segmentCategory==='ROW').map(r=>[r.name,r.totalPlaces]))]));
 if(JSON.stringify(rows)!==JSON.stringify(ref.eventRows.sections))throw Error('Hydro row extraction changed');
 for(const [section,rows]of Object.entries(ref.eventRows.sections))for(const [row,count]of Object.entries(rows))if(!/^\d{3}$/.test(section)||! /^[A-Z]{1,2}$/.test(row)||!Number.isInteger(count)||count<1)throw Error('Invalid Hydro event row capacity');
 if(ref.numberedRows.artifact!=='hydro-204-numbered-rows.json')throw Error('Invalid Hydro numbered row artifact');
 const chartBytes=readFileSync(resolve(root,'data/research-global/2026-10-26/hydro-meo-supplement',ref.numberedRows.artifact));
 if(createHash('sha256').update(chartBytes).digest('hex')!==ref.numberedRows.sha256)throw Error('Hydro numbered rows changed');
 const chart=JSON.parse(chartBytes);
 if(chart.schemaVersion!==1||chart.venueId!=='ovo-hydro'||chart.section!=='204'||chart.kind!=='manually-transcribed-numbered-chart'||chart.imageSha256!==ref.numberedChart.sha256||chart.sourceUrl!==ref.numberedChart.url||chart.positionBasis!=='estimated-numbered-row-slot')throw Error('Invalid Hydro chart provenance');
 for(const row of chart.rows){
  const count=row.firstSeat-row.lastSeat+1;
  if(!/^[A-Z]$/.test(row.row)||!Number.isInteger(row.firstSeat)||!Number.isInteger(row.lastSeat)||row.lastSeat<1||count!==ref.eventRows.sections[chart.section][row.row]||row.internalGaps.length)throw Error('Invalid Hydro numbered row range');
  for(let i=0;i<count;i++){
   const seat=String(row.firstSeat-i),existing=ref.references.find(r=>r.section===chart.section&&r.row===row.row&&r.seat===seat),fraction=(i+.5)/count;
   if(existing){
    if(Math.abs(existing.rowFraction-fraction)>.025)throw Error('Hydro chart/model direction mismatch');
    continue;
   }
   const id=[chart.section,row.row,seat].join('/');
   if(ids.has(id))throw Error('Duplicate Hydro chart identity');
   ids.add(id);
   ref.references.push({section:chart.section,row:row.row,seat,rowFraction:fraction,identityBasis:'transcribed-chart-row-range',positionBasis:chart.positionBasis,eventAvailability:'unknown',sourceUrl:chart.sourceUrl});
  }
 }
 ref.numberedRows.section=chart.section;ref.numberedRows.rows=chart.rows;
 return ref;
}
