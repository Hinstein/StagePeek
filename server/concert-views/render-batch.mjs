import {readFileSync} from 'node:fs';

const o2Id='twcv-the-o2-arena-london';

function finite(value){return typeof value==='number'&&Number.isFinite(value);}

export function loadRenderBatch(file=new URL('../../data/render-batch/tiers.json',import.meta.url)){
  const data=JSON.parse(readFileSync(file,'utf8'));
  const entry=data.venues?.[o2Id];
  if(data.schemaVersion!==1||data.status!=='local-research-v0'||data.publicationStatus!=='not-published'||data.rightsStatus!=='undecided')throw new Error('Invalid render batch status');
  if(Object.keys(data.venues||{}).some(id=>id!==o2Id)||!entry)throw new Error('Render batch must contain only O2');
  if(entry.layout!=='o2a'||entry.sourceSeatCount!==14389||!Array.isArray(entry.tiers)||entry.tiers.length!==2||entry.tiers.some(tier=>!Array.isArray(tier)||tier.length!==5||tier.some(value=>!finite(value))))throw new Error('Invalid O2 render batch tiers');
  if(!Array.isArray(entry.floor)||entry.floor.length!==2||entry.floor.some(value=>!finite(value)||value<20))throw new Error('Invalid O2 render batch floor');
  if(!Array.isArray(entry.sourceBounds)||entry.sourceBounds.length!==2||entry.sourceBounds.some(value=>!finite(value)||value<=48))throw new Error('Invalid O2 render batch source bounds');
  if(!entry.stage?.rect||![entry.stage.rect.x,entry.stage.rect.z,entry.stage.rect.w,entry.stage.rect.d,entry.stage.rect.h].every(finite))throw new Error('Invalid O2 render batch stage');
  if(!Array.isArray(entry.annotations)||entry.annotations.length!==3)throw new Error('O2 render batch annotations are required');
  const numbering=loadO2NumberingReference();
  return {status:data.status,publicationStatus:data.publicationStatus,rightsStatus:data.rightsStatus,venue:entry,standGeometry:loadO2StandGeometry(),seatNumberingReference:numbering,frontReference:loadO2FrontReference(numbering),sectionReference:loadO2SectionReference()};
}

function loadO2FrontReference(numbering){
  const reference=JSON.parse(readFileSync(new URL('../../data/render-batch/o2-front-row-reference.json',import.meta.url),'utf8'));
  if(reference.schemaVersion!==1||reference.venueId!==o2Id||reference.layout!=='o2a'||reference.configuration!=='endstage'||reference.status!=='local-research-v0'||reference.publicationStatus!=='not-published'||reference.rightsStatus!=='undecided'||reference.basis!=='panorama-camera-reference'||!finite(reference.estimate?.eyeOffset))throw new Error('Invalid O2 front-row reference');
  const ids=new Set();
  if(reference.rows?.map(row=>row.label).join(',')!=='AA,BB,CC,A,B,C,D,E,F,G')throw new Error('Invalid O2 front-row order');
  for(const row of reference.rows){
    for(const seat of row.seats){
      if(!['106','107'].includes(seat.section)||seat.id!==`S_${seat.section}-${row.label}-${seat.seat}`||ids.has(seat.id)||!numbering.sections['S_'+seat.section][row.label]?.includes(seat.seat)||seat.camera?.length!==3||!seat.camera.every(finite))throw new Error('Invalid O2 front-row seat');
      ids.add(seat.id);
    }
    const ordered=row.runs.flat().filter(id=>id!==null);
    if(ordered.length!==row.seats.length||new Set(ordered).size!==ordered.length||ordered.some(id=>!row.seats.some(seat=>seat.id===id)))throw new Error('Invalid O2 front-row runs');
  }
  if(ids.size!==508)throw new Error('Incomplete O2 front-row reference');
  return reference;
}

function loadO2NumberingReference(){
  const reference=JSON.parse(readFileSync(new URL('../../data/render-batch/o2-numbering-reference.json',import.meta.url),'utf8'));
  if(reference.schemaVersion!==1||reference.venueId!==o2Id||reference.layout!=='o2a'||reference.configuration!=='endstage'||reference.status!=='local-research-v0'||reference.publicationStatus!=='not-published'||reference.rightsStatus!=='undecided')throw new Error('Invalid O2 numbering reference');
  const stands=Object.entries(reference.sections||{}).filter(([id])=>/^S_[14]\d{2}$/.test(id));
  if(reference.rowSequence?.join('')!=='ABCDEFGHJKLMNPQRSTUVWXYZ'||stands.length!==40||stands.some(([,rows])=>!rows||typeof rows!=='object'||Object.entries(rows).some(([row,seats])=>!(/^[A-Z]+$/.test(row))||!Array.isArray(seats)||seats.some(seat=>typeof seat!=='string'||!/^\d+$/.test(seat)))))throw new Error('Invalid O2 reference seat labels');
  return reference;
}

function loadO2SectionReference(){
  const reference=JSON.parse(readFileSync(new URL('../../data/render-batch/o2-official-section-reference.json',import.meta.url),'utf8'));
  const sections=Object.entries(reference.sections||{}),ids=new Set();let seatCount=0;
  if(reference.schemaVersion!==1||reference.venueId!==o2Id||reference.layout!=='o2a'||reference.configuration!=='endstage'||reference.status!=='local-research-v0'||reference.publicationStatus!=='not-published'||reference.rightsStatus!=='undecided'||reference.basis!=='official-section-map-reference'||sections.length!==40)throw new Error('Invalid O2 official section reference');
  for(const [section,entry]of sections){
    if(!/^S_[14]\d{2}$/.test(section)||!finite(entry.seatCount)||entry.seatCount!==entry.seats?.length||!finite(entry.rowCount)||entry.rowCount!==entry.rows?.length||!Array.isArray(entry.bounds)||entry.bounds.some(value=>!finite(value))||typeof entry.mapSha256!=='string')throw new Error('Invalid O2 official section summary');
    for(const seat of entry.seats){
      if(typeof seat.id!=='string'||ids.has(seat.id)||seat.id.split('-')[0]!==section||!/^[A-Z]+$/.test(seat.row)||!/^[0-9]+$/.test(seat.seat)||!Array.isArray(seat.center)||seat.center.length!==2||seat.center.some(value=>!finite(value))||!Array.isArray(seat.polygon)||seat.polygon.length<6||seat.polygon.some(value=>!finite(value))||!finite(seat.rank))throw new Error('Invalid O2 official section seat');
      ids.add(seat.id);seatCount++;
    }
    for(const row of entry.rows){
      if(!/^[A-Z]+$/.test(row.row)||!Array.isArray(row.order)||!finite(row.gaps)||row.gaps!==row.order.filter(id=>id===null).length||row.order.some(id=>id!==null&&(!ids.has(id)||!id.startsWith(`${section}-${row.row}-`))))throw new Error('Invalid O2 official section row');
    }
  }
  if(seatCount!==14719||ids.size!==seatCount)throw new Error('Incomplete O2 official section reference');
  const summary={source:reference.sourceTemplate,observedAt:reference.observedAt,configuration:reference.configuration,sectionCount:sections.length,seatCount,sections:Object.fromEntries(sections.map(([section,entry])=>[section,{seatCount:entry.seatCount,rowCount:entry.rowCount,gapCount:entry.rows.reduce((n,row)=>n+row.gaps,0),mapSha256:entry.mapSha256}]))};
  return {reference,summary};
}

function loadO2StandGeometry(){
  const raw=JSON.parse(readFileSync(new URL('../../data/research-twconcertview/2026-10-27/raw/the-o2-arena-london.json',import.meta.url),'utf8'));
  const point=p=>Array.isArray(p)&&p.length===2&&p.every(finite);
  const vertical=q=>point(q.a)&&point(q.b)&&finite(q.y0)&&finite(q.y1);
  if(raw.seats?.rows?.length!==14389||raw.geo?.tread?.length!==4771||raw.geo?.riser?.length!==2122||
    raw.seats.rows.some(r=>![r[3],r[4],r[5],r[6]].every(finite)||!['L1','L4'].includes(raw.secs[r[0]]?.tier))||
    raw.geo.tread.some(q=>!Array.isArray(q.p)||q.p.length!==4||!q.p.every(point)||!finite(q.y)||!['L1','L4'].includes(q.t))||
    raw.geo.riser.some(q=>!vertical(q))||!['wall','back','cheek'].every(key=>Array.isArray(raw.geo[key])&&raw.geo[key].every(vertical))||
    !Array.isArray(raw.shell?.floor)||raw.shell.floor.length<3||!raw.shell.floor.every(point))throw new Error('Invalid retained O2 stand geometry');
  const wall=q=>[[q.a[0],q.y0,q.a[1]],[q.b[0],q.y0,q.b[1]],[q.b[0],q.y1,q.b[1]],[q.a[0],q.y1,q.a[1]]];
  return {basis:'retained-source-mesh',
    rowGuides:raw.seats.rows.map(r=>[String(r[1]),String(r[2]),r[3],r[5],r[4],raw.secs[r[0]].tier,r[6]]),
    treads:raw.geo.tread.map(q=>q.p.map(p=>[p[0],q.y,p[1]])),treadLevels:raw.geo.tread.map(q=>q.t),
    risers:raw.geo.riser.map(wall),walls:[...raw.geo.wall,...raw.geo.back,...raw.geo.cheek].map(wall),floor:raw.shell.floor};
}

export function applyRenderBatch(venue,batch){
  if(venue?.id!==batch.venue.venueId||venue.seatLayout?.id!==batch.venue.layout)return venue;
  const entry=batch.venue;
  const seatNumbering=matchO2SeatNumbering(venue.sourceSeats,batch.seatNumberingReference);
  return {...venue,
    tiers:entry.tiers.map(tier=>[...tier]),
    geometry:{...venue.geometry,shape:entry.shape,power:entry.power,floor:[...entry.floor],sourceBounds:[...entry.sourceBounds],coordinateSystem:entry.coordinateSystem,tiers:entry.steps.map((steps,index)=>({id:entry.sourceLevels[index],name:`来源层级 ${entry.sourceLevels[index]}`,steps}))},
    researchRenderBatch:{status:batch.status,publicationStatus:batch.publicationStatus,rightsStatus:batch.rightsStatus,layout:entry.layout,stage:{layout:entry.stage.layout,...entry.stage.rect},annotations:[...entry.annotations],standGeometry:batch.standGeometry,seatNumbering,frontReference:batch.frontReference,officialSectionReference:batch.sectionReference.summary,upperSeatRuns:upperSeatRuns(batch.sectionReference.reference,seatNumbering)}
  };
}

function upperSeatRuns(reference,numbering){
  const result={};
  for(const [id,section]of Object.entries(reference.sections).filter(([id])=>id.startsWith('S_4'))){
    const rows=section.rows.map(row=>{
      const seats=section.seats.filter(s=>s.row===row.row).sort((a,b)=>Number(a.seat)-Number(b.seat));
      const gaps=seats.slice(1).map((s,i)=>Math.hypot(s.center[0]-seats[i].center[0],s.center[1]-seats[i].center[1]));
      const pitch=gaps.toSorted((a,b)=>a-b)[Math.floor(gaps.length/2)],largest=Math.max(...gaps),split=gaps.indexOf(largest)+1;
      // A null in the SDK row order can also separate one adjacent chair.
      // Only the larger, visible centre gap defines the two seating banks.
      return {label:row.row,seats:seats.map(s=>s.seat),split:largest>pitch*1.8?split:0,gap:largest>pitch*1.8?largest/pitch:0,pitch,x:seats.map(s=>s.center[0]),axis:(seats[split-1].center[0]+seats[split].center[0])/2};
    });
    const divided=rows.filter(r=>r.split);
    const cut=(Math.max(...divided.map(r=>Number(r.seats[r.split-1])))+Math.min(...divided.map(r=>Number(r.seats[r.split]))))/2;
    const axes=divided.filter(row=>row.gap<6).map(row=>row.axis).sort((a,b)=>a-b),axis=axes[Math.floor(axes.length/2)];
    result[id.slice(2)]=Object.fromEntries(rows.map(row=>{
      const sourceRow=Object.keys(numbering.rows[id.slice(2)]).find(key=>numbering.rows[id.slice(2)][key].label===row.label);
      // A one-sided last row must stay beside the opening, not migrate into
      // its empty centre when the opposite bank has no seats to measure from.
      const gap=row.split?row.gap:2*Math.min(...row.x.map(x=>Math.abs(x-axis)))/row.pitch;
      return [sourceRow,{label:row.label,low:row.seats.filter(s=>Number(s)<cut),high:row.seats.filter(s=>Number(s)>cut),gap}];
    }));
  }
  return result;
}

export function matchO2SeatNumbering(sourceSeats,reference){
  // A label correspondence does not transfer coordinates or create inventory.
  // Include only existing seats also listed in this particular reference layout.
  const rows={};
  let matchedSeatCount=0;
  for(const [section,localRows] of sourceRowsBySection(sourceSeats)){
    const referenceRows=reference.sections['S_'+section];
    if(!referenceRows)continue;
    for(const match of alignReferenceRows(localRows,referenceRows)){
      const source=localRows[match.localIndex],referenceRow=referenceRows[match.referenceLabel];
      const seats=source.seats.filter(seat=>referenceRow.includes(seat));
      if(!seats.length)continue;
      rows[section]??={};rows[section][source.row]={label:match.referenceLabel,seats};matchedSeatCount+=seats.length;
    }
  }
  return {source:reference.source,viewer:reference.viewer,configuration:reference.configuration,observedAt:reference.observedAt,matchedSeatCount,rows};
}

function sourceRowsBySection(sourceSeats){
  const sections=new Map();
  for(const seat of sourceSeats){
    if(!sections.has(seat.section))sections.set(seat.section,new Map());
    const rows=sections.get(seat.section);
    if(!rows.has(seat.row))rows.set(seat.row,new Set());
    rows.get(seat.row).add(seat.seat);
  }
  return [...sections].map(([section,rows])=>[section,[...rows].sort((a,b)=>Number(a[0])-Number(b[0])).map(([row,seats])=>({row,seats:[...seats]}))]);
}

// The public catalog can contain extra rows, while the retained source can
// contain extra or merged rows. Align each section independently using row
// order and shared seat numbers; never infer a label from the global row index.
function alignReferenceRows(localRows,referenceRows){
  const officialRows=Object.entries(referenceRows).map(([label,seats])=>({label,seats:new Set(seats)}));
  const n=localRows.length,m=officialRows.length;
  const score=Array.from({length:n+1},()=>Array(m+1).fill(-Infinity));
  const path=Array.from({length:n+1},()=>Array(m+1));score[0][0]=0;
  for(let i=0;i<=n;i++)for(let j=0;j<=m;j++){
    const current=score[i][j];if(!Number.isFinite(current))continue;
    if(i<n&&current-4>score[i+1][j]){score[i+1][j]=current-4;path[i+1][j]=[i,j,'local'];}
    if(j<m&&current-4>score[i][j+1]){score[i][j+1]=current-4;path[i][j+1]=[i,j,'official'];}
    if(i>=n||j>=m)continue;
    const local=localRows[i],official=officialRows[j],shared=local.seats.filter(seat=>official.seats.has(seat)).length;
    const overlap=shared/Math.max(local.seats.length,official.seats.size);
    const matchScore=shared*4+overlap*10-Math.abs(local.seats.length-official.seats.size)*.4;
    if(current+matchScore>score[i+1][j+1]){score[i+1][j+1]=current+matchScore;path[i+1][j+1]=[i,j,'match'];}
  }
  const matches=[];let i=n,j=m;
  while(i||j){
    const step=path[i][j];if(!step)break;
    if(step[2]==='match')matches.push({localIndex:step[0],referenceLabel:officialRows[step[1]].label});
    i=step[0];j=step[1];
  }
  return matches.reverse();
}
