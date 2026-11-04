import test from 'node:test';
import assert from 'node:assert/strict';
import {loadConcertViews} from '../server/concert-views/index.mjs';
import {sourceEventDisplayDraft} from '../public/concert-views/source-event-display.mjs';

const views=loadConcertViews();
for(const [venue,event] of [
 ['twcv-kia-forum-los-angeles','kia-forum-don-omar-20261106'],
 ['twcv-united-center-chicago','unc-katseye-20261105'],
 ['twcv-ubs-arena-new-york','ubs-anuel-aa-20261106'],
 ['twcv-prudential-center-newark','pru-xg-20261114'],
 ['twcv-state-farm-arena-atlanta','sfa-doja-cat-20261117']
])test(event+' uses coherent temporary rows across all floor blocks',()=>{
 const source=views.previews.get(event),before=JSON.stringify(source);
 const display=sourceEventDisplayDraft(views.venues.get(venue),source);
 assert.ok(display.floorChairs.length>0);
 const angle=display.floorChairs[0].angle;
 assert.ok(display.floorChairs.every(c=>Math.abs(c.angle-angle)<1e-10),'one event seating direction, including blocks beside the runway');
 const points=display.floorChairs.map(c=>[
  c.p[0]*Math.cos(angle)-c.p[2]*Math.sin(angle),
  c.p[0]*Math.sin(angle)+c.p[2]*Math.cos(angle)
 ]);
 for(const p of points){
  assert.ok(Math.abs((p[0]-points[0][0])/.66-Math.round((p[0]-points[0][0])/.66))<1e-7,'columns share an origin');
  assert.ok(Math.abs((p[1]-points[0][1])/.95-Math.round((p[1]-points[0][1])/.95))<1e-7,'rows share an origin');
 }
 assert.equal(JSON.stringify(source),before,'display reconstruction never rewrites retained event geometry');
});
