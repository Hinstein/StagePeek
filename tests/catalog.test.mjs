import test from 'node:test';
import assert from 'node:assert/strict';
import {groupVenuesByCountry,venueCountry} from '../public/catalog.mjs';

test('venue catalog groups by country while preserving regional labels',()=>{
  assert.equal(venueCountry({city:'纽约都市圈 · East Rutherford'}),'美国');
  assert.equal(venueCountry({city:'中国香港 · 香港'}),'中国香港');
  const groups=groupVenuesByCountry([
    {id:'b',name:'Z Arena',city:'日本 · 东京'},
    {id:'a',name:'A Stadium',city:'纽约都市圈 · East Rutherford'},
    {id:'c',name:'B Hall',country:'美国',city:'未知'}
  ]);
  assert.deepEqual(groups.map(group=>group.country),['美国','日本']);
  assert.deepEqual(groups[0].venues.map(venue=>venue.id),['a','c']);
});
