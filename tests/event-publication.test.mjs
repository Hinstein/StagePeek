import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {PublishedEventRepository,validateEventPublication} from '../server/event-publication.mjs';
import {stageOutsideParts,stageRects,performer} from '../public/geometry.mjs';

const venue={id:'fixture',geometry:{shape:'rectangle',floor:[100,100]},tiers:[[30,30,3,5,5]],sections:[{id:'A',tier:0,angle:0,halfAngle:.1,ticketLabels:['A'],samples:[]}]};
const source={url:'https://official.example/event',retrievedAt:'2026-10-25T00:00:00Z',sha256:'a'.repeat(64),kind:'ticketing-seatmap',rights:'test fixture'};
function reviewed(){return {id:'show',venueId:'fixture',name:'Fixture show',source:'https://official.example/event/show',identity:{providerEventId:'show',providerVenueId:'fixture',eventSpecificUrl:'https://official.example/event/show',source},localDate:'2026-10-25',timezone:'Asia/Shanghai',category:'music',verificationStatus:'reviewed',
  verificationHistory:['candidate','source-matched','geometry-checked','reviewed'].map(status=>({status,actor:'fixture reviewer',at:'2026-10-25T00:00:00Z'})),
  layout:{model:{id:'show-v1',eventId:'show',venueId:'fixture',coordinateFrame:'venue-metres',source:{...source,eventId:'show'},stageRects:[{x:0,z:0,w:5,d:6,h:1.5}],closedSections:[],boundary:{coordinateFrame:'venue-metres',polygon:[[-40,-40],[40,-40],[40,40],[-40,40]],source}}},
  review:{reviewer:'fixture reviewer',reviewedAt:'2026-10-25T01:00:00Z',holdout:{independent:true,error:0,tolerance:.1,source},checks:{stageOrientation:true,sectionLabels:true,closedSections:true,floorBoundary:true,mapOverlay:true,browser2d3d:true,mobile:true}}};}

test('publication requires event identity, evidence, independent review and unchanged valid stage geometry',()=>{
  assert.equal(validateEventPublication(reviewed(),venue).valid,true);
  const mutations=[e=>e.verificationStatus='candidate',e=>e.identity.providerVenueId=null,e=>e.timezone=null,e=>e.layout.model.eventId='other',e=>e.layout.model.source.sha256=null,e=>e.verificationHistory.reverse(),e=>e.verificationHistory={},e=>e.verificationHistory[2].at='2026-01-01',e=>e.layout.model.stageRects=[null],e=>e.review.holdout.independent=false,e=>e.layout.model.stageRects[0].z=80,e=>e.layout.model.stageRects[0].x=NaN,e=>e.layout.model.boundary.polygon=[[0,0],[2,2],[0,2],[2,0]]];
  assert.equal(validateEventPublication(reviewed(),{...venue,seatLayout:{id:'specific'}}).valid,false);
  assert.equal(validateEventPublication(reviewed(),{...venue,sections:venue.sections.map(s=>({...s,polygonStatus:'source'}))}).valid,false);
  for(const change of mutations){const e=reviewed();change(e);assert.equal(validateEventPublication(e,venue).valid,false);}
});

test('version files stay immutable and tampered published data is rejected',t=>{
  const dir=mkdtempSync(join(tmpdir(),'seatpeep-publication-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const repo=new PublishedEventRepository(dir,{get:id=>id===venue.id?venue:null});
  const e=reviewed(),first=repo.publish(e);assert.equal(repo.list('fixture').length,1);
  e.name='Updated fixture show';const second=repo.publish(e);
  assert.notEqual(first.sha256,second.sha256);assert.equal(JSON.parse(readFileSync(join(dir,first.file))).name,'Fixture show');
  assert.equal(JSON.parse(readFileSync(join(dir,'index.json'))).events[0].previousVersion,first.sha256);
  writeFileSync(join(dir,second.file),'{}');assert.deepEqual(repo.list('fixture'),[]);
});

test('bounds reject depth overflow and rotation; no-event-layout suppresses every stage and performer',()=>{
  assert.equal(stageOutsideParts(venue,'center',[{x:0,z:55,w:3,d:8,h:1}]).length>0,true);
  assert.equal(stageOutsideParts(venue,'center',[{x:46,z:0,w:8,d:20,h:1,kind:'screen',angle:Math.PI/4}]).length>0,true);
  const sourced={...venue,sourceStage:{x:0,z:0,width:5,depth:5},seatLayout:{id:'end'},geometry:{...venue.geometry,referenceLayout:{stageRects:[{x:0,z:0,w:5,d:5,h:1}],performer:[0,1,0]}}};
  assert.deepEqual(stageRects('none',sourced),[]);assert.equal(performer('none',sourced),null);
});

test('repeated candidate import preserves product files, operator notes and published versions',t=>{
  const dir=mkdtempSync(join(tmpdir(),'seatpeep-import-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
  for(const path of ['scripts','data/artist-events','data/events-published'])mkdirSync(join(dir,path),{recursive:true});
  copyFileSync(new URL('../scripts/import-weeknd-tour.mjs',import.meta.url),join(dir,'scripts/import-weeknd-tour.mjs'));
  copyFileSync(new URL('../data/artist-events/the-weeknd-after-hours-til-dawn-2026.json',import.meta.url),join(dir,'data/artist-events/the-weeknd-after-hours-til-dawn-2026.json'));
  const published='{"schemaVersion":1,"events":[{"sentinel":true}]}';
  writeFileSync(join(dir,'data/events-published/index.json'),published);
  for(const name of ['venues','events'])writeFileSync(join(dir,`data/${name}.json`),'PRODUCT SENTINEL');
  const run=()=>execFileSync(process.execPath,[join(dir,'scripts/import-weeknd-tour.mjs')]);run();
  const file=join(dir,'data/events-candidates/the-weeknd-after-hours-til-dawn-2026.json');const candidate=JSON.parse(readFileSync(file));candidate.events[0].operatorNotes='retain';writeFileSync(file,JSON.stringify(candidate));const before=readFileSync(file,'utf8');run();
  assert.equal(readFileSync(file,'utf8'),before);assert.equal(readFileSync(join(dir,'data/events-published/index.json'),'utf8'),published);
  for(const name of ['venues','events'])assert.equal(readFileSync(join(dir,`data/${name}.json`),'utf8'),'PRODUCT SENTINEL');
});
