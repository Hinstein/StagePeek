import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadVenues} from '../server/venues.mjs';
import {stageBoxes} from '../public/scene-geometry.mjs';
import {venueFootprintContainsPoint} from '../public/geometry.mjs';
import {CandidateEventRepository} from '../server/event-candidates.mjs';

test('The Weeknd import stays in research and candidate layers',()=>{
  const candidate=JSON.parse(readFileSync(new URL('../data/events-candidates/the-weeknd-after-hours-til-dawn-2026.json',import.meta.url),'utf8'));
  const events=JSON.parse(readFileSync(new URL('../data/events.json',import.meta.url),'utf8'));
  const venues=JSON.parse(readFileSync(new URL('../data/venues.json',import.meta.url),'utf8'));
  assert.equal(candidate.status,'candidate');
  assert.equal(candidate.events.length,58);
  assert.equal(candidate.venues.length,24);
  assert.equal(Object.values(events.venues).flatMap(item=>item.events||[]).some(item=>item.artist==='The Weeknd'),false);
  assert.equal(Object.values(venues.venues).some(item=>item.accuracy?.catalogStatus==='identity-only-candidate'),false);
  const candidates=new CandidateEventRepository(new URL('../data/events-candidates',import.meta.url).pathname).list();
  assert.equal(candidates.status,'candidate');
  assert.equal(candidates.events.length,58);
});

test('every visible stage part stays inside its model footprint',()=>{
  const store=loadVenues();
  for(const id of store.ids()){
    const base=store.get(id),layouts=base.seatLayouts?.length?base.seatLayouts.map(item=>item.id):['end','runway','center'];
    for(const layout of layouts){
      const venue=store.get(id,layout);
      for(const box of stageBoxes(layout,venue)){
        const c=Math.cos(box.angle||0),s=Math.sin(box.angle||0),wx=box.size[0]/2,wz=box.size[2]/2;
        for(const [x,z] of [[-wx,-wz],[-wx,wz],[wx,-wz],[wx,wz]])assert.equal(venueFootprintContainsPoint(venue,box.center[0]+x*c+z*s,box.center[2]-x*s+z*c),true,`${id}/${layout}/${box.kind}`);
      }
    }
  }
});
