import test from 'node:test';
import assert from 'node:assert/strict';
import {loadRenderBatch,applyRenderBatch} from '../server/concert-views/render-batch.mjs';
import {loadVenues} from '../server/concert-views/venues.mjs';
import {stageRects} from '../public/concert-views/geometry.mjs';

const batch=loadRenderBatch();

test('O2 render batch is local research v0 and keeps publication gates closed',()=>{
  assert.equal(batch.status,'local-research-v0');
  assert.equal(batch.publicationStatus,'not-published');
  assert.equal(batch.rightsStatus,'undecided');
  assert.deepEqual(Object.keys(batch.venue),['venueId','layout','sourceSeatCount','sourceLevels','levels','shape','power','floor','sourceBounds','coordinateSystem','tiers','steps','fit','stage','annotations']);
  assert.equal(batch.venue.venueId,'twcv-the-o2-arena-london');
  assert.equal(batch.venue.layout,'o2a');
  assert.equal(batch.venue.sourceSeatCount,14389);
  assert.equal(batch.venue.tiers.length,2);
  assert.deepEqual(batch.venue.annotations,['示意舞台','本地研究 v0 · 数据未发布','来源坐标 · 未校准，不代表实测']);
});

test('official O2 section reference covers every numbered stand and preserves row gaps',()=>{
  assert.equal(batch.sectionReference.summary.sectionCount,40);
  assert.equal(batch.sectionReference.summary.seatCount,14719);
  assert.equal(Object.keys(batch.sectionReference.summary.sections).length,40);
  assert.ok(Object.values(batch.sectionReference.summary.sections).every(section=>section.rowCount>0));
  assert.ok(Object.values(batch.sectionReference.summary.sections).every(section=>section.gapCount>0));
  const front=batch.sectionReference.reference.sections.S_106;
  assert.deepEqual(front.rows.find(row=>row.row==='AA').order.slice(0,4),['S_106-AA-202','S_106-AA-201','S_106-AA-200','S_106-AA-199']);
  assert.ok(front.rows.find(row=>row.row==='AA').order.includes(null));
});

test('applying the batch changes only O2 render metadata and preserves source seats',()=>{
  const venues=loadVenues(undefined,{includeResearch:true});
  const original=venues.get(batch.venue.venueId,batch.venue.layout);
  const venue=applyRenderBatch(original,batch);
  assert.equal(venue.id,original.id);
  assert.equal(venue.sourceSeats.length,14389);
  assert.deepEqual(venue.tiers,batch.venue.tiers);
  assert.deepEqual(venue.geometry.floor,batch.venue.floor);
  assert.deepEqual(venue.geometry.sourceBounds,batch.venue.sourceBounds);
  assert.deepEqual(venue.researchRenderBatch.stage,{layout:batch.venue.stage.layout,...batch.venue.stage.rect});
  assert.deepEqual(venue.researchRenderBatch.annotations,batch.venue.annotations);
  assert.deepEqual(venue.researchRenderBatch.officialSectionReference,batch.sectionReference.summary);
  const upper=venue.researchRenderBatch.upperSeatRuns;
  assert.equal(Object.keys(upper).length,22);
  assert.equal(Object.values(upper).flatMap(section=>Object.values(section)).reduce((n,row)=>n+row.low.length+row.high.length,0),7360);
  assert.equal(upper['414']['1'].high.length,8,'adjacent 789/788 are one bank despite the SDK null separator');
  assert.ok(upper['414']['3'].gap>8,'the entry opening is wider than a walking stair');
  assert.deepEqual(upper['404']['19'].high,['547','548','549','550']);
  assert.equal(upper['404']['19'].low.length,0);
  assert.ok(upper['404']['19'].gap>18,'a missing bank must not shrink the last-row opening');
  assert.equal(applyRenderBatch(venues.get('tottenham'),batch),venues.get('tottenham'));
  assert.equal(applyRenderBatch(venues.get(batch.venue.venueId,'missing-layout'),batch),venues.get(batch.venue.venueId,'missing-layout'));
});

test('O2 v0 geometry has finite source seats inside source bounds and a stage rect inside the inner floor',()=>{
  const venue=applyRenderBatch(loadVenues(undefined,{includeResearch:true}).get(batch.venue.venueId,batch.venue.layout),batch);
  assert.equal(venue.sourceSeats.length,batch.venue.sourceSeatCount);
  assert.ok(venue.sourceSeats.every(seat=>seat.position.every(Number.isFinite)));
  assert.ok(venue.sourceSeats.every(seat=>Math.abs(seat.position[0])<venue.geometry.sourceBounds[0]/2&&Math.abs(seat.position[2])<venue.geometry.sourceBounds[1]/2));
  assert.deepEqual(stageRects('end',venue),[{...batch.venue.stage.rect,source:'local-research-v0',label:'示意舞台'}]);
});
