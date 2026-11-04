import {concertViewsPage} from './page.mjs';
import {presentConcertVenue} from './presentation.mjs';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadVenues} from './venues.mjs';
import {loadRenderBatch,applyRenderBatch} from './render-batch.mjs';
import {loadTicketMapPreviews} from './ticket-map-previews.mjs';
import {loadHydroReference} from './hydro-reference.mjs';
import {packSourceSeats} from '../../public/concert-views/seating.mjs';
import {fault} from '../store.mjs';

// Only the local venue workspace sees these retained research assets.
// Main's venue inventory, entitlement rules, auth and billing remain independent.
export function loadConcertViews(){
 const root=fileURLToPath(new URL('../../',import.meta.url));
 const venues=loadVenues(undefined,{includeResearch:true}),batch=loadRenderBatch();
 const previews=loadTicketMapPreviews({venues});
 const hydro=JSON.parse(readFileSync(new URL('../../data/concert-views/hydro/venue.json',import.meta.url),'utf8'));
 hydro.numberingReference=loadHydroReference(root);
 if(hydro.id!=='ovo-hydro'||hydro.venueDraft.map.sourceSha256!==hydro.numberingReference.mapSha256)throw Error('Hydro integration map mismatch');
 const hydroImage=readFileSync(new URL('../../data/concert-views/hydro/event-map.png',import.meta.url));
 if(createHash('sha256').update(hydroImage).digest('hex')!==hydro.venueDraft.map.sourceSha256)throw Error('Hydro event map changed');
 return {
  venues,hydro,previews,
  async handle(req,res,url,{path=url.pathname,locale='en'}={}){
   const json=value=>{res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
   res.setHeader('X-Robots-Tag','noindex, nofollow');
   const method=req.method;
   if(path==='/concert-views'&&['GET','HEAD'].includes(method)){
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(method==='HEAD'?null:concertViewsPage(locale,req.stagepeekUser));return true;
   }
   if(!path.startsWith('/api/concert-views/'))return false;
   if(!['GET','HEAD','POST'].includes(method))throw fault(405,'METHOD_NOT_ALLOWED','Method not allowed');
   if(path==='/api/concert-views/venues'&&method==='GET'){json({venues:venues.catalog().map(v=>({...presentConcertVenue(v),locked:false}))});return true;}
   if(path==='/api/concert-views/hydro'&&method==='GET'){json({venues:[hydro]});return true;}
   if(path==='/api/concert-views/hydro/ovo-hydro'&&method==='GET'){json({venue:hydro});return true;}
   if(path==='/api/concert-views/hydro/ovo-hydro/image'&&['GET','HEAD'].includes(method)){
    res.writeHead(200,{'Content-Type':'image/png','Content-Length':hydroImage.length});res.end(method==='HEAD'?null:hydroImage);return true;
   }
   const preview=path.match(/^\/api\/concert-views\/ticket-map-previews\/([a-z0-9-]+)(\/image)?$/);
   if(preview&&['GET','HEAD'].includes(method)){
    const draft=previews.get(preview[1]);if(!draft)throw fault(404,'NOT_FOUND','Preview unavailable');
    if(!preview[2]){json({draft});return true;}
    const image=previews.artifact(preview[1]);if(!image)throw fault(404,'NOT_FOUND','Image unavailable');
    res.writeHead(200,{'Content-Type':image.contentType,'Content-Length':image.bytes.length});res.end(method==='HEAD'?null:image.bytes);return true;
   }
   const venue=path.match(/^\/api\/concert-views\/venues\/([a-z0-9-]+)(?:\/(resolve|events))?$/);
   if(!venue||!venues.get(venue[1]))throw fault(404,'VENUE_NOT_FOUND','Venue outside this workspace');
   if(!venue[2]&&method==='GET'){
    const base=venues.get(venue[1],url.searchParams.get('layout')||undefined);if(!base)throw fault(422,'UNKNOWN_LAYOUT','Layout unavailable');
    json({venue:{...presentConcertVenue(applyRenderBatch(base,batch)),sourceSeats:undefined,seatTuples:packSourceSeats(base.sourceSeats)}});return true;
   }
   if(venue[2]==='events'&&method==='GET'){
    json({events:[],researchConcerts:previews.list(venue[1]).map(draft=>({id:draft.id,name:draft.label,localDate:draft.dates[0],dates:draft.dates,source:draft.source,researchOnly:true,ticketMapDraft:{id:draft.id,version:draft.version,seatLayoutId:draft.seatLayoutId}}))});return true;
   }
   if(venue[2]==='resolve'&&method==='POST'){
    const chunks=[];let size=0;
    for await(const chunk of req){size+=chunk.length;if(size>16384)throw fault(413,'BODY_TOO_LARGE','Request too large');chunks.push(chunk);}
    let input;try{input=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw fault(400,'INVALID_JSON','Invalid JSON');}
    if(!input||typeof input!=='object'||Array.isArray(input))throw fault(400,'INVALID_JSON','Expected ticket fields');
    json(venues.resolve(venue[1],input));return true;
   }
   throw fault(405,'METHOD_NOT_ALLOWED','Method not allowed');
  }
 };
}
