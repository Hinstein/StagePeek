import {readFileSync} from 'node:fs';
import {applyRenderBatch,loadRenderBatch} from './render-batch.mjs';
import {presentConcertVenue} from './presentation.mjs';
import {fault} from '../store.mjs';
import {loadVenues} from '../venues.mjs';

// Publishing a source manifest never expands the consumer catalog implicitly.
// Every released venue must be explicitly included in this reviewed list.
export function releasedVenues(views){
 const manifest=JSON.parse(readFileSync(new URL('../../data/concert-views/release.json',import.meta.url),'utf8'));
 if(manifest.schemaVersion!==1||new Set(manifest.venueIds).size!==manifest.venueIds.length)throw Error('Invalid venue release');
 const allowed=new Set(manifest.venueIds),batch=loadRenderBatch();
 const mainIds=new Set(manifest.mainCatalogVenueIds||[]),main=loadVenues();
 for(const id of mainIds)if(!allowed.has(id)||!main.get(id))throw Error('Missing released main venue: '+id);
 for(const id of allowed)if(id!==views.hydro.id&&!mainIds.has(id)&&!views.venues.get(id))throw Error('Missing released venue: '+id);
 const hydro={id:views.hydro.id,name:views.hydro.name,city:views.hydro.city,country:'英国',sectionCount:50,sourceSeatCount:0,venueDraft:{},eventPlans:views.hydro.eventPlans,accuracy:{metricCalibrated:false,completeSeatInventory:false,seatDataStatus:'estimated'}};
 return {
  release:true,
  ids:()=>[...allowed],
  catalog:()=>[...views.venues.catalog().filter(v=>allowed.has(v.id)&&!mainIds.has(v.id)).map(presentConcertVenue),...(allowed.has(hydro.id)?[hydro]:[]),...main.catalog().filter(v=>mainIds.has(v.id))],
  get(id,layout){
   if(!allowed.has(id))return null;
   if(id===hydro.id)return hydro;
   if(mainIds.has(id)){
    const venue=main.get(id,layout);
    return venue?{...venue,calendarVenue:true}:null;
   }
   const venue=views.venues.get(id,layout);
   return venue?presentConcertVenue(applyRenderBatch(venue,batch)):null;
  },
  resolve:(id,input)=>!allowed.has(id)?{status:'unknown-venue'}:id===hydro.id?{status:'unverified',position:null,positionStatus:'illustrative'}:mainIds.has(id)?main.resolve(id,input):views.venues.resolve(id,input),
  validate:views.venues.validate,
  publish(){throw fault(409,'RELEASE_REVIEW_REQUIRED','New venues require a reviewed release');},
  reload:()=>views.venues.reload()
 };
}
