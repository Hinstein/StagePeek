import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const file=new URL('../data/artist-events/the-weeknd-after-hours-til-dawn-2026.json',import.meta.url);
const data=JSON.parse(readFileSync(file,'utf8'));

test('The Weeknd recent-six-month import contains the complete official-window candidate set',()=>{
  assert.equal(data.artist,'The Weeknd');
  assert.equal(data.eventCount,58);
  assert.equal(data.venueCount,24);
  assert.equal(data.events.length,58);
  assert.equal(new Set(data.events.map(event=>event.id)).size,58);
  assert.equal(new Set(data.events.map(event=>event.venueId)).size,24);
  for(const event of data.events){
    assert.ok(event.date>='2026-04-25'&&event.date<='2026-10-25',event.id);
    assert.equal(event.verificationStatus,'candidate');
    assert.ok(['unconfirmed','reference-only'].includes(event.seating.stageLayout.status),event.id);
    assert.ok(data.venues.some(venue=>venue.id===event.venueId),event.id);
  }
});

test('venue references distinguish public seat-map evidence from event-specific geometry',()=>{
  for(const venue of data.venues){
    assert.ok(venue.publicSeatMap.status,venue.id);
    assert.ok(venue.publicSeatMap.sources.length>0,venue.id);
    assert.equal(venue.publicSeatMap.eventSpecific,false,venue.id);
  }
  const kaiTak=data.events.find(event=>event.venueId==='kai-tak-stadium');
  assert.equal(kaiTak.seating.publicSeatMapStatus,'official-event-map-reference');
  assert.equal(kaiTak.seating.eventSpecificMap,'official-admission-notice-linked-map');
  assert.match(kaiTak.seating.mapSources[0],/livenation\.hk/);
});
