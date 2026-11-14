import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {concertViewsPage} from '../server/concert-views/page.mjs';
import {renderVenueLocation} from '../public/venue-view/venue-page-presenter.mjs';
import {setLocaleUrl} from '../public/locales.mjs';
import {safeReturn} from '../public/auth-contract.mjs';

const source=readFileSync(new URL('../public/concert-views/app.mjs',import.meta.url),'utf8');

test('public explorer places venue and layout before the ticket and result, with no automatic sample ticket',()=>{
 for(const locale of ['en','zh-CN','zh-TW','ja','ko']){
  const html=concertViewsPage(locale,null,{publicMode:true});
  const order=['id="journey-start"','id="journey-context"','class="input-panel"','class="workspace"'];
  for(let index=1;index<order.length;index++)assert.ok(html.indexOf(order[index-1])<html.indexOf(order[index]),locale);
  assert.ok(html.indexOf('id="stage-layout"')<html.indexOf('id="ticket-form"'),locale);
  assert.match(html,/<section id="journey-context"[^>]+hidden/);
  assert.match(html,/<section class="input-panel" hidden/);
  assert.match(html,/<div class="workspace" hidden/);
  assert.match(html,/<div class="journey-controls">/);
  assert.match(html,/<details class="journey-details"><summary>/);
  assert.ok(html.indexOf('id="stage-layout"')<html.indexOf('class="journey-details"'),locale+' layout stays accessible while details are closed');
  for(const id of ['section','row','seat'])assert.match(html,new RegExp(`<input[^>]+id="${id}"[^>]+value=""`));
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,locale+' unique controls');
  assert.match(html,/href="[^\"]+venue=kai-tak-stadium[^\"]+demo=1"/);
 }
});

test('clicking a public map section previews a section without borrowing a sample ticket',()=>{
 const fields=new Map(['section','row','seat','locate'].map(id=>[id,{}]));
 const state={venue:{sections:[{id:'101',ticketLabels:['101'],tier:1,samples:[{section:'101',row:'A',seat:'78'}]}]}};
 const code=source.slice(source.indexOf('function chooseSection('),source.indexOf('function chooseEstimatedSeat('));
 const choose=new Function('state','$','publicViewer','render','referenceRowLabel',`let resolveVersion=0;${code};return chooseSection;`)(state,id=>fields.get(id),true,()=>{},()=>{});
 choose('101',false);
 assert.equal(state.result.status,'unverified');
 assert.equal(fields.get('section').value,'101');
 assert.equal(fields.get('row').value,'');assert.equal(fields.get('seat').value,'');
});

test('public journey shows a ready Hydro adapter and hides a previously loaded venue after country changes',()=>{
 const nodes=new Map(['section','row','seat','venue','journey-context','journey-demo-note','journey-account','.input-panel','.workspace'].map(id=>[id,{value:'',hidden:false}]));
 const state={venueId:'kai-tak-stadium',venue:{}};
 const doc={body:{dataset:{}},querySelector:id=>nodes.get(id.replace(/^#/,'')),querySelectorAll:()=>[]};
 const code=source.slice(source.indexOf('function updateExplorerSteps('),source.indexOf('function setStatus('));
 const create=new Function('state','$','document','publicViewer','localResearch','location','route','currentReturn',`${code};return updateExplorerSteps;`);
 const update=create(state,id=>nodes.get(id),doc,true,null,{search:''},x=>x,()=>'/explore');
 update();assert.equal(nodes.get('.workspace').hidden,true);
 nodes.get('venue').value='kai-tak-stadium';update();assert.equal(nodes.get('.workspace').hidden,false);
 nodes.get('venue').value='ovo-hydro';
 create(state,id=>nodes.get(id),doc,true,{active:true,ready:true},{search:''},x=>x,()=>'/explore?venue=ovo-hydro')();
 assert.equal(nodes.get('.workspace').hidden,false);
});

test('only eligible matched results enable the existing save control',()=>{
 const nodes=new Map(['location-section','location-row','location-status','location-description','distance','save-position'].map(id=>[id,{classList:{toggle(){}}}]));
 const doc={getElementById:id=>nodes.get(id)},result={section:'101',row:'A',status:'Matched',description:'Reference',distance:'—',matched:true};
 renderVenueLocation(doc,result);assert.equal(nodes.get('save-position').disabled,true);
 renderVenueLocation(doc,{...result,saveable:true});assert.equal(nodes.get('save-position').disabled,false);
 renderVenueLocation(doc,{...result,matched:false,saveable:false});assert.equal(nodes.get('save-position').disabled,true);
});

test('language changes retain explicit demo and plans return context but discard tokens',()=>{
 const previous=globalThis.location;const assigned=[];
 globalThis.location={href:'https://stagepeek.live/zh-CN/explore?venue=kai-tak-stadium&demo=1&token=secret',assign:value=>assigned.push(value)};
 setLocaleUrl('ja');assert.equal(assigned.pop(),'/ja/explore?venue=kai-tak-stadium&demo=1');
 globalThis.location.href='https://stagepeek.live/zh-CN/plans?next=%2Fzh-CN%2Fexplore%3Fvenue%3Dtwcv-the-o2-arena-london';
 setLocaleUrl('ko');assert.equal(assigned.pop(),'/ko/plans?next=%2Fzh-CN%2Fexplore%3Fvenue%3Dtwcv-the-o2-arena-london');
 globalThis.location=previous;
});

test('plans guest login preserves the requested venue and selected billing period',async()=>{
 const nodes=new Map(['plan-return','plan-context','plan-checkout','plan-feedback','plan-options'].map(id=>[id,{textContent:'',append(){}}]));
 const selected={value:'annual'},storage=new Map(),assigned=[];
 const doc={getElementById:id=>nodes.get(id),createElement:()=>({append(){},style:{}}),createTextNode:text=>text,querySelector:()=>selected};
 const location={search:'?next='+encodeURIComponent('/zh-CN/explore?venue=twcv-the-o2-arena-london&section=110&row=18&seat=319'),origin:'https://stagepeek.live',assign:url=>assigned.push(url)};
 const responses={'/api/me':{providers:{billing:true},access:{plan:'guest'},user:null},'/api/venues':{venues:[{id:'twcv-the-o2-arena-london',name:'O2'}]},'/api/billing/price':{prices:[{plan:'monthly',currency:'USD',amount:500},{plan:'annual',currency:'USD',amount:5000}]}};
 const code=readFileSync(new URL('../public/plans.mjs',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
 const run=new (Object.getPrototypeOf(async function(){}).constructor)('document','location','safeReturn','copy','getLocale','localizedPath','venueName','fetch','sessionStorage',code);
 await run(doc,location,safeReturn,(s,values=[])=>s.replace('{0}',values[0]),()=> 'zh-CN',(_,path)=>'/zh-CN'+path,v=>v.name,async path=>({ok:true,json:async()=>responses[path]}),{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)});
 assert.equal(nodes.get('plan-return').href,'/zh-CN/explore?venue=twcv-the-o2-arena-london&section=110&row=18&seat=319');
 assert.equal(nodes.get('plan-checkout').disabled,false);
 await nodes.get('plan-checkout').onclick();
 const url=new URL(assigned[0],location.origin),next=new URL(url.searchParams.get('next'),location.origin);
 assert.equal(url.pathname,'/zh-CN/auth/login');
 assert.equal(next.searchParams.get('venue'),'twcv-the-o2-arena-london');
 assert.equal(next.searchParams.get('seat'),'319');assert.equal(next.searchParams.get('account'),'billing');
 assert.equal(storage.get('stagepeek-billing-plan'),'annual');
});

test('legacy billing handoff forwards the incoming ticket rather than the uninitialized default venue',()=>{
 const start=source.indexOf("if(publicViewer&&(params.get('panel')==='plans'");
 const end=source.indexOf('\n  if((!publicViewer',start);
 const assigned=[],location={pathname:'/zh-CN/explore',replace:url=>assigned.push(url)};
 new Function('publicViewer','params','location','route','safeReturn',source.slice(start,end))(true,new URLSearchParams('venue=kai-tak-stadium&section=101&row=A&seat=78&account=billing'),location,path=>'/zh-CN'+path,safeReturn);
 const target=new URL(assigned[0],'https://stagepeek.live');
 assert.equal(target.pathname,'/zh-CN/plans');
 assert.equal(target.searchParams.get('next'),'/zh-CN/explore?venue=kai-tak-stadium&section=101&row=A&seat=78');
});

test('real Kai Tak query can be saved by a free local account while unknown seats stay rejected',async t=>{
 const {once}=await import('node:events');
 const {openStore}=await import('../server/store.mjs');
 const {createApplication}=await import('../server/app.mjs');
 const {releasedVenues}=await import('../server/concert-views/release.mjs');
 const {loadConcertViews}=await import('../server/concert-views/index.mjs');
 const {loadConfig}=await import('../server/config.mjs');
 const views=loadConcertViews({localDrafts:true});
 const db=openStore(':memory:');
 const config={...loadConfig({}),appUrl:'http://127.0.0.1',allowedOrigins:[],production:false,authMode:'local',devMailbox:true};
 const app=createApplication({db,config,venues:releasedVenues(views),concertViews:views});
 app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
 config.appUrl=`http://127.0.0.1:${app.server.address().port}`;
 t.after(async()=>{await new Promise(resolve=>app.server.close(resolve));await db.close();});
 const cookieFrom=response=>response.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ');
 const call=(path,body,cookie)=>fetch(config.appUrl+path,{method:body?'POST':'GET',headers:{Origin:config.appUrl,...body&&{'Content-Type':'application/json'},...cookie&&{Cookie:cookie}},body:body?JSON.stringify(body):undefined});
 const ticket={venueId:'kai-tak-stadium',layout:'bowl',section:'101',row:'A',seat:'78'};
 assert.equal((await call('/api/positions',ticket)).status,401);
 const login=await call('/api/auth/email',{email:'journey-regression@example.invalid'});assert.equal(login.status,200);
 const token=new URLSearchParams(new URL(app.email.outbox[0].url).hash.slice(1)).get('token');
 const verified=await call('/api/auth/email/verify',{token},cookieFrom(login));assert.equal(verified.status,200);
 const cookie=cookieFrom(verified);
 const resolved=await call('/api/venues/kai-tak-stadium/resolve',ticket);assert.equal((await resolved.json()).status,'matched');
 assert.equal((await call('/api/positions',ticket,cookie)).status,201);
 const positions=await(await call('/api/positions',null,cookie)).json();
 assert.equal(positions.positions.length,1);assert.equal(positions.positions[0].venue_id,ticket.venueId);
 assert.equal(positions.positions[0].layout,'bowl');assert.equal(positions.positions[0].seat_token,'78');
 assert.equal((await call('/api/positions',{...ticket,seat:'999999'},cookie)).status,422);
 assert.equal((await call('/api/venues/twcv-the-o2-arena-london',null,cookie)).status,403);
});
