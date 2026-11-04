// Source pixels remain untouched. This model is a smooth, non-metric display
// reconstruction of the retained Noah Kahan ticket plan, not a seat inventory.
export const HYDRO_MAP_HASH='b589255b363f6b0e5500ae8cbb17acff87a0ef93d79022b327712ebbea56d359';
const scale=.18;
export function hydroPoint(x,z,y=0){return [(x-512)*scale,y,(z-460)*scale];}

export function buildHydroDisplay(venue,eventId=null){
 const map=venue.venueDraft.map;
 if(venue.id!=='ovo-hydro'||map.sourceSha256!==HYDRO_MAP_HASH)throw Error('Hydro display requires the retained event map');
 const event=eventId?venue.eventPlans.find(e=>e.id===eventId):null;
 if(eventId&&(!event||event.mapSha256!==HYDRO_MAP_HASH))throw Error('Unbound Hydro event');
 const sections=[],chairs=[],treads=[],risers=[],stairs=[],decks=[],skirts=[];
 const stairKeys=new Set();
 const bands=[
  {labels:Array.from({length:18},(_,i)=>String(201+i)),inner:[200,200],outer:[242,242],base:3.2,rise:.38},
  {labels:Array.from({length:18},(_,i)=>String(221+i)),inner:[249,249],outer:[320,320],base:6.5,rise:.42},
  // The pictorial ticket map compresses the sides of the upper bank. Give
  // its 13 illustrative rows uniform depth instead of squeezing the chairs.
  {labels:Array.from({length:12},(_,i)=>String(324+i)),inner:[327,327],outer:[399,399],base:13.3,rise:.46}
 ];
 const lower=map.sections.filter(s=>bands[0].labels.includes(s.ticketLabel));
 const centres=lower.map(s=>Math.atan2(s.labelPoint[1]-460,s.labelPoint[0]-512));
 // Unwrap the left side through -PI, retaining the same divisions on both
 // lower banks. All row curves share these boundaries, rather than fit alone.
 for(let i=1;i<centres.length;i++)if(centres[i]>centres[i-1])centres[i]-=Math.PI*2;
 const lowerEdges=[Math.PI/6,...centres.slice(1).map((a,i)=>(a+centres[i])/2),-Math.PI*7/6];
 for(const [index,band]of bands.entries()){
  const edges=index<2?lowerEdges:Array.from({length:13},(_,i)=>-.075-i*(Math.PI-.15)/12);
  for(const [i,label]of band.labels.entries())addSection(label,band,edges[i+1],edges[i]);
  // Continuous concourses are separate from row surfaces; gaps in chair runs
  // are aisles, not holes punched through the building.
  for(let i=0;i<160;i++){
   const a=edges.at(-1)+(edges[0]-edges.at(-1))*i/160,b=edges.at(-1)+(edges[0]-edges.at(-1))*(i+1)/160;
   decks.push([ellipse(band.outer,a,band.base+band.rise*rowCount(band.labels[0])),ellipse(band.outer,b,band.base+band.rise*rowCount(band.labels[0])),ellipse(band.outer.map(v=>v+6),b,band.base+band.rise*rowCount(band.labels[0])),ellipse(band.outer.map(v=>v+6),a,band.base+band.rise*rowCount(band.labels[0]))]);
  }
 }
 for(const label of ['052','056']){
  const source=map.sections.find(s=>s.ticketLabel===label),a=Math.atan2(source.labelPoint[1]-460,source.labelPoint[0]-512);
  addSection(label,{inner:[165,165],outer:[194,194],base:.35,rise:.36},a-.23,a+.23);
 }
 const shapes=(event?.overlay?.shapes||[]).map(s=>{
  const points=smoothContour(s.polygon),height=s.kind==='stage'?1.25:s.kind==='equipment'?1:.025;
  return {id:s.id,label:s.label,kind:s.kind,points:points.map(p=>hydroPoint(...p)),height,positionStatus:'estimated-display',sourceShape:s.id};
 });
 const main=shapes.find(s=>s.id==='stage-main'),performer=main?hydroPoint(512,554,main.height):null;
 // Preserve the reference model's relative position along this row. Its
 // geometry is approximate; neither these anchors nor our chairs are inventory.
 const references=(venue.numberingReference?.references||[]).map(ref=>{
  const section=sections.find(s=>s.label===ref.section),row=section?.chairs.filter(c=>c.displayRow===ref.row);
  if(!row?.length)throw Error('Hydro reference row is outside the display');
  const chair=row[Math.min(row.length-1,Math.floor(ref.rowFraction*row.length))];
  if(chair.referenceTicket)throw Error('Hydro reference identities share a display chair');
  chair.referenceTicket=ref;
  return {reference:ref,chair};
 });
 const inferredAnchors=(venue.numberingReference?.excluded||[]).map(ref=>{
  const section=sections.find(s=>s.label===ref.section),row=section?.chairs.filter(c=>c.displayRow===ref.row);
  return {reference:{...ref,rowFraction:.5,identityBasis:'excluded-reference-inference'},chair:row?.[Math.min(row.length-1,Math.floor(row.length/2))]};
 }).filter(ref=>ref.chair);
 const numbering=inferHydroNumbering(sections,[...references,...inferredAnchors],venue.numberingReference);
 return {version:'hydro-local-v0',sections,chairs,treads,risers,stairs,decks,skirts,shapes,performer,event,
  references,inferredReferences:numbering.inferred,numberingRows:numbering.rows,eventRows:event?.id===venue.numberingReference?.eventRows.eventId?venue.numberingReference.eventRows.sections:null,
  metricCalibrated:false,completeSeatInventory:false,publicationStatus:'not-published',rightsDecision:'undecided'};

 function rowLabels(label){return venue.rowCatalogs.flatMap(c=>c.sections).find(s=>s.label===label)?.rowLabels||[];}
 function rowCount(label){return rowLabels(label).length;}
 function addSection(label,band,start,end){
  const source=map.sections.find(s=>s.ticketLabel===label);
  if(!source)throw Error('Missing Hydro source section '+label);
  const rows=rowLabels(label),section={id:source.id,label,tier:source.displayTier,rows,chairs:[],rowAnchors:[],polygon:[],labelPoint:null};
  const count=rows.length;
  for(let r=0;r<count;r++){
   const inside=band.inner.map((v,i)=>v+(band.outer[i]-v)*r/count),outside=band.inner.map((v,i)=>v+(band.outer[i]-v)*(r+1)/count),radius=inside.map((v,i)=>(v+outside[i])/2),y=band.base+r*band.rise;
   const samples=Math.ceil((end-start)*Math.max(...outside)/4);
   for(let j=0;j<samples;j++){
    const a=start+(end-start)*j/samples,b=start+(end-start)*(j+1)/samples;
    treads.push([ellipse(inside,a,y),ellipse(inside,b,y),ellipse(outside,b,y),ellipse(outside,a,y)]);
    if(r===0)skirts.push([ellipse(inside,a,y),ellipse(inside,b,y),ellipse(inside,b,0),ellipse(inside,a,0)]);
    if(r===count-1)skirts.push([ellipse(outside,b,y),ellipse(outside,a,y),ellipse(outside,a,0),ellipse(outside,b,0)]);
    risers.push([ellipse(inside,a,y),ellipse(inside,b,y),ellipse(inside,b,y-band.rise),ellipse(inside,a,y-band.rise)]);
   }
   for(const side of [start,end])skirts.push([ellipse(inside,side,y),ellipse(outside,side,y),ellipse(outside,side,0),ellipse(inside,side,0)]);
   const gap=3.3/Math.min(...radius),usable=end-start-2*gap;
   const numbered=venue.numberingReference?.numberedRows;
   const numberedRow=numbered?.section===label?numbered.rows.find(v=>v.row===rows[r]):null;
   const seats=numberedRow?numberedRow.firstSeat-numberedRow.lastSeat+1:Math.max(1,Math.floor(usable*Math.min(...radius)/3.2));
   for(let j=0;j<seats;j++){
    const a=start+gap+usable*(j+.5)/seats,p=ellipse(radius,a,y);
    const inward=[-Math.cos(a)/radius[0],-Math.sin(a)/radius[1]],chair={section:source.id,displayRow:rows[r],p,angle:Math.atan2(inward[0],inward[1]),visualOnly:true,sourceSeat:false};
    chairs.push(chair);section.chairs.push(chair);
   }
   section.rowAnchors.push({label:rows[r],p:ellipse(radius,start+gap*.35,y+.25)});
   // Two half-height walking steps in every division leave the aisle clear.
   for(const side of [start,end])for(let half=0;half<2;half++){
    const a=inside.map((v,i)=>v+(outside[i]-v)*half/2),b=inside.map((v,i)=>v+(outside[i]-v)*(half+1)/2),g=2.8/Math.min(...a),h=y-band.rise/2+half*band.rise/2;
    const step=[ellipse(a,side-g/2,h),ellipse(a,side+g/2,h),ellipse(b,side+g/2,h),ellipse(b,side-g/2,h)];
    // Both neighbors describe the shared aisle. Emit its surface only once.
    const key=step.map(p=>p.map(v=>v.toFixed(8)).join(',')).sort().join(';');
    if(!stairKeys.has(key)){stairKeys.add(key);stairs.push(step);}
   }
  }
  for(let j=0;j<=48;j++)section.polygon.push(ellipse(band.inner,start+(end-start)*j/48));
  for(let j=48;j>=0;j--)section.polygon.push(ellipse(band.outer,start+(end-start)*j/48));
  section.labelPoint=ellipse(band.inner.map((v,i)=>(v+band.outer[i])/2),(start+end)/2,band.base+(count-1)*band.rise/2+.8);
  sections.push(section);
 }
}

export function locateHydroReference(model,{section,row='',seat=''}){
 const selected=model.sections.find(s=>s.id===section||s.label===section);
 if(!selected)return {status:'unknown-section',chair:null};
 const label=row.trim().toUpperCase(),number=seat.trim();
 if(!label&&!number)return {status:'section',chair:null};
 if(!selected.rows.includes(label))return {status:'unknown-row',chair:null};
 if(!number)return {status:'row',chair:null};
 const match=model.references.find(r=>r.reference.section===selected.label&&r.reference.row===label&&r.reference.seat===number);
 if(match)return {status:'reference',chair:match.chair,reference:match.reference};
 const inferred=model.inferredReferences?.find(r=>r.reference.section===selected.label&&r.reference.row===label&&r.reference.seat===number);
 return inferred?{status:'inferred',chair:inferred.chair,reference:inferred.reference}:{status:'unknown-seat',chair:null};
}

// This is a reproducible illustration, not an inventory reconstruction. Capacity
// locates section boundaries approximately; it never supplies an actual start ID.
function inferHydroNumbering(sections,references,source){
 const inferred=[],rows=[];
 const groups=[sections.slice(0,18),sections.slice(18,36),sections.slice(36,48),sections.slice(48)];
 for(const group of groups){
  const labels=[...new Set(group.flatMap(s=>s.rows))];
  const groupRefs=references.filter(r=>group.some(s=>s.id===r.chair.section));
  for(const rowLabel of labels){
   const members=group.filter(s=>s.rows.includes(rowLabel));
   const capacities=members.map(s=>source.eventRows.sections[s.label]?.[rowLabel]??s.chairs.filter(c=>c.displayRow===rowLabel).length);
   const starts=capacities.map((_,i)=>capacities.slice(0,i).reduce((a,b)=>a+b,0));
   const sameRow=groupRefs.filter(r=>r.reference.row===rowLabel);
   const nearestRow=groupRefs.length?Math.min(...groupRefs.map(r=>Math.abs(labels.indexOf(r.reference.row)-labels.indexOf(rowLabel)))):null;
   const anchors=sameRow.length?sameRow:groupRefs.filter(r=>Math.abs(labels.indexOf(r.reference.row)-labels.indexOf(rowLabel))===nearestRow);
   for(const [sectionIndex,section] of members.entries()){
    const row=section.chairs.filter(c=>c.displayRow===rowLabel);
    const direct=references.filter(r=>r.chair.section===section.id&&r.reference.row===rowLabel);
    const local=groupRefs.filter(a=>a.reference.section===section.label).sort((a,b)=>Math.abs(labels.indexOf(a.reference.row)-labels.indexOf(rowLabel))-Math.abs(labels.indexOf(b.reference.row)-labels.indexOf(rowLabel)));
    const nearest=!sameRow.length&&local.length?local[0]:anchors.filter(a=>members.some(s=>s.label===a.reference.section)).sort((a,b)=>Math.abs(members.findIndex(s=>s.label===a.reference.section)-sectionIndex)-Math.abs(members.findIndex(s=>s.label===b.reference.section)-sectionIndex))[0];
    const anchorIndex=nearest?members.findIndex(s=>s.label===nearest.reference.section):-1;
    const offset=nearest?Number(nearest.reference.seat)-(starts[anchorIndex]+capacities[anchorIndex]*(1-nearest.reference.rowFraction)):0;
    const high=direct.length?Number(direct[0].reference.seat)+row.indexOf(direct[0].chair):Math.max(row.length,Math.round(starts[sectionIndex]+capacities[sectionIndex]+offset));
    const used=new Set(direct.map(a=>Number(a.reference.seat)));
    const appliedAnchors=direct.length?direct:nearest?[nearest]:[];
    const constraint={section:section.label,row:rowLabel,method:direct.length?'same-row-anchor':nearest?(sameRow.length?'neighbor-section-anchor':'neighbor-row-anchor'):'section-order-only',capacityPrior:source.eventRows.sections[section.label]?.[rowLabel]??null,priorEventId:source.eventRows.eventId,anchorIds:appliedAnchors.map(a=>[a.reference.section,a.reference.row,a.reference.seat].join('/')),anchorBasis:appliedAnchors.some(a=>a.reference.identityBasis==='excluded-reference-inference')?'author-estimate':appliedAnchors.length?'retained-reference':'section-order',conflicts:[]};
    for(const [index,chair] of row.entries()){
     if(chair.referenceTicket)continue;
     const forced=direct.find(anchor=>anchor.chair===chair);
     let seat=forced?Number(forced.reference.seat):high-index;
     if(!forced&&(seat<1||used.has(seat))){
      constraint.conflicts.push('anchor-spacing');
      seat=Math.max(high,...used)+1;
      while(used.has(seat))seat++;
     }
     used.add(seat);
     chair.inferredTicket={section:section.label,row:rowLabel,seat:String(seat),identityBasis:'inferred-from-reference-and-row-capacity',positionBasis:'estimated-display-slot',eventAvailability:'unknown',numberingMethod:constraint.method,anchorBasis:constraint.anchorBasis,anchorIds:constraint.anchorIds,capacityPrior:constraint.capacityPrior,priorEventId:constraint.priorEventId};
     inferred.push({chair,reference:chair.inferredTicket});
    }
    constraint.conflicts=[...new Set(constraint.conflicts)];rows.push(constraint);
   }
  }
 }
 return {inferred,rows};
}

function ellipse(r,a,y=0){return [r[0]*Math.cos(a)*scale,y,r[1]*Math.sin(a)*scale];}

function smoothContour(input){
 const points=input.map(p=>[...p]);
 // Remove raster stair steps without changing the source asset. Corners
 // beyond 1.2 source pixels remain, including the porch opening in the stage.
 let changed=true;
 while(changed&&points.length>4){
  changed=false;
  for(let i=points.length-1;i>=0&&points.length>4;i--){
   const a=points[(i+points.length-1)%points.length],b=points[i],c=points[(i+1)%points.length],dx=c[0]-a[0],dz=c[1]-a[1],length=dx*dx+dz*dz;
   const t=length?Math.max(0,Math.min(1,((b[0]-a[0])*dx+(b[1]-a[1])*dz)/length)):0;
   if(Math.hypot(b[0]-a[0]-t*dx,b[1]-a[1]-t*dz)<1.2){points.splice(i,1);changed=true;}
  }
 }
 return points;
}
