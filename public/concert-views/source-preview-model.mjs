// Independent source frames are selectable, never implicitly combined. Event
// registrations refer to the primary map until a separate registration exists.
export function venueForDraftMap(venue,id){
 const draft=venue.venueDraft,map=[draft.map,...(draft.alternateMaps||[])].find(m=>m.id===id);
 if(!map)return null;
 return {...venue,venueDraft:{...draft,map,alternateMaps:[]},eventPlans:map===draft.map?venue.eventPlans:[]};
}

export function lookupSourceRow(catalogs,section,row){
 const matches=catalogs.flatMap(c=>c.sections||[]).filter(s=>s.label===section);
 if(!matches.length)return {status:'unknown-section'};
 const found=matches.filter(s=>s.rowLabels.includes(row));
 if(!found.length)return {status:'unverified-row'};
 if(found.length!==1)return {status:'ambiguous'};
 return {status:'matched',section:found[0],completeSeatInventory:false};
}

export function lookupDraftTicket(venue,map,{section,row='',seat='',ticketLabel}){
 const block=map.sections.find(s=>s.id===section);
 if(!block)return {status:'unknown-section'};
 const requestedSection=ticketLabel??block.ticketLabel;
 if(!(block.ticketLabels||[block.ticketLabel]).includes(requestedSection))return {status:'unknown-section'};
 if(block.identityStatus==='ambiguous-source-label')return {status:'ambiguous',block,requestedSection};
 const sharedBoundary=block.boundaryStatus==='shared-source-outline';
 if(!row&&!seat)return {status:'section-matched',block,requestedSection,sharedBoundary};
 const seats=(venue.seatLayouts||[]).flatMap(layout=>(layout.seats||[]).filter(s=>s.section===requestedSection&&s.row===row&&s.seat===seat).map(s=>({layout,seat:s})));
 if(seat){
  const match=seats.length===1?seats[0]:null,s=match?.seat;
  // Local seat coordinates cannot be placed on an unrelated whole-venue map.
  const bound=match?.layout.sectionMapId===map.id&&!!map.id&&match.layout.sourceSha256===map.sourceSha256&&match.layout.coordinateSpace===map.coordinateSpace&&(map.sourcePage==null||s.page===map.sourcePage);
  const position=bound&&Number.isFinite(s.x)&&Number.isFinite(s.y)&&s.x>=map.viewBox[0]&&s.x<=map.viewBox[0]+map.viewBox[2]&&s.y>=map.viewBox[1]&&s.y<=map.viewBox[1]+map.viewBox[3]?{x:s.x,y:s.y}:null;
  return {status:seats.length===1?'seat-matched':seats.length?'ambiguous':'unverified-seat',block,requestedSection,sharedBoundary,seat:s||null,mapPosition:position};
 }
 const match=lookupSourceRow(venue.rowCatalogs||[],requestedSection,row);
 return {status:match.status==='matched'?'row-matched':match.status==='ambiguous'?'ambiguous':'unverified-row',block,requestedSection,sharedBoundary,rowEvidence:match.section?.sourceRange||null};
}

// Display coordinates only: no height evidence means no invented row rise.
// Each source layout stays in its own frame; no whole-venue alignment is implied.
export function buildSourceSeatDisplay(layout){
 const input=(layout?.seats||[]).filter(s=>Number.isFinite(s.x)&&Number.isFinite(s.y));
 if(!input.length)return {seats:[],scale:1,metricCalibrated:false,heightBasis:'flat-unmeasured'};
 let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
 for(const s of input){minX=Math.min(minX,s.x);maxX=Math.max(maxX,s.x);minY=Math.min(minY,s.y);maxY=Math.max(maxY,s.y);}
 const scale=120/Math.max(maxX-minX,maxY-minY,1),cx=(minX+maxX)/2,cy=(minY+maxY)/2;
 return {scale,metricCalibrated:false,heightBasis:'flat-unmeasured',seats:input.map(source=>({source,x:(source.x-cx)*scale,z:(source.y-cy)*scale,height:0}))};
}
