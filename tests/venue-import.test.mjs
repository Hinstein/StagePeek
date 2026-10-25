import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

test('Wembley manual import is validated and exposes only official observed anchors',async()=>{
  const {readVenueManifest,validateVenueManifest,normalizeVenueManifest}=await import('../server/venue-import.mjs');
  const manifest=readVenueManifest(new URL('../data/manual-venues/wembley.json',import.meta.url));
  const report=validateVenueManifest(manifest);assert.equal(report.valid,true);assert.equal(report.counts.sections,25);assert.equal(report.counts.samples,0);
  const venue=normalizeVenueManifest(manifest);assert.equal(venue.sections.length,25);assert.equal(venue.accuracy.completeSeatInventory,false);assert.equal(venue.accuracy.metricCalibrated,false);
  assert.ok(venue.sections.every(section=>section.sourcePolygons?.length===1));
});

test('venue loader includes manual and imported venues and keeps unknown Wembley seats unverified',async()=>{
  const {loadVenues}=await import('../server/venues.mjs');const venues=loadVenues();
  const ids=venues.ids();
  // The catalog includes the 20 venues imported for the Weeknd 2026 tour.
  // Keep this count explicit so a future import cannot silently disappear.
  assert.equal(ids.length,217);
  assert.ok(ids.includes('metlife')&&ids.includes('sofi')&&ids.includes('tottenham')&&ids.includes('wembley'));
  assert.ok(ids.includes('kspo-dome')&&ids.includes('tokyo-dome')&&ids.includes('london-the-o2'));
  assert.equal(venues.catalog().find(x=>x.id==='wembley').sectionCount,25);
  const kspo=venues.catalog().find(x=>x.id==='kspo-dome'),tokyo=venues.catalog().find(x=>x.id==='tokyo-dome');
  assert.equal(kspo.accuracy.catalogStatus,'source-geometry-and-sections');
  assert.equal(tokyo.accuracy.catalogStatus,'catalog-only');
  assert.equal(JSON.stringify(kspo).includes('/Users/'),false);
  assert.equal(venues.resolve('wembley',{section:'122',row:'1',seat:'1'}).status,'unverified');
  assert.equal(venues.resolve('wembley',{section:'999',row:'1',seat:'1'}).status,'unknown-section');
  assert.equal(venues.catalog().find(x=>x.id==='metlife').country,'美国');
  assert.equal(venues.catalog().find(x=>x.id==='wembley').country,'英国');
});

test('venue publisher atomically adds a manifest and keeps a source import copy',async t=>{
  const {loadVenues}=await import('../server/venues.mjs');const {readVenueManifest}=await import('../server/venue-import.mjs');
  const dir=mkdtempSync(join(tmpdir(),'seatpeep-venue-publish-'));t.after(()=>rmSync(dir,{recursive:true}));
  const file=join(dir,'venues.json');writeFileSync(file,JSON.stringify({schemaVersion:1,venues:{}}));
  const manifest=readVenueManifest(new URL('../data/manual-venues/wembley.json',import.meta.url));
  const venues=loadVenues(file),published=venues.publish(manifest);assert.equal(published.id,'wembley');assert.ok(venues.get('wembley'));assert.ok(readFileSync(join(dir,'manual-venues','wembley.json'),'utf8').includes('Wembley Stadium'));
  assert.throws(()=>venues.publish(manifest),/already exists/);
});

test('new imports preserve source precision and never invent XYZ from a ticket identity',async()=>{
 const {normalizeVenueManifest,readVenueManifest}=await import('../server/venue-import.mjs');
 const manifest=readVenueManifest(new URL('../data/manual-venues/wembley.json',import.meta.url));
 const section=manifest.sections[0],position=[1.123456789,2.987654321,-3.123456789],sourceRecord={assetSha256:'abc',index:12};
 section.samples=[{row:'A',seat:'1'},{row:'A',seat:'2',position,positionStatus:'source-coordinate',sourceRecord}];
 const samples=normalizeVenueManifest(manifest).sections[0].samples;
 assert.equal(samples[0].position,null);assert.equal(samples[0].positionStatus,'unavailable');
 assert.deepEqual(samples[1].position,position);assert.deepEqual(samples[1].sourceRecord,sourceRecord);
});
