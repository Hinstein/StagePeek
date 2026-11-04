import test from 'node:test';
import assert from 'node:assert/strict';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {o2DisplayModel} from '../public/concert-views/o2-display.mjs';
import {buildHydroDisplay} from '../public/concert-views/hydro-display.mjs';
import {applyRenderBatch,loadRenderBatch} from '../server/concert-views/render-batch.mjs';

const views=loadConcertViews();

test('concert views expose the curated local venue workspaces',()=>{
 assert.deepEqual(views.venues.catalog().map(v=>v.id),['twcv-the-o2-arena-london','twcv-accor-arena-paris','twcv-ziggo-dome-amsterdam','twcv-uber-arena-berlin','twcv-kia-forum-los-angeles','twcv-united-center-chicago','twcv-ubs-arena-new-york','twcv-prudential-center-newark','twcv-state-farm-arena-atlanta']);
 assert.equal(views.hydro.id,'ovo-hydro');
 assert.equal(views.previews.list('twcv-the-o2-arena-london').length,2);
});

test('O2 retains source identities while rendering the accepted display completion',()=>{
 const venue=applyRenderBatch(views.venues.get('twcv-the-o2-arena-london','o2a'),loadRenderBatch());
 const model=o2DisplayModel(venue);
 assert.equal(model.records.length,14389);
 assert.ok(model.renderRecords.length>model.records.length);
 assert.equal(model.sourceSeats?.length,undefined);
 assert.equal(venue.sourceSeats.length,14389);
});

test('Hydro keeps fixed camera and numbering provenance in the merged namespace',()=>{
 const model=buildHydroDisplay(views.hydro,'hydro-event-noah-kahan-20261105');
 assert.equal(model.sections.length,50);
 assert.equal(model.references.length,80);
 assert.ok(model.inferredReferences.length>9000);
 assert.equal(model.publicationStatus,'not-published');
 assert.equal(model.rightsDecision,'undecided');
});

test('merged routes reject venue data outside the curated local namespace',async()=>{
 const response=await new Promise(async resolve=>{
  const req={method:'GET',url:'/api/concert-views/venues/not-curated',socket:{remoteAddress:'127.0.0.1'}};
  const res={setHeader(){},writeHead(status){this.status=status},end(){resolve(this.status)}};
  try{await views.handle(req,res,new URL('http://127.0.0.1'+req.url));}catch(error){resolve(error.status||500)}
 });
 assert.equal(response,404);
});
