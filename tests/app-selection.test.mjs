import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadVenues} from '../server/venues.mjs';
import {unpackSourceSeats} from '../public/seating.mjs';

const appSource=readFileSync(new URL('../public/app.mjs',import.meta.url),'utf8');
const selectionSource=appSource.slice(appSource.indexOf('async function loadVenue('),appSource.indexOf('async function loadEvents('));
const venues=loadVenues();
const deferred=()=>{let resolve;const promise=new Promise(done=>resolve=done);return {promise,resolve};};

// Execute the shipped orchestration functions with inert DOM/rendering stubs.
// This checks request ordering and ticket identity, not browser events or WebGL.
function harness(id='asiaworld-viva',layout='end'){
 const state={venueId:id,venue:venues.get(id,layout),layout,sectionId:'',result:null};
 const nodes=new Map(),requests=[],camera=[],tracked=[];
 const $=id=>{if(!nodes.has(id))nodes.set(id,{value:'',disabled:false,replaceChildren(){},append(){}});return nodes.get(id);};
 const api=(path,options)=>{const pending=deferred();requests.push({path,body:options?.body,...pending});return pending.promise;};
 const viewer={near:()=>camera.push('near'),seatView:()=>camera.push('seat')};
 const create=new Function('state','$','api','viewer','render','toast','message','open','element','loadEvents','unpackSourceSeats','window',
  `let loadVersion=0,resolveVersion=0;${selectionSource};return {loadVenue,locate,chooseSection,chooseEstimatedSeat,applyRequestedSection,applyRequestedLayout};`);
 const actions=create(state,$,api,viewer,()=>{},()=>{},String,()=>{},()=>({}),async()=>{},unpackSourceSeats,{stagepeekTrack:name=>tracked.push(name)});
 actions.chooseSection(state.venue.sections[0].id,false);
 return {state,$,requests,camera,tracked,...actions};
}
function ticket(h,section,row,seat){h.$('section').value=section;h.$('row').value=row;h.$('seat').value=seat;}
function resolveRequest(request,id){return venues.resolve(id,request.body);}

test('late old-layout resolve cannot replace a newly loaded layout selection',async()=>{
 const h=harness();
 const loading=h.loadVenue('asiaworld-viva','expanded');
 ticket(h,'A','1','1');const locating=h.locate();
 assert.equal(h.requests[1].body.layout,'end');
 h.requests[0].resolve({venue:venues.get('asiaworld-viva','expanded')});await loading;
 const selected=h.state.result;
 h.requests[1].resolve(resolveRequest(h.requests[1],'asiaworld-viva'));await locating;
 assert.equal(h.state.venue.seatLayout.id,'expanded');
 assert.equal(h.state.result,selected);
 assert.equal(h.state.result.layout,'expanded');
 assert.notDeepEqual(h.state.result.position,venues.resolve('asiaworld-viva',{layout:'end',section:'A',row:'1',seat:'1'}).position);
 assert.equal(h.$('locate').disabled,false);
});

test('a later map section selection wins over an outstanding seat resolve',async()=>{
 const h=harness(),first=h.state.venue.sections[0],next=h.state.venue.sections[1],seat=first.samples[0];
 ticket(h,seat.section,seat.row,seat.seat);const locating=h.locate();
 h.chooseSection(next.id);const selected=h.state.result,cameraCalls=h.camera.length;
 h.requests[0].resolve(resolveRequest(h.requests[0],'asiaworld-viva'));await locating;
 assert.equal(h.state.sectionId,next.id);assert.equal(h.state.result,selected);
 assert.equal(h.$('section').value,next.samples[0].section);
 assert.equal(h.camera.length,cameraCalls);assert.equal(h.$('locate').disabled,false);
});

test('a later synthetic seat selection wins over an outstanding seat resolve',async()=>{
 const h=harness(),seat=h.state.venue.sections[0].samples[0];
 ticket(h,seat.section,seat.row,seat.seat);const locating=h.locate();
 h.chooseEstimatedSeat({section:h.state.venue.sections[1].id,row:'2',seat:'3',p:[1,2,3]});
 const selected=h.state.result;
 h.requests[0].resolve(resolveRequest(h.requests[0],'asiaworld-viva'));await locating;
 assert.equal(h.state.result,selected);assert.equal(h.state.result.status,'estimated');
 assert.equal(h.$('locate').disabled,false);
});

test('unknown deep-link section stays unknown instead of matching a default ticket',async()=>{
 const h=harness('taipei-arena','center');
 h.applyRequestedSection('DOES-NOT-EXIST');
 assert.equal(h.state.result.status,'unknown-section');
 h.$('row').value='1';h.$('seat').value='1';const locating=h.locate();
 assert.equal(h.requests[0].body.section,'DOES-NOT-EXIST');
 h.requests[0].resolve(resolveRequest(h.requests[0],'taipei-arena'));await locating;
 assert.equal(h.state.result.status,'unknown-section');
 assert.equal(h.state.result.section,'DOES-NOT-EXIST');
});

test('deep-link section aliases retain the exact requested ticket label',()=>{
 const h=harness('tottenham');
 const section=h.state.venue.sections.find(section=>section.ticketLabels.length>1),alias=section.ticketLabels.find(label=>label!==section.samples[0]?.section);
 assert.ok(alias);h.applyRequestedSection(alias);
 assert.equal(h.state.sectionId,section.id);assert.equal(h.$('section').value,alias);
 assert.equal(h.$('row').value,'');assert.equal(h.$('seat').value,'');
});

test('unavailable deep-link layout reports failure without loading another variant',async()=>{
 const h=harness('taipei-arena','end'),selected=h.state.venue;
 assert.equal(await h.applyRequestedLayout('runway'),false);
 assert.equal(h.state.venue,selected);assert.equal(h.requests.length,0);
});

test('locating a ticket on another tier also reveals that tier in the 2D map',async()=>{
 const h=harness('taipei-arena','center');
 const target=h.state.venue.sections.find(s=>s.tier!==h.state.mapTier&&s.samples.length),seat=target.samples[0];
 assert.ok(target);ticket(h,seat.section,seat.row,seat.seat);
 const locating=h.locate();h.requests[0].resolve(resolveRequest(h.requests[0],'taipei-arena'));await locating;
 assert.equal(h.state.result.status,'matched');assert.equal(h.state.sectionId,target.id);
 assert.equal(h.state.mapTier,target.tier);
});

test('an upper-tier deep link reveals the requested tier before a seat is entered',()=>{
 const h=harness('taipei-arena','center'),target=h.state.venue.sections.find(s=>s.tier!==h.state.mapTier);
 assert.ok(target);h.applyRequestedSection(target.id);
 assert.equal(h.state.sectionId,target.id);assert.equal(h.state.mapTier,target.tier);
});

test('a locked initial venue reports its requested identity and never claims another venue loaded',async()=>{
 const h=harness('taipei-arena');h.state.venue=null;h.state.venueId='tottenham';h.state.catalog=[{id:'taipei-arena',name:'台北小巨蛋'}];
 const loading=h.loadVenue('taipei-arena');
 h.requests[0].resolve(Promise.reject(Object.assign(new Error('locked'),{code:'SUBSCRIPTION_REQUIRED'})));
 assert.equal(await loading,false);assert.equal(h.state.venue,null);
 assert.equal(h.$('venue-name').textContent,'台北小巨蛋');
 assert.match(h.$('location-status').textContent,/订阅/);
});

test('automatic example matches do not count as intentional seat location',async()=>{
 const h=harness('kai-tak-stadium','bowl');
 ticket(h,'101','A','78');
 const automatic=h.locate();h.requests[0].resolve(resolveRequest(h.requests[0],'kai-tak-stadium'));await automatic;
 assert.equal(h.state.result.status,'matched');assert.deepEqual(h.tracked,[]);
 const manual=h.locate({intentional:true});h.requests[1].resolve(resolveRequest(h.requests[1],'kai-tak-stadium'));await manual;
 assert.deepEqual(h.tracked,['seat_located']);
 ticket(h,'101','unknown','unknown');
 const unmatched=h.locate({intentional:true});h.requests[2].resolve(resolveRequest(h.requests[2],'kai-tak-stadium'));await unmatched;
 assert.deepEqual(h.tracked,['seat_located']);
});
