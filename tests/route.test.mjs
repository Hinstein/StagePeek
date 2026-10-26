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

test('default demo prefers available coordinate-backed Kai Tak and falls back to an unlocked venue',()=>{
  const catalog=[{id:'tottenham',locked:false,sourceSeatCount:0},{id:'kai-tak-stadium',locked:false,sourceSeatCount:48483}];
  assert.equal(resolveInitialRoute(new URLSearchParams(),catalog).venueId,'kai-tak-stadium');
  assert.equal(resolveInitialRoute(new URLSearchParams('venue=tottenham'),catalog).venueId,'tottenham');
  assert.equal(resolveInitialRoute(new URLSearchParams('venue=kai-tak-stadium'),catalog.map(v=>({...v,locked:true}))).venueId,'kai-tak-stadium','explicit locked deep link is never silently replaced');
  assert.equal(resolveInitialRoute(new URLSearchParams(),[{id:'tottenham',locked:true},{id:'taipei-arena',locked:false,sourceSeatCount:10000}]).venueId,'taipei-arena');
});
