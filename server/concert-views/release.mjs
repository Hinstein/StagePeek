import {readFileSync} from 'node:fs';
import {applyRenderBatch,loadRenderBatch} from './render-batch.mjs';
import {presentConcertVenue} from './presentation.mjs';
import {fault} from '../store.mjs';

// Publishing a source manifest never expands the consumer catalog implicitly.
// Every released venue must be explicitly included in this reviewed list.
export function releasedVenues(views){
 const manifest=JSON.parse(readFileSync(new URL('../../data/concert-views/release.json',import.meta.url),'utf8'));
 if(manifest.schemaVersion!==1||new Set(manifest.venueIds).size!==manifest.venueIds.length)throw Error('Invalid venue release');
 const allowed=new Set(manifest.venueIds),batch=loadRenderBatch();
 for(const id of allowed)if(id!==views.hydro.id&&!views.venues.get(id))throw Error('Missing released venue: '+id);
 const hydro={id:views.hydro.id,name:views.hydro.name,city:views.hydro.city,country:'英国',sectionCount:50,sourceSeatCount:0,venueDraft:{},eventPlans:views.hydro.eventPlans,accuracy:{metricCalibrated:false,completeSeatInventory:false,seatDataStatus:'estimated'}};
 return {
  release:true,
  ids:()=>[...allowed],
  catalog:()=>[...views.venues.catalog().filter(v=>allowed.has(v.id)).map(presentConcertVenue),...(allowed.has(hydro.id)?[hydro]:[])],
  get:(id,layout)=>!allowed.has(id)?null:id===hydro.id?hydro:((v)=>v?presentConcertVenue(applyRenderBatch(v,batch)):null)(views.venues.get(id,layout)),
  resolve:(id,input)=>!allowed.has(id)?{status:'unknown-venue'}:id===hydro.id?{status:'unverified',position:null,positionStatus:'illustrative'}:views.venues.resolve(id,input),
  validate:views.venues.validate,
  publish(){throw fault(409,'RELEASE_REVIEW_REQUIRED','New venues require a reviewed release');},
  reload:()=>views.venues.reload()
 };
}
