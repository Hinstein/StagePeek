import test from 'node:test';
import assert from 'node:assert/strict';
import {loadVenues} from '../server/venues.mjs';
import {sceneCollisions} from '../public/scene-geometry.mjs';
test('Tokyo Garden Theater backdrop and stage never penetrate rendered chairs',()=>{
 const venue=loadVenues().get('tokyo-garden-theater');
 const hits=sceneCollisions(venue,'end');
 assert.equal(hits.length,0,JSON.stringify({count:hits.length,examples:hits.slice(0,4)}));
});
