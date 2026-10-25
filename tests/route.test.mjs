import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveInitialRoute} from '../public/route.mjs';

const catalog=[{id:'tottenham'},{id:'ntsu-arena'},{id:'hall-10'}];

test('deep links preserve a known venue and section',()=>{
  const route=resolveInitialRoute(new URLSearchParams('venue=ntsu-arena&section=%E9%BB%844&row=12&seat=8&layout=center'),catalog);
  assert.deepEqual(route,{venueId:'ntsu-arena',section:'黄4',row:'12',seat:'8',layout:'center'});
});

test('unknown deep-link venues safely use the free default',()=>{
  const route=resolveInitialRoute(new URLSearchParams('venue=missing&section=122'),catalog);
  assert.deepEqual(route,{venueId:'tottenham',section:'122',row:'',seat:'',layout:'end'});
});

test('source-layout deep links retain the exact variant rather than replacing it with end',()=>{
 const route=resolveInitialRoute(new URLSearchParams('venue=hall-10&layout=expanded'),catalog);
 assert.equal(route.layout,'expanded');
});
